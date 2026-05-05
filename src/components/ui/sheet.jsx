import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sheet(props) {
  return <DialogPrimitive.Root {...props} />;
}
Sheet.displayName = "Sheet";

export const SheetTrigger = React.forwardRef(({ ...props }, ref) => (
  <DialogPrimitive.Trigger ref={ref} {...props} />
));
SheetTrigger.displayName = "SheetTrigger";

export const SheetClose = React.forwardRef(({ ...props }, ref) => (
  <DialogPrimitive.Close ref={ref} {...props} />
));
SheetClose.displayName = "SheetClose";

const SheetPortal = ({ children, ...p }) => (
  <DialogPrimitive.Portal {...p}>{children}</DialogPrimitive.Portal>
);

export const SheetOverlay = React.forwardRef(({ className, ...p }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out",
      className,
    )}
    {...p}
  />
));
SheetOverlay.displayName = "SheetOverlay";

export const SheetContent = React.forwardRef(
  ({ side = "right", className, children, ...p }, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 bg-white shadow-xl transition-transform duration-300",
          side === "right" &&
            "inset-y-0 right-0 h-full w-80 data-[state=closed]:translate-x-full",
          side === "left" &&
            "inset-y-0 left-0 h-full w-80 data-[state=closed]:-translate-x-full",
          side === "top" &&
            "inset-x-0 top-0 w-full data-[state=closed]:-translate-y-full",
          side === "bottom" &&
            "inset-x-0 bottom-0 w-full data-[state=closed]:translate-y-full",
          className,
        )}
        {...p}
      >
        <DialogPrimitive.Title className="sr-only">Menu</DialogPrimitive.Title>
        <DialogPrimitive.Description className="sr-only">
          Site navigation
        </DialogPrimitive.Description>
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm p-1 hover:bg-[var(--color-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)]">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </SheetPortal>
  ),
);
SheetContent.displayName = "SheetContent";
