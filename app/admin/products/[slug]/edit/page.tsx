'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/layout/PageTransition';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import type { Product } from '@/types';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    category: '',
    images: '',
    inStock: true,
    featured: false,
  });

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((data: Product) => {
        setForm({
          name: data.name,
          description: data.description,
          price: (data.price / 100).toFixed(2),
          compareAtPrice: data.compareAtPrice
            ? (data.compareAtPrice / 100).toFixed(2)
            : '',
          category: data.category,
          images: data.images?.join(', ') ?? '',
          inStock: data.inStock,
          featured: data.featured ?? false,
        });
      })
      .catch(() => router.push('/admin/products'))
      .finally(() => setFetching(false));
  }, [slug, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/products/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
        category: form.category,
        images: form.images ? form.images.split(',').map((s) => s.trim()) : [],
        inStock: form.inStock,
        featured: form.featured,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      alert(data.error ?? 'Failed to update');
      return;
    }
    router.push('/admin/products');
    router.refresh();
  };

  if (fetching) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/admin/products"
            className="text-gray-400 hover:text-cyber-neon"
          >
            ← Products
          </Link>
          <h1 className="text-2xl font-bold text-white">Edit product</h1>
        </div>
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl border border-cyber-border bg-cyber-card/80 p-6 backdrop-blur-md"
        >
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              required
              rows={4}
              className="w-full rounded-lg border border-cyber-border bg-cyber-darker/50 px-4 py-2.5 text-white outline-none focus:border-cyber-neon"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Price (USD)"
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              required
            />
            <Input
              label="Compare at price (optional)"
              type="number"
              step="0.01"
              value={form.compareAtPrice}
              onChange={(e) =>
                setForm((f) => ({ ...f, compareAtPrice: e.target.value }))
              }
            />
          </div>
          <Input
            label="Category"
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value }))
            }
            required
          />
          <Input
            label="Image URLs (comma-separated)"
            value={form.images}
            onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
          />
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={(e) =>
                  setForm((f) => ({ ...f, inStock: e.target.checked }))
                }
                className="rounded border-cyber-border bg-cyber-darker text-cyber-neon focus:ring-cyber-neon"
              />
              In stock
            </label>
            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  setForm((f) => ({ ...f, featured: e.target.checked }))
                }
                className="rounded border-cyber-border bg-cyber-darker text-cyber-neon focus:ring-cyber-neon"
              />
              Featured
            </label>
          </div>
          <div className="flex gap-3">
            <Button type="submit" loading={loading}>
              Save changes
            </Button>
            <Link href="/admin/products">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
          </div>
        </motion.form>
      </div>
    </PageTransition>
  );
}
