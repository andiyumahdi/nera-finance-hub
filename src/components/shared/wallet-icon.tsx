import {
  Wallet as WalletIcon,
  Banknote,
  Landmark,
  CreditCard,
  PiggyBank,
  Smartphone,
  Coins,
  ShoppingBag,
  Utensils,
  Car,
  Home,
  HeartPulse,
  Plane,
  Gamepad2,
  Briefcase,
  Gift,
  GraduationCap,
  Sparkles,
  Receipt,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  walletColorClasses,
  type WalletColor,
  type WalletIconKey,
  type CategoryIconKey,
} from "@/lib/wallet-mock";

const map: Record<WalletIconKey | CategoryIconKey, LucideIcon> = {
  wallet: WalletIcon,
  banknote: Banknote,
  landmark: Landmark,
  "credit-card": CreditCard,
  "piggy-bank": PiggyBank,
  smartphone: Smartphone,
  coins: Coins,
  "shopping-bag": ShoppingBag,
  utensils: Utensils,
  car: Car,
  home: Home,
  "heart-pulse": HeartPulse,
  plane: Plane,
  "gamepad-2": Gamepad2,
  briefcase: Briefcase,
  gift: Gift,
  "graduation-cap": GraduationCap,
  sparkles: Sparkles,
  receipt: Receipt,
};

export function ColoredIcon({
  icon,
  color,
  size = "md",
  className,
}: {
  icon: WalletIconKey | CategoryIconKey;
  color: WalletColor;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const Icon = map[icon] ?? WalletIcon;
  const c = walletColorClasses[color];
  const dim =
    size === "sm"
      ? "h-7 w-7"
      : size === "lg"
        ? "h-11 w-11"
        : "h-9 w-9";
  const iconDim = size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center rounded-lg ring-1",
        dim,
        c.bg,
        c.text,
        c.ring,
        className,
      )}
    >
      <Icon className={iconDim} strokeWidth={1.75} />
    </div>
  );
}

export { map as iconMap };