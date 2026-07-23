import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Tags } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryCard } from "@/components/category/category-card";
import { CategoryFormDialog, type CategoryFormValues } from "@/components/category/category-form-dialog";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { EmptyState } from "@/components/state/empty-state";
import { mockCategories, type Category, type CategoryKind } from "@/lib/wallet-mock";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — Nera" },
      { name: "description", content: "Organize your income and expenses with custom categories." },
      { property: "og:title", content: "Categories — Nera" },
      { property: "og:description", content: "Organize your income and expenses with custom categories." },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [tab, setTab] = useState<CategoryKind>("expense");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [deletingLoad, setDeletingLoad] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => { setItems(mockCategories); setLoading(false); }, 400);
    return () => clearTimeout(id);
  }, []);

  const wait = (ms = 300) => new Promise((r) => setTimeout(r, ms));

  const handleCreate = async (v: CategoryFormValues) => { await wait(); setItems((p) => [...p, { id: `c-${Date.now()}`, txCount: 0, ...v }]); toast.success(`${v.name} added`); };
  const handleEdit = async (v: CategoryFormValues) => { if (!editing) return; await wait(); setItems((p) => p.map((c) => (c.id === editing.id ? { ...c, ...v } : c))); toast.success("Category updated"); };
  const handleDelete = async () => { if (!deleting) return; setDeletingLoad(true); await wait(); setItems((p) => p.filter((c) => c.id !== deleting.id)); setDeletingLoad(false); setDeleting(null); toast.success("Category deleted"); };

  const shown = items.filter((c) => c.kind === tab);

  return (
    <AppLayout title="Categories" subtitle="Organize income and expenses">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs value={tab} onValueChange={(v) => setTab(v as CategoryKind)}>
            <TabsList className="h-8">
              <TabsTrigger value="expense" className="text-[12.5px]">Expense</TabsTrigger>
              <TabsTrigger value="income" className="text-[12.5px]">Income</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button size="sm" onClick={() => setCreating(true)} className="h-8 text-[12.5px]"><Plus className="mr-1 h-3.5 w-3.5" /> Add category</Button>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => (<Card key={i} className="shadow-none"><CardContent className="flex items-center gap-3 p-4"><Skeleton className="h-9 w-9 rounded-lg" /><div className="flex-1 space-y-2"><Skeleton className="h-3 w-24" /><Skeleton className="h-2.5 w-16" /></div></CardContent></Card>))}</div>
        ) : shown.length === 0 ? (
          <EmptyState icon={Tags} title={`No ${tab} categories`} description="Add a category to start organizing your transactions." actionLabel="Add category" onAction={() => setCreating(true)} />
        ) : (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((c) => (<CategoryCard key={c.id} category={c} onEdit={setEditing} onDelete={setDeleting} />))}
          </section>
        )}
      </div>
      <CategoryFormDialog open={creating} onOpenChange={setCreating} defaultKind={tab} onSubmit={handleCreate} title="New category" submitLabel="Create category" />
      <CategoryFormDialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)} category={editing ?? undefined} onSubmit={handleEdit} title="Edit category" submitLabel="Save changes" />
      <ConfirmationDialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)} title={`Delete ${deleting?.name ?? "category"}?`} description="Existing transactions keep their category label but this category won't appear in new pickers." confirmLabel="Delete category" destructive loading={deletingLoad} onConfirm={handleDelete} />
    </AppLayout>
  );
}