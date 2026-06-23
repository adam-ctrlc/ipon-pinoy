"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { downloadCSV } from "@/utils/csv";
import { parsePHP } from "@/utils/currency";
import { useAuth } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import { useBudgets } from "@/hooks/useBudgets";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import ExportMenu from "@/components/common/ExportMenu";
import type { Transaction, Budget } from "@/types";

function StatCard({ title, amount, icon, color, bg, loading }: { title: string; amount: number; icon: string; color: string; bg: string; loading: boolean }) {
  return (
    <div className={`flex flex-col gap-3 rounded-2xl border border-white/8 ${bg} banig-xs p-5 relative overflow-hidden`}>
      <div className="flex items-center gap-2">
        <div className={`flex size-9 items-center justify-center rounded-xl border border-white/8`} style={{ background: `${color}18` }}>
          <span className="material-symbols-outlined text-[20px]" style={{ color }}>{icon}</span>
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</p>
      </div>
      {loading ? (
        <div className="h-8 w-28 animate-pulse rounded-lg bg-white/5" />
      ) : (
        <p className="text-2xl font-black text-white">
          ₱ {Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const userId = user?.id;
  const { transactions, isLoading: txLoading, mutate } = useTransactions(userId ? { userId } : {});
  const { categories, isLoading: catLoading } = useCategories(userId ? { userId } : {});
  const { budgets, isLoading: budLoading } = useBudgets(userId ? { userId } : {});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTx, setNewTx] = useState({ amount: "", type: "expense", description: "", date: new Date().toISOString().split("T")[0], categoryId: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [cashFlowPeriod, setCashFlowPeriod] = useState("30days");
  const [greeting, setGreeting] = useState({ greeting: "", greetingIcon: "" });
  const [greetingLoading, setGreetingLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/greeting")
      .then((r) => r.json())
      .then(setGreeting)
      .catch(() => setGreeting({ greeting: "Magandang Araw", greetingIcon: "sunny" }))
      .finally(() => setGreetingLoading(false));
  }, []);

  const totalIncome  = transactions.filter((t: Transaction) => t.type === "income") .reduce((s: number, t: Transaction) => s + t.amount, 0);
  const totalExpense = transactions.filter((t: Transaction) => t.type === "expense").reduce((s: number, t: Transaction) => s + t.amount, 0);
  const totalSavings = totalIncome - totalExpense;

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.amount || !newTx.categoryId) { setSubmitError("Please fill in all required fields"); return; }
    setIsSubmitting(true); setSubmitError("");
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newTx, amount: parseFloat(newTx.amount), userId }),
      });
      if (!res.ok) { const d = await res.json(); setSubmitError(d.error || "Failed to save"); return; }
      mutate();
      setIsModalOpen(false);
      setNewTx({ amount: "", type: "expense", description: "", date: new Date().toISOString().split("T")[0], categoryId: "" });
    } catch { setSubmitError("Failed to save transaction"); }
    finally { setIsSubmitting(false); }
  };

  const exportRows = () => transactions.map((t: Transaction) => [
    new Date(t.date).toLocaleDateString(), t.type, t.category?.name || "Uncategorized", t.description || "", parsePHP(t.amount).toFixed(2),
  ]);

  const handleExportCSV = () => {
    downloadCSV(`finance-report-${new Date().toISOString().split("T")[0]}.csv`, [
      ["Date", "Type", "Category", "Description", "Amount"],
      ...exportRows(),
    ]);
  };

  const handleExportXLSX = async () => {
    const XLSX = await import("xlsx");
    const ws = XLSX.utils.aoa_to_sheet([["Date", "Type", "Category", "Description", "Amount"], ...exportRows()]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, `finance-report-${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const handleExportPDF = async () => {
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
    const doc = new jsPDF();
    doc.setFontSize(16); doc.text("Finance Report", 14, 20);
    doc.setFontSize(10); doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
    autoTable(doc, {
      startY: 40,
      head: [["Date", "Type", "Category", "Description", "Amount"]],
      body: exportRows(),
      styles: { fontSize: 9 },
    });
    doc.save(`finance-report-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const weeklyCashFlow = useMemo(() => {
    const numPeriods = cashFlowPeriod === "30days" ? 4 : 12;
    if (!transactions.length) return Array(numPeriods).fill(0);
    const now = new Date();
    const periods = Array(numPeriods).fill(0);
    transactions.forEach((t: Transaction) => {
      const diff = Math.floor((now.getTime() - new Date(t.date).getTime()) / (1000 * 60 * 60 * 24));
      const idx = Math.floor(diff / 7);
      if (idx >= 0 && idx < numPeriods) periods[numPeriods - 1 - idx] += t.type === "income" ? t.amount : -t.amount;
    });
    return periods;
  }, [transactions, cashFlowPeriod]);

  const netCashFlow = weeklyCashFlow.reduce((s: number, v: number) => s + v, 0);
  const maxFlow = Math.max(...weeklyCashFlow.map(Math.abs), 1);

  const categoryBreakdown = useMemo(() => {
    if (!transactions.length || !categories.length) return [];
    const totals: Record<string, number> = {};
    transactions.filter((t: Transaction) => t.type === "expense").forEach((t: Transaction) => {
      totals[t.categoryId] = (totals[t.categoryId] || 0) + t.amount;
    });
    const result = categories
      .filter((c: { type: string; id: string }) => c.type === "expense" && totals[c.id])
      .map((c: { id: string; name: string; icon: string }) => ({ id: c.id, name: c.name, icon: c.icon || "category", amount: totals[c.id] }))
      .sort((a: { amount: number }, b: { amount: number }) => b.amount - a.amount)
      .slice(0, 5);
    const max = Math.max(...result.map((c: { amount: number }) => c.amount), 1);
    return result.map((c: { amount: number; id: string; name: string; icon: string }) => ({ ...c, pct: (c.amount / max) * 100 }));
  }, [transactions, categories]);

  const barColors   = ["#fbbf24", "#f43f5e", "#0ea5e9", "#10b981"];
  const catColors   = ["#fbbf24", "#f43f5e", "#0ea5e9", "#10b981", "#a855f7"];
  const periodLabels = cashFlowPeriod === "30days" ? ["Wk 1","Wk 2","Wk 3","Wk 4"] : Array.from({ length: 12 }, (_, i) => `W${i + 1}`);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 font-display text-white min-h-full">

      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 h-5">
            {greetingLoading ? (
              <div className="h-3 w-24 animate-pulse rounded bg-white/5" />
            ) : (
              <>
                <span className="material-symbols-outlined text-primary text-[16px]">{greeting.greetingIcon}</span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{greeting.greeting}</p>
              </>
            )}
          </div>
          <h1 className="text-2xl font-black leading-tight text-white md:text-3xl">
            Kumusta, <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">{user?.firstName || user?.username || "Friend"}!</span>
          </h1>
          <p className="text-sm text-slate-500">Here&apos;s your <span className="text-slate-400 font-medium">Lagay ng Bulsa</span> update.</p>
        </div>
        <div className="flex gap-2">
          <ExportMenu onCSV={handleExportCSV} onXLSX={handleExportXLSX} onPDF={handleExportPDF} disabled={transactions.length === 0} />
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-black text-stone-900 shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Add Gastos
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Net Savings" amount={totalSavings} icon="account_balance_wallet" color={totalSavings >= 0 ? "#10b981" : "#f43f5e"} bg={totalSavings >= 0 ? "bg-[#292524]" : "bg-[#292524]"} loading={txLoading} />
        <StatCard title="Total Income"   amount={totalIncome}  icon="trending_up"   color="#10b981" bg="bg-[#292524]" loading={txLoading} />
        <StatCard title="Total Expenses" amount={totalExpense} icon="trending_down" color="#f43f5e" bg="bg-[#292524]" loading={txLoading} />
      </div>

      {/* Motivational banner */}
      {!txLoading && (() => {
        const hasTransactions = transactions.length > 0;
        const totalBudget = budgets.reduce((s: number, b: Budget) => s + b.amount, 0);
        const overBudget = totalBudget > 0 && totalExpense > totalBudget;
        if (!hasTransactions) return (
          <div className="flex items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4">
            <span className="material-symbols-outlined text-2xl text-primary shrink-0">waving_hand</span>
            <div className="flex-1 min-w-0">
              <p className="font-black text-white text-sm">Maligayang pagdating! Start logging your <span className="text-primary">gastos</span>.</p>
              <p className="text-xs text-slate-500 mt-0.5">Add your first transaction to see your financial picture.</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="shrink-0 rounded-xl bg-primary px-4 py-2 text-xs font-black text-stone-900 hover:bg-primary-hover transition-colors">
              Add now
            </button>
          </div>
        );
        if (overBudget) return (
          <div className="flex items-center gap-4 rounded-2xl border border-secondary/20 bg-secondary/5 px-5 py-4">
            <span className="material-symbols-outlined text-2xl text-secondary shrink-0">warning</span>
            <div>
              <p className="font-black text-white text-sm">Ay! You&apos;ve gone over your budget this month.</p>
              <p className="text-xs text-slate-500 mt-0.5">Review your spending and adjust your budget goals.</p>
            </div>
          </div>
        );
        return (
          <div className="flex items-center gap-4 rounded-2xl border border-quaternary/20 bg-quaternary/5 px-5 py-4">
            <span className="material-symbols-outlined text-2xl text-quaternary shrink-0">savings</span>
            <div>
              <p className="font-black text-white text-sm">Magaling! You&apos;re saving <span className="text-quaternary">₱{Math.abs(totalSavings).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span> so far.</p>
              <p className="text-xs text-slate-500 mt-0.5">Keep it up; every peso saved counts!</p>
            </div>
          </div>
        );
      })()}

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">

        {/* Cash Flow chart */}
        <div className="flex flex-col gap-4 rounded-2xl border border-white/8 bg-[#292524] banig-xs p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-black text-white">Cash Flow</p>
              <p className="text-xs text-slate-500">Pasok at labas ng pera</p>
            </div>
            <div className="flex gap-1 rounded-lg border border-white/8 bg-[#1c1917] p-1">
              {["30days", "3months"].map((p) => (
                <button
                  key={p}
                  onClick={() => setCashFlowPeriod(p)}
                  className={cn("rounded px-3 py-1 text-xs font-bold transition-colors", cashFlowPeriod === p ? "bg-white/10 text-white" : "text-slate-500 hover:text-white")}
                >
                  {p === "30days" ? "30d" : "3mo"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-white">
              ₱ {Math.abs(netCashFlow).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <span className={cn("text-xs font-bold", netCashFlow >= 0 ? "text-quaternary" : "text-secondary")}>
              {netCashFlow >= 0 ? "+ net inflow" : "− net outflow"}
            </span>
          </div>
          <div className="flex flex-col gap-3 mt-2">
            <div className="flex items-end justify-between gap-2 h-[140px]">
              {weeklyCashFlow.map((value: number, i: number) => {
                const color = barColors[i % barColors.length];
                const h = maxFlow > 0 ? Math.max((Math.abs(value) / maxFlow) * 100, 4) : 4;
                return (
                  <div key={i} className="group relative flex flex-1 flex-col items-center justify-end h-full">
                    <div
                      className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:flex rounded-lg border border-white/10 bg-[#1c1917] px-2 py-1 text-xs font-bold whitespace-nowrap z-10 shadow-xl"
                      style={{ color }}
                    >
                      {value >= 0 ? "+" : "-"}₱{Math.abs(value).toFixed(0)}
                    </div>
                    <div
                      className="w-full rounded-t-lg transition-all"
                      style={{ height: `${h}%`, background: `${color}30`, borderTop: `2px solid ${color}` }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between border-t border-white/6 pt-2">
              {periodLabels.map((l, i) => (
                <p key={i} className="flex-1 text-center text-[10px] font-bold uppercase text-slate-600">{l}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="flex flex-col gap-4 rounded-2xl border border-white/8 bg-[#292524] banig-xs p-6">
          <div>
            <p className="font-black text-white">Top Expenses</p>
            <p className="text-xs text-slate-500">Where your money goes</p>
          </div>
          <div className="flex flex-1 flex-col gap-4 mt-1">
            {catLoading ? (
              <div className="flex-1 flex items-center justify-center text-sm text-slate-500">Loading...</div>
            ) : categoryBreakdown.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-sm text-slate-500">No expenses yet</div>
            ) : categoryBreakdown.map((cat: { id: string; icon: string; name: string; amount: number; pct: number }, i: number) => (
              <div key={cat.id} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-white font-medium">
                    <span className="material-symbols-outlined text-[15px]" style={{ color: catColors[i % catColors.length] }}>{cat.icon}</span>
                    {cat.name}
                  </span>
                  <span className="font-bold text-white text-xs">₱{cat.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/5">
                  <div className="h-full rounded-full transition-all" style={{ width: `${cat.pct}%`, background: catColors[i % catColors.length] }} />
                </div>
              </div>
            ))}
          </div>
          <Link href="/transactions" className="mt-auto block rounded-xl border border-white/8 py-2 text-center text-xs font-bold uppercase tracking-wider text-slate-400 transition-all hover:border-primary/30 hover:text-primary">
            View All
          </Link>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 pb-4">

        {/* Recent Transactions */}
        <div className="flex flex-col gap-4 rounded-2xl border border-white/8 bg-[#292524] banig-xs p-6">
          <div className="flex items-center justify-between">
            <p className="font-black text-white">Recent Transactions</p>
            <Link href="/transactions" className="text-xs font-bold text-primary hover:underline">View all</Link>
          </div>
          {txLoading ? (
            <div className="flex flex-col gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-white/5 animate-pulse" />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="h-3 w-32 rounded bg-white/5 animate-pulse" />
                    <div className="h-2.5 w-20 rounded bg-white/5 animate-pulse" />
                  </div>
                  <div className="h-3 w-16 rounded bg-white/5 animate-pulse" />
                </div>
              ))}
            </div>
          ) : !transactions.length ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <span className="material-symbols-outlined text-4xl text-slate-600">receipt_long</span>
              <p className="text-sm text-slate-500">No transactions yet.</p>
              <button onClick={() => setIsModalOpen(true)} className="text-xs font-bold text-primary hover:underline">Add your first one</button>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {transactions.slice(0, 6).map((t: Transaction) => (
                <div key={t.id} className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-white/4">
                  <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", t.type === "income" ? "bg-quaternary/10" : "bg-secondary/10")}>
                    <span className={cn("material-symbols-outlined text-[18px]", t.type === "income" ? "text-quaternary" : "text-secondary")}>{t.category?.icon || "receipt"}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{t.category?.name || "Uncategorized"}</p>
                    <p className="truncate text-xs text-slate-500">{t.description || new Date(t.date).toLocaleDateString()}</p>
                  </div>
                  <p className={cn("shrink-0 text-sm font-black", t.type === "income" ? "text-quaternary" : "text-secondary")}>
                    {t.type === "income" ? "+" : "-"}₱{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Budget Goals */}
        <div className="flex flex-col gap-4 rounded-2xl border border-white/8 bg-[#292524] banig-xs p-6">
          <div className="flex items-center justify-between">
            <p className="font-black text-white">Budget Goals</p>
            <Link href="/budget" className="text-xs font-bold text-primary hover:underline">Manage</Link>
          </div>
          {budLoading ? (
            <div className="text-center text-sm text-slate-500 py-8">Loading...</div>
          ) : !budgets.length ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-8 text-center">
              <span className="material-symbols-outlined text-4xl text-slate-600">savings</span>
              <p className="text-sm text-slate-500">No budgets set yet.</p>
              <Link href="/budget">
                <button className="rounded-xl border border-white/8 px-4 py-2 text-xs font-bold text-slate-400 transition-all hover:border-primary/30 hover:text-primary">
                  Create Budget
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {budgets.slice(0, 4).map((budget: Budget) => {
                const spent = transactions
                  .filter((t: Transaction) => t.type === "expense" && t.categoryId === budget.categoryId)
                  .reduce((s: number, t: Transaction) => s + t.amount, 0);
                const goal = budget.amount;
                const pct  = Math.min((spent / goal) * 100, 100);
                const over = spent > goal;
                return (
                  <div key={budget.id} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-primary">{budget.category?.icon || "savings"}</span>
                        <p className="text-sm font-semibold text-white">{budget.category?.name || budget.name}</p>
                      </div>
                      <span className={cn("text-xs font-bold", over ? "text-secondary" : "text-primary")}>{Math.round(pct)}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/5">
                      <div className={cn("h-full rounded-full transition-all", over ? "bg-secondary" : "bg-primary")} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>₱{spent.toLocaleString(undefined, { maximumFractionDigits: 0 })} spent</span>
                      <span>₱{goal.toLocaleString(undefined, { maximumFractionDigits: 0 })} limit</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSubmitError(""); }}
        title="Add Transaction"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handleCreateTransaction as unknown as () => void} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateTransaction} className="flex flex-col gap-4">
          {submitError && (
            <div className="flex items-center gap-2 rounded-xl bg-secondary/10 border border-secondary/20 px-4 py-3 text-sm text-secondary">
              <span className="material-symbols-outlined text-base">error</span>
              {submitError}
            </div>
          )}
          <Input label="Amount" type="number" placeholder="0.00" prefix="₱" size="lg" value={newTx.amount} onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })} required />
          <Select label="Type" value={newTx.type} onChange={(e) => setNewTx({ ...newTx, type: e.target.value, categoryId: "" })} options={[{ value: "expense", label: "Expense" }, { value: "income", label: "Income" }]} icon="swap_vert" />
          <Select
            label="Category"
            value={newTx.categoryId}
            onChange={(e) => setNewTx({ ...newTx, categoryId: e.target.value })}
            options={categories.filter((c: { type: string }) => c.type === newTx.type).map((c: { id: string; name: string }) => ({ value: c.id, label: c.name }))}
            icon="category"
            required
          />
          <Input label="Description" placeholder="What was this for?" value={newTx.description} onChange={(e) => setNewTx({ ...newTx, description: e.target.value })} />
          <Input label="Date" type="date" value={newTx.date} onChange={(e) => setNewTx({ ...newTx, date: e.target.value })} />
        </form>
      </Modal>
    </div>
  );
}
