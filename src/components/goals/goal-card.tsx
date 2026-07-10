import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import type { Goal } from "@/lib/mock-data";
import { format } from "date-fns";

export function GoalCard({ goal }: { goal: Goal }) {
  const pct = Math.min(100, (goal.current / goal.target) * 100);
  return (
    <Card className="shadow-none">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold">{goal.name}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Target {format(new Date(goal.deadline), "MMM yyyy")}
            </p>
          </div>
          <Badge variant="secondary" className="shrink-0 font-normal">
            {goal.category}
          </Badge>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <div className="font-mono text-lg font-semibold tabular-nums">
              {formatCurrency(goal.current)}
            </div>
            <div className="text-xs text-muted-foreground">
              of {formatCurrency(goal.target)}
            </div>
          </div>
          <Progress value={pct} className="mt-2 h-1.5" />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{pct.toFixed(0)}% funded</span>
            <span>{formatCurrency(goal.target - goal.current)} to go</span>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button size="sm" className="flex-1">Contribute</Button>
          <Button size="sm" variant="outline">Edit</Button>
        </div>
      </CardContent>
    </Card>
  );
}
