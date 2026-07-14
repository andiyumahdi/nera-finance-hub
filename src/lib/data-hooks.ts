import { useEffect, useRef, useState } from "react";
import {
  budgets as mockBudgets,
  categories as mockCategories,
  goals as mockGoals,
  kpis as mockKpis,
  monthlyCashflow,
  spendingByCategory,
  transactions as mockTransactions,
  type Goal,
  type Transaction,
} from "./mock-data";

export type AsyncState<T> = {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

function useAsync<T>(fetcher: () => Promise<T>, deps: unknown[] = []): AsyncState<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [nonce, setNonce] = useState(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetcher()
      .then((v) => {
        if (mounted.current) {
          setData(v);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (mounted.current) {
          setError(e instanceof Error ? e : new Error(String(e)));
          setLoading(false);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce, ...deps]);

  return { data, isLoading, error, refetch: () => setNonce((n) => n + 1) };
}

const wait = <T,>(v: T, ms = 500): Promise<T> =>
  new Promise((r) => setTimeout(() => r(v), ms));

export type DashboardData = {
  kpis: typeof mockKpis;
  cashflow: typeof monthlyCashflow;
  budgets: typeof mockBudgets;
  recent: Transaction[];
};

export function useDashboardData() {
  return useAsync<DashboardData>(() =>
    wait({
      kpis: mockKpis,
      cashflow: monthlyCashflow,
      budgets: mockBudgets,
      recent: mockTransactions.slice(0, 5),
    }),
  );
}

export type TransactionsFilters = {
  q?: string;
  type?: "all" | "income" | "expense";
  category?: string;
};

export function useTransactionsData(filters: TransactionsFilters) {
  const { q = "", type = "all", category = "all" } = filters;
  return useAsync(
    () => {
      const items = mockTransactions.filter((t) => {
        if (type !== "all" && t.type !== type) return false;
        if (category !== "all" && t.category !== category) return false;
        if (q && !t.description.toLowerCase().includes(q.toLowerCase())) return false;
        return true;
      });
      return wait({ items, total: items.length, categories: mockCategories }, 350);
    },
    [q, type, category],
  );
}

export type AnalyticsData = {
  kpis: typeof mockKpis;
  cashflow: typeof monthlyCashflow;
  categories: typeof spendingByCategory;
};

export function useAnalyticsData() {
  return useAsync<AnalyticsData>(() =>
    wait({ kpis: mockKpis, cashflow: monthlyCashflow, categories: spendingByCategory }, 500),
  );
}

export function useGoalsData() {
  return useAsync<{ goals: Goal[] }>(() => wait({ goals: mockGoals }, 450));
}

export type SearchResult = {
  id: string;
  kind: "transaction" | "goal" | "page";
  title: string;
  subtitle?: string;
  href: string;
};

export function searchAll(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tx: SearchResult[] = mockTransactions
    .filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q),
    )
    .slice(0, 5)
    .map((t) => ({
      id: t.id,
      kind: "transaction",
      title: t.description,
      subtitle: `${t.category} · $${t.amount.toFixed(2)}`,
      href: "/transactions",
    }));
  const gl: SearchResult[] = mockGoals
    .filter((g) => g.name.toLowerCase().includes(q))
    .slice(0, 3)
    .map((g) => ({
      id: g.id,
      kind: "goal",
      title: g.name,
      subtitle: g.category,
      href: "/goals",
    }));
  const pages: SearchResult[] = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Transactions", href: "/transactions" },
    { title: "Analytics", href: "/analytics" },
    { title: "Goals", href: "/goals" },
    { title: "Settings", href: "/settings" },
  ]
    .filter((p) => p.title.toLowerCase().includes(q))
    .map((p) => ({ id: p.href, kind: "page", title: p.title, href: p.href }));
  return [...pages, ...tx, ...gl];
}