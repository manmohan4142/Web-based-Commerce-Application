'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { PageTransition } from '@/components/layout/PageTransition';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    totalPrice,
    totalItems,
  } = useCartStore();

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white">Your Cart</h1>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 rounded-xl border border-cyber-border bg-cyber-card/50 py-16 text-center"
          >
            <ShoppingBag className="mx-auto h-16 w-16 text-cyber-muted" />
            <p className="mt-4 text-gray-400">Your cart is empty</p>
            <Link href="/shop">
              <Button variant="outline" className="mt-6">
                Continue shopping
              </Button>
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="mt-8 space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.product._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 rounded-xl border border-cyber-border bg-cyber-card/80 p-4 backdrop-blur-md"
                  >
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-cyber-darker">
                      {item.product.images?.[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-cyber-muted text-sm">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/shop/${item.product.slug}`}
                        className="font-semibold text-white hover:text-cyber-neon"
                      >
                        {item.product.name}
                      </Link>
                      <p className="mt-1 text-cyber-neon">
                        {formatPrice(item.product.price)} each
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex items-center gap-1 rounded-lg border border-cyber-border bg-cyber-darker/50">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product._id,
                                item.quantity - 1
                              )
                            }
                            className="rounded-l-md p-2 text-gray-400 hover:bg-white/10 hover:text-white"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-10 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product._id,
                                item.quantity + 1
                              )
                            }
                            className="rounded-r-md p-2 text-gray-400 hover:bg-white/10 hover:text-white"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product._id)}
                          className="flex items-center gap-1 text-sm text-red-400 hover:underline"
                        >
                          <Trash2 className="h-4 w-4" /> Remove
                        </button>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-semibold text-cyber-neon">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <motion.div
              layout
              className="mt-8 rounded-xl border border-cyber-border bg-cyber-card/80 p-6 backdrop-blur-md"
            >
              <div className="flex justify-between text-lg">
                <span className="text-gray-300">Subtotal ({totalItems()} items)</span>
                <span className="font-bold text-cyber-neon">
                  {formatPrice(totalPrice())}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Shipping and taxes calculated at checkout.
              </p>
              <Link href="/checkout">
                <Button size="lg" fullWidth className="mt-6">
                  Proceed to checkout
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="ghost" fullWidth className="mt-3">
                  Continue shopping
                </Button>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </PageTransition>
  );
}
