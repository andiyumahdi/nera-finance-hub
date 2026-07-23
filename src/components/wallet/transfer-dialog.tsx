import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColoredIcon } from "@/components/shared/wallet-icon";
import { formatIDR, type Wallet } from "@/lib/wallet-mock";

type Step = "form" | "review" | "success";

export function TransferDialog({ open, onOpenChange, wallets, onTransfer }: { open: boolean; onOpenChange: (v: boolean) => void; wallets: Wallet[]; onTransfer?: (p: { fromId: string; toId: string; amount: number; note?: string }) => void | Promise<void> }) {
  const [step, setStep] = useState<Step>("form");
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      const def = wallets.find((w) => w.isDefault) ?? wallets[0];
      setFromId(def?.id ?? "");
      setToId(""); setAmount(""); setNote(""); setErrors({}); setStep("form"); setSubmitting(false);
    }
  }, [open, wallets]);

  const from = useMemo(() => wallets.find((w) => w.id === fromId), [wallets, fromId]);
  const to = useMemo(() => wallets.find((w) => w.id === toId), [wallets, toId]);
  const amt = Number(amount);

  const handleReview = () => {
    const e: Record<string, string> = {};
    if (!fromId) e.fromId = "Choose a source wallet";
    if (!toId) e.toId = "Choose a destination wallet";
    if (fromId && toId && fromId === toId) e.toId = "Destination must differ from source";
    if (!amount || Number.isNaN(amt) || amt <= 0) e.amount = "Amount must be greater than 0";
    if (from && amt > from.balance) e.amount = "Amount exceeds source balance";
    setErrors(e);
    if (!Object.keys(e).length) setStep("review");
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onTransfer?.({ fromId, toId, amount: amt, note: note.trim() || undefined });
      setStep("success");
      toast.success("Transfer completed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Transfer failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !submitting && onOpenChange(v)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{step === "form" ? "Transfer between wallets" : step === "review" ? "Review transfer" : "Transfer successful"}</DialogTitle>
        </DialogHeader>
        {step === "form" && (
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>From</Label>
              <Select value={fromId} onValueChange={setFromId}>
                <SelectTrigger><SelectValue placeholder="Select source wallet" /></SelectTrigger>
                <SelectContent>{wallets.map((w) => (<SelectItem key={w.id} value={w.id}>{w.name} · {formatIDR(w.balance)}</SelectItem>))}</SelectContent>
              </Select>
              {errors.fromId && <p className="text-[11px] text-destructive">{errors.fromId}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>To</Label>
              <Select value={toId} onValueChange={setToId}>
                <SelectTrigger><SelectValue placeholder="Select destination wallet" /></SelectTrigger>
                <SelectContent>{wallets.filter((w) => w.id !== fromId).map((w) => (<SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>))}</SelectContent>
              </Select>
              {errors.toId && <p className="text-[11px] text-destructive">{errors.toId}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tf-amt">Amount</Label>
              <Input id="tf-amt" type="number" min="0" step="1000" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
              {errors.amount && <p className="text-[11px] text-destructive">{errors.amount}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tf-note">Note (optional)</Label>
              <Textarea id="tf-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Move savings" rows={2} />
            </div>
          </div>
        )}
        {step === "review" && from && to && (
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <ColoredIcon icon={from.icon} color={from.color} size="sm" />
                <div>
                  <div className="text-[13px] font-medium">{from.name}</div>
                  <div className="text-[11px] text-muted-foreground">{formatIDR(from.balance)} → {formatIDR(from.balance - amt)}</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[13px] font-medium">{to.name}</div>
                  <div className="text-[11px] text-muted-foreground">{formatIDR(to.balance)} → {formatIDR(to.balance + amt)}</div>
                </div>
                <ColoredIcon icon={to.icon} color={to.color} size="sm" />
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Amount</span>
                <span className="text-lg font-semibold tabular-nums">{formatIDR(amt)}</span>
              </div>
              {note && <div className="mt-2 border-t pt-2 text-[12.5px] text-muted-foreground">{note}</div>}
            </div>
          </div>
        )}
        {step === "success" && from && to && (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-income/10 text-income"><CheckCircle2 className="h-6 w-6" strokeWidth={1.75} /></div>
            <p className="mt-4 text-[14px] font-medium">{formatIDR(amt)} transferred</p>
            <p className="mt-1 text-[12.5px] text-muted-foreground">{from.name} → {to.name}</p>
          </div>
        )}
        <DialogFooter>
          {step === "form" && (<><Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button><Button onClick={handleReview}>Continue</Button></>)}
          {step === "review" && (<><Button variant="ghost" onClick={() => setStep("form")} disabled={submitting}>Back</Button><Button onClick={handleConfirm} disabled={submitting}>{submitting && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}Confirm transfer</Button></>)}
          {step === "success" && (<Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto">Done</Button>)}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}