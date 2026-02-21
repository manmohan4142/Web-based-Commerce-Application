'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/layout/PageTransition';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import type { Product, Category, SortOption } from '@/types';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (sort) params.set('sort', sort);
      if (minPrice) params.set('minPrice', String(Number(minPrice) * 100));
      if (maxPrice) params.set('maxPrice', String(Number(maxPrice) * 100));
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (!res.ok) {
        const msg = (data && typeof data.error === 'string') ? data.error : 'Failed to load products.';
        setError(msg);
        setProducts([]);
      } else {
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch {
      setError('Unable to load products. Check that the server and MongoDB are running.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, sort, minPrice, maxPrice]);

  useEffect(() => {
    fetch(`/api/categories`)
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setCategories(list);
        const slug = searchParams.get('category');
        if (slug && list.length) {
          const found = list.find((c: Category) => c.slug === slug);
          if (found) setCategory(found.name);
        }
      });
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white"
        >
          Shop
        </motion.h1>

        <div className="mt-8 flex flex-col gap-6 lg:flex-row">
          {/* Filters sidebar */}
          <aside className="w-full shrink-0 lg:w-64">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl border border-cyber-border bg-cyber-card/80 p-4 backdrop-blur-md"
            >
              <h3 className="mb-4 font-semibold text-white">Category</h3>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-cyber-border bg-cyber-darker px-3 py-2 text-white outline-none focus:border-cyber-neon"
              >
                <option value="">All</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name} ({c.productCount})
                  </option>
                ))}
              </select>
              <h3 className="mt-6 mb-2 font-semibold text-white">Price range</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full rounded-lg border border-cyber-border bg-cyber-darker px-3 py-2 text-white placeholder-gray-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full rounded-lg border border-cyber-border bg-cyber-darker px-3 py-2 text-white placeholder-gray-500"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">USD (e.g. 10, 100)</p>
              <h3 className="mt-6 mb-2 font-semibold text-white">Sort</h3>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="w-full rounded-lg border border-cyber-border bg-cyber-darker px-3 py-2 text-white outline-none focus:border-cyber-neon"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name A–Z</option>
              </select>
            </motion.div>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-cyber-border bg-cyber-card/50 py-16 px-6 text-center"
              >
                <p className="text-gray-400 mb-4">{error}</p>
                <button
                  type="button"
                  onClick={() => fetchProducts()}
                  className="rounded-lg bg-cyber-neon/20 px-4 py-2 text-cyber-neon hover:bg-cyber-neon/30 transition-colors"
                >
                  Try again
                </button>
              </motion.div>
            ) : products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-cyber-border bg-cyber-card/50 py-16 px-6 text-center text-gray-400"
              >
                <p className="mb-2">No products found.</p>
                <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
                  {category || minPrice || maxPrice
                    ? 'Try adjusting filters or choose "All" categories.'
                    : 'The database has no products yet. Run "npm run seed" (with MongoDB running) to load sample products, or sign in as admin to add products.'}
                </p>
                {!category && !minPrice && !maxPrice && (
                  <Link
                    href="/auth/login"
                    className="text-cyber-neon hover:underline text-sm"
                  >
                    Sign in as admin to add products →
                  </Link>
                )}
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
              >
                {products.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
