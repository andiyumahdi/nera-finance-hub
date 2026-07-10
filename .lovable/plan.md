# Nera — Premium Personal Finance Dashboard

A calm, minimal finance dashboard inspired by Linear / Stripe / Vercel / Notion. Indigo primary, neutral grays, green for income, red for expense. Light + dark mode. Fully responsive.

Note: this project runs on TanStack Start (not Next.js), but the design principles and shadcn/ui approach translate 1:1. All routing uses TanStack Router's file-based routes under `src/routes/`.

## Design system

Update `src/styles.css` tokens (oklch):
- `--primary`: Indigo #4F46E5
- Neutral gray surfaces: near-white bg + subtle borders (light); near-black bg with slightly elevated cards (dark)
- Add semantic tokens: `--income` (green ~ oklch(0.65 0.17 150)), `--expense` (red ~ oklch(0.60 0.22 25)), plus `-foreground` pairs
- Register them in `@theme inline` so `bg-income` / `text-expense` work
- Radius 0.5rem, tight typography scale, no gradients/shadows beyond subtle `ring-1 ring-border`
- Font: Inter via `<link>` in `__root.tsx` head

Dark mode toggle: `next-themes`-style, but implemented with a small `ThemeProvider` that toggles `.dark` on `<html>`, persisted in `localStorage`. Read inside `useEffect` to avoid hydration mismatch.

## Routes (`src/routes/`)

```
__root.tsx              → shell + <AppLayout>
index.tsx               → redirects to /dashboard (or serves dashboard)
dashboard.tsx           → Overview
transactions.tsx        → Transactions
analytics.tsx           → Analytics
goals.tsx               → Goals
settings.tsx            → Settings (with sub-tabs)
```

Each route sets its own `head()` with unique title + description + og tags.

## Layout

`src/components/layout/AppLayout.tsx` using shadcn Sidebar:
- Desktop: collapsible icon sidebar (left) with Nera wordmark, nav (Dashboard, Transactions, Analytics, Goals, Settings), user card at bottom
- Mobile: sidebar becomes off-canvas via `SidebarTrigger` in a slim top bar; top bar also holds page title, search, theme toggle, notifications
- Uses `grid-cols-[minmax(0,1fr)_auto]` responsive header pattern

## Page content

**Dashboard Overview**
- 4 KPI cards: Net Worth, Monthly Income (green delta), Monthly Expense (red delta), Savings Rate
- Cashflow area chart (last 6 months) — Recharts, single indigo line + muted grid
- Recent transactions list (5 rows)
- Budget progress list (3–4 categories with thin progress bars)

**Transactions**
- Filter bar: search, date range, category multiselect, type (income/expense)
- Table (shadcn Table) with columns: Date, Description, Category (badge), Account, Amount (colored)
- Pagination footer; empty + loading states
- Mobile: table collapses into stacked cards

**Analytics**
- Income vs Expense bar chart (monthly, grouped)
- Spending by category donut + legend list with % and amount
- Trend line: Savings over time
- Small KPI strip on top

**Goals**
- Grid of goal cards: title, target, current, progress bar, ETA, contribute button
- "New goal" primary button opens a Dialog with form (name, target amount, deadline, category)
- Empty state illustration (simple, no gradients)

**Settings**
- Tabs: Profile, Preferences, Notifications, Security, Billing
- Preferences includes Appearance (Light / Dark / System) radio group and Currency select
- Forms use shadcn Form + Input + Switch + Button

All data is mock/static (typed in `src/lib/mock-data.ts`) — no backend in this pass.

## Components to add

- `components/layout/AppSidebar.tsx`
- `components/layout/Topbar.tsx`
- `components/layout/ThemeToggle.tsx` + `components/theme-provider.tsx`
- `components/dashboard/KpiCard.tsx`
- `components/dashboard/CashflowChart.tsx`
- `components/transactions/TransactionsTable.tsx` + `TransactionRow.tsx`
- `components/analytics/CategoryDonut.tsx`, `IncomeExpenseBars.tsx`
- `components/goals/GoalCard.tsx`, `NewGoalDialog.tsx`
- `lib/mock-data.ts`, `lib/format.ts` (currency, %, delta helpers)

Install: `recharts`, `date-fns`. shadcn primitives already available (add any missing: sidebar, table, tabs, dialog, dropdown-menu, badge, progress, select, switch, form).

## Technical notes

- All colors via semantic tokens — no hardcoded hex in components
- Sidebar wrapped in `SidebarProvider` inside `__root.tsx` so `SidebarTrigger` always visible on mobile
- Charts use CSS variables for colors so they follow light/dark automatically
- Every page route has distinct `head()` metadata (title, description, og:title, og:description); no og:image
- Placeholder in `src/routes/index.tsx` removed
