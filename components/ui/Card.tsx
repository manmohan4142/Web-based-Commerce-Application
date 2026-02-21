'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLMotionProps<'div'> {
  glow?: boolean;
  hover?: boolean;
}

export function Card({
  className,
  glow,
  hover = true,
  children,
  ...props
}: CardProps) {
  return (
    <motion.div
      initial={false}
      whileHover={
        hover
          ? {
              scale: 1.02,
              boxShadow: '0 0 30px rgba(0, 255, 136, 0.15)',
              transition: { duration: 0.2 },
            }
          : undefined
      }
      className={cn(
        'rounded-xl border border-cyber-border bg-cyber-card/80 backdrop-blur-md',
        glow && 'shadow-glow',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('border-b border-cyber-border/50 px-6 py-4', className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6', className)} {...props} />;
}