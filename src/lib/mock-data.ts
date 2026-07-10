export type TxType = "income" | "expense";
export type Transaction = {
  id: string;
  date: string; // ISO
  description: string;
  category: string;
  account: string;
  amount: number; // positive number; type indicates sign
  type: TxType;
};

export const categories = [
  "Salary",
  "Freelance",
  "Groceries",
  "Rent",
  "Utilities",
  "Dining",
  "Transport",
  "Subscriptions",
  "Health",
  "Shopping",
  "Travel",
  "Investments",
];

export const accounts = ["Checking", "Savings", "Credit Card", "Brokerage"];

export const transactions: Transaction[] = [
  { id: "t1", date: "2026-07-08", description: "Acme Inc — Payroll", category: "Salary", account: "Checking", amount: 6200, type: "income" },
  { id: "t2", date: "2026-07-07", description: "Whole Foods Market", category: "Groceries", account: "Credit Card", amount: 128.42, type: "expense" },
  { id: "t3", date: "2026-07-06", description: "Lyft ride", category: "Transport", account: "Credit Card", amount: 18.9, type: "expense" },
  { id: "t4", date: "2026-07-05", description: "Figma subscription", category: "Subscriptions", account: "Credit Card", amount: 15, type: "expense" },
  { id: "t5", date: "2026-07-04", description: "Blue Bottle Coffee", category: "Dining", account: "Checking", amount: 6.75, type: "expense" },
  { id: "t6", date: "2026-07-03", description: "Freelance — Nova Studio", category: "Freelance", account: "Checking", amount: 1400, type: "income" },
  { id: "t7", date: "2026-07-02", description: "PG&E electricity", category: "Utilities", account: "Checking", amount: 82.11, type: "expense" },
  { id: "t8", date: "2026-07-01", description: "Rent — July", category: "Rent", account: "Checking", amount: 2400, type: "expense" },
  { id: "t9", date: "2026-06-30", description: "Amazon order", category: "Shopping", account: "Credit Card", amount: 64.2, type: "expense" },
  { id: "t10", date: "2026-06-28", description: "Delta flight to NYC", category: "Travel", account: "Credit Card", amount: 342.5, type: "expense" },
  { id: "t11", date: "2026-06-27", description: "Trader Joe's", category: "Groceries", account: "Credit Card", amount: 74.3, type: "expense" },
  { id: "t12", date: "2026-06-26", description: "Spotify Family", category: "Subscriptions", account: "Credit Card", amount: 16.99, type: "expense" },
  { id: "t13", date: "2026-06-25", description: "Dividend — VTI", category: "Investments", account: "Brokerage", amount: 128.4, type: "income" },
  { id: "t14", date: "2026-06-24", description: "Kaiser copay", category: "Health", account: "Checking", amount: 40, type: "expense" },
  { id: "t15", date: "2026-06-22", description: "Sushi Ran dinner", category: "Dining", account: "Credit Card", amount: 96.5, type: "expense" },
];

export const monthlyCashflow = [
  { month: "Feb", income: 7100, expense: 4820, net: 2280 },
  { month: "Mar", income: 7250, expense: 5100, net: 2150 },
  { month: "Apr", income: 7600, expense: 4980, net: 2620 },
  { month: "May", income: 7420, expense: 5320, net: 2100 },
  { month: "Jun", income: 7830, expense: 5150, net: 2680 },
  { month: "Jul", income: 7728, expense: 3184, net: 4544 },
];

export const spendingByCategory = [
  { category: "Rent", amount: 2400 },
  { category: "Groceries", amount: 620 },
  { category: "Dining", amount: 310 },
  { category: "Transport", amount: 180 },
  { category: "Subscriptions", amount: 96 },
  { category: "Utilities", amount: 145 },
  { category: "Shopping", amount: 230 },
  { category: "Health", amount: 90 },
];

export const budgets = [
  { category: "Groceries", spent: 620, limit: 800 },
  { category: "Dining", spent: 310, limit: 350 },
  { category: "Transport", spent: 180, limit: 250 },
  { category: "Shopping", spent: 230, limit: 200 },
];

export type Goal = {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  category: string;
};

export const goals: Goal[] = [
  { id: "g1", name: "Emergency fund", target: 15000, current: 11200, deadline: "2026-12-31", category: "Safety" },
  { id: "g2", name: "Japan trip", target: 6000, current: 2450, deadline: "2027-03-01", category: "Travel" },
  { id: "g3", name: "New MacBook", target: 3200, current: 2800, deadline: "2026-09-15", category: "Tech" },
  { id: "g4", name: "House down payment", target: 80000, current: 24500, deadline: "2028-06-01", category: "Home" },
];

export const kpis = {
  netWorth: 84210,
  netWorthDelta: 2.4,
  monthIncome: 7728,
  monthIncomeDelta: 3.1,
  monthExpense: 3184,
  monthExpenseDelta: -8.2,
  savingsRate: 58.8,
  savingsRateDelta: 4.6,
};
