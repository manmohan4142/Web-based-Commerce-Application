'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/layout/PageTransition';
import { Spinner } from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  if (!session) {
    router.push('/auth/login?callbackUrl=/account');
    return null;
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white">Account</h1>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-xl border border-cyber-border bg-cyber-card/80 p-6 backdrop-blur-md"
        >
          <div className="flex items-center gap-4">
            {session.user?.image && (
              <Image
                src={session.user.image}
                alt=""
                width={64}
                height={64}
                className="h-16 w-16 rounded-full border-2 border-cyber-neon/30"
              />
            )}
            <div>
              <p className="text-xl font-semibold text-white">
                {session.user?.name ?? 'User'}
              </p>
              <p className="text-gray-400">{session.user?.email}</p>
            </div>
          </div>
          <div className="mt-8 flex gap-4">
            <Link href="/shop">
              <Button variant="outline">Continue shopping</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
