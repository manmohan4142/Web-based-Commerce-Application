'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Package,
  ShoppingCart,
  Plus,
  LayoutDashboard,
  BarChart3,
} from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { Spinner } from '@/components/ui/Spinner';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<{
    products: number;
    orders: number;
  } | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/admin');
      return;
    }
    if (status === 'authenticated') {
      Promise.all([
        fetch('/api/products').then((r) => r.json()),
        fetch('/api/orders').then((r) => r.json()).catch(() => []),
      ]).then(([products, orders]) => {
        setStats({
          products: Array.isArray(products) ? products.length : 0,
          orders: Array.isArray(orders) ? orders.length : 0,
        });
      });
    }
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
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <Link href="/admin/products/new">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 rounded-lg bg-cyber-neon px-4 py-2 font-medium text-cyber-dark"
            >
              <Plus className="h-5 w-5" /> Add product
            </motion.button>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-cyber-border bg-cyber-card/80 p-6 backdrop-blur-md"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-cyber-neon/20 p-3">
                <Package className="h-8 w-8 text-cyber-neon" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Products</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.products ?? '—'}
                </p>
              </div>
            </div>
            <Link
              href="/admin/products"
              className="mt-4 block text-sm text-cyber-neon hover:underline"
            >
              Manage products →
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-xl border border-cyber-border bg-cyber-card/80 p-6 backdrop-blur-md"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-cyber-neon-blue/20 p-3">
                <ShoppingCart className="h-8 w-8 text-cyber-neon-blue" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Orders</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.orders ?? '—'}
                </p>
              </div>
            </div>
            <Link
              href="/admin/orders"
              className="mt-4 block text-sm text-cyber-neon-blue hover:underline"
            >
              View orders →
            </Link>
          </motion.div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-cyber-border bg-cyber-card/80 p-6 backdrop-blur-md"
          >
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <LayoutDashboard className="h-5 w-5" /> Quick actions
            </h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/admin/products/new"
                  className="text-cyber-neon hover:underline"
                >
                  Add new product
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/products"
                  className="text-cyber-neon hover:underline"
                >
                  Edit / delete products
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/orders"
                  className="text-cyber-neon hover:underline"
                >
                  Order management
                </Link>
              </li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl border border-cyber-border bg-cyber-card/80 p-6 backdrop-blur-md"
          >
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <BarChart3 className="h-5 w-5" /> Analytics
            </h2>
            <p className="text-gray-400">
              Connect Google Analytics or add custom tracking in a production build.
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
