import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColoredIcon } from "@/components/shared/wallet-icon";
import { categoryIconOptions, walletColorClasses, walletColorOptions, type Category, type CategoryIconKey, type CategoryKind, type WalletColor } from "@/lib/wallet-mock";
import { cn } from "@/lib/utils";

export type CategoryFormValues = { name: string; icon: CategoryIconKey; color: WalletColor; kind: CategoryKind };

export function CategoryFormDialog({ open, onOpenChange, category, defaultKind = "expense", onSubmit, title, submitLabel }: { open: boolean; onOpenChange: (v: boolean) => void; category?: Category; defaultKind?: CategoryKind; onSubmit: (v: CategoryFormValues) => Promise<void> | void; title: string; submitLabel: string }) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState<CategoryIconKey>("shopping-bag");
  const [color, setColor] = useState<WalletColor>("indigo");
  const [kind, setKind] = useState<CategoryKind>(defaultKind);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName(category?.name ?? "");
      setIcon(category?.icon ?? "shopping-bag");
      setColor(category?.color ?? "indigo");
      setKind(category?.kind ?? defaultKind);
      setErrors({}); setSubmitting(false);
    }
  }, [open, category, defaultKind]);

  const handleSubmit = async () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    setErrors(e);
    if (Object.keys(e).length) return;
    setSubmitting(true);
    try { await onSubmit({ name: name.trim(), icon, color, kind }); onOpenChange(false); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Something went wrong"); }
    finally { setSubmitting(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !submitting && onOpenChange(v)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
            <ColoredIcon icon={icon} color={color} size="lg" />
            <div className="min-w-0">
              <div className="truncate text-[13px] font-medium">{name || "Category name"}</div>
              <div className="text-[11px] capitalize text-muted-foreground">{kind}</div>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cf-name">Name</Label>
            <Input id="cf-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Groceries" disabled={submitting} />
            {errors.name && <p className="text-[11px] text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={kind} onValueChange={(v) => setKind(v as CategoryKind)} disabled={submitting}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="expense">Expense</SelectItem><SelectItem value="income">Income</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {categoryIconOptions.map((k) => (
                <button key={k} type="button" onClick={() => setIcon(k)} aria-pressed={icon === k} disabled={submitting} className={cn("rounded-md border p-1.5 transition", icon === k ? "border-primary ring-1 ring-primary/40" : "border-border hover:bg-muted")}>
                  <ColoredIcon icon={k} color={color} size="sm" />
                </button>
              ))}
            </div>
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