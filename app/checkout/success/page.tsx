'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import Button from '@/components/ui/Button';

export default function CheckoutSuccessPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-cyber-neon/20"
        >
          <CheckCircle className="h-14 w-14 text-cyber-neon" />
        </motion.div>
        <h1 className="mt-8 text-3xl font-bold text-white">
          Order confirmed
        </h1>
        <p className="mt-4 text-gray-400">
          Thank you for your purchase. You will receive an email confirmation shortly.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/shop">
            <Button>Continue shopping</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Back to home</Button>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
