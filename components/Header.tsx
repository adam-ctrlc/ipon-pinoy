"use client";
import Link from "next/link";
import Button from "@/components/common/Button";

interface HeaderProps {
  variant?: "landing" | "public" | "dashboard";
}

export default function Header({ variant = "dashboard" }: HeaderProps) {
  if (variant === "landing") {
    return (
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-border-dark bg-[#0F172A]/90 backdrop-blur-md px-6 md:px-10 py-4">
        <Link href="/" className="flex items-center gap-4 text-white">
          <div className="size-10 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-500 text-background-dark shadow-lg shadow-yellow-500/20">
            <span className="material-symbols-outlined text-2xl">savings</span>
          </div>
          <h2 className="text-white text-xl font-bold leading-tight tracking-tight">
            Ipon<span className="text-primary">Pinoy</span>
          </h2>
        </Link>
        <div className="flex flex-1 justify-end gap-8">
          <div className="hidden lg:flex items-center gap-9">
            <a className="text-slate-300 text-sm font-semibold hover:text-primary transition-colors" href="#features">Features</a>
            <a className="text-slate-300 text-sm font-semibold hover:text-primary transition-colors" href="#pricing">Pricing (Free)</a>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <button className="hidden md:flex items-center justify-center rounded-full h-10 px-6 bg-transparent border border-border-dark hover:border-primary hover:text-primary transition-all text-white text-sm font-bold">
                Log In
              </button>
            </Link>
            <Link href="/login">
              <Button variant="primary" className="h-10 px-6 rounded-full text-sm font-extrabold text-slate-900">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-border-dark bg-background-dark/95 backdrop-blur-md px-4 md:px-10 py-3 textile-texture">
      <div className="flex items-center gap-4 text-white">
        <div className="size-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 text-primary">
          <span className="material-symbols-outlined text-3xl text-primary">account_balance_wallet</span>
        </div>
        <div className="flex flex-col">
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">KuwartaTrack</h2>
          <span className="text-[10px] text-text-muted uppercase tracking-widest font-medium">Pinoy Finance</span>
        </div>
      </div>
    </header>
  );
}
