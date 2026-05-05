import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef(({ className, ...p }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-32 w-full rounded-sm border border-[var(--color-border-soft)] bg-white px-3 py-2 text-sm text-[var(--color-navy)] shadow-sm placeholder:text-[var(--color-muted)] focus-visible:border-[var(--color-teal)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-teal)] disabled:opacity-50 aria-invalid:border-red-400 aria-invalid:ring-red-200",
      className,
    )}
    {...p}
  />
));
Textarea.displayName = "Textarea";
