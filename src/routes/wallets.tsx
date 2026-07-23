import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Wallet as WalletIcon, ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WalletCard } from "@/components/wallet/wallet-card";
import { WalletFormDialog, type WalletFormValues } from "@/components/wallet/wallet-form-dialog";
import { TransferDialog } from "@/components/wallet/transfer-dialog";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { StatisticCard } from "@/components/shared/statistic-card";
import { EmptyState } from "@/components/state/empty-state";
import { formatIDR, mockWallets, type Wallet } from "@/lib/wallet-mock";

export const Route = createFileRoute("/wallets")({
  head: () => ({
    meta: [
      { title: "Wallets — Nera" },
      { name: "description", content: "Manage your cash, bank, and e-wallet accounts in one place." },
      { property: "og:title", content: "Wallets — Nera" },
      { property: "og:description", content: "Manage your cash, bank, and e-wallet accounts in one place." },
    ],
  }),
  component: WalletsPage,
});

function WalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Wallet | null>(null);
  const [deleting, setDeleting] = useState<Wallet | null>(null);
  const [deletingLoad, setDeletingLoad] = useState(false);
  const [transferring, setTransferring] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => { setWallets(mockWallets); setLoading(false); }, 400);
    return () => clearTimeout(id);
  }, []);

  const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms));

  const handleCreate = async (v: WalletFormValues) => {
    await wait();
    setWallets((prev) => {
      const next = v.isDefault ? prev.map((w) => ({ ...w, isDefault: false })) : prev;
      return [...next, { id: `w-${Date.now()}`, ...v }];
    });
    toast.success(`${v.name} created`);
  };
  const handleEdit = async (v: WalletFormValues) => {
    if (!editing) return;
    await wait();
    setWallets((prev) => prev.map((w) => {
      if (w.id === editing.id) return { ...w, ...v };
      if (v.isDefault) return { ...w, isDefault: false };
      return w;
    }));
    toast.success("Wallet updated");
  };
  const handleDelete = async () => {
    if (!deleting) return;
    setDeletingLoad(true); await wait();
    setWallets((prev) => prev.filter((w) => w.id !== deleting.id));
    setDeletingLoad(false); setDeleting(null); toast.success("Wallet deleted");
  };
  const handleSetDefault = (w: Wallet) => {
    setWallets((prev) => prev.map((x) => ({ ...x, isDefault: x.id === w.id })));
    toast.success(`${w.name} set as default`);
  };
  const handleTransfer = async (p: { fromId: string; toId: string; amount: number }) => {
    await wait();
    setWallets((prev) => prev.map((w) => {
      if (w.id === p.fromId) return { ...w, balance: w.balance - p.amount };
      if (w.id === p.toId) return { ...w, balance: w.balance + p.amount };
      return w;
    }));
  };

  const total = wallets.reduce((a, w) => a + w.balance, 0);
  const def = wallets.find((w) => w.isDefault);

  return (
    <AppLayout title="Wallets" subtitle="Manage cash, bank, and e-wallet accounts">
      <div className="mx-auto max-w-7xl space-y-8">
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">{Array.from({ length: 3 }).map((_, i) => (<Card key={i} className="shadow-none"><CardContent className="space-y-3 p-4"><Skeleton className="h-3 w-20" /><Skeleton className="h-6 w-32" /></CardContent></Card>))}</div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => (<Card key={i} className="shadow-none"><CardContent className="space-y-4 p-4"><Skeleton className="h-9 w-9 rounded-lg" /><Skeleton className="h-3 w-24" /><Skeleton className="h-6 w-32" /></CardContent></Card>))}</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <StatisticCard label="Total balance" value={formatIDR(total)} hint={`Across ${wallets.length} wallet${wallets.length === 1 ? "" : "s"}`} />
              <StatisticCard label="Default wallet" value={def?.name ?? "—"} hint="Used for new transactions" />
              <Card className="shadow-none">
                <CardContent className="flex h-full flex-col items-start justify-between gap-3 p-4">
                  <div>
                    <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Quick actions</div>
                    <div className="mt-1 text-[12.5px] text-muted-foreground">Add or move money between wallets.</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => setCreating(true)} className="h-7 text-[12px]"><Plus className="mr-1 h-3.5 w-3.5" /> New wallet</Button>
                    <Button size="sm" variant="outline" disabled={wallets.length < 2} onClick={() => setTransferring(true)} className="h-7 text-[12px]"><ArrowLeftRight className="mr-1 h-3.5 w-3.5" /> Transfer</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            {wallets.length === 0 ? (
              <EmptyState icon={WalletIcon} title="No wallets yet" description="Add your first wallet to start tracking balances across accounts." actionLabel="New wallet" onAction={() => setCreating(true)} />
            ) : (
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {wallets.map((w) => (<WalletCard key={w.id} wallet={w} onEdit={setEditing} onDelete={setDeleting} onSetDefault={handleSetDefault} />))}
              </section>
            )}
          </>
        )}
      </div>
      <WalletFormDialog open={creating} onOpenChange={setCreating} onSubmit={handleCreate} title="New wallet" submitLabel="Create wallet" />
      <WalletFormDialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)} wallet={editing ?? undefined} onSubmit={handleEdit} title="Edit wallet" submitLabel="Save changes" />
      <ConfirmationDialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)} title={`Delete ${deleting?.name ?? "wallet"}?`} description="This wallet and its balance record will be removed." confirmLabel="Delete wallet" destructive loading={deletingLoad} onConfirm={handleDelete} />
      <TransferDialog open={transferring} onOpenChange={setTransferring} wallets={wallets} onTransfer={handleTransfer} />
    </AppLayout>
  );
}