import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef(({ className, type = 'text', ...p }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      'flex h-11 w-full rounded-sm border border-[var(--color-border-soft)] bg-white px-3 py-2 text-sm text-[var(--color-navy)] placeholder:text-[var(--color-muted)] focus-visible:outline-none focus-visible:border-[var(--color-teal)] focus-visible:ring-1 focus-visible:ring-[var(--color-teal)] disabled:opacity-50',
      className
    )}
    {...p}
  />
));
Input.displayName = 'Input';
