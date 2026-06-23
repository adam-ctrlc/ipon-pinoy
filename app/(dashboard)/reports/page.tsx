"use client";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { downloadCSV } from "@/utils/csv";
import { parsePHP } from "@/utils/currency";
import { toMonthKey, currentMonthKey, monthLabel, shortMonthLabel } from "@/utils/date";
import { useAuth } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/useTransactions";
import ExportMenu from "@/components/common/ExportMenu";
import type { Transaction } from "@/types";

export default function ReportsPage() {
  const { user } = useAuth();
  const userId = user?.id;
  const { transactions, isLoading } = useTransactions(userId ? { userId } : {});
  const [selectedMonth, setSelectedMonth] = useState(() => currentMonthKey());

  const monthTx = useMemo(() => transactions.filter((t: Transaction) =>
    toMonthKey(t.date) === selectedMonth
  ), [transactions, selectedMonth]);

  const totalIncome  = monthTx.filter((t: Transaction) => t.type === "income") .reduce((s: number, t: Transaction) => s + t.amount, 0);
  const totalExpense = monthTx.filter((t: Transaction) => t.type === "expense").reduce((s: number, t: Transaction) => s + t.amount, 0);
  const netSavings   = totalIncome - totalExpense;

  const topExpenses = useMemo(() => {
    const totals: Record<string, { name: string; icon: string; color: string; amount: number }> = {};
    monthTx.filter((t: Transaction) => t.type === "expense").forEach((t: Transaction) => {
      const c = t.category;
      if (!totals[t.categoryId]) totals[t.categoryId] = { name: c?.name || "Unknown", icon: c?.icon || "category", color: c?.color || "#a8a29e", amount: 0 };
      totals[t.categoryId].amount += t.amount;
    });
    return Object.values(totals).sort((a, b) => b.amount - a.amount).slice(0, 8);
  }, [monthTx]);

  const maxTopAmount = Math.max(...topExpenses.map(c => c.amount), 1);

  const monthlyTrend = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i);
      const key = toMonthKey(d);
      const label = shortMonthLabel(d);
      const inc = transactions.filter((t: Transaction) => t.type === "income"  && toMonthKey(t.date) === key).reduce((s: number, t: Transaction) => s + parsePHP(t.amount), 0);
      const exp = transactions.filter((t: Transaction) => t.type === "expense" && toMonthKey(t.date) === key).reduce((s: number, t: Transaction) => s + parsePHP(t.amount), 0);
      months.push({ key, label, income: inc, expense: exp });
    }
    return months;
  }, [transactions]);

  const maxTrend = Math.max(...monthlyTrend.flatMap(m => [m.income, m.expense]), 1);

  const exportRows = () => monthTx.map((t: Transaction) => [
    new Date(t.date).toLocaleDateString(), t.type, t.category?.name || "", t.description || "", parsePHP(t.amount).toFixed(2),
  ]);
  const exportHeaders = ["Date", "Type", "Category", "Description", "Amount"];

  const handleExportCSV = () => {
    downloadCSV(`report-${selectedMonth}.csv`, [exportHeaders, ...exportRows()]);
  };

  const handleExportXLSX = async () => {
    const XLSX = await import("xlsx");
    const ws = XLSX.utils.aoa_to_sheet([exportHeaders, ...exportRows()]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `report-${selectedMonth}.xlsx`);
  };

  const handleExportPDF = async () => {
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
    const doc = new jsPDF();
    doc.setFontSize(16); doc.text(`Finance Report: ${selectedMonth}`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Income: ₱${totalIncome.toFixed(2)}   Expenses: ₱${totalExpense.toFixed(2)}   Net: ₱${netSavings.toFixed(2)}`, 14, 30);
    autoTable(doc, {
      startY: 40,
      head: [exportHeaders],
      body: exportRows(),
      styles: { fontSize: 9 },
    });
    doc.save(`report-${selectedMonth}.pdf`);
  };

  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 font-display text-white min-h-full">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-black text-white md:text-3xl">Reports</h1>
          <p className="text-sm text-slate-500">Analyze your <span className="text-primary font-semibold">financial health</span>.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            id="report-month"
            name="report-month"
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="h-10 rounded-xl border border-white/8 bg-[#292524] px-4 text-sm text-white outline-none focus:border-primary/40 transition-colors [color-scheme:dark]"
          />
          <ExportMenu onCSV={handleExportCSV} onXLSX={handleExportXLSX} onPDF={handleExportPDF} disabled={monthTx.length === 0} />
        </div>
      </div>

      {/* Summary chips */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Income",   value: totalIncome,  color: "#10b981", icon: "trending_up" },
          { label: "Total Expenses", value: totalExpense, color: "#f43f5e", icon: "trending_down" },
          { label: "Net Savings",    value: netSavings,   color: netSavings >= 0 ? "#fbbf24" : "#f43f5e", icon: "savings" },
          { label: "Savings Rate",   value: null,         color: savingsRate >= 20 ? "#10b981" : savingsRate >= 0 ? "#fbbf24" : "#f43f5e", icon: "percent" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/8 bg-[#292524] banig-xs p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-lg" style={{ color: s.color }}>{s.icon}</span>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{s.label}</p>
            </div>
            {isLoading ? (
              <div className="h-6 w-28 animate-pulse rounded-lg bg-white/5" />
            ) : (
            <p className="text-xl font-black" style={{ color: s.color }}>
              {s.value !== null ? `₱${Math.abs(s.value).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : `${savingsRate}%`}
            </p>
            )}
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5">

        {/* 6-Month Trend */}
        <div className="rounded-2xl border border-white/8 bg-[#292524] banig-xs p-6">
          <p className="font-bold text-white mb-5">6-Month Trend</p>
          {isLoading ? (
            <div className="flex items-end justify-between h-[180px] gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="flex items-end gap-0.5 w-full justify-center" style={{ height: 155 }}>
                    <div className="flex-1 rounded-t-md bg-white/5 animate-pulse" style={{ height: 40 + i * 15 }} />
                    <div className="flex-1 rounded-t-md bg-white/5 animate-pulse" style={{ height: 25 + i * 10 }} />
                  </div>
                  <div className="h-2.5 w-6 rounded bg-white/5 animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-end justify-between h-[180px] gap-2">
              {monthlyTrend.map((m) => {
                const incH = (m.income / maxTrend) * 150;
                const expH = (m.expense / maxTrend) * 150;
                return (
                  <div key={m.key} className="flex-1 flex flex-col items-center gap-1">
                    <div className="flex items-end gap-0.5 w-full justify-center" style={{ height: 155 }}>
                      <div className="flex-1 rounded-t-md bg-quaternary/40 transition-all" style={{ height: incH || 2 }} title={`Income: ₱${m.income.toFixed(0)}`} />
                      <div className="flex-1 rounded-t-md bg-secondary/40 transition-all" style={{ height: expH || 2 }} title={`Expenses: ₱${m.expense.toFixed(0)}`} />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500">{m.label}</p>
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex gap-5 mt-4 border-t border-white/5 pt-4">
            <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-sm bg-quaternary/40" /><span className="text-xs text-slate-500">Income</span></div>
            <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-sm bg-secondary/40" /><span className="text-xs text-slate-500">Expenses</span></div>
          </div>
        </div>

        {/* Top Expenses */}
        <div className="rounded-2xl border border-white/8 bg-[#292524] banig-xs p-6">
          <p className="font-bold text-white mb-5">Top Expenses: {monthLabel(selectedMonth)}</p>
          {isLoading ? (
            <div className="flex flex-col gap-4">
              {[...Array(5)].map((_, i) => <div key={i} className="h-8 rounded-lg bg-white/5 animate-pulse" />)}
            </div>
          ) : topExpenses.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <span className="material-symbols-outlined text-4xl text-slate-600">bar_chart</span>
              <p className="text-sm text-slate-500">No expenses this month.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {topExpenses.map((c) => (
                <div key={c.name} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-white">
                      <span className="material-symbols-outlined text-[15px]" style={{ color: c.color }}>{c.icon}</span>
                      {c.name}
                    </span>
                    <span className="font-black text-secondary text-xs">₱{c.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/5">
                    <div className="h-full rounded-full transition-all" style={{ width: `${(c.amount / maxTopAmount) * 100}%`, background: c.color }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transaction table */}
      <div className="rounded-2xl border border-white/8 bg-[#292524] banig-xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
          <p className="font-bold text-white">All Transactions: {monthLabel(selectedMonth)}</p>
          <span className="text-xs text-slate-500">{monthTx.length} transaction{monthTx.length !== 1 ? "s" : ""}</span>
        </div>
        {isLoading ? (
          <div className="divide-y divide-white/5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                <div className="size-9 shrink-0 rounded-xl bg-white/5 animate-pulse" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-3 w-32 rounded bg-white/5 animate-pulse" />
                  <div className="h-2.5 w-20 rounded bg-white/5 animate-pulse" />
                </div>
                <div className="h-3 w-16 rounded bg-white/5 animate-pulse" />
              </div>
            ))}
          </div>
        ) : monthTx.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-600">receipt_long</span>
            <p className="text-sm text-slate-500">No transactions for this month.</p>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto divide-y divide-white/5">
            {monthTx.map((t: Transaction) => (
              <div key={t.id} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/3">
                <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", t.type === "income" ? "bg-quaternary/10" : "bg-secondary/10")}>
                  <span className={cn("material-symbols-outlined text-[18px]", t.type === "income" ? "text-quaternary" : "text-secondary")}>{t.category?.icon || "receipt"}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{t.category?.name || "Uncategorized"}</p>
                  <p className="text-xs text-slate-500">{new Date(t.date).toLocaleDateString()}{t.description ? ` · ${t.description}` : ""}</p>
                </div>
                <p className={cn("shrink-0 font-black text-sm", t.type === "income" ? "text-quaternary" : "text-secondary")}>
                  {t.type === "income" ? "+" : "-"}₱{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
