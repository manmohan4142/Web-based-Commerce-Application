'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCartStore } from '@/store/cartStore';
import { CheckoutForm } from './CheckoutForm';
import { PageTransition } from '@/components/layout/PageTransition';
import { Spinner } from '@/components/ui/Spinner';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/checkout');
      return;
    }
    if (status !== 'authenticated' || !items.length) {
      if (status === 'authenticated' && !items.length) {
        router.push('/cart');
      }
      setLoading(false);
      return;
    }
    setCheckoutError(null);
    const shippingAddress = {
      fullName: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: 'US',
    };
    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((i) => ({
          productId: i.product._id,
          quantity: i.quantity,
        })),
        shippingAddress,
      }),
    })
      .then((r) => r.json().then((data) => ({ ok: r.ok, data })))
      .then(({ ok, data }) => {
        if (ok && data.clientSecret) {
          setClientSecret(data.clientSecret);
          setCheckoutError(null);
        } else {
          setCheckoutError(typeof data?.error === 'string' ? data.error : 'Checkout failed. Try again.');
        }
      })
      .catch((err) => {
        console.error(err);
        setCheckoutError('Unable to start checkout. Check your connection and try again.');
      })
      .finally(() => setLoading(false));
  }, [status, items, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!items.length) return null;

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white">Checkout</h1>
        {clientSecret ? (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'night',
                variables: { colorPrimary: '#00ff88' },
              },
            }}
          >
            <CheckoutForm
              clientSecret={clientSecret}
              items={items}
              total={totalPrice()}
            />
          </Elements>
        ) : checkoutError ? (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
            <p className="font-medium">Checkout error</p>
            <p className="mt-1 text-sm">{checkoutError}</p>
            <p className="mt-3 text-sm text-gray-400">
              Add STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to .env.local with your Stripe test keys to enable payments.
            </p>
            <a href="/cart" className="mt-4 inline-block text-cyber-neon hover:underline">← Back to cart</a>
          </div>
        ) : (
          <p className="mt-4 text-gray-400">Preparing payment…</p>
        )}
      </div>
    </PageTransition>
  );
}
