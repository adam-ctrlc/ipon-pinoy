"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useCategories } from "@/hooks/useCategories";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Modal from "@/components/common/Modal";
import Select from "@/components/common/Select";
import type { Category } from "@/types";

const ICON_OPTIONS = [
  { value: "restaurant", label: "Restaurant" }, { value: "directions_car", label: "Transport" },
  { value: "shopping_cart", label: "Shopping" }, { value: "movie", label: "Entertainment" },
  { value: "receipt", label: "Bills" }, { value: "local_hospital", label: "Healthcare" },
  { value: "payments", label: "Payments" }, { value: "work", label: "Work" },
  { value: "trending_up", label: "Investments" }, { value: "storefront", label: "Business" },
  { value: "redeem", label: "Gifts" }, { value: "attach_money", label: "Money" },
  { value: "home", label: "Home" }, { value: "school", label: "School" },
  { value: "fitness_center", label: "Fitness" }, { value: "category", label: "Other" },
];

export default function CategoriesPage() {
  const { user } = useAuth();
  const userId = user?.id;
  const { categories, isLoading, mutate } = useCategories(userId ? { userId } : {});
  const [tab, setTab] = useState<"expense" | "income">("expense");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", type: "expense", color: "#fbbf24", icon: "category" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const filtered = categories.filter((c: Category) => c.type === tab);

  const openCreate = () => { setEditing(null); setForm({ name: "", type: tab, color: "#fbbf24", icon: "category" }); setError(""); setIsModalOpen(true); };
  const openEdit   = (c: Category) => { setEditing(c); setForm({ name: c.name, type: c.type, color: c.color || "#fbbf24", icon: c.icon || "category" }); setError(""); setIsModalOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { setError("Category name is required"); return; }
    setIsSubmitting(true); setError("");
    try {
      const url = editing ? `/api/categories/${editing.id}` : "/api/categories";
      const method = editing ? "PUT" : "POST";
      const body = editing ? { name: form.name, type: form.type, color: form.color, icon: form.icon } : { ...form, userId };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Failed"); return; }
      mutate(); setIsModalOpen(false);
    } catch { setError("Failed to save category"); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setIsSubmitting(true);
    try { await fetch(`/api/categories/${deleting.id}`, { method: "DELETE" }); mutate(); setIsDeleteOpen(false); setDeleting(null); }
    catch { /* ignore */ } finally { setIsSubmitting(false); }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 font-display text-white min-h-full">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-black text-white md:text-3xl">Categories</h1>
          <p className="text-sm text-slate-500">Organize your <span className="text-primary font-semibold">gastos</span> and income.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 self-start rounded-xl bg-primary px-5 py-2.5 text-sm font-black text-stone-900 shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover sm:self-auto">
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          New Category
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-white/8 bg-[#292524] p-1 w-full sm:w-fit">
        {(["expense", "income"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn("flex-1 sm:flex-none rounded-lg px-6 py-2 text-sm font-bold capitalize transition-colors",
              tab === t ? "bg-primary text-stone-900 shadow" : "text-slate-400 hover:text-white"
            )}
          >
            {t === "expense" ? "Expenses" : "Income"}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-24 rounded-2xl border border-white/8 bg-[#292524] animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <span className="material-symbols-outlined text-6xl text-slate-600">category</span>
          <p className="text-slate-500">No {tab} categories yet.</p>
          <button onClick={openCreate} className="rounded-xl bg-primary px-6 py-2.5 text-sm font-black text-stone-900 hover:bg-primary-hover transition-colors">
            Create First Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((cat: Category) => (
            <div key={cat.id} className="group rounded-2xl border border-white/8 bg-[#292524] banig-xs p-5 transition-all hover:border-white/15">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl" style={{ background: `${cat.color || "#a8a29e"}20` }}>
                    <span className="material-symbols-outlined text-xl" style={{ color: cat.color || "#a8a29e" }}>{cat.icon || "category"}</span>
                  </div>
                  <div>
                    <p className="font-bold text-white">{cat.name}</p>
                    <p className="text-xs capitalize text-slate-500">{cat.type}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                  <button onClick={() => openEdit(cat)} className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-primary/10 hover:text-primary">
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                  </button>
                  <button onClick={() => { setDeleting(cat); setIsDeleteOpen(true); }} className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-secondary/10 hover:text-secondary">
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? "Edit Category" : "New Category"} footer={<><Button variant="ghost" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button><Button onClick={handleSubmit as unknown as () => void} disabled={isSubmitting}>{isSubmitting ? "Saving..." : editing ? "Update" : "Create"}</Button></>}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <div className="flex items-center gap-2 rounded-xl bg-secondary/10 border border-secondary/20 px-4 py-3 text-sm text-secondary"><span className="material-symbols-outlined text-base">error</span>{error}</div>}
          <Input label="Category Name" placeholder="e.g. Food & Dining" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
          <Select label="Type" value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} options={[{value:"expense",label:"Expense"},{value:"income",label:"Income"}]} icon="swap_vert" />
          <Select label="Icon" value={form.icon} onChange={(e) => setForm({...form, icon: e.target.value})} options={ICON_OPTIONS} icon="category" />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-wider text-slate-300">Color</label>
            <div className="flex items-center gap-3">
              <input id="category-color" name="category-color" type="color" value={form.color} onChange={(e) => setForm({...form, color: e.target.value})} className="h-10 w-10 cursor-pointer rounded-lg border-0 bg-transparent" />
              <span className="text-sm text-slate-500 font-mono">{form.color}</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: `${form.color}25` }}>
                <span className="material-symbols-outlined text-[22px]" style={{ color: form.color }}>{form.icon}</span>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Category" footer={<><Button variant="ghost" onClick={() => setIsDeleteOpen(false)} disabled={isSubmitting}>Cancel</Button><Button variant="secondary" onClick={handleDelete} disabled={isSubmitting}>{isSubmitting ? "Deleting..." : "Delete"}</Button></>}>
        <p className="text-sm text-slate-400">Are you sure you want to delete <span className="font-bold text-white">{deleting?.name}</span>? This cannot be undone.</p>
      </Modal>
    </div>
  );
}
