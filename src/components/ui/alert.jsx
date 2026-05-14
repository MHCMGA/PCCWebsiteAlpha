import * as React from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const icons = {
  default: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  error: AlertCircle,
};

const alertVariants = cva("rounded-sm border p-4 text-sm leading-6", {
  variants: {
    variant: {
      default: "border-[var(--color-border-soft)] bg-white text-[var(--color-ink)]",
      success: "border-emerald-200 bg-emerald-50 text-emerald-950",
      warning: "border-amber-200 bg-amber-50 text-amber-950",
      error: "border-red-200 bg-red-50 text-red-950",
    },
  },
  defaultVariants: { variant: "default" },
});

export const Alert = React.forwardRef(
  ({ className, variant = "default", title, children, ...props }, ref) => {
    const Icon = icons[variant] || icons.default;
    return (
      <div
        ref={ref}
        role={variant === "error" ? "alert" : "status"}
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        <div className="flex gap-3">
          <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <div>
            {title ? <p className="font-bold">{title}</p> : null}
            {children ? <div className={cn(title && "mt-1")}>{children}</div> : null}
          </div>
        </div>
      </div>
    );
  },
);
Alert.displayName = "Alert";
