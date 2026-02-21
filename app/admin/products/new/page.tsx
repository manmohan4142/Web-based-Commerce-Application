'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/layout/PageTransition';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    compareAtPrice: '',
    category: '',
    images: '',
    inStock: true,
    featured: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug || undefined,
        description: form.description,
        price: Number(form.price) || 0,
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
      alert(data.error ?? 'Failed to create product');
      return;
    }
    const product = await res.json();
    router.push(`/admin/products`);
    router.refresh();
  };

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
          <h1 className="text-2xl font-bold text-white">Add product</h1>
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
          <Input
            label="Slug (optional)"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="auto-generated if empty"
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
            placeholder="e.g. Electronics"
          />
          <Input
            label="Image URLs (comma-separated)"
            value={form.images}
            onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
            placeholder="https://..."
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
              Create product
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
