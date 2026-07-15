import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import type { Goal } from "@/lib/mock-data";
import { format } from "date-fns";

export function GoalCard({
  goal,
  onEdit,
  onContribute,
}: {
  goal: Goal;
  onEdit?: (g: Goal) => void;
  onContribute?: (g: Goal) => void;
}) {
  const pct = Math.min(100, (goal.current / goal.target) * 100);
  const size = 88;
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (pct / 100) * circumference;
  return (
    <Card className="shadow-none">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {goal.category}
            </p>
            <h3 className="mt-1 truncate text-[15px] font-medium">{goal.name}</h3>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Target {format(new Date(goal.deadline), "MMM yyyy")}
            </p>
          </div>
          <div className="relative shrink-0" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="var(--border)"
                strokeWidth={stroke}
                fill="none"
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="var(--primary)"
                strokeWidth={stroke}
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${dash} ${circumference}`}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <span className="text-sm font-medium tabular-nums">{pct.toFixed(0)}%</span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-baseline justify-between border-t border-border/60 pt-4">
          <div>
            <div className="text-lg font-semibold tabular-nums tracking-tight">
              {formatCurrency(goal.current)}
            </div>
            <div className="text-[11px] text-muted-foreground">
              of {formatCurrency(goal.target)}
            </div>
          </div>
          <div className="text-right text-[11px] text-muted-foreground">
            {formatCurrency(goal.target - goal.current)} to go
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => onContribute?.(goal)}
            disabled={goal.current >= goal.target}
          >
            {goal.current >= goal.target ? "Completed" : "Contribute"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onEdit?.(goal)}>
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
