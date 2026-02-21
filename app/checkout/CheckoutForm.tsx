'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useCartStore } from '@/store/cartStore';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { CartItem } from '@/types';

export function CheckoutForm({
  clientSecret,
  items,
  total,
}: {
  clientSecret: string;
  items: CartItem[];
  total: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);
    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
        payment_method_data: {
          billing_details: {
            name: address.fullName,
            address: {
              line1: address.address,
              city: address.city,
              state: address.state,
              postal_code: address.zip,
              country: address.country,
            },
          },
        },
      },
    });
    if (submitError) {
      setError(submitError.message ?? 'Payment failed');
      setLoading(false);
      return;
    }
    // Create order on our backend
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((i) => ({
          productId: i.product._id,
          quantity: i.quantity,
          price: i.product.price,
        })),
        total,
        shippingAddress: address,
        stripePaymentIntentId: clientSecret.split('_secret')[0],
      }),
    });
    clearCart();
    router.push('/checkout/success');
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="rounded-xl border border-cyber-border bg-cyber-card/80 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Shipping address
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Full name"
            value={address.fullName}
            onChange={(e) =>
              setAddress((a) => ({ ...a, fullName: e.target.value }))
            }
            required
          />
          <Input
            label="Address"
            value={address.address}
            onChange={(e) =>
              setAddress((a) => ({ ...a, address: e.target.value }))
            }
            required
          />
          <Input
            label="City"
            value={address.city}
            onChange={(e) =>
              setAddress((a) => ({ ...a, city: e.target.value }))
            }
            required
          />
          <Input
            label="State"
            value={address.state}
            onChange={(e) =>
              setAddress((a) => ({ ...a, state: e.target.value }))
            }
            required
          />
          <Input
            label="ZIP"
            value={address.zip}
            onChange={(e) =>
              setAddress((a) => ({ ...a, zip: e.target.value }))
            }
            required
          />
          <Input
            label="Country"
            value={address.country}
            onChange={(e) =>
              setAddress((a) => ({ ...a, country: e.target.value }))
            }
            required
          />
        </div>
      </div>
      <div className="rounded-xl border border-cyber-border bg-cyber-card/80 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Payment details
        </h2>
        <PaymentElement />
      </div>
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
      <Button type="submit" size="lg" fullWidth loading={loading}>
        Pay now
      </Button>
    </form>
  );
}
