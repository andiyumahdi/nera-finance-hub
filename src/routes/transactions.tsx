import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Download, Filter } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { categories, transactions } from "@/lib/mock-data";

export const Route = createFileRoute("/transactions")({
  head: () => ({
    meta: [
      { title: "Transactions — Nera" },
      { name: "description", content: "Search, filter, and review every transaction across your accounts." },
      { property: "og:title", content: "Transactions — Nera" },
      { property: "og:description", content: "Search, filter, and review every transaction across your accounts." },
    ],
  }),
  component: TransactionsPage,
});

function TransactionsPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<"all" | "income" | "expense">("all");
  const [category, setCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (type !== "all" && t.type !== type) return false;
      if (category !== "all" && t.category !== category) return false;
      if (q && !t.description.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, type, category]);

  return (
    <AppLayout title="Transactions" subtitle={`${filtered.length} results`}>
      <div className="mx-auto max-w-7xl space-y-4">
        <Card className="shadow-none">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search description…"
                  className="h-9 pl-9"
                />
              </div>
              <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
                <SelectTrigger className="h-9 md:w-[140px]"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-9 md:w-[170px]"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="mr-1 h-4 w-4" /> More
                </Button>
                <Button variant="outline" size="sm" className="h-9">
                  <Download className="mr-1 h-4 w-4" /> Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <TransactionsTable items={filtered} />
      </div>
    </AppLayout>
  );
}
