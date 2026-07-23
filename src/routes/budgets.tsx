import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, PieChart, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BudgetCard } from "@/components/budget/budget-card";
import { BudgetFormDialog, type BudgetFormValues } from "@/components/budget/budget-form-dialog";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { StatisticCard } from "@/components/shared/statistic-card";
import { EmptyState } from "@/components/state/empty-state";
import { formatIDR, mockBudgets, type Budget, type BudgetPeriod } from "@/lib/wallet-mock";

export const Route = createFileRoute("/budgets")({
  head: () => ({
    meta: [
      { title: "Budgets — Nera" },
      { name: "description", content: "Plan spending limits by category and stay on track." },
      { property: "og:title", content: "Budgets — Nera" },
      { property: "og:description", content: "Plan spending limits by category and stay on track." },
    ],
  }),
  component: BudgetsPage,
});

function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [period, setPeriod] = useState<BudgetPeriod>("monthly");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);
  const [deleting, setDeleting] = useState<Budget | null>(null);
  const [deletingLoad, setDeletingLoad] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => { setBudgets(mockBudgets); setLoading(false); }, 400);
    return () => clearTimeout(id);
  }, []);

  const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms));

  const handleCreate = async (v: BudgetFormValues) => { await wait(); setBudgets((p) => [...p, { id: `b-${Date.now()}`, ...v }]); toast.success(`${v.category} budget added`); };
  const handleEdit = async (v: BudgetFormValues) => { if (!editing) return; await wait(); setBudgets((p) => p.map((b) => (b.id === editing.id ? { ...b, ...v } : b))); toast.success("Budget updated"); };
  const handleDelete = async () => { if (!deleting) return; setDeletingLoad(true); await wait(); setBudgets((p) => p.filter((b) => b.id !== deleting.id)); setDeletingLoad(false); setDeleting(null); toast.success("Budget removed"); };

  const shown = budgets.filter((b) => b.period === period);
  const totalLimit = shown.reduce((a, b) => a + b.limit, 0);
  const totalSpent = shown.reduce((a, b) => a + b.spent, 0);
  const overCount = shown.filter((b) => b.spent > b.limit).length;
  const warnCount = shown.filter((b) => b.spent / b.limit >= 0.8 && b.spent <= b.limit).length;

  return (
    <AppLayout title="Budgets" subtitle="Plan spending limits by category">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Select value={period} onValueChange={(v) => setPeriod(v as BudgetPeriod)}>
            <SelectTrigger className="h-8 w-[140px] text-[12.5px]"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="monthly">Monthly</SelectItem><SelectItem value="weekly">Weekly</SelectItem></SelectContent>
          </Select>
          <Button size="sm" onClick={() => setCreating(true)} className="h-8 text-[12.5px]"><Plus className="mr-1 h-3.5 w-3.5" /> New budget</Button>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => (<Card key={i} className="shadow-none"><CardContent className="space-y-3 p-4"><Skeleton className="h-3 w-24" /><Skeleton className="h-1.5 w-full" /><Skeleton className="h-3 w-20" /></CardContent></Card>))}</div>
        ) : (
          <>
            <section className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <StatisticCard label="Total budget" value={formatIDR(totalLimit)} hint={`${shown.length} categories`} />
              <StatisticCard label="Total spent" value={formatIDR(totalSpent)} hint={`${Math.round((totalSpent / (totalLimit || 1)) * 100)}% used`} />
              <StatisticCard label="Attention" value={overCount > 0 ? `${overCount} over` : warnCount > 0 ? `${warnCount} near limit` : "All on track"} hint="Categories needing review" />
            </section>
            {overCount + warnCount > 0 && (
              <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-[12.5px] text-amber-700 dark:text-amber-500">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
                <span>{overCount > 0 && `${overCount} budget${overCount > 1 ? "s" : ""} exceeded. `}{warnCount > 0 && `${warnCount} nearing their limit. `}Review your spending to stay on track.</span>
              </div>
            )}
            {shown.length === 0 ? (
              <EmptyState icon={PieChart} title="No budgets for this period" description="Create a budget to set a spending limit for a category." actionLabel="New budget" onAction={() => setCreating(true)} />
            ) : (
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {shown.map((b) => (<BudgetCard key={b.id} budget={b} onEdit={setEditing} onDelete={setDeleting} />))}
              </section>
            )}
          </>
        )}
      </div>
      <BudgetFormDialog open={creating} onOpenChange={setCreating} onSubmit={handleCreate} title="New budget" submitLabel="Create budget" />
      <BudgetFormDialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)} budget={editing ?? undefined} onSubmit={handleEdit} title="Edit budget" submitLabel="Save changes" />
      <ConfirmationDialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)} title={`Delete ${deleting?.category ?? "budget"}?`} description="This budget will no longer be tracked." confirmLabel="Delete budget" destructive loading={deletingLoad} onConfirm={handleDelete} />
    </AppLayout>
  );
}