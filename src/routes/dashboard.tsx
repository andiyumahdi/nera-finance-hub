import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { CashflowChart } from "@/components/dashboard/cashflow-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { budgets, kpis, transactions } from "@/lib/mock-data";
import { formatCurrency, formatDelta } from "@/lib/format";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Nera" },
      { name: "description", content: "Your monthly cashflow, spending, and savings at a glance." },
      { property: "og:title", content: "Dashboard — Nera" },
      { property: "og:description", content: "Your monthly cashflow, spending, and savings at a glance." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const recent = transactions.slice(0, 5);
  return (
    <AppLayout title="Dashboard" subtitle="Overview of your finances this month">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Net worth"
            value={formatCurrency(kpis.netWorth)}
            delta={formatDelta(kpis.netWorthDelta)}
            deltaGood={kpis.netWorthDelta >= 0}
            hint="vs last month"
          />
          <KpiCard
            label="Income (July)"
            value={formatCurrency(kpis.monthIncome)}
            delta={formatDelta(kpis.monthIncomeDelta)}
            deltaGood={kpis.monthIncomeDelta >= 0}
            hint="vs June"
          />
          <KpiCard
            label="Expenses (July)"
            value={formatCurrency(kpis.monthExpense)}
            delta={formatDelta(kpis.monthExpenseDelta)}
            deltaGood={kpis.monthExpenseDelta <= 0}
            hint="vs June"
          />
          <KpiCard
            label="Savings rate"
            value={`${kpis.savingsRate.toFixed(1)}%`}
            delta={formatDelta(kpis.savingsRateDelta)}
            deltaGood={kpis.savingsRateDelta >= 0}
            hint="of monthly income"
          />
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="shadow-none lg:col-span-2">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-semibold">Net cashflow</CardTitle>
                <p className="text-xs text-muted-foreground">Last 6 months</p>
              </div>
              <Badge variant="secondary" className="font-normal">Monthly</Badge>
            </CardHeader>
            <CardContent>
              <CashflowChart />
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <CardTitle className="text-sm font-semibold">Budgets</CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                Manage <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {budgets.map((b) => {
                const pct = Math.min(100, (b.spent / b.limit) * 100);
                const over = b.spent > b.limit;
                return (
                  <div key={b.category}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-medium">{b.category}</span>
                      <span className={cn("font-mono text-xs tabular-nums", over ? "text-expense" : "text-muted-foreground")}>
                        {formatCurrency(b.spent)} / {formatCurrency(b.limit)}
                      </span>
                    </div>
                    <Progress value={pct} className="mt-1.5 h-1.5" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </section>

        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-sm font-semibold">Recent transactions</CardTitle>
              <p className="text-xs text-muted-foreground">Latest activity across accounts</p>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              View all <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="divide-y">
              {recent.map((t) => (
                <li key={t.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{t.description}</div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{format(new Date(t.date), "MMM d")}</span>
                      <span>·</span>
                      <span className="truncate">{t.category}</span>
                    </div>
                  </div>
                  <div className={cn("font-mono text-sm tabular-nums", t.type === "income" ? "text-income" : "text-expense")}>
                    {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
