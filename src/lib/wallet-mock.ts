export type WalletColor =
  | "indigo"
  | "emerald"
  | "rose"
  | "amber"
  | "sky"
  | "violet"
  | "slate";

export const walletColorClasses: Record<
  WalletColor,
  { bg: string; text: string; ring: string; dot: string }
> = {
  indigo: { bg: "bg-indigo-500/10", text: "text-indigo-500", ring: "ring-indigo-500/20", dot: "bg-indigo-500" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-500", ring: "ring-emerald-500/20", dot: "bg-emerald-500" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-500", ring: "ring-rose-500/20", dot: "bg-rose-500" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-500", ring: "ring-amber-500/20", dot: "bg-amber-500" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-500", ring: "ring-sky-500/20", dot: "bg-sky-500" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-500", ring: "ring-violet-500/20", dot: "bg-violet-500" },
  slate: { bg: "bg-slate-500/10", text: "text-slate-500", ring: "ring-slate-500/20", dot: "bg-slate-500" },
};

export const walletColorOptions: WalletColor[] = [
  "indigo",
  "emerald",
  "rose",
  "amber",
  "sky",
  "violet",
  "slate",
];

export type WalletIconKey =
  | "wallet"
  | "banknote"
  | "landmark"
  | "credit-card"
  | "piggy-bank"
  | "smartphone"
  | "coins";

export const walletIconOptions: WalletIconKey[] = [
  "wallet",
  "banknote",
  "landmark",
  "credit-card",
  "piggy-bank",
  "smartphone",
  "coins",
];

export type WalletType = "cash" | "bank" | "ewallet" | "credit";

export type Wallet = {
  id: string;
  name: string;
  type: WalletType;
  icon: WalletIconKey;
  color: WalletColor;
  balance: number;
  isDefault: boolean;
};

export const mockWallets: Wallet[] = [
  { id: "w1", name: "Cash", type: "cash", icon: "banknote", color: "emerald", balance: 850000, isDefault: false },
  { id: "w2", name: "Bank Jago", type: "bank", icon: "landmark", color: "indigo", balance: 12480000, isDefault: true },
  { id: "w3", name: "BCA", type: "bank", icon: "landmark", color: "sky", balance: 34210000, isDefault: false },
  { id: "w4", name: "OVO", type: "ewallet", icon: "smartphone", color: "violet", balance: 425000, isDefault: false },
  { id: "w5", name: "GoPay", type: "ewallet", icon: "smartphone", color: "rose", balance: 132500, isDefault: false },
];

export type BudgetPeriod = "weekly" | "monthly";

export type Budget = {
  id: string;
  category: string;
  color: WalletColor;
  limit: number;
  spent: number;
  period: BudgetPeriod;
};

export const mockBudgets: Budget[] = [
  { id: "b1", category: "Groceries", color: "emerald", limit: 2000000, spent: 1420000, period: "monthly" },
  { id: "b2", category: "Dining", color: "amber", limit: 1200000, spent: 1080000, period: "monthly" },
  { id: "b3", category: "Transport", color: "sky", limit: 800000, spent: 320000, period: "monthly" },
  { id: "b4", category: "Shopping", color: "rose", limit: 1500000, spent: 1650000, period: "monthly" },
  { id: "b5", category: "Subscriptions", color: "violet", limit: 400000, spent: 240000, period: "monthly" },
  { id: "b6", category: "Health", color: "indigo", limit: 600000, spent: 90000, period: "monthly" },
];

export type CategoryIconKey =
  | "shopping-bag"
  | "utensils"
  | "car"
  | "home"
  | "heart-pulse"
  | "plane"
  | "gamepad-2"
  | "briefcase"
  | "gift"
  | "graduation-cap"
  | "sparkles"
  | "receipt";

export const categoryIconOptions: CategoryIconKey[] = [
  "shopping-bag",
  "utensils",
  "car",
  "home",
  "heart-pulse",
  "plane",
  "gamepad-2",
  "briefcase",
  "gift",
  "graduation-cap",
  "sparkles",
  "receipt",
];

export type CategoryKind = "income" | "expense";

export type Category = {
  id: string;
  name: string;
  icon: CategoryIconKey;
  color: WalletColor;
  kind: CategoryKind;
  txCount: number;
};

export const mockCategories: Category[] = [
  { id: "c1", name: "Groceries", icon: "shopping-bag", color: "emerald", kind: "expense", txCount: 42 },
  { id: "c2", name: "Dining", icon: "utensils", color: "amber", kind: "expense", txCount: 28 },
  { id: "c3", name: "Transport", icon: "car", color: "sky", kind: "expense", txCount: 19 },
  { id: "c4", name: "Rent", icon: "home", color: "slate", kind: "expense", txCount: 1 },
  { id: "c5", name: "Health", icon: "heart-pulse", color: "rose", kind: "expense", txCount: 6 },
  { id: "c6", name: "Travel", icon: "plane", color: "indigo", kind: "expense", txCount: 4 },
  { id: "c7", name: "Entertainment", icon: "gamepad-2", color: "violet", kind: "expense", txCount: 11 },
  { id: "c8", name: "Subscriptions", icon: "receipt", color: "violet", kind: "expense", txCount: 9 },
  { id: "c9", name: "Salary", icon: "briefcase", color: "emerald", kind: "income", txCount: 3 },
  { id: "c10", name: "Freelance", icon: "sparkles", color: "indigo", kind: "income", txCount: 5 },
  { id: "c11", name: "Gifts", icon: "gift", color: "rose", kind: "income", txCount: 2 },
  { id: "c12", name: "Scholarship", icon: "graduation-cap", color: "sky", kind: "income", txCount: 1 },
];

export function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}