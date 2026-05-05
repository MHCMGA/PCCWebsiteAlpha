import { cn } from "@/lib/utils";

export function Spinner({ className, label = "Loading" }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        aria-hidden="true"
      />
      <span>{label}</span>
    </span>
  );
}
