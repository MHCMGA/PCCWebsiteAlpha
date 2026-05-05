import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-bold uppercase tracking-[0.08em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] focus-visible:ring-offset-2 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-teal)] text-white shadow-sm hover:bg-[var(--color-navy)] hover:shadow-md motion-safe:hover:-translate-y-0.5",
        secondary:
          "bg-white text-[var(--color-navy)] shadow-sm ring-1 ring-[var(--color-border-soft)] hover:bg-[var(--color-bg)] hover:text-[var(--color-teal)]",
        danger: "bg-red-600 text-white shadow-sm hover:bg-red-700",
        outline:
          "border-2 border-white text-white hover:bg-white hover:text-[var(--color-teal)]",
        ghost:
          "text-[var(--color-navy)] hover:bg-[var(--color-bg)] hover:text-[var(--color-teal)]",
        navy: "bg-[var(--color-navy)] text-white shadow-sm hover:bg-[var(--color-teal)] motion-safe:hover:-translate-y-0.5",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-6",
        lg: "h-12 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
export { buttonVariants };
