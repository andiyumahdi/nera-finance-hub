import { MoreHorizontal, Pencil, Trash2, Copy } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type Actions = {
  onEdit?: (t: Transaction) => void;
  onDelete?: (t: Transaction) => void;
  onDuplicate?: (t: Transaction) => void;
};

function RowActions({ t, onEdit, onDelete, onDuplicate }: { t: Transaction } & Actions) {
  if (!onEdit && !onDelete && !onDuplicate) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground"
          aria-label={`Actions for ${t.description}`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(t)}>
            <Pencil className="h-4 w-4" /> Edit
          </DropdownMenuItem>
        )}
        {onDuplicate && (
          <DropdownMenuItem onClick={() => onDuplicate(t)}>
            <Copy className="h-4 w-4" /> Duplicate
          </DropdownMenuItem>
        )}
        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(t)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function TransactionsTable({
  items,
  onEdit,
  onDelete,
  onDuplicate,
}: { items: Transaction[] } & Actions) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border p-10 text-center text-sm text-muted-foreground">
        No transactions match your filters.
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[120px] px-5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Date</TableHead>
              <TableHead className="px-5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Description</TableHead>
              <TableHead className="px-5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Category</TableHead>
              <TableHead className="px-5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Wallet</TableHead>
              <TableHead className="px-5 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Amount</TableHead>
              <TableHead className="w-[52px] px-2" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((t) => (
              <TableRow key={t.id} className="border-border/60">
                <TableCell className="px-5 py-4 text-[13px] text-muted-foreground tabular-nums">
                  {format(new Date(t.date), "MMM d")}
                </TableCell>
                <TableCell className="px-5 py-4 text-[13px]">{t.description}</TableCell>
                <TableCell className="px-5 py-4">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-transparent px-2 py-0.5 text-[11px] font-normal text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
                    {t.category}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4 text-[13px] text-muted-foreground">{t.account}</TableCell>
                <TableCell
                  className={cn(
                    "px-5 py-4 text-right text-[13px] tabular-nums",
                    t.type === "income" ? "text-income" : "text-expense",
                  )}
                >
                  {t.type === "income" ? "+" : "−"}
                  {formatCurrency(t.amount)}
                </TableCell>
                <TableCell className="px-2 py-4 text-right">
                  <RowActions t={t} onEdit={onEdit} onDelete={onDelete} onDuplicate={onDuplicate} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-2 md:hidden">
        {items.map((t) => (
          <div key={t.id} className="flex items-center gap-2 rounded-xl border border-border/70 bg-card p-4">
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px]">{t.description}</div>
              <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                <span>{format(new Date(t.date), "MMM d")}</span>
                <span>·</span>
                <span className="truncate">{t.category}</span>
                <span>·</span>
                <span className="truncate">{t.account}</span>
              </div>
            </div>
            <div
              className={cn(
                "shrink-0 text-[13px] tabular-nums",
                t.type === "income" ? "text-income" : "text-expense",
              )}
            >
              {t.type === "income" ? "+" : "−"}
              {formatCurrency(t.amount)}
            </div>
            <RowActions t={t} onEdit={onEdit} onDelete={onDelete} onDuplicate={onDuplicate} />
          </div>
        ))}
      </div>
    </>
  );
}
