# IponPinoy

![IponPinoy](./IponPinoy.PNG)

> A Filipino personal finance tracker. Know where your piso goes.

![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.9 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth | Better Auth v1.6.20 |
| Database | Turso (libSQL / SQLite) |
| ORM | Drizzle ORM |
| Data fetching | SWR |
| Icons | Google Material Symbols |

---

## Features

- **Dashboard** — net savings, income, expenses, cash flow chart, top spending categories, recent transactions, budget goals
- **Transactions** — log income and expenses, search, filter, CSV export, keyboard shortcut (`N` to add)
- **Budget (Tipid Mode)** — set spending limits per category or overall, see how much is left with days remaining
- **Reports** — monthly summary, 6-month trend chart, top expenses breakdown, PDF and CSV export
- **Categories** — custom categories with icons and colors for expenses and income
- **Profile** — edit personal info and password with inline edit mode

---

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```env
# Turso database
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token

# Better Auth
BETTER_AUTH_SECRET=your-secret
BETTER_AUTH_URL=http://localhost:3000
```

### 3. Push the database schema

```bash
pnpm db:push
```

### 4. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
app/
  (auth)/login/        # Login & register page
  (dashboard)/
    dashboard/         # Main dashboard
    transactions/      # Transaction list
    budget/            # Budget (Tipid Mode)
    reports/           # Monthly reports
    categories/        # Category management
    profile/           # User profile
  api/                 # API routes
components/
  common/              # Button, Input, Select, Modal, Toast
  Navbar.tsx           # Shared landing/login navbar
  Sidebar.tsx          # Dashboard sidebar
hooks/                 # useAuth, useTransactions, useBudgets, useCategories, useToast
utils/                 # currency, csv, date, user helpers
```

---

## Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Production build
pnpm lint       # Lint
pnpm db:push    # Push Drizzle schema to Turso
pnpm db:studio  # Open Drizzle Studio
```
