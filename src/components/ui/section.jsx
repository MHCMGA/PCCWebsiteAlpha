import { cn } from "@/lib/utils";

export function Section({ as: As = "section", className, container = true, children, ...p }) {
  return (
    <As className={cn("section", className)} {...p}>
      {container ? <div className="container-x">{children}</div> : children}
    </As>
  );
}

export function Eyebrow({ className, light = false, children }) {
  return <p className={cn(light ? "eyebrow-light" : "eyebrow", className)}>{children}</p>;
}

export function SectionHeading({ className, children }) {
  return <h2 className={cn("h-section", className)}>{children}</h2>;
}
