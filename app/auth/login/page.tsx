'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/layout/PageTransition';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError('Invalid email or password');
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <PageTransition>
      <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-cyber-border bg-cyber-card/80 p-8 backdrop-blur-md"
        >
          <h1 className="text-2xl font-bold text-white">Sign in</h1>
          <p className="mt-2 text-gray-400">
            Welcome back. Sign in to your account.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
            <Button type="submit" fullWidth loading={loading}>
              Sign in
            </Button>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cyber-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-cyber-card px-4 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Button
                type="button"
                variant="secondary"
                fullWidth
                onClick={() => signIn('google', { callbackUrl })}
              >
                Google
              </Button>
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-cyber-neon hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <PageTransition>
        <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12">
          <div className="rounded-2xl border border-cyber-border bg-cyber-card/80 p-8 backdrop-blur-md animate-pulse">
            <div className="h-8 w-32 bg-cyber-border rounded" />
            <div className="mt-2 h-4 w-64 bg-cyber-border rounded" />
            <div className="mt-8 space-y-6">
              <div className="h-12 bg-cyber-border rounded" />
              <div className="h-12 bg-cyber-border rounded" />
              <div className="h-12 bg-cyber-border rounded" />
            </div>
          </div>
        </div>
      </PageTransition>
    }>
      <LoginForm />
    </Suspense>
  );
}
