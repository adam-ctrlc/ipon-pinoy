"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { downloadCSV } from "@/utils/csv";
import { parsePHP } from "@/utils/currency";
import { useAuth } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import { useToast } from "@/hooks/useToast";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Modal from "@/components/common/Modal";
import Select from "@/components/common/Select";
import ToastList from "@/components/common/Toast";
import ExportMenu from "@/components/common/ExportMenu";
import type { Transaction, Category } from "@/types";

export default function TransactionsPage() {
  const { user } = useAuth();
  const userId = user?.id;
  const { transactions, isLoading, mutate } = useTransactions(userId ? { userId } : {});
  const { categories } = useCategories(userId ? { userId } : {});
  const { toasts, toast, dismiss } = useToast();

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);
  const [form, setForm] = useState({ amount: "", type: "expense", description: "", date: new Date().toISOString().split("T")[0], categoryId: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "n" && !isModalOpen && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        openCreate();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isModalOpen]);

  const filtered = transactions.filter((t: Transaction) => {
    const matchSearch = t.description?.toLowerCase().includes(search.toLowerCase()) || t.category?.name?.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (filterType === "all" || t.type === filterType);
  });

  const totalIncome  = filtered.filter((t: Transaction) => t.type === "income") .reduce((s: number, t: Transaction) => s + t.amount, 0);
  const totalExpense = filtered.filter((t: Transaction) => t.type === "expense").reduce((s: number, t: Transaction) => s + t.amount, 0);

  const openCreate = () => { setEditing(null); setForm({ amount: "", type: "expense", description: "", date: new Date().toISOString().split("T")[0], categoryId: "" }); setError(""); setIsModalOpen(true); };
  const openEdit   = (t: Transaction) => { setEditing(t); setForm({ amount: t.amount.toString(), type: t.type, description: t.description || "", date: t.date.split("T")[0], categoryId: t.categoryId }); setError(""); setIsModalOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.categoryId) { setError("Please fill in all required fields"); return; }
    setIsSubmitting(true); setError("");
    try {
      const url = editing ? `/api/transactions/${editing.id}` : "/api/transactions";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, amount: parseFloat(form.amount), userId }) });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Failed"); return; }
      mutate(); setIsModalOpen(false);
      toast(editing ? "Transaction updated!" : "Transaction saved!");
    } catch { setError("Failed to save"); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setIsSubmitting(true);
    try {
      await fetch(`/api/transactions/${deleting.id}`, { method: "DELETE" });
      mutate(); setIsDeleteOpen(false); setDeleting(null);
      toast("Transaction deleted.", "info");
    }
    catch { /* ignore */ } finally { setIsSubmitting(false); }
  };

  const exportRows = () => filtered.map((t: Transaction) => [
    new Date(t.date).toLocaleDateString(), t.type, t.category?.name || "Uncategorized", t.description || "", parsePHP(t.amount).toFixed(2),
  ]);
  const exportHeaders = ["Date", "Type", "Category", "Description", "Amount"];
  const exportFilename = `transactions-${new Date().toISOString().split("T")[0]}`;

  const handleExportCSV = () => {
    downloadCSV(`${exportFilename}.csv`, [exportHeaders, ...exportRows()]);
  };

  const handleExportXLSX = async () => {
    const XLSX = await import("xlsx");
    const ws = XLSX.utils.aoa_to_sheet([exportHeaders, ...exportRows()]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, `${exportFilename}.xlsx`);
  };

  const handleExportPDF = async () => {
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
    const doc = new jsPDF();
    doc.setFontSize(16); doc.text("Transactions", 14, 20);
    doc.setFontSize(10); doc.text(`Exported: ${new Date().toLocaleDateString()}`, 14, 30);
    autoTable(doc, {
      startY: 40,
      head: [exportHeaders],
      body: exportRows(),
      styles: { fontSize: 9 },
    });
    doc.save(`${exportFilename}.pdf`);
  };

  const filteredCats = categories.filter((c: Category) => c.type === form.type);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 font-display text-white min-h-full">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-black text-white md:text-3xl">Transactions</h1>
          <p className="text-sm text-slate-500">Track your daily <span className="text-primary font-semibold">gastos</span> and income.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-black text-stone-900 shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover self-start sm:self-auto">
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          New Transaction
        </button>
      </div>

      {/* Stat chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Total Income",   amount: totalIncome,  color: "#10b981" },
          { label: "Total Expenses", amount: totalExpense, color: "#f43f5e" },
          { label: "Net",            amount: totalIncome - totalExpense, color: totalIncome - totalExpense >= 0 ? "#fbbf24" : "#f43f5e" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/8 bg-[#292524] banig-xs p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{s.label}</p>
            <p className="text-xl font-black" style={{ color: s.color }}>
              ₱ {Math.abs(s.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-slate-500">search</span>
          <input
            id="transaction-search"
            name="transaction-search"
            type="text"
            placeholder="Search by category or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-xl border border-white/8 bg-[#292524] pl-10 pr-4 text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/40 transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["all", "income", "expense"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={cn("h-11 rounded-xl border px-4 text-sm font-bold capitalize transition-colors",
                filterType === t ? "border-primary bg-primary/10 text-primary" : "border-white/8 bg-[#292524] text-slate-400 hover:text-white"
              )}
            >
              {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
          <ExportMenu onCSV={handleExportCSV} onXLSX={handleExportXLSX} onPDF={handleExportPDF} disabled={filtered.length === 0} />
        </div>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-white/8 bg-[#292524] banig-xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col gap-0">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border-b border-white/5">
                <div className="size-10 shrink-0 rounded-xl bg-white/5 animate-pulse" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-3 w-32 rounded bg-white/5 animate-pulse" />
                  <div className="h-2.5 w-20 rounded bg-white/5 animate-pulse" />
                </div>
                <div className="h-3 w-16 rounded bg-white/5 animate-pulse" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-600">receipt_long</span>
            <p className="text-sm text-slate-500">
              {search || filterType !== "all" ? "No transactions match your filters." : "No transactions yet. Add your first one!"}
            </p>
            {!search && filterType === "all" && (
              <button onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-black text-stone-900 shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover">
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                New Transaction
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((t: Transaction) => (
              <div key={t.id} className="group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-white/3">
                <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", t.type === "income" ? "bg-quaternary/10" : "bg-secondary/10")}>
                  <span className={cn("material-symbols-outlined text-[20px]", t.type === "income" ? "text-quaternary" : "text-secondary")}>{t.category?.icon || "receipt"}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{t.category?.name || "Uncategorized"}</p>
                  <p className="truncate text-xs text-slate-500">{t.description || "No description"} · {new Date(t.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className={cn("font-black text-sm", t.type === "income" ? "text-quaternary" : "text-secondary")}>
                      {t.type === "income" ? "+" : "-"}₱{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <span className={cn("text-[10px] font-bold", t.type === "income" ? "text-quaternary/70" : "text-secondary/70")}>{t.type}</span>
                  </div>
                  <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(t)} className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-primary/10 hover:text-primary">
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button onClick={() => { setDeleting(t); setIsDeleteOpen(true); }} className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-secondary/10 hover:text-secondary">
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? "Edit Transaction" : "New Transaction"} footer={<><Button variant="ghost" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button><Button onClick={handleSubmit as unknown as () => void} disabled={isSubmitting}>{isSubmitting ? "Saving..." : editing ? "Update" : "Create"}</Button></>}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <div className="flex items-center gap-2 rounded-xl bg-secondary/10 border border-secondary/20 px-4 py-3 text-sm text-secondary"><span className="material-symbols-outlined text-base">error</span>{error}</div>}
          <Input label="Amount" type="number" placeholder="0.00" prefix="₱" size="lg" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} required />
          <Select label="Type" value={form.type} onChange={(e) => setForm({...form, type: e.target.value, categoryId: ""})} options={[{value:"expense",label:"Expense"},{value:"income",label:"Income"}]} icon="swap_vert" />
          <Select label="Category" value={form.categoryId} onChange={(e) => setForm({...form, categoryId: e.target.value})} options={filteredCats.map((c: Category) => ({value: c.id, label: c.name}))} icon="category" required />
          <Input label="Description" placeholder="What was this for?" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
          <Input label="Date" type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />
        </form>
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Transaction" footer={<><Button variant="ghost" onClick={() => setIsDeleteOpen(false)} disabled={isSubmitting}>Cancel</Button><Button variant="secondary" onClick={handleDelete} disabled={isSubmitting}>{isSubmitting ? "Deleting..." : "Delete"}</Button></>}>
        <p className="text-slate-400 text-sm">Are you sure you want to delete this transaction? This cannot be undone.</p>
        {deleting && (
          <div className="mt-4 rounded-xl border border-white/8 bg-[#1c1917] p-4">
            <p className="font-semibold text-white">{deleting.category?.name || "Transaction"}</p>
            <p className="text-lg font-black text-secondary">₱{deleting.amount.toFixed(2)}</p>
          </div>
        )}
      </Modal>
      <ToastList toasts={toasts} dismiss={dismiss} />
    </div>
  );
}
