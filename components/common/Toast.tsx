"use client";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import type { Toast, ToastType } from "@/hooks/useToast";

const icons: Record<ToastType, string> = {
  success: "check_circle",
  error:   "error",
  info:    "info",
};

const colors: Record<ToastType, string> = {
  success: "text-quaternary border-quaternary/20 bg-quaternary/10",
  error:   "text-secondary border-secondary/20 bg-secondary/10",
  info:    "text-tertiary border-tertiary/20 bg-tertiary/10",
};

interface ToastListProps {
  toasts: Toast[];
  dismiss: (id: string) => void;
}

export default function ToastList({ toasts, dismiss }: ToastListProps) {
  if (!toasts.length) return null;
  return createPortal(
    <div className="fixed bottom-6 right-6 z-[300] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl shadow-black/40 backdrop-blur-sm font-display text-sm font-semibold min-w-[240px] max-w-[340px] animate-in slide-in-from-right-4 fade-in duration-200",
            "bg-[#292524]/95",
            colors[t.type]
          )}
        >
          <span className={cn("material-symbols-outlined text-xl shrink-0")}>{icons[t.type]}</span>
          <span className="flex-1 text-white">{t.message}</span>
          <button onClick={() => dismiss(t.id)} className="shrink-0 text-slate-500 hover:text-white transition-colors ml-1">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
}
