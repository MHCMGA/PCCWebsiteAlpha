import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] transition-colors",
  {
    variants: {
      variant: {
        default: "border-[var(--color-teal)]/20 bg-[var(--color-teal)]/10 text-[var(--color-teal)]",
        navy: "border-[var(--color-navy)]/15 bg-[var(--color-navy)]/5 text-[var(--color-navy)]",
        light: "border-white/20 bg-white/10 text-white",
        cyan: "border-[var(--color-cyan)]/25 bg-[var(--color-cyan)]/10 text-[var(--color-navy)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export const Badge = React.forwardRef(({ className, variant, ...props }, ref) => (
  <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
));
Badge.displayName = "Badge";
