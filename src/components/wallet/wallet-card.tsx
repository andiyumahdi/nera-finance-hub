import { MoreHorizontal, Star, Pencil, Trash2, StarOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColoredIcon } from "@/components/shared/wallet-icon";
import { formatIDR, type Wallet } from "@/lib/wallet-mock";
import { cn } from "@/lib/utils";

export function WalletCard({
  wallet,
  variant = "default",
  onEdit,
  onDelete,
  onSetDefault,
  className,
}: {
  wallet: Wallet;
  variant?: "default" | "compact";
  onEdit?: (w: Wallet) => void;
  onDelete?: (w: Wallet) => void;
  onSetDefault?: (w: Wallet) => void;
  className?: string;
}) {
  const typeLabel: Record<Wallet["type"], string> = {
    cash: "Cash",
    bank: "Bank",
    ewallet: "E-Wallet",
    credit: "Credit",
  };

  return (
    <Card className={cn("shadow-none", className)}>
      <CardContent className={cn("p-4", variant === "compact" && "p-3.5")}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3">
            <ColoredIcon
              icon={wallet.icon}
              color={wallet.color}
              size={variant === "compact" ? "sm" : "md"}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-[13px] font-medium">{wallet.name}</span>
                {wallet.isDefault && (
                  <Badge variant="secondary" className="h-4 rounded px-1.5 text-[9.5px] font-medium uppercase tracking-wider">
                    Default
                  </Badge>
                )}
              </div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">
                {typeLabel[wallet.type]}
              </div>
            </div>
          </div>
          {(onEdit || onDelete || onSetDefault) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(wallet)}>
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </DropdownMenuItem>
                )}
                {onSetDefault && (
                  <DropdownMenuItem
                    onClick={() => onSetDefault(wallet)}
                    disabled={wallet.isDefault}
                  >
                    {wallet.isDefault ? (
                      <>
                        <StarOff className="h-3.5 w-3.5" /> Already default
                      </>
                    ) : (
                      <>
                        <Star className="h-3.5 w-3.5" /> Set as default
                      </>
                    )}
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(wallet)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className={cn("mt-4", variant === "compact" && "mt-3")}>
          <div className="text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground">
            Balance
          </div>
          <div className="mt-1 text-lg font-semibold tabular-nums tracking-tight">
            {formatIDR(wallet.balance)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}