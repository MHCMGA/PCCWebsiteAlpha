import * as React from "react";
import { cn } from "@/lib/utils";

export const Card = React.forwardRef(({ className, ...p }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-sm border border-[var(--color-border-soft)] bg-white shadow-[0_1px_0_rgba(0,48,87,0.03)] transition-all hover:shadow-[0_12px_34px_rgba(0,48,87,0.12)] focus-within:ring-2 focus-within:ring-[var(--color-teal)]/30 motion-safe:hover:-translate-y-1",
      className,
    )}
    {...p}
  />
));
Card.displayName = "Card";

export const CardHeader = React.forwardRef(({ className, ...p }, ref) => (
  <div ref={ref} className={cn("p-8 pb-4", className)} {...p} />
));
CardHeader.displayName = "CardHeader";

export const CardContent = React.forwardRef(({ className, ...p }, ref) => (
  <div ref={ref} className={cn("p-8 pt-0", className)} {...p} />
));
CardContent.displayName = "CardContent";

export const CardTitle = React.forwardRef(({ className, ...p }, ref) => (
  <h3
    ref={ref}
    className={cn("text-base font-bold text-[var(--color-navy)]", className)}
    {...p}
  />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef(({ className, ...p }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-[var(--color-muted)] leading-7", className)}
    {...p}
  />
));
CardDescription.displayName = "CardDescription";
