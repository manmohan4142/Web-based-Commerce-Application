'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import Button from '@/components/ui/Button';

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    if (!product.inStock) return;
    addItem(product, 1);
    openDrawer();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div whileTap={{ scale: 0.98 }}>
      <Button
        size="lg"
        leftIcon={<ShoppingCart className="h-5 w-5" />}
        onClick={handleClick}
        disabled={!product.inStock}
      >
        {added ? 'Added to cart!' : 'Add to cart'}
      </Button>
    </motion.div>
  );
}
