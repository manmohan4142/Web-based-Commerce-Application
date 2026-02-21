import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Order } from '@/lib/models/Order';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as { id?: string }).id ?? session.user.email;
    await connectDB();
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    const serialized = orders.map((o) => ({
      ...o,
      _id: (o._id as { toString(): string }).toString(),
      createdAt: (o as { createdAt?: Date }).createdAt?.toISOString(),
      updatedAt: (o as { updatedAt?: Date }).updatedAt?.toISOString(),
    }));
    return NextResponse.json(serialized);
  } catch (e) {
    console.error('Orders API error:', e);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const { items, total, shippingAddress, stripePaymentIntentId } = body;
    if (!items?.length || total == null || !shippingAddress) {
      return NextResponse.json(
        { error: 'items, total, and shippingAddress required' },
        { status: 400 }
      );
    }
    const userId = (session.user as { id?: string }).id ?? session.user.email;
    await connectDB();
    const order = await Order.create({
      userId,
      items,
      total,
      shippingAddress,
      stripePaymentIntentId: stripePaymentIntentId ?? undefined,
      status: 'paid',
    });
    return NextResponse.json({
      ...order.toObject(),
      _id: (order._id as { toString(): string }).toString(),
    });
  } catch (e) {
    console.error('Create order error:', e);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
