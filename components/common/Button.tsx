"use client";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "success";
}

export default function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  const variants = {
    primary: "bg-primary hover:bg-primary-hover text-surface-dark shadow-yellow-500/20",
    secondary: "bg-secondary hover:bg-rose-600 text-white shadow-rose-500/20",
    outline: "bg-transparent border border-border-dark hover:border-primary hover:text-primary text-white",
    ghost: "bg-transparent text-text-muted hover:text-white hover:bg-white/5",
    success: "bg-gradient-to-r from-quaternary to-emerald-600 hover:to-emerald-500 text-white shadow-emerald-600/30",
  };

  return (
    <button
      className={cn(
        "flex items-center justify-center rounded-xl font-bold transition-all shadow-lg active:scale-[0.98] cursor-pointer px-4 py-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
