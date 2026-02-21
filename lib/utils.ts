import { clsx, type ClassValue } from 'clsx';

/** Merge class names with Tailwind-friendly conflict resolution */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Format price for display */
export function formatPrice(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount / 100); // Stripe uses cents
}

/** Generate slug from string */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

/** Delay helper for animations */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
