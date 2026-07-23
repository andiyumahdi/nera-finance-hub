import { MoreHorizontal, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatIDR, type Budget, walletColorClasses } from "@/lib/wallet-mock";
import { cn } from "@/lib/utils";

export function BudgetCard({ budget, onEdit, onDelete }: { budget: Budget; onEdit?: (b: Budget) => void; onDelete?: (b: Budget) => void }) {
  const pct = Math.min(100, Math.round((budget.spent / budget.limit) * 100));
  const remaining = Math.max(0, budget.limit - budget.spent);
  const over = budget.spent > budget.limit;
  const warning = pct >= 80 && !over;
  const status = over ? "Over" : warning ? "Warning" : "On track";
  const c = walletColorClasses[budget.color];

  return (
    <Card className="shadow-none">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={cn("h-2 w-2 rounded-full", c.dot)} />
              <span className="truncate text-[13px] font-medium">{budget.category}</span>
              <Badge variant="secondary" className={cn("h-4 rounded px-1.5 text-[9.5px] font-medium uppercase tracking-wider", over && "bg-destructive/10 text-destructive", warning && "bg-amber-500/10 text-amber-600 dark:text-amber-500", !over && !warning && "bg-income/10 text-income")}>{status}</Badge>
            </div>
            <div className="mt-0.5 text-[11px] capitalize text-muted-foreground">{budget.period}</div>
          </div>
          {(onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground"><MoreHorizontal className="h-3.5 w-3.5" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {onEdit && (<DropdownMenuItem onClick={() => onEdit(budget)}><Pencil className="h-3.5 w-3.5" /> Edit</DropdownMenuItem>)}
                {onDelete && (<><DropdownMenuSeparator /><DropdownMenuItem onClick={() => onDelete(budget)} className="text-destructive focus:text-destructive"><Trash2 className="h-3.5 w-3.5" /> Delete</DropdownMenuItem></>)}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] text-muted-foreground">Used</span>
            <span className="text-[11px] tabular-nums text-muted-foreground">{pct}%</span>
          </div>
          <Progress value={pct} className={cn("mt-1.5 h-1.5", over && "[&>div]:bg-destructive", warning && "[&>div]:bg-amber-500")} />
          <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
            <div>
              <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Spent</div>
              <div className="mt-0.5 font-medium tabular-nums">{formatIDR(budget.spent)}</div>
            </div>
            <div className="text-right">
              <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">{over ? "Over by" : "Remaining"}</div>
              <div className={cn("mt-0.5 font-medium tabular-nums", over && "text-destructive")}>{over ? formatIDR(budget.spent - budget.limit) : formatIDR(remaining)}</div>
            </div>
          </div>
          {(warning || over) && (
            <div className={cn("mt-3 flex items-start gap-2 rounded-md p-2 text-[11.5px]", over ? "bg-destructive/10 text-destructive" : "bg-amber-500/10 text-amber-700 dark:text-amber-500")}>
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
              <span>{over ? `You've exceeded this budget by ${formatIDR(budget.spent - budget.limit)}.` : "You're nearing your limit for this category."}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}