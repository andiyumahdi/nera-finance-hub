import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { walletColorClasses, walletColorOptions, type Budget, type BudgetPeriod, type WalletColor } from "@/lib/wallet-mock";
import { cn } from "@/lib/utils";

export type BudgetFormValues = { category: string; limit: number; spent: number; period: BudgetPeriod; color: WalletColor };

export function BudgetFormDialog({ open, onOpenChange, budget, onSubmit, title, submitLabel }: { open: boolean; onOpenChange: (v: boolean) => void; budget?: Budget; onSubmit: (v: BudgetFormValues) => Promise<void> | void; title: string; submitLabel: string }) {
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [spent, setSpent] = useState("0");
  const [period, setPeriod] = useState<BudgetPeriod>("monthly");
  const [color, setColor] = useState<WalletColor>("indigo");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setCategory(budget?.category ?? "");
      setLimit(budget ? String(budget.limit) : "");
      setSpent(budget ? String(budget.spent) : "0");
      setPeriod(budget?.period ?? "monthly");
      setColor(budget?.color ?? "indigo");
      setErrors({}); setSubmitting(false);
    }
  }, [open, budget]);

  const handleSubmit = async () => {
    const e: Record<string, string> = {};
    if (!category.trim()) e.category = "Category is required";
    const l = Number(limit); const s = Number(spent);
    if (!limit || Number.isNaN(l) || l <= 0) e.limit = "Limit must be greater than 0";
    if (spent === "" || Number.isNaN(s) || s < 0) e.spent = "Spent cannot be negative";
    setErrors(e);
    if (Object.keys(e).length) return;
    setSubmitting(true);
    try { await onSubmit({ category: category.trim(), limit: l, spent: s, period, color }); onOpenChange(false); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Something went wrong"); }
    finally { setSubmitting(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !submitting && onOpenChange(v)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="bf-cat">Category</Label>
            <Input id="bf-cat" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Groceries" disabled={submitting} />
            {errors.category && <p className="text-[11px] text-destructive">{errors.category}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="bf-lim">Limit</Label>
              <Input id="bf-lim" type="number" min="0" step="1000" value={limit} onChange={(e) => setLimit(e.target.value)} disabled={submitting} />
              {errors.limit && <p className="text-[11px] text-destructive">{errors.limit}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bf-sp">Spent so far</Label>
              <Input id="bf-sp" type="number" min="0" step="1000" value={spent} onChange={(e) => setSpent(e.target.value)} disabled={submitting} />
              {errors.spent && <p className="text-[11px] text-destructive">{errors.spent}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Period</Label>
            <Select value={period} onValueChange={(v) => setPeriod(v as BudgetPeriod)} disabled={submitting}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="weekly">Weekly</SelectItem><SelectItem value="monthly">Monthly</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {walletColorOptions.map((c) => (
                <button key={c} type="button" onClick={() => setColor(c)} aria-pressed={color === c} aria-label={c} className={cn("h-6 w-6 rounded-full ring-2 ring-offset-2 ring-offset-background transition", walletColorClasses[c].dot, color === c ? "ring-foreground/40" : "ring-transparent")} />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={submitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}>{submitting && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}{submitLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}