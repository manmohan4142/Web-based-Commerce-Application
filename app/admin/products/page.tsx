'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { Spinner } from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/admin/products');
      return;
    }
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [status, router]);

  const deleteProduct = async (slug: string) => {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/products/${slug}`, { method: 'DELETE' });
    setProducts((prev) => prev.filter((p) => p.slug !== slug));
  };

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
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <Link href="/admin/products/new">
            <Button leftIcon={<Plus className="h-5 w-5" />}>Add product</Button>
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-cyber-border">
            <table className="w-full text-left">
              <thead className="border-b border-cyber-border bg-cyber-card/50">
                <tr>
                  <th className="px-4 py-3 text-sm font-medium text-gray-400">Image</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-400">Name</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-400">Price</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-400">Category</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-400">Stock</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <motion.tr
                    key={p._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-cyber-border/50 hover:bg-cyber-card/30"
                  >
                    <td className="px-4 py-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-cyber-darker">
                        {p.images?.[0] ? (
                          <Image
                            src={p.images[0]}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <span className="text-xs text-cyber-muted">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-white">{p.name}</td>
                    <td className="px-4 py-3 text-cyber-neon">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3 text-gray-400">{p.category}</td>
                    <td className="px-4 py-3">
                      <span className={p.inStock ? 'text-cyber-neon' : 'text-red-400'}>
                        {p.inStock ? 'In stock' : 'Out'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/admin/products/${p.slug}/edit`}>
                          <button className="rounded p-2 text-gray-400 hover:bg-white/10 hover:text-cyber-neon">
                            <Pencil className="h-4 w-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => deleteProduct(p.slug)}
                          className="rounded p-2 text-gray-400 hover:bg-red-500/20 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
