import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB, isMongoConnectionError } from '@/lib/db';
import { Product } from '@/lib/models/Product';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export async function POST(request: Request) {
  try {
    if (!stripeSecretKey?.startsWith('sk_')) {
      console.error('Checkout: STRIPE_SECRET_KEY is missing or invalid. Set it in .env.local.');
      return NextResponse.json(
        { error: 'Payment is not configured. Set STRIPE_SECRET_KEY in .env.local.' },
        { status: 503 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const { items, shippingAddress } = body as {
      items: { productId: string; quantity: number }[];
      shippingAddress: {
        fullName: string;
        address: string;
        city: string;
        state: string;
        zip: string;
        country: string;
      };
    };
    if (!items?.length || !shippingAddress) {
      return NextResponse.json(
        { error: 'Items and shipping address required' },
        { status: 400 }
      );
    }
    await connectDB();
    const productIds = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds } }).lean();
    const total = items.reduce((sum, item) => {
      const product = products.find(
        (p) => (p._id as { toString(): string }).toString() === item.productId
      );
      if (!product) return sum;
      return sum + (product.price as number) * item.quantity;
    }, 0);

    // Stripe requires minimum 50 cents for USD
    if (total < 50) {
      return NextResponse.json(
        { error: 'Invalid cart or total too low. Minimum charge is $0.50.' },
        { status: 400 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: (session.user as { id?: string }).id ?? session.user.email,
        shipping: JSON.stringify(shippingAddress),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    console.error('Checkout error:', e);
    if (isMongoConnectionError(e)) {
      return NextResponse.json(
        { error: 'Database unavailable. Start MongoDB and try again.' },
        { status: 503 }
      );
    }
    const message = e instanceof Error ? e.message : 'Checkout failed';
    const isStripeError = e && typeof e === 'object' && 'type' in e;
    return NextResponse.json(
      { error: isStripeError ? message : 'Checkout failed' },
      { status: 500 }
    );
  }
}
