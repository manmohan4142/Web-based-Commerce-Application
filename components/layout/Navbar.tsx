'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import Button from '@/components/ui/Button';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/cart', label: 'Cart' },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const totalItems = useCartStore((s) => s.totalItems());
  const toggleDrawer = useCartStore((s) => s.toggleDrawer);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 border-b border-cyber-border bg-cyber-dark/95 backdrop-blur-md"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-cyber-neon"
          >
            NEXUS
          </Link>

          <nav className="hidden md:flex md:items-center md:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 transition hover:text-cyber-neon"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDrawer}
              className="relative rounded-lg p-2 text-gray-300 hover:bg-white/5 hover:text-cyber-neon"
              aria-label="Cart"
            >
              <ShoppingCart className="h-6 w-6" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyber-neon text-xs font-bold text-cyber-dark"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {status === 'loading' ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-cyber-border/50" />
            ) : session ? (
              <div className="hidden items-center gap-2 md:flex">
                <Link
                  href="/account"
                  className="rounded-lg p-2 text-gray-300 hover:bg-white/5 hover:text-cyber-neon"
                  title="Account"
                >
                  <User className="h-6 w-6" />
                </Link>
                {(session.user as { role?: string })?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="rounded-lg p-2 text-gray-300 hover:bg-white/5 hover:text-cyber-neon"
                    title="Admin"
                  >
                    <LayoutDashboard className="h-6 w-6" />
                  </Link>
                )}
                <Link href="/api/auth/signout">
                  <Button variant="ghost" size="sm">
                    Sign out
                  </Button>
                </Link>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Sign in
                </Button>
              </Link>
            )}

            <button
              className="rounded-lg p-2 text-gray-300 hover:bg-white/5 md:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-cyber-border bg-cyber-dark md:hidden"
            >
              <nav className="flex flex-col gap-1 px-4 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-cyber-neon"
                  >
                    {link.label}
                  </Link>
                ))}
                {!session && (
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-4 py-2 text-cyber-neon"
                  >
                    Sign in
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
      <CartDrawer />
    </>
  );
}
