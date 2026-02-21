'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import type { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
  priority?: boolean;
}

export function ProductCard({ product, index = 0, priority }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    openDrawer();
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group overflow-hidden rounded-xl border border-cyber-border bg-cyber-card/80 backdrop-blur-md transition-shadow hover:border-cyber-neon/30 hover:shadow-neon/20"
    >
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-cyber-darker">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={priority}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-cyber-muted">
              No image
            </div>
          )}
          {product.featured && (
            <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-cyber-neon/20 px-2 py-1 text-xs font-medium text-cyber-neon">
              <Star className="h-3 w-3 fill-current" /> Featured
            </span>
          )}
          {product.compareAtPrice != null && product.compareAtPrice > product.price && (
            <span className="absolute right-3 top-3 rounded bg-cyber-neon-pink/80 px-2 py-1 text-xs font-medium text-white">
              Sale
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-white line-clamp-2 group-hover:text-cyber-neon">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-bold text-cyber-neon">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice != null && product.compareAtPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          <div className="mt-3 flex gap-2">
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              leftIcon={<ShoppingCart className="h-4 w-4" />}
              onClick={handleAddToCart}
            >
              Add to cart
            </Button>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
