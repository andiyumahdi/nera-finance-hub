import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, Receipt } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { CashflowChart } from "@/components/dashboard/cashflow-chart";
import { NeraInsight } from "@/components/dashboard/nera-insight";
import { WalletOverview } from "@/components/dashboard/wallet-overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDelta } from "@/lib/format";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useDashboardData } from "@/lib/data-hooks";
import { DashboardSkeleton } from "@/components/state/skeletons";
import { ErrorState } from "@/components/state/error-state";
import { EmptyState } from "@/components/state/empty-state";
import { mockWallets } from "@/lib/wallet-mock";

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
  const { data, isLoading, error, refetch } = useDashboardData();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <AppLayout title="Dashboard" subtitle="Overview of your finances this month">
        <div className="mx-auto max-w-7xl">
          <DashboardSkeleton />
        </div>
      </AppLayout>
    );
  }

  if (error || !data) {
    return (
      <AppLayout title="Dashboard" subtitle="Overview of your finances this month">
        <div className="mx-auto max-w-7xl">
          <ErrorState
            title="Unable to load dashboard"
            description="We couldn't fetch your latest data. Please try again."
            onRetry={refetch}
          />
        </div>
      </AppLayout>
    );
  }

  const { kpis, budgets, recent } = data;
  return (
    <AppLayout title="Dashboard" subtitle="Overview of your finances this month">
      <div className="mx-auto max-w-7xl space-y-8">
        <NeraInsight />

        <section className="grid grid-cols-2 gap-5 xl:grid-cols-4">
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

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Card className="shadow-none lg:col-span-2">

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-[13px] font-medium">Net cashflow</CardTitle>
                <p className="text-[11px] text-muted-foreground">Last 6 months</p>
              </div>
              <span className="text-[11px] text-muted-foreground">Monthly</span>
            </CardHeader>
            <CardContent>
              <CashflowChart />
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[13px] font-medium">Budgets</CardTitle>
              <Button variant="ghost" size="sm" className="h-6 px-1 text-[11px] text-muted-foreground">
                Manage <ArrowUpRight className="ml-0.5 h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-5">
              {budgets.map((b) => {
                const pct = Math.min(100, (b.spent / b.limit) * 100);
                const over = b.spent > b.limit;
                return (
                  <div key={b.category}>
                    <div className="flex items-baseline justify-between text-[13px]">
                      <span>{b.category}</span>
                      <span className={cn("text-[11px] tabular-nums", over ? "text-expense" : "text-muted-foreground")}>
                        {formatCurrency(b.spent)} / {formatCurrency(b.limit)}
                      </span>
                    </div>
                    <Progress value={pct} className="mt-2 h-1" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </section>

        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-[13px] font-medium">Recent transactions</CardTitle>
              <p className="text-[11px] text-muted-foreground">Latest activity across accounts</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: "/transactions" })}
              className="h-6 px-1 text-[11px] text-muted-foreground"
            >
              View all <ArrowUpRight className="ml-0.5 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            {recent.length === 0 ? (
              <EmptyState
                icon={Receipt}
                title="No transactions yet"
                description="Once your accounts sync, activity will show up here."
                actionLabel="Go to transactions"
                onAction={() => navigate({ to: "/transactions" })}
              />
            ) : (
            <ul className="divide-y divide-border/60">
              {recent.map((t) => (
                <li key={t.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3.5">
                  <div className="min-w-0">
                    <div className="truncate text-[13px]">{t.description}</div>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span>{format(new Date(t.date), "MMM d")}</span>
                      <span>·</span>
                      <span className="truncate">{t.category}</span>
                    </div>
                  </div>
                  <div className={cn("text-[13px] tabular-nums", t.type === "income" ? "text-income" : "text-expense")}>
                    {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
                  </div>
                </li>
              ))}
            </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
