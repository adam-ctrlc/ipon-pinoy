"use client";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ExportMenuProps {
  onCSV: () => void;
  onXLSX: () => void;
  onPDF: () => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export default function ExportMenu({ onCSV, onXLSX, onPDF, label = "Export", disabled = false, className }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", handler); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const options = [
    { icon: "table_view",      label: "CSV",  sub: "Spreadsheet",  action: onCSV  },
    { icon: "grid_on",         label: "XLSX", sub: "Excel",         action: onXLSX },
    { icon: "picture_as_pdf",  label: "PDF",  sub: "Document",      action: onPDF  },
  ];

  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all",
          disabled
            ? "border-white/4 bg-white/2 text-slate-600 cursor-not-allowed"
            : "border-white/8 bg-white/4 text-slate-300 hover:border-white/15 hover:text-white"
        )}
      >
        <span className="material-symbols-outlined text-[18px]">download</span>
        {label}
        <span className={cn("material-symbols-outlined text-[15px] transition-transform duration-150", open && "rotate-180")}>
          expand_more
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-white/10 bg-[#292524] shadow-2xl shadow-black/50">
          {options.map((o) => (
            <button
              key={o.label}
              onClick={() => { o.action(); setOpen(false); }}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/6"
            >
              <span className="material-symbols-outlined text-[18px] text-slate-400">{o.icon}</span>
              <div>
                <p className="text-xs font-bold text-white">{o.label}</p>
                <p className="text-[10px] text-slate-500">{o.sub}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
