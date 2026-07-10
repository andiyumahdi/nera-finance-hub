import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  delta,
  deltaGood,
  hint,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaGood?: boolean;
  hint?: string;
}) {
  return (
    <Card className="shadow-none">
      <CardContent className="p-5">
        <div className="text-xs font-medium text-muted-foreground">{label}</div>
        <div className="mt-2 flex items-baseline justify-between gap-2">
          <div className="truncate text-2xl font-semibold tracking-tight">{value}</div>
          {delta && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium",
                deltaGood ? "bg-income/10 text-income" : "bg-expense/10 text-expense",
              )}
            >
              {deltaGood ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {delta}
            </span>
          )}
        </div>
        {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
      </CardContent>
    </Card>
  );
}
