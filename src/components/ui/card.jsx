import * as React from 'react';
import { cn } from '@/lib/utils';

export const Card = React.forwardRef(({ className, ...p }, ref) => (
  <div
    ref={ref}
    className={cn(
      'bg-white border border-[var(--color-border-soft)] rounded-sm transition-all hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,48,87,0.1)]',
      className
    )}
    {...p}
  />
));
Card.displayName = 'Card';

export const CardHeader = React.forwardRef(({ className, ...p }, ref) => (
  <div ref={ref} className={cn('p-8 pb-4', className)} {...p} />
));
CardHeader.displayName = 'CardHeader';

export const CardContent = React.forwardRef(({ className, ...p }, ref) => (
  <div ref={ref} className={cn('p-8 pt-0', className)} {...p} />
));
CardContent.displayName = 'CardContent';

export const CardTitle = React.forwardRef(({ className, ...p }, ref) => (
  <h3 ref={ref} className={cn('text-base font-bold text-[var(--color-navy)]', className)} {...p} />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef(({ className, ...p }, ref) => (
  <p ref={ref} className={cn('text-sm text-[var(--color-muted)] leading-7', className)} {...p} />
));
CardDescription.displayName = 'CardDescription';
