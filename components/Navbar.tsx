import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#1c1917]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-500 shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-xl text-stone-900">savings</span>
          </div>
          <span className="text-lg font-black tracking-tight text-white">
            Ipon<span className="text-primary">Pinoy</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="/#features" className="text-sm font-semibold text-slate-400 transition-colors hover:text-white">Features</a>
          <a href="/#how" className="text-sm font-semibold text-slate-400 transition-colors hover:text-white">How it works</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <button className="hidden h-9 items-center rounded-full border border-white/10 px-5 text-sm font-bold text-slate-300 transition-all hover:border-primary/50 hover:text-primary md:flex">
              Log in
            </button>
          </Link>
          <Link href="/login">
            <button className="flex h-9 items-center rounded-full bg-primary px-5 text-sm font-black text-stone-900 shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover">
              Get started free
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
