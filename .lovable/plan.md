# MVP v1.0 Polish Sprint

Preserve the existing visual language (colors, spacing, typography, radii, components). No redesign — only wire up interactions, states, and data-readiness.

## 1. Navbar interactions

**Notification Center** (`src/components/layout/notification-center.tsx`, new)
- Bell icon → `DropdownMenu` (Popover) with list of notifications.
- Types: `weekly_summary`, `budget_alert`, `goal_progress`, `transaction_synced`.
- Unread dot badge on the bell when `unread > 0`.
- "Mark all as read" action + empty state ("You're all caught up").
- Backed by a small `useNotifications` hook with in-memory mock list; shape ready to swap for an API call.

**User Menu** — move avatar/user dropdown from sidebar footer into the topbar too, keep sidebar version. Menu items: Profile (routes to `/settings`), Settings, Help (external link placeholder), Logout.
- Logout opens an `AlertDialog` confirmation before clearing session; on confirm → toast "Signed out" → redirect to `/login`.

## 2. Global Search
- Debounced input (250ms), controlled state.
- Loading spinner while "searching", empty result state, `X` clear button, focus ring, `⌘K` hint.
- Uses `useDebouncedValue` hook + local mock query fn (ready to swap).
- Results dropdown grouped by transactions/goals/pages.

## 3. Empty / Loading / Error States
Reusable primitives in `src/components/state/`:
- `<EmptyState icon title description action />`
- `<ErrorState title description onRetry />`
- `<Skeleton>` (already in shadcn) + composed skeletons: `DashboardSkeleton`, `TransactionsTableSkeleton`, `AnalyticsSkeleton`, `GoalsSkeleton`, `SettingsSkeleton`.

Wire each route to accept data via props/hooks (`useDashboardData`, `useTransactions`, etc.) that return `{ data, isLoading, error, refetch }`. Current mock data flows through these hooks so the UI is data-shape-ready.

## 4. Auth flow completion
- Route protection: `_authenticated`-style guard already via `AuthGate`. Add reverse guard on `/login` and `/register` → redirect authenticated users to `/dashboard`.
- Session-expired toast on redirect (already scaffolded via `?expired=1`).
- Add `/verify-email` placeholder route.
- Google button: loading state → toast "Welcome back" → smooth navigate to `/dashboard`. Error surfaces via inline alert.
- Logout confirmation dialog (see §1).

## 5. Toasts
Consistent sonner usage: login success ("Welcome back, {name}"), logout, profile updated, settings saved, transaction/goal CRUD (mock handlers). Standardize on `toast.success` / `toast.error` with short messages.

## 6. Theme persistence
Verify `ThemeProvider` persists to localStorage under `nera-theme` (already does via inline script + provider). Add explicit `system` handling watcher for OS-level changes.

## 7. Data-readiness
Introduce `src/lib/data-hooks.ts` — mock async hooks matching future API shape:
```
useDashboardData() → { kpis, cashflow, budgets, recent }
useTransactionsData(filters) → { items, total }
useAnalyticsData() → { categories, incomeExpense, kpis }
useGoalsData() → { goals }
useProfile() → { user }
```
Each simulates a delay + can toggle error state for demo. Components read from hooks, not from imports of `mock-data.ts` directly.

## 8. Polish
- Focus-visible rings on interactive elements (use `focus-visible:ring-2 ring-ring/50`).
- Loading button states (`<Button disabled>` + spinner) on all form submits.
- Smooth page transitions: subtle `animate-in fade-in-0` on route content.
- Consistent hover/active states audit on cards, table rows, sidebar items.

## Files to add
- `src/components/layout/notification-center.tsx`
- `src/components/layout/user-menu.tsx`
- `src/components/layout/global-search.tsx`
- `src/components/state/empty-state.tsx`
- `src/components/state/error-state.tsx`
- `src/components/state/skeletons.tsx`
- `src/hooks/use-debounced-value.ts`
- `src/hooks/use-notifications.ts`
- `src/lib/data-hooks.ts`
- `src/routes/verify-email.tsx`

## Files to edit
- `src/components/layout/topbar.tsx` — mount notification center, user menu, wired search.
- `src/routes/{dashboard,transactions,analytics,goals,settings}.tsx` — consume data hooks, render skeletons/empty/error.
- `src/routes/{login,register}.tsx` — reverse guard, Google flow polish, welcome toast.
- `src/components/layout/app-sidebar.tsx` — logout confirmation.
- `src/components/theme-provider.tsx` — verify system watcher.

## Out of scope
No redesign. No new features beyond above. No backend/Supabase integration yet — hooks are shaped for it.
