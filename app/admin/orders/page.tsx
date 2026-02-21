'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/layout/PageTransition';
import { Spinner } from '@/components/ui/Spinner';
import { formatPrice } from '@/lib/utils';
import type { Order } from '@/types';

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/admin/orders');
      return;
    }
    fetch('/api/orders')
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [status, router]);

  if (status === 'loading' || !session) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-white">Orders</h1>
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : orders.length === 0 ? (
          <p className="rounded-xl border border-cyber-border bg-cyber-card/50 py-12 text-center text-gray-400">
            No orders yet.
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-xl border border-cyber-border bg-cyber-card/80 p-6 backdrop-blur-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">
                      Order #{order._id.slice(-8)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        order.status === 'paid'
                          ? 'bg-cyber-neon/20 text-cyber-neon'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-lg font-semibold text-cyber-neon">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
                {order.shippingAddress && (
                  <div className="mt-4 border-t border-cyber-border pt-4 text-sm text-gray-400">
                    <p>{order.shippingAddress.fullName}</p>
                    <p>
                      {order.shippingAddress.address},{' '}
                      {order.shippingAddress.city},{' '}
                      {order.shippingAddress.state}{' '}
                      {order.shippingAddress.zip}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
