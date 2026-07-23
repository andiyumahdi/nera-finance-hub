## Sprint D — Financial Organization (Frontend Only)

Semua pakai mock data + local state. Tidak ada backend/Supabase. Design system, warna, typography, spacing, dan card style Nera dipertahankan (border-based cards, shadow-none, radius 12px, semantic tokens, Indigo accent, income/expense colors).

### 1. Mock data & shared types
File baru: `src/lib/wallet-mock.ts`
- Types: `Wallet { id, name, icon, color, balance, isDefault, type }`, `Budget { id, category, limit, spent, period }`, `Category { id, name, icon, color, type: 'income'|'expense', txCount }`.
- Seed: Cash, Bank Jago, BCA, OVO, GoPay + 6 budgets + ~12 categories.
- Palette warna wallet (indigo/emerald/rose/amber/sky/violet) pakai token, bukan hex mentah.

### 2. Reusable components
`src/components/wallet/wallet-card.tsx` — icon bulat berwarna, nama, balance, default badge, action menu (Edit / Set Default / Delete). Varian: `default` (grid) & `compact` (horizontal scroll di dashboard).
`src/components/wallet/wallet-form-dialog.tsx` — create + edit (name, type, icon picker, color picker, initial balance, set as default).
`src/components/wallet/delete-wallet-dialog.tsx` — confirm dengan nama wallet.
`src/components/wallet/transfer-dialog.tsx` — multi-step: form → review → success (in-dialog step, bukan route baru; lebih ringan & konsisten dgn dialog Goals).
`src/components/budget/budget-card.tsx` — progress bar (Progress shadcn), used/remaining, status badge (On track / Warning ≥80% / Over ≥100%).
`src/components/budget/budget-form-dialog.tsx`.
`src/components/category/category-card.tsx` + `category-form-dialog.tsx` + `delete-confirm-dialog.tsx`.
`src/components/shared/confirmation-dialog.tsx` — generic confirm (title, description, variant destructive), dipakai ulang di wallet/category/goals.
`src/components/shared/statistic-card.tsx` — generalisasi KpiCard (label, value, delta, icon opsional).
Empty state, error state, skeleton pakai komponen `src/components/state/*` yang sudah ada; tambah `WalletsSkeleton`, `BudgetsSkeleton`, `CategoriesSkeleton` di `skeletons.tsx`.

### 3. Routes baru (TanStack file-based)
Tiap route punya `head()` unik (title + description + og:title/description).

- `src/routes/wallets.tsx` — grid wallet cards, tombol "New Wallet", empty/loading/error state, action menu per card (Edit, Set Default, Delete via ConfirmationDialog + toast), tombol "Transfer" di header membuka TransferDialog.
- `src/routes/budgets.tsx` — grid BudgetCard per kategori, header period selector (Monthly/Weekly — visual only), tombol "New Budget", warning callout kalau ada budget ≥90%.
- `src/routes/categories.tsx` — tabs Income / Expense, list CategoryCard, tombol "Add Category", edit & delete via dialog.

Tambahkan link ke sidebar (`app-sidebar.tsx`) di grup "Money": Wallets, Budgets, Categories (di antara Transactions & Analytics). Icon Lucide: `Wallet`, `PieChart`/`Target`, `Tags`.

### 4. Dashboard update
`src/routes/dashboard.tsx` + komponen baru `src/components/dashboard/wallet-overview.tsx`:
- Section baru di atas KPI: "Wallets" header + "Manage" link ke `/wallets` + `+ Transfer` button.
- Horizontal scroll row (snap-x, overflow-x-auto) berisi WalletCard varian `compact` (min-w ~200px). Di mobile: swipe; di desktop: grid wrap dgn max ~5 kolom.
- Tidak menghapus section existing (Nera Insight, KPI, cashflow, budgets ringkas, recent tx).

### 5. Transfer UX
TransferDialog step:
1. **Form**: Select wallet asal, wallet tujuan (disable yang sama dgn asal), input nominal (format currency), textarea catatan opsional.
2. **Review**: ringkasan asal → tujuan, nominal, saldo sebelum/sesudah (dari mock), tombol Back / Confirm.
3. **Success**: check icon, ringkasan singkat, tombol Done. Toast sukses.
Validasi: nominal > 0, ≤ saldo asal, kedua wallet harus terisi & berbeda.

### 6. State & interaksi
- Semua CRUD (wallet/budget/category) pakai `useState` di route masing-masing, meniru pola `goals.tsx` (setState + toast + close dialog + loading state 300ms simulasi).
- Set Default Wallet: toggle boolean di list, hanya satu default.
- Delete: ConfirmationDialog destructive.
- Semua form: validasi client (nama required, nominal > 0, limit > 0), disable submit saat invalid, loading pada tombol saat submit.

### 7. Responsive
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` untuk wallet/budget/category.
- Dashboard wallet row: horizontal scroll di <768px, grid di ≥768px.
- Dialog: `max-w-lg`, scroll internal untuk form panjang, sticky footer buttons.

### 8. Konsistensi visual
- Card: `shadow-none border` (match existing).
- Icon: Lucide, `strokeWidth={1.75}`, ukuran 14–16px dalam badge bulat warna.
- Warna wallet/category disimpan sebagai key semantic (mis. `indigo`, `emerald`) lalu dipetakan ke class Tailwind — bukan hex inline di JSX.
- Typography, spacing (`p-4`/`p-5`), heading sizes ikut pola KpiCard & GoalCard.

### Out of scope (Sprint E)
Backend, Supabase schema, real API, business logic saldo otomatis dari transaksi, filter transaksi berdasar wallet.

### Ringkasan file
```text
src/lib/wallet-mock.ts                              (new)
src/components/shared/confirmation-dialog.tsx       (new)
src/components/shared/statistic-card.tsx            (new)
src/components/wallet/{wallet-card,wallet-form-dialog,delete-wallet-dialog,transfer-dialog}.tsx  (new)
src/components/budget/{budget-card,budget-form-dialog}.tsx  (new)
src/components/category/{category-card,category-form-dialog}.tsx  (new)
src/components/dashboard/wallet-overview.tsx        (new)
src/components/state/skeletons.tsx                  (extend)
src/routes/{wallets,budgets,categories}.tsx         (new)
src/routes/dashboard.tsx                            (add WalletOverview)
src/components/layout/app-sidebar.tsx               (add 3 nav items)
```
