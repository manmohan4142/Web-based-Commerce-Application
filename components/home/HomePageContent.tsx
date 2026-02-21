'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Shield } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import { NewsletterForm } from '@/components/NewsletterForm';
import type { Product } from '@/types';

interface Category {
  _id: string;
  name: string;
  slug: string;
  productCount?: number;
}

interface HomePageContentProps {
  featuredProducts: Product[];
  categories: Category[];
}

export function HomePageContent({
  featuredProducts,
  categories,
}: HomePageContentProps) {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-cyber-border">
        <div className="absolute inset-0 bg-gradient-radial from-cyber-neon/5 via-transparent to-transparent" />
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-cyber-neon/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-cyber-neon-blue/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyber-neon/30 bg-cyber-neon/5 px-4 py-2 text-sm text-cyber-neon"
            >
              <Sparkles className="h-4 w-4" /> Next-gen shopping
            </motion.span>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="text-white">Welcome to </span>
              <span className="gradient-text">NEXUS</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
              Experience the future of e-commerce. Cutting-edge products,
              seamless checkout, and a design that feels like tomorrow.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <Link href="/shop">
                <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Shop Now
                </Button>
              </Link>
              <Link href="/shop#categories">
                <Button variant="outline" size="lg">
                  Browse Categories
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          {/* Floating elements */}
          <div className="mt-20 flex justify-center gap-8 opacity-60">
            {[
              { Icon: Zap, label: 'Fast' },
              { Icon: Shield, label: 'Secure' },
              { Icon: Sparkles, label: 'Premium' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="flex flex-col items-center gap-2 text-cyber-neon"
              >
                <item.Icon className="h-8 w-8" />
                <span className="text-sm">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-10 flex items-end justify-between"
        >
          <h2 className="text-3xl font-bold text-white">Featured Products</h2>
          <Link
            href="/shop"
            className="text-cyber-neon transition hover:underline"
          >
            View all →
          </Link>
        </motion.div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.slice(0, 4).map((product, i) => (
            <ProductCard
              key={product._id}
              product={product}
              index={i}
              priority={i < 2}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section
        id="categories"
        className="border-t border-cyber-border bg-cyber-darker/50 py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-10 text-3xl font-bold text-white"
          >
            Categories
          </motion.h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/shop?category=${encodeURIComponent(cat.slug)}`}>
                  <div className="group overflow-hidden rounded-xl border border-cyber-border bg-cyber-card/80 p-6 backdrop-blur-md transition hover:border-cyber-neon/40 hover:shadow-neon/20">
                    <span className="text-lg font-semibold text-white group-hover:text-cyber-neon">
                      {cat.name}
                    </span>
                    <p className="mt-1 text-sm text-gray-500">
                      {cat.productCount} products
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-10 text-3xl font-bold text-white"
        >
          What people say
        </motion.h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              quote:
                "NEXUS is the most polished store I've used. Checkout was seamless.",
              author: 'Alex C.',
              role: 'Tech enthusiast',
            },
            {
              quote:
                'Love the cyberpunk vibe. Fast delivery and great support.',
              author: 'Sam R.',
              role: 'Designer',
            },
            {
              quote:
                'Finally an e-commerce site that feels from the future.',
              author: 'Jordan M.',
              role: 'Developer',
            },
          ].map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-cyber-border bg-cyber-card/60 p-6 backdrop-blur-md"
            >
              <p className="text-gray-300">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-4 font-medium text-cyber-neon">{t.author}</p>
              <p className="text-sm text-gray-500">{t.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-cyber-border bg-cyber-darker/50 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-white sm:text-3xl"
          >
            Stay in the loop
          </motion.h2>
          <p className="mt-2 text-gray-400">
            Get early access to new drops and exclusive offers.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </PageTransition>
  );
}
