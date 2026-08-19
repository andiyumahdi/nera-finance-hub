import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Download, X, Receipt } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import {
  TransactionFormDialog,
  type TransactionFormValues,
} from "@/components/transactions/transaction-form-dialog";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { TransactionsTableSkeleton } from "@/components/state/skeletons";
import { ErrorState } from "@/components/state/error-state";
import { EmptyState } from "@/components/state/empty-state";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { formatCurrency } from "@/lib/format";
import {
  accounts,
  categories as allCategories,
  transactions as mockTransactions,
  type Transaction,
} from "@/lib/mock-data";

export const Route = createFileRoute("/transactions")({
  head: () => ({
    meta: [
      { title: "Transactions — Nera" },
      { name: "description", content: "Search, filter, edit, and review every transaction across your wallets." },
      { property: "og:title", content: "Transactions — Nera" },
      { property: "og:description", content: "Search, filter, edit, and review every transaction across your wallets." },
    ],
  }),
  component: TransactionsPage,
});

const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms));

function TransactionsPage() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error] = useState<Error | null>(null);

  const [q, setQ] = useState("");
  const debouncedQ = useDebouncedValue(q, 200);
  const [type, setType] = useState<"all" | "income" | "expense">("all");
  const [category, setCategory] = useState("all");
  const [wallet, setWallet] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setItems(mockTransactions);
      setLoading(false);
    }, 400);
    return () => clearTimeout(id);
  }, []);

  const filtered = useMemo(() => {
    const needle = debouncedQ.trim().toLowerCase();
    return items.filter((t) => {
      if (type !== "all" && t.type !== type) return false;
      if (category !== "all" && t.category !== category) return false;
      if (wallet !== "all" && t.account !== wallet) return false;
      if (from && t.date < from) return false;
      if (to && t.date > to) return false;
      if (
        needle &&
        !t.description.toLowerCase().includes(needle) &&
        !t.category.toLowerCase().includes(needle)
      )
        return false;
      return true;
    });
  }, [items, debouncedQ, type, category, wallet, from, to]);

  const hasFilters =
    q !== "" || type !== "all" || category !== "all" || wallet !== "all" || from !== "" || to !== "";

  const clearFilters = () => {
    setQ("");
    setType("all");
    setCategory("all");
    setWallet("all");
    setFrom("");
    setTo("");
  };

  const handleEdit = async (v: TransactionFormValues) => {
    if (!editing) return;
    const previous = editing;
    await wait();
    setItems((prev) => prev.map((t) => (t.id === previous.id ? { ...t, ...v } : t)));
    setEditing(null);
    toast.success("Transaction updated", {
      description: v.description,
      action: {
        label: "Undo",
        onClick: () => {
          setItems((prev) => prev.map((t) => (t.id === previous.id ? previous : t)));
          toast.info("Change reverted");
        },
      },
    });
  };

  const handleDuplicate = (t: Transaction) => {
    const copy: Transaction = { ...t, id: `t-${Date.now()}`, description: `${t.description} (copy)` };
    setItems((prev) => [copy, ...prev]);
    toast.success("Transaction duplicated", {
      action: {
        label: "Undo",
        onClick: () => {
          setItems((prev) => prev.filter((x) => x.id !== copy.id));
          toast.info("Duplicate removed");
        },
      },
    });
  };

  const handleDelete = async () => {
    if (!deleting) return;
    const removed = deleting;
    const index = items.findIndex((t) => t.id === removed.id);
    setDeleteLoading(true);
    await wait();
    setItems((prev) => prev.filter((t) => t.id !== removed.id));
    setDeleteLoading(false);
    setDeleting(null);
    toast.success("Transaction deleted", {
      description: `${removed.description} · ${formatCurrency(removed.amount)}`,
      action: {
        label: "Undo",
        onClick: () => {
          setItems((prev) => {
            const next = [...prev];
            next.splice(Math.max(0, index), 0, removed);
            return next;
          });
          toast.info("Transaction restored");
        },
      },
    });
  };

  return (
    <AppLayout
      title="Transactions"
      subtitle={isLoading ? "Loading…" : `${filtered.length} of ${items.length} transactions`}
    >
      <div className="mx-auto max-w-7xl space-y-4">
        <Card className="shadow-none">
          <CardContent className="space-y-3 p-4">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,1fr)_auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search description or category…"
                  className="h-9 pl-9"
                  aria-label="Search transactions"
                />
              </div>
              <Button variant="outline" size="sm" className="h-9 justify-center">
                <Download className="mr-1 h-4 w-4" /> Export
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 lg:grid-cols-5">
              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {allCategories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">Wallet</Label>
                <Select value={wallet} onValueChange={setWallet}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Wallet" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All wallets</SelectItem>
                    {accounts.map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="tx-from" className="text-[11px] text-muted-foreground">From</Label>
                <Input id="tx-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-9" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="tx-to" className="text-[11px] text-muted-foreground">To</Label>
                <Input id="tx-to" type="date" value={to} onChange={(e) => setTo(e.target.value)} className="h-9" />
              </div>
            </div>

            {hasFilters && (
              <div className="flex items-center justify-between border-t border-border/60 pt-3">
                <span className="text-[12px] text-muted-foreground">
                  Filters applied · {filtered.length} result{filtered.length === 1 ? "" : "s"}
                </span>
                <Button variant="ghost" size="sm" className="h-7 text-[12px]" onClick={clearFilters}>
                  <X className="mr-1 h-3.5 w-3.5" /> Clear filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {isLoading ? (
          <TransactionsTableSkeleton />
        ) : error ? (
          <ErrorState title="Unable to load transactions" onRetry={() => setItems(mockTransactions)} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title={hasFilters ? "No transactions found" : "No transactions yet"}
            description={
              hasFilters
                ? "Try adjusting your filters or search terms."
                : "Once your wallets sync, activity will show up here."
            }
            actionLabel={hasFilters ? "Clear filters" : undefined}
            onAction={hasFilters ? clearFilters : undefined}
          />
        ) : (
          <TransactionsTable
            items={filtered}
            onEdit={setEditing}
            onDelete={setDeleting}
            onDuplicate={handleDuplicate}
          />
        )}
      </div>

      <TransactionFormDialog
        open={!!editing}
        onOpenChange={(v) => !v && setEditing(null)}
        transaction={editing}
        onSubmit={handleEdit}
      />
      <ConfirmationDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title="Delete this transaction?"
        description={
          deleting
            ? `${deleting.description} · ${formatCurrency(deleting.amount)} will be removed. You can undo right after.`
            : undefined
        }
        confirmLabel="Delete transaction"
        destructive
        loading={deleteLoading}
        onConfirm={handleDelete}
      />
    </AppLayout>
  );
}
