import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function FeatureCard({ icon: Icon, title, body, badge, className }) {
  return (
    <Card className={cn("group h-full overflow-hidden", className)}>
      <CardContent className="flex h-full flex-col p-8">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-sm bg-[var(--color-bg)] text-[var(--color-teal)] ring-1 ring-[var(--color-teal)]/10 transition-colors group-hover:bg-[var(--color-teal)] group-hover:text-white">
            <Icon size={28} aria-hidden="true" />
          </div>
          {badge ? <Badge variant="navy">{badge}</Badge> : null}
        </div>
        <h3 className="mb-3 text-lg font-bold text-[var(--color-navy)]">{title}</h3>
        <p className="text-sm leading-7 text-[var(--color-muted)]">{body}</p>
      </CardContent>
    </Card>
  );
}
