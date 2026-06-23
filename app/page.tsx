import Link from "next/link";
import Navbar from "@/components/Navbar";

function DashboardMockup() {
  return (
    <div className="relative flex justify-center lg:justify-end">
      {/* Glow */}
      <div className="absolute -inset-8 rounded-[50px] bg-gradient-to-br from-primary/15 via-transparent to-secondary/10 blur-3xl" />

      {/* Floating cards */}
      <div className="absolute -left-4 top-16 hidden lg:block z-20 animate-float-slow">
        <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#292524]/90 backdrop-blur-sm px-4 py-3 shadow-xl">
          <div className="flex size-8 items-center justify-center rounded-xl bg-quaternary/15">
            <span className="material-symbols-outlined text-sm text-quaternary">work</span>
          </div>
          <div>
            <p className="text-[10px] text-slate-500">Sweldo</p>
            <p className="text-sm font-black text-quaternary">+₱21,250</p>
          </div>
        </div>
      </div>

      <div className="absolute -left-8 bottom-28 hidden lg:block z-20 animate-float">
        <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#292524]/90 backdrop-blur-sm px-4 py-3 shadow-xl">
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary/15">
            <span className="material-symbols-outlined text-sm text-primary">savings</span>
          </div>
          <div>
            <p className="text-[10px] text-slate-500">This month</p>
            <p className="text-sm font-black text-primary">₱24.2k saved</p>
          </div>
        </div>
      </div>

      <div className="absolute -right-4 top-32 hidden lg:block z-20 animate-float-slow" style={{ animationDelay: "1s" }}>
        <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#292524]/90 backdrop-blur-sm px-4 py-3 shadow-xl">
          <div className="flex size-8 items-center justify-center rounded-xl bg-secondary/15">
            <span className="material-symbols-outlined text-sm text-secondary">restaurant</span>
          </div>
          <div>
            <p className="text-[10px] text-slate-500">Jollibee</p>
            <p className="text-sm font-black text-secondary">-₱185</p>
          </div>
        </div>
      </div>

      <div className="absolute -right-2 bottom-20 hidden lg:block z-20 animate-float" style={{ animationDelay: "0.5s" }}>
        <div className="rounded-2xl border border-primary/20 bg-primary/10 backdrop-blur-sm px-4 py-3 shadow-xl">
          <p className="text-[10px] text-slate-500 mb-0.5">Budget safe</p>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
            <p className="text-sm font-black text-primary">68% used</p>
          </div>
        </div>
      </div>

      {/* Phone shell */}
      <div className="relative w-[300px] rounded-[44px] border-[6px] border-white/10 bg-[#0a0a0a] p-2 shadow-2xl shadow-black/60">
        <div className="absolute left-1/2 top-3 -translate-x-1/2 flex items-center gap-1.5 z-10">
          <div className="h-2 w-2 rounded-full bg-black border border-white/10" />
          <div className="h-2.5 w-14 rounded-full bg-black border border-white/10" />
        </div>
        <div className="overflow-hidden rounded-[38px] bg-[#1c1917]">
          <div className="flex items-center justify-between px-5 pt-6 pb-2">
            <span className="text-[10px] font-bold text-white">9:41</span>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px] text-white">signal_cellular_alt</span>
              <span className="material-symbols-outlined text-[12px] text-white">wifi</span>
              <span className="material-symbols-outlined text-[12px] text-white">battery_5_bar</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 px-3 pb-6">
            <div className="flex items-center justify-between px-1 py-1">
              <div>
                <p className="text-[10px] text-slate-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[11px] text-primary">wb_sunny</span>
                  Magandang umaga
                </p>
                <p className="text-sm font-black text-white">IponPinoy</p>
              </div>
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                <span className="material-symbols-outlined text-sm text-primary">account_circle</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: "Income", value: "₱42.5k", color: "text-quaternary", bg: "bg-quaternary/10", icon: "trending_up" },
                { label: "Expenses", value: "₱18.3k", color: "text-secondary", bg: "bg-secondary/10", icon: "trending_down" },
                { label: "Savings", value: "₱24.2k", color: "text-primary", bg: "bg-primary/10", icon: "savings" },
              ].map((s) => (
                <div key={s.label} className={`rounded-xl ${s.bg} border border-white/5 p-2`}>
                  <span className={`material-symbols-outlined text-xs ${s.color}`}>{s.icon}</span>
                  <p className={`text-[11px] font-black ${s.color} mt-0.5`}>{s.value}</p>
                  <p className="text-[9px] text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-white/5 bg-[#292524] p-3">
              <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-slate-500">Budget Overview</p>
              <div className="flex flex-col gap-2">
                {[
                  { name: "Pagkain", pct: 68, color: "bg-primary", spent: "₱3,400", budget: "₱5,000" },
                  { name: "Transpo", pct: 45, color: "bg-tertiary", spent: "₱900", budget: "₱2,000" },
                  { name: "Libangan", pct: 89, color: "bg-secondary", spent: "₱2,225", budget: "₱2,500" },
                ].map((b) => (
                  <div key={b.name}>
                    <div className="mb-0.5 flex justify-between">
                      <span className="text-[10px] font-semibold text-white">{b.name}</span>
                      <span className="text-[9px] text-slate-500">{b.spent} / {b.budget}</span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-white/5">
                      <div className={`h-full rounded-full ${b.color}`} style={{ width: `${b.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 px-1 text-[9px] font-bold uppercase tracking-wider text-slate-500">Recent Transactions</p>
              <div className="flex flex-col gap-0.5">
                {[
                  { icon: "restaurant", label: "Jollibee", amount: "-₱185", type: "expense", cat: "Pagkain" },
                  { icon: "directions_bus", label: "Jeepney", amount: "-₱15", type: "expense", cat: "Transpo" },
                  { icon: "work", label: "Sweldo", amount: "+₱21,250", type: "income", cat: "Income" },
                ].map((t) => (
                  <div key={t.label} className="flex items-center gap-2 rounded-lg px-2 py-1.5">
                    <div className={`flex size-6 shrink-0 items-center justify-center rounded-lg ${t.type === "income" ? "bg-quaternary/10" : "bg-secondary/10"}`}>
                      <span className={`material-symbols-outlined text-xs ${t.type === "income" ? "text-quaternary" : "text-secondary"}`}>{t.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-white leading-tight">{t.label}</p>
                      <p className="text-[9px] text-slate-500">{t.cat}</p>
                    </div>
                    <span className={`text-[11px] font-black shrink-0 ${t.type === "income" ? "text-quaternary" : "text-secondary"}`}>{t.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center pt-2 pb-1">
          <div className="h-1 w-20 rounded-full bg-white/20" />
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden px-6 pb-12 pt-12 md:pb-24 md:pt-20 md:px-10 lg:pt-28">
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-primary/8 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-secondary/6 blur-[100px]" />
      <div className="relative mx-auto flex max-w-[1200px] flex-col items-center gap-16 lg:flex-row lg:gap-12">
        <div className="flex flex-col items-center gap-6 text-center lg:w-1/2 lg:items-start lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Gawang Pinoy</span>
          </div>
          <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl xl:text-7xl">
            Ang ipon partner ng{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
                bawat Pilipino.
              </span>
            </span>
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-slate-400">
            Track your <span className="font-bold text-white">₱ piso</span>, set budgets, avoid{" "}
            <span className="font-bold italic text-secondary">petsa de peligro</span>, and finally see where your{" "}
            <span className="font-bold text-white">sweldo</span> actually goes.
          </p>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:w-auto">
            <Link href="/login">
              <button className="flex h-13 items-center justify-center gap-2 rounded-full bg-primary px-8 text-base font-black text-stone-900 shadow-xl shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto">
                Simulan na, Libre!
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </Link>
            <a href="#features">
              <button className="flex h-13 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 text-base font-bold text-white transition-all hover:border-white/20 hover:bg-white/10 w-full sm:w-auto">
                See features
              </button>
            </a>
          </div>
          <p className="flex items-center gap-2 text-sm text-slate-500">
            <span className="material-symbols-outlined text-base text-quaternary">check_circle</span>
            No credit card. No hidden charges. Forever free.
          </p>
        </div>
        <div className="w-full lg:w-1/2">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}

function StatsStrip() {
  const stats = [
    { value: "100%", label: "Libre, forever", icon: "verified" },
    { value: "₱ PHP", label: "Philippine Peso first", icon: "currency_exchange" },
    { value: "Secure", label: "Bcrypt-hashed passwords", icon: "lock" },
    { value: "CSV + PDF", label: "Export anytime", icon: "download" },
  ];
  return (
    <section className="w-full border-y border-white/5 bg-[#292524]/60 banig-sm px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col divide-y divide-white/5 sm:flex-row sm:divide-x sm:divide-y-0">
        {stats.map((s) => (
          <div key={s.value} className="flex flex-1 items-center gap-4 px-6 py-6">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <span className="material-symbols-outlined text-xl text-primary">{s.icon}</span>
            </div>
            <div>
              <p className="text-lg font-black text-white">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProblemSection() {
  const pains = [
    { icon: "sentiment_very_dissatisfied", text: "Sweldo pa lang, ubos na agad.", sub: "Parang nawawala lang ang pera." },
    { icon: "calendar_today", text: "Petsa de peligro every 25th.", sub: "Lagi kang nagda-dash bago dumating ang sahod." },
    { icon: "help", text: "Saan ba napupunta ang pera ko?", sub: "Hindi mo alam kung saan pumupunta ang ₱500 mo araw-araw." },
    { icon: "trending_down", text: "Walang naiiipon kahit gusto mo.", sub: "Lagi na lang 'susunod na buwan na' ang plano." },
  ];

  return (
    <section className="w-full px-6 py-12 md:py-24 md:px-10">
      <div className="mx-auto max-w-[1200px] flex flex-col gap-8 md:gap-14">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="rounded-full border border-secondary/25 bg-secondary/8 px-4 py-1 text-xs font-bold uppercase tracking-widest text-secondary">Pamilyar?</span>
          <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            Ito ba ang nangyayari<br />
            <span className="bg-gradient-to-r from-secondary to-rose-400 bg-clip-text text-transparent">sa iyong buhay-pera?</span>
          </h2>
          <p className="max-w-lg text-lg text-slate-400">Hindi ka nag-iisa. Ito ang pinakakaraniwang problema ng mga Pilipinong nagtatrabaho.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {pains.map((p) => (
            <div key={p.text} className="flex items-start gap-4 rounded-2xl border border-secondary/10 bg-secondary/5 p-6">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
                <span className="material-symbols-outlined text-xl text-secondary">{p.icon}</span>
              </div>
              <div>
                <p className="font-bold text-white">{p.text}</p>
                <p className="text-sm text-slate-500 mt-0.5">{p.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 rounded-3xl border border-primary/20 bg-primary/5 banig-xs p-6 md:p-10 text-center">
          <span className="material-symbols-outlined text-5xl text-primary">lightbulb</span>
          <p className="text-2xl font-black text-white">Ang solusyon? <span className="text-primary">Alamin kung saan pumupunta ang pera mo.</span></p>
          <p className="text-slate-400 max-w-md">Hindi kailangan ng spreadsheet. Hindi kailangan ng accountant. IponPinoy lang.</p>
          <Link href="/login">
            <button className="mt-2 flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-black text-stone-900 shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:scale-[1.02]">
              Subukan nang libre
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { icon: "receipt_long", title: "Track Every Gastos", desc: "Add what you spent or earned in seconds. Pick a category, write a note, set the date; that's it.", color: "from-primary/20 to-orange-500/10", iconColor: "text-primary" },
    { icon: "savings", title: "Tipid Mode Budgets", desc: "Set a spending limit per category. IponPinoy shows you a progress bar so you know before you go overboard.", color: "from-quaternary/20 to-emerald-500/10", iconColor: "text-quaternary" },
    { icon: "bar_chart", title: "See the Bigger Picture", desc: "Find out where your money actually goes each month. Spot your biggest expenses at a glance.", color: "from-tertiary/20 to-sky-500/10", iconColor: "text-tertiary" },
    { icon: "category", title: "Ready-Made Categories", desc: "Start with 12 Pinoy-friendly categories like Pagkain, Transpo, and Kuryente. Add your own whenever.", color: "from-violet-500/20 to-purple-500/10", iconColor: "text-violet-400" },
    { icon: "picture_as_pdf", title: "Save & Share Anytime", desc: "Download your monthly summary as a file or printable PDF. Great for budgeting with your partner or family.", color: "from-secondary/20 to-rose-500/10", iconColor: "text-secondary" },
    { icon: "lock", title: "Your Finances Stay Private", desc: "Only you can see your money data. No one else can access your account, and your password is never stored as plain text.", color: "from-amber-500/20 to-yellow-500/10", iconColor: "text-amber-400" },
  ];

  return (
    <section id="features" className="w-full px-6 py-12 md:py-24 md:px-10">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-14">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="rounded-full border border-primary/25 bg-primary/8 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary">Features</span>
          <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            Lahat ng kailangan mo para<br />
            <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">mag-ipon nang matalino.</span>
          </h2>
          <p className="max-w-lg text-lg text-slate-400">Built specifically for Filipino finances; no overcomplicated spreadsheets, no foreign currency confusion.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group relative overflow-hidden rounded-2xl border border-white/8 bg-[#292524] banig-xs p-6 transition-all hover:border-white/15 hover:-translate-y-0.5">
              <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 transition-opacity group-hover:opacity-100`} />
              <div className="relative flex flex-col gap-4">
                <div className="flex size-11 items-center justify-center rounded-xl border border-white/8 bg-[#1c1917]">
                  <span className={`material-symbols-outlined text-2xl ${f.iconColor}`}>{f.icon}</span>
                </div>
                <div>
                  <h3 className="mb-1.5 text-base font-bold text-white">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { n: "01", icon: "person_add", title: "Mag-sign up, libre!", desc: "Create your account in under 30 seconds. No credit card, no verification email needed." },
    { n: "02", icon: "add_circle", title: "I-log ang iyong kita at gastos", desc: "Add transactions with amount, category, and date. Your 12 default categories are ready on signup." },
    { n: "03", icon: "insights", title: "Panoorin ang iyong ipon lumaki", desc: "Check your dashboard daily. Set budgets, read reports, and export whenever you need." },
  ];

  return (
    <section id="how" className="w-full px-6 py-12 md:py-24 md:px-10">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-14">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="rounded-full border border-primary/25 bg-primary/8 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary">How it works</span>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">Tatlong hakbang lang.</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.n} className="relative flex flex-col gap-5 rounded-2xl border border-white/8 bg-[#292524] banig-xs p-7 overflow-visible">
              {i < steps.length - 1 && (
                <>
                  <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 md:block z-10 pointer-events-none">
                    <span className="material-symbols-outlined leading-none text-primary/60 drop-shadow-[0_0_24px_rgba(251,191,36,0.3)]" style={{ fontSize: "120px" }}>arrow_forward</span>
                  </div>
                  <div className="absolute bottom-0 left-1/2 block -translate-x-1/2 translate-y-1/2 md:hidden z-10 pointer-events-none">
                    <span className="material-symbols-outlined leading-none text-primary/60 drop-shadow-[0_0_24px_rgba(251,191,36,0.3)]" style={{ fontSize: "96px" }}>arrow_downward</span>
                  </div>
                </>
              )}
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-primary/20 leading-none">{s.n}</span>
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                  <span className="material-symbols-outlined text-2xl text-primary">{s.icon}</span>
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-bold text-white">{s.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Hindi na ako nagugulat sa petsa de peligro. Alam ko na kung saan pumupunta ang pera ko every month.",
      name: "Maria Santos",
      role: "Nurse, Quezon City",
      initials: "MS",
      color: "from-primary to-orange-500",
    },
    {
      quote: "Nag-set ako ng budget para sa Pagkain at Transpo. Nakatipid ako ng ₱3,000 ngayong buwan! Totoo!",
      name: "Jomar Reyes",
      role: "BPO Agent, Pasig",
      initials: "JR",
      color: "from-tertiary to-sky-500",
    },
    {
      quote: "Simple lang gamitin. Hindi siya katulad ng ibang apps na puro settings pa bago ka makapagsimula.",
      name: "Analiza Cruz",
      role: "Teacher, Cebu City",
      initials: "AC",
      color: "from-quaternary to-emerald-500",
    },
    {
      quote: "Ang ganda ng reports. Na-export ko yung PDF at ipinakita ko sa asawa ko para mag-budget kami ng tama.",
      name: "Rodel Villanueva",
      role: "OFW, Dubai",
      initials: "RV",
      color: "from-violet-500 to-purple-500",
    },
  ];

  return (
    <section className="w-full px-6 py-12 md:py-24 md:px-10">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-14">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="rounded-full border border-primary/25 bg-primary/8 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary">Testimonials</span>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
            Sinasabi ng mga <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">kapwa Pinoy.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:items-start">
          {testimonials.map((t) => (
            <div key={t.name} className="flex flex-col gap-4 rounded-2xl border border-white/8 bg-[#292524] banig-xs p-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
              <p className="text-white leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 pt-3 border-t border-white/6">
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-sm font-black text-stone-900`}>
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    {
      q: "Libre ba talaga ito?",
      a: "Oo, 100% libre. Walang premium plan, walang credit card, walang hidden charges. Gamitin mo nang libre habang buhay.",
    },
    {
      q: "Ligtas ba ang aking data?",
      a: "Oo. Ang iyong password ay hindi stored as plain text; ginagamit namin ang bcrypt hashing. Ikaw lang ang may access sa iyong financial data.",
    },
    {
      q: "Puwede bang mag-export ng data?",
      a: "Oo! Puwede kang mag-download ng CSV para sa spreadsheets, o PDF para i-print at ibahagi sa iyong pamilya.",
    },
    {
      q: "Ano ang mga default na categories?",
      a: "May 12 kang ready-made categories sa sign-up: Pagkain, Transpo, Kuryente, Internet, Renta, Libangan, Healthcare, Edukasyon, Savings, Sweldo, at iba pa. Puwede kang mag-add ng custom.",
    },
    {
      q: "Puwede bang gamitin sa mobile?",
      a: "Oo, fully responsive ang IponPinoy. Gumana sa kahit anong browser: Android, iPhone, o desktop.",
    },
    {
      q: "May app ba sa App Store o Play Store?",
      a: "Wala pa sa stores, pero ang web app ay gumagana gaya ng native app sa mobile browser mo. Puwede mo ring i-add to Home Screen.",
    },
  ];

  return (
    <section className="w-full px-6 py-12 md:py-24 md:px-10">
      <div className="mx-auto flex max-w-[800px] flex-col gap-14">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="rounded-full border border-primary/25 bg-primary/8 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary">FAQ</span>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
            Mga katanungan.
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-2xl border border-white/8 bg-[#292524] banig-xs p-6">
              <div className="flex items-start gap-4">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 mt-0.5">
                  <span className="material-symbols-outlined text-sm text-primary">help</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-bold text-white">{f.q}</p>
                  <p className="text-sm leading-relaxed text-slate-400">{f.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="w-full px-6 pb-12 md:pb-24 md:px-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-[#292524] to-[#1c1917] banig-weave p-8 text-center md:p-12 lg:p-16">
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-[250px] w-[250px] rounded-full bg-secondary/8 blur-3xl" />
          <div className="relative flex flex-col items-center gap-6">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-orange-500 shadow-xl shadow-primary/30">
              <span className="material-symbols-outlined text-3xl text-stone-900">savings</span>
            </div>
            <div>
              <h2 className="mb-3 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                Handa ka na bang<br />
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">mag-ipon?</span>
              </h2>
              <p className="text-lg text-slate-400">Join Pinoys who finally know where their piso goes. It&apos;s free, forever.</p>
            </div>
            <Link href="/login">
              <button className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-black text-stone-900 shadow-xl shadow-primary/30 transition-all hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap sm:px-10 sm:py-4 sm:text-lg">
                Magsimula Na, Libre!
                <span className="material-symbols-outlined text-lg sm:text-xl">arrow_forward</span>
              </button>
            </Link>
            <div className="flex flex-col items-start gap-2 text-sm text-slate-500 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-5">
              {["No credit card", "No verification email", "Cancel anytime (nothing to cancel)"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-quaternary">check_circle</span>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-[#1c1917] px-6 py-10">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-orange-500">
            <span className="material-symbols-outlined text-lg text-stone-900">savings</span>
          </div>
          <span className="font-black text-white">Ipon<span className="text-primary">Pinoy</span></span>
        </div>
        <p className="text-sm text-slate-500">© 2026 IponPinoy. Gawang Pilipino para sa mga Pilipino.</p>
        <div className="flex gap-5 text-sm text-slate-500">
          <a href="https://github.com/adam-ctrlc/pinoy-finance-tracker-frontend" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">GitHub</a>
          <a href="https://github.com/adam-ctrlc/pinoy-finance-tracker-frontend/issues" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">Issues</a>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#1c1917] banig-xs font-display text-white">
      <Navbar />
      <main>
        <HeroSection />
        <StatsStrip />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
