import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Transaction, TxType } from "@/lib/mock-data";
import { accounts, categories } from "@/lib/mock-data";

export type TransactionFormValues = {
  date: string;
  description: string;
  category: string;
  account: string;
  amount: number;
  type: TxType;
};

export function TransactionFormDialog({
  open,
  onOpenChange,
  transaction,
  onSubmit,
  title = "Edit transaction",
  submitLabel = "Save changes",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  transaction?: Transaction | null;
  onSubmit: (values: TransactionFormValues) => void | Promise<void>;
  title?: string;
  submitLabel?: string;
}) {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TxType>("expense");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDate(transaction?.date ?? new Date().toISOString().slice(0, 10));
    setDescription(transaction?.description ?? "");
    setCategory(transaction?.category ?? "");
    setAccount(transaction?.account ?? "");
    setAmount(transaction ? String(transaction.amount) : "");
    setType(transaction?.type ?? "expense");
    setErrors({});
    setSubmitting(false);
  }, [open, transaction]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!description.trim()) e.description = "Description is required";
    else if (description.trim().length < 2) e.description = "Use at least 2 characters";
    const amt = Number(amount);
    if (amount === "" || Number.isNaN(amt) || amt <= 0) e.amount = "Amount must be greater than 0";
    if (!category) e.category = "Choose a category";
    if (!account) e.account = "Choose a wallet";
    if (!date) e.date = "Date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        date,
        description: description.trim(),
        category,
        account,
        amount: Number(amount),
        type,
      });
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !submitting && onOpenChange(v)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-[12.5px]">
            Changes are stored locally in this demo workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="tx-desc">Description</Label>
            <Input
              id="tx-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Whole Foods Market"
            />
            {errors.description && <p className="text-[11px] text-destructive">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as TxType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tx-amt">Amount</Label>
              <Input
                id="tx-amt"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
              {errors.amount && <p className="text-[11px] text-destructive">{errors.amount}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-[11px] text-destructive">{errors.category}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Wallet</Label>
              <Select value={account} onValueChange={setAccount}>
                <SelectTrigger><SelectValue placeholder="Select wallet" /></SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.account && <p className="text-[11px] text-destructive">{errors.account}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tx-date">Date</Label>
            <Input id="tx-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            {errors.date && <p className="text-[11px] text-destructive">{errors.date}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
