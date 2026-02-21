'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const links = [
  { href: '/shop', label: 'Shop' },
  { href: '/cart', label: 'Cart' },
  { href: '/auth/login', label: 'Account' },
];

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="border-t border-cyber-border bg-cyber-darker mt-24"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <Link href="/" className="text-2xl font-bold text-cyber-neon">
            NEXUS
          </Link>
          <nav className="flex gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-400 transition hover:text-cyber-neon"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-8 border-t border-cyber-border pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} NEXUS. Built with Next.js, Tailwind & Framer Motion.
        </div>
      </div>
    </motion.footer>
  );
}
