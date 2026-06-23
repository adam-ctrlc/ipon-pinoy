"use client";
import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getUserInitial, getDisplayName } from "@/utils/user";
import { useAuth } from "@/hooks/useAuth";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { to: "/dashboard",    icon: "dashboard",     label: "Dashboard" },
  { to: "/transactions", icon: "receipt_long",  label: "Transactions" },
  { to: "/budget",       icon: "savings",       label: "Budget" },
  { to: "/reports",      icon: "bar_chart",     label: "Reports" },
  { to: "/categories",   icon: "category",      label: "Categories" },
];

function NavItem({ to, icon, label, isActive }: { to: string; icon: string; label: string; isActive: boolean }) {
  return (
    <Link href={to} className="w-full">
      <div className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group",
        isActive
          ? "bg-primary/10 border border-primary/20 text-primary"
          : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
      )}>
        <span className={cn(
          "material-symbols-outlined text-[20px]",
          isActive ? "text-primary" : "text-slate-500 group-hover:text-white"
        )}>
          {icon}
        </span>
        <span className={cn("text-sm font-bold tracking-wide", isActive ? "text-primary" : "")}>{label}</span>
      </div>
    </Link>
  );
}

function LogoutModal({ onConfirm, onCancel, isLoading }: { onConfirm: () => void; onCancel: () => void; isLoading: boolean }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-2xl border border-white/8 bg-[#292524] banig-xs shadow-2xl shadow-black/60 overflow-hidden">
        <div className="flex flex-col items-center gap-4 px-8 py-8 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary/10">
            <span className="material-symbols-outlined text-3xl text-secondary">logout</span>
          </div>
          <div>
            <p className="text-lg font-black text-white">Sign out?</p>
            <p className="mt-1 text-sm text-slate-500">Your <span className="text-primary font-semibold">ipon</span> will be here when you come back.</p>
          </div>
        </div>
        <div className="flex gap-3 border-t border-white/6 bg-black/20 px-6 py-4">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-white/8 py-2.5 text-sm font-bold text-slate-400 transition-all hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 rounded-xl bg-secondary py-2.5 text-sm font-black text-white shadow-lg shadow-secondary/20 transition-all hover:bg-secondary/80 disabled:opacity-50"
          >
            {isLoading ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user } = useAuth();

  useEffect(() => { setIsOpen(false); }, [pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#1c1917] banig-xs">
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-white/6 bg-[#1c1917] transition-transform duration-300 ease-in-out lg:sticky",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-white/6">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-500 shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-xl text-stone-900">savings</span>
            </div>
            <p className="text-base font-black text-white">Ipon<span className="text-primary">Pinoy</span></p>
          </Link>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">Menu</p>
          {navLinks.map((link) => (
            <NavItem key={link.to} {...link} isActive={pathname === link.to} />
          ))}
          <div className="my-3 border-t border-white/6 mx-2" />
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">Account</p>
          <NavItem to="/profile" icon="manage_accounts" label="My Profile" isActive={pathname === "/profile"} />
        </div>

        {/* User card */}
        <div className="p-3 border-t border-white/6">
          <button
            onClick={() => setIsLogoutOpen(true)}
            className="group flex w-full items-center gap-3 rounded-xl border border-white/6 bg-white/3 p-3 text-left transition-all hover:border-secondary/30 hover:bg-secondary/5"
          >
            {user?.profileImage ? (
              <img src={user.profileImage} alt="" className="size-9 rounded-full border border-white/10 object-cover shrink-0" />
            ) : (
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-500 text-base font-black text-stone-900">
                {getUserInitial(user)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-bold text-white group-hover:text-secondary transition-colors">{getDisplayName(user)}</p>
              <p className="truncate text-[11px] text-slate-500">{user?.email}</p>
            </div>
            <span className="material-symbols-outlined text-lg text-slate-600 group-hover:text-secondary transition-colors shrink-0">logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex flex-1 flex-col min-h-screen overflow-hidden">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/6 bg-[#1c1917]/95 backdrop-blur-xl px-4 py-3 lg:hidden">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-orange-500">
              <span className="material-symbols-outlined text-lg text-stone-900">savings</span>
            </div>
            <span className="font-black text-white">Ipon<span className="text-primary">Pinoy</span></span>
          </Link>
          <button onClick={() => setIsOpen(true)} className="text-slate-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>

      {/* Logout confirmation */}
      {isLogoutOpen && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setIsLogoutOpen(false)}
          isLoading={isLoggingOut}
        />
      )}
    </div>
  );
}
