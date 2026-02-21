'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const formData = new FormData();
      formData.set('email', email);
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full rounded-lg border border-cyber-border bg-cyber-dark px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-cyber-neon sm:w-80"
        required
        disabled={status === 'loading'}
      />
      <Button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
      </Button>
      {status === 'success' && (
        <p className="w-full text-center text-sm text-cyber-neon sm:w-auto">
          Thanks! You&apos;re subscribed.
        </p>
      )}
      {status === 'error' && (
        <p className="w-full text-center text-sm text-red-400 sm:w-auto">
          Something went wrong. Try again.
        </p>
      )}
    </form>
  );
}
