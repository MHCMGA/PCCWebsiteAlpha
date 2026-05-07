import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

export const Label = React.forwardRef(({ className, ...p }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-sm font-bold text-[var(--color-navy)] mb-2 block",
      className,
    )}
    {...p}
  />
));
Label.displayName = "Label";
