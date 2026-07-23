import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColoredIcon } from "@/components/shared/wallet-icon";
import { walletColorOptions, walletIconOptions, walletColorClasses, type Wallet, type WalletColor, type WalletIconKey, type WalletType } from "@/lib/wallet-mock";
import { cn } from "@/lib/utils";

export type WalletFormValues = { name: string; type: WalletType; icon: WalletIconKey; color: WalletColor; balance: number; isDefault: boolean };

export function WalletFormDialog({ open, onOpenChange, wallet, onSubmit, title, submitLabel }: { open: boolean; onOpenChange: (v: boolean) => void; wallet?: Wallet; onSubmit: (v: WalletFormValues) => Promise<void> | void; title: string; submitLabel: string }) {
  const [name, setName] = useState("");
  const [type, setType] = useState<WalletType>("bank");
  const [icon, setIcon] = useState<WalletIconKey>("landmark");
  const [color, setColor] = useState<WalletColor>("indigo");
  const [balance, setBalance] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName(wallet?.name ?? "");
      setType(wallet?.type ?? "bank");
      setIcon(wallet?.icon ?? "landmark");
      setColor(wallet?.color ?? "indigo");
      setBalance(wallet ? String(wallet.balance) : "0");
      setIsDefault(wallet?.isDefault ?? false);
      setErrors({});
      setSubmitting(false);
    }
  }, [open, wallet]);

  const handleSubmit = async () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    const b = Number(balance);
    if (balance === "" || Number.isNaN(b) || b < 0) e.balance = "Balance cannot be negative";
    setErrors(e);
    if (Object.keys(e).length) return;
    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), type, icon, color, balance: b, isDefault });
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !submitting && onOpenChange(v)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
            <ColoredIcon icon={icon} color={color} size="lg" />
            <div className="min-w-0">
              <div className="truncate text-[13px] font-medium">{name || "Wallet name"}</div>
              <div className="text-[11px] text-muted-foreground">Preview</div>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="wf-name">Name</Label>
            <Input id="wf-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Bank Jago" disabled={submitting} />
            {errors.name && <p className="text-[11px] text-destructive">{errors.name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as WalletType)} disabled={submitting}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank">Bank</SelectItem>
                  <SelectItem value="ewallet">E-Wallet</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="wf-bal">Initial balance</Label>
              <Input id="wf-bal" type="number" min="0" step="1000" value={balance} onChange={(e) => setBalance(e.target.value)} disabled={submitting} />
              {errors.balance && <p className="text-[11px] text-destructive">{errors.balance}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {walletIconOptions.map((k) => (
                <button key={k} type="button" onClick={() => setIcon(k)} disabled={submitting} aria-pressed={icon === k} className={cn("rounded-md border p-1.5 transition", icon === k ? "border-primary ring-1 ring-primary/40" : "border-border hover:bg-muted")}>
                  <ColoredIcon icon={k} color={color} size="sm" />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {walletColorOptions.map((c) => (
                <button key={c} type="button" onClick={() => setColor(c)} disabled={submitting} aria-pressed={color === c} aria-label={c} className={cn("h-6 w-6 rounded-full ring-2 ring-offset-2 ring-offset-background transition", walletColorClasses[c].dot, color === c ? "ring-foreground/40" : "ring-transparent")} />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <div className="text-[13px] font-medium">Set as default wallet</div>
              <div className="text-[11px] text-muted-foreground">Used by default for new transactions.</div>
            </div>
            <Switch checked={isDefault} onCheckedChange={setIsDefault} disabled={submitting} />
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