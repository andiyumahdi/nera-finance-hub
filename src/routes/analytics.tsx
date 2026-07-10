import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/app-layout";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryDonut } from "@/components/analytics/category-donut";
import { IncomeExpenseBars } from "@/components/analytics/income-expense-bars";
import { CashflowChart } from "@/components/dashboard/cashflow-chart";
import { formatCurrency, formatDelta } from "@/lib/format";
import { kpis } from "@/lib/mock-data";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Nera" },
      { name: "description", content: "Trends, category breakdowns, and long-term savings insights." },
      { property: "og:title", content: "Analytics — Nera" },
      { property: "og:description", content: "Trends, category breakdowns, and long-term savings insights." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <AppLayout title="Analytics" subtitle="Trends and category insights">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <KpiCard label="Avg. monthly income" value={formatCurrency(7488)} delta={formatDelta(2.1)} deltaGood hint="Trailing 6 months" />
          <KpiCard label="Avg. monthly expense" value={formatCurrency(4759)} delta={formatDelta(-1.4)} deltaGood hint="Trailing 6 months" />
          <KpiCard label="Avg. savings" value={formatCurrency(2729)} delta={formatDelta(5.8)} deltaGood hint="Trailing 6 months" />
          <KpiCard label="Savings rate" value={`${kpis.savingsRate.toFixed(1)}%`} delta={formatDelta(kpis.savingsRateDelta)} deltaGood hint="This month" />
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Income vs. expense</CardTitle>
              <p className="text-xs text-muted-foreground">Monthly comparison</p>
            </CardHeader>
            <CardContent>
              <IncomeExpenseBars />
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Spending by category</CardTitle>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardHeader>
            <CardContent>
              <CategoryDonut />
            </CardContent>
          </Card>
        </section>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Savings trend</CardTitle>
            <p className="text-xs text-muted-foreground">Net cashflow over the last 6 months</p>
          </CardHeader>
          <CardContent>
            <CashflowChart />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
