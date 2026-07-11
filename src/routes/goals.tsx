import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/app-layout";
import { GoalCard } from "@/components/goals/goal-card";
import { NewGoalDialog } from "@/components/goals/new-goal-dialog";
import { goals } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/goals")({
  head: () => ({
    meta: [
      { title: "Goals — Nera" },
      { name: "description", content: "Set savings goals and track progress toward what matters most." },
      { property: "og:title", content: "Goals — Nera" },
      { property: "og:description", content: "Set savings goals and track progress toward what matters most." },
    ],
  }),
  component: GoalsPage,
});

function GoalsPage() {
  const total = goals.reduce((a, g) => a + g.current, 0);
  const target = goals.reduce((a, g) => a + g.target, 0);
  return (
    <AppLayout title="Goals" subtitle={`${goals.length} active`}>
      <div className="mx-auto max-w-7xl space-y-8">
        <Card className="shadow-none">
          <CardContent className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5 sm:flex sm:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Total saved toward goals</p>
              <p className="mt-2 text-xl font-semibold tabular-nums tracking-tight">
                {formatCurrency(total)}
                <span className="ml-2 text-[13px] font-normal text-muted-foreground">
                  of {formatCurrency(target)}
                </span>
              </p>
            </div>
            <NewGoalDialog />
          </CardContent>
        </Card>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {goals.map((g) => (
            <GoalCard key={g.id} goal={g} />
          ))}
        </section>
      </div>
    </AppLayout>
  );
}
