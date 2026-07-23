import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatisticCard({
  label,
  value,
  delta,
  deltaGood,
  hint,
  icon: Icon,
  className,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaGood?: boolean;
  hint?: string;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <Card className={cn("shadow-none", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.75} />}
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <div className="text-xl font-semibold tabular-nums tracking-tight">{value}</div>
          {delta && (
            <span
              className={cn(
                "text-xs font-medium tabular-nums",
                deltaGood ? "text-income" : "text-expense",
              )}
            >
              {delta}
            </span>
          )}
        </div>
        {hint && <div className="mt-1 text-[11px] text-muted-foreground">{hint}</div>}
      </CardContent>
    </Card>
  );
}