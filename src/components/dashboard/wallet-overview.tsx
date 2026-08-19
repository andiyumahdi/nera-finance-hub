import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Wallet as WalletIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/state/empty-state";
import { ColoredIcon } from "@/components/shared/wallet-icon";
import { formatIDR, type Wallet } from "@/lib/wallet-mock";
import { cn } from "@/lib/utils";

const typeLabel: Record<Wallet["type"], string> = {
  cash: "Cash",
  bank: "Bank account",
  ewallet: "E-wallet",
  credit: "Credit",
};

export function WalletOverview({
  wallets,
  isLoading = false,
}: {
  wallets: Wallet[];
  isLoading?: boolean;
}) {
  const total = wallets.reduce((a, w) => a + w.balance, 0);

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-[13px] font-medium">Wallets</CardTitle>
          <p className="text-[11px] text-muted-foreground">
            {isLoading ? "Loading…" : `${formatIDR(total)} across ${wallets.length} account${wallets.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <Button asChild variant="ghost" size="sm" className="h-6 px-1 text-[11px] text-muted-foreground">
          <Link to="/wallets">
            Manage <ArrowUpRight className="ml-0.5 h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-1">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-border/70 p-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3.5 w-28" />
                </div>
              </div>
            ))}
          </div>
        ) : wallets.length === 0 ? (
          <EmptyState
            icon={WalletIcon}
            title="No wallets yet"
            description="Add a wallet to track balances across your accounts."
          />
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {wallets.map((w) => (
              <Link
                key={w.id}
                to="/wallets"
                className={cn(
                  "flex items-center gap-3 rounded-lg border border-border/70 p-3 transition-colors hover:bg-muted/40",
                )}
              >
                <ColoredIcon icon={w.icon} color={w.color} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-[12.5px] font-medium">{w.name}</span>
                    {w.isDefault && (
                      <span className="shrink-0 rounded border border-border/70 px-1 text-[10px] text-muted-foreground">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
                    {typeLabel[w.type]}
                  </div>
                </div>
                <div className="shrink-0 text-[12.5px] font-medium tabular-nums">
                  {formatIDR(w.balance)}
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
