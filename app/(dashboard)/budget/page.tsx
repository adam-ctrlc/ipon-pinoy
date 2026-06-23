"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useBudgets } from "@/hooks/useBudgets";
import { useCategories } from "@/hooks/useCategories";
import { useTransactions } from "@/hooks/useTransactions";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Modal from "@/components/common/Modal";
import Select from "@/components/common/Select";
import type { Budget, Category, Transaction } from "@/types";

function calcSpent(budget: Budget, transactions: Transaction[]) {
  return transactions.filter((t) => {
    const inRange = new Date(t.date) >= new Date(budget.startDate) && (!budget.endDate || new Date(t.date) <= new Date(budget.endDate));
    return t.type === "expense" && (budget.categoryId ? t.categoryId === budget.categoryId : true) && inRange;
  }).reduce((s, t) => s + t.amount, 0);
}

export default function BudgetPage() {
  const { user } = useAuth();
  const userId = user?.id;
  const { budgets, isLoading, mutate } = useBudgets(userId ? { userId } : {});
  const { categories } = useCategories(userId ? { userId } : {});
  const { transactions } = useTransactions(userId ? { userId } : {});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);
  const [deleting, setDeleting] = useState<Budget | null>(null);
  const [form, setForm] = useState({ name: "", amount: "", period: "monthly", startDate: new Date().toISOString().split("T")[0], endDate: "", categoryId: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const totalBudget = budgets.reduce((s: number, b: Budget) => s + b.amount, 0);
  const totalSpent  = budgets.reduce((s: number, b: Budget) => s + calcSpent(b, transactions), 0);

  const openCreate = () => { setEditing(null); setForm({ name: "", amount: "", period: "monthly", startDate: new Date().toISOString().split("T")[0], endDate: "", categoryId: "" }); setError(""); setIsModalOpen(true); };
  const openEdit   = (b: Budget) => { setEditing(b); setForm({ name: b.name, amount: b.amount.toString(), period: b.period, startDate: b.startDate.split("T")[0], endDate: b.endDate ? b.endDate.split("T")[0] : "", categoryId: b.categoryId || "" }); setError(""); setIsModalOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.amount) { setError("Please fill in all required fields"); return; }
    setIsSubmitting(true); setError("");
    try {
      const url = editing ? `/api/budgets/${editing.id}` : "/api/budgets";
      const method = editing ? "PUT" : "POST";
      const body = { ...form, amount: parseFloat(form.amount), startDate: new Date(form.startDate).toISOString(), endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined, categoryId: form.categoryId || undefined, ...(!editing && { userId }) };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Failed"); return; }
      mutate(); setIsModalOpen(false);
    } catch { setError("Failed to save budget"); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setIsSubmitting(true);
    try { await fetch(`/api/budgets/${deleting.id}`, { method: "DELETE" }); mutate(); setIsDeleteOpen(false); setDeleting(null); }
    catch { /* ignore */ } finally { setIsSubmitting(false); }
  };

  const expCats = categories.filter((c: Category) => c.type === "expense").map((c: Category) => ({ value: c.id, label: c.name }));

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 font-display text-white min-h-full">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-black text-white md:text-3xl">Budget <span className="text-primary">(Tipid Mode)</span></h1>
          <p className="text-sm text-slate-500">Set limits and track your spending.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 self-start rounded-xl bg-primary px-5 py-2.5 text-sm font-black text-stone-900 shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover sm:self-auto">
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          New Budget
        </button>
      </div>

      {/* Summary chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Total Budgeted",   value: `₱${totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: "text-primary" },
          { label: "Active Budgets",   value: budgets.length.toString(), color: "text-white" },
          { label: "Total Spent",      value: `₱${totalSpent.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: "text-secondary" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/8 bg-[#292524] banig-xs p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{s.label}</p>
            <p className={cn("text-2xl font-black", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Budget cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-44 rounded-2xl border border-white/8 bg-[#292524] animate-pulse" />)}
        </div>
      ) : budgets.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <span className="material-symbols-outlined text-6xl text-slate-600">savings</span>
          <p className="text-slate-500">No budgets yet. Start saving with Tipid Mode!</p>
          <button onClick={openCreate} className="rounded-xl bg-primary px-6 py-2.5 text-sm font-black text-stone-900 hover:bg-primary-hover transition-colors">
            Create First Budget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((b: Budget) => {
            const spent     = calcSpent(b, transactions);
            const goal      = b.amount;
            const pct       = Math.min((spent / goal) * 100, 100);
            const remaining = Math.max(goal - spent, 0);
            const isOver    = spent > goal;
            const daysLeft  = b.endDate ? Math.max(0, Math.ceil((new Date(b.endDate).getTime() - Date.now()) / 86400000)) : null;
            return (
              <div key={b.id} className="group rounded-2xl border border-white/8 bg-[#292524] banig-xs p-6 transition-all hover:border-white/15">
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex size-11 items-center justify-center rounded-xl", isOver ? "bg-secondary/10" : "bg-primary/10")}>
                      <span className={cn("material-symbols-outlined text-xl", isOver ? "text-secondary" : "text-primary")}>{b.category?.icon || "savings"}</span>
                    </div>
                    <div>
                      <p className="font-bold text-white">{b.name}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs capitalize text-slate-500">{b.period} · {b.category?.name || "All Expenses"}</p>
                        {daysLeft !== null && (
                          <span className={cn("text-[10px] font-bold rounded-full px-2 py-0.5", daysLeft <= 3 ? "bg-secondary/15 text-secondary" : "bg-white/5 text-slate-500")}>
                            {daysLeft === 0 ? "ends today" : `${daysLeft}d left`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => openEdit(b)} className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-primary/10 hover:text-primary">
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button onClick={() => { setDeleting(b); setIsDeleteOpen(true); }} className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-secondary/10 hover:text-secondary">
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className={cn("font-bold", isOver ? "text-secondary" : "text-quaternary")}>
                      ₱{spent.toLocaleString(undefined, { maximumFractionDigits: 0 })} spent
                    </span>
                    <span className="text-slate-500">₱{goal.toLocaleString(undefined, { maximumFractionDigits: 0 })} limit</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5">
                    <div className={cn("h-full rounded-full transition-all", isOver ? "bg-secondary" : pct > 80 ? "bg-primary" : "bg-quaternary")} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{Math.round(pct)}% used</span>
                    <span className={cn("font-bold", isOver ? "text-secondary" : "text-quaternary")}>
                      {isOver ? `₱${(spent - goal).toLocaleString(undefined, { maximumFractionDigits: 0 })} over` : `₱${remaining.toLocaleString(undefined, { maximumFractionDigits: 0 })} left`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? "Edit Budget" : "New Budget"} footer={<><Button variant="ghost" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button><Button onClick={handleSubmit as unknown as () => void} disabled={isSubmitting}>{isSubmitting ? "Saving..." : editing ? "Update" : "Create"}</Button></>}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <div className="flex items-center gap-2 rounded-xl bg-secondary/10 border border-secondary/20 px-4 py-3 text-sm text-secondary"><span className="material-symbols-outlined text-base">error</span>{error}</div>}
          <Input label="Budget Name" placeholder="e.g. Monthly Food Budget" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
          <Input label="Amount" type="number" placeholder="0.00" prefix="₱" size="lg" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} required />
          <Select label="Period" value={form.period} onChange={(e) => setForm({...form, period: e.target.value})} options={[{value:"monthly",label:"Monthly"},{value:"weekly",label:"Weekly"},{value:"yearly",label:"Yearly"}]} icon="event_repeat" />
          <Select label="Category (Optional)" value={form.categoryId} onChange={(e) => setForm({...form, categoryId: e.target.value})} options={expCats} icon="category" placeholder="All Expenses" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={form.startDate} onChange={(e) => setForm({...form, startDate: e.target.value})} required />
            <Input label="End Date" type="date" value={form.endDate} onChange={(e) => setForm({...form, endDate: e.target.value})} />
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Budget" footer={<><Button variant="ghost" onClick={() => setIsDeleteOpen(false)} disabled={isSubmitting}>Cancel</Button><Button variant="secondary" onClick={handleDelete} disabled={isSubmitting}>{isSubmitting ? "Deleting..." : "Delete"}</Button></>}>
        <p className="text-slate-400 text-sm">Are you sure you want to delete <span className="font-bold text-white">{deleting?.name}</span>? This cannot be undone.</p>
      </Modal>
    </div>
  );
}
