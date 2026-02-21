'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

export function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, updateQuantity, removeItem, totalPrice, totalItems } =
    useCartStore();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-cyber-border bg-cyber-dark shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-cyber-border px-6 py-4">
              <h2 className="text-lg font-semibold text-white">
                Cart ({totalItems()})
              </h2>
              <button
                onClick={closeDrawer}
                className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ShoppingBag className="mb-4 h-16 w-16 text-cyber-muted" />
                  <p className="text-gray-400">Your cart is empty</p>
                  <Link href="/shop" onClick={closeDrawer}>
                    <Button variant="outline" className="mt-4">
                      Browse Shop
                    </Button>
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item, index) => (
                      <motion.li
                        key={item.product._id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-4 rounded-lg border border-cyber-border bg-cyber-card/50 p-3"
                      >
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-cyber-darker">
                          {item.product.images?.[0] ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-cyber-muted">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/shop/${item.product.slug}`}
                            onClick={closeDrawer}
                            className="font-medium text-white hover:text-cyber-neon line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          <p className="mt-1 text-sm text-cyber-neon">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product._id,
                                  item.quantity - 1
                                )
                              }
                              className="rounded bg-cyber-darker p-1 text-gray-400 hover:bg-white/10 hover:text-white"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product._id,
                                  item.quantity + 1
                                )
                              }
                              className="rounded bg-cyber-darker p-1 text-gray-400 hover:bg-white/10 hover:text-white"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => removeItem(item.product._id)}
                              className="ml-2 text-xs text-red-400 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>
            {items.length > 0 && (
              <div className="border-t border-cyber-border p-6">
                <div className="mb-4 flex justify-between text-lg font-semibold">
                  <span className="text-gray-300">Subtotal</span>
                  <span className="text-cyber-neon">
                    {formatPrice(totalPrice())}
                  </span>
                </div>
                <div className="flex gap-3">
                  <Link href="/cart" onClick={closeDrawer}>
                    <Button variant="secondary" fullWidth>
                      View Cart
                    </Button>
                  </Link>
                  <Link href="/checkout" onClick={closeDrawer}>
                    <Button fullWidth>Checkout</Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
