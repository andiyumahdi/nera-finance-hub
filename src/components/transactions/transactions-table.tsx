import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Transaction } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function TransactionsTable({ items }: { items: Transaction[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border p-10 text-center text-sm text-muted-foreground">
        No transactions match your filters.
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-lg border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[110px]">Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="text-muted-foreground">
                  {format(new Date(t.date), "MMM d")}
                </TableCell>
                <TableCell className="font-medium">{t.description}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-normal">
                    {t.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{t.account}</TableCell>
                <TableCell
                  className={cn(
                    "text-right font-mono text-sm tabular-nums",
                    t.type === "income" ? "text-income" : "text-expense",
                  )}
                >
                  {t.type === "income" ? "+" : "−"}
                  {formatCurrency(t.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-2 md:hidden">
        {items.map((t) => (
          <div key={t.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 rounded-lg border bg-card p-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{t.description}</div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{format(new Date(t.date), "MMM d")}</span>
                <span>·</span>
                <span className="truncate">{t.category}</span>
              </div>
            </div>
            <div
              className={cn(
                "shrink-0 self-center font-mono text-sm tabular-nums",
                t.type === "income" ? "text-income" : "text-expense",
              )}
            >
              {t.type === "income" ? "+" : "−"}
              {formatCurrency(t.amount)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
