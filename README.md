# inFlow — Personal Finance Dashboard

> A modern, full-stack personal finance dashboard built with React, Ant Design, Supabase, and Recharts. Track income, expenses, investments, and savings — all in one sleek interface.

🔗 **Live Demo:** [https://finance-dashboard-one-neon.vercel.app](https://finance-dashboard-one-neon.vercel.app)

---

## Features at a Glance

- 🔐 **Authentication** — Sign up, sign in, password reset via Supabase Auth
- 📊 **Dashboard** — Balance overview, summary cards, area charts, pie charts, recent transactions
- 💳 **Transactions** — Add, edit, delete, filter, search, and export transactions
- 📈 **Analytics** — Monthly comparisons, category breakdowns, savings rate insights
- 🌙 **Dark / Light Mode** — System-aware theme toggle, persisted across sessions
- ☁️ **Supabase Backend** — Real-time PostgreSQL database with row-level security
- 📤 **Export** — Download transactions as CSV or JSON

---

## 🛠 Tech Stack

| Layer                  | Technology                          |
| ---------------------- | ----------------------------------- |
| Frontend Framework     | React 19 + Vite 8                   |
| UI Library             | Ant Design 6                        |
| Charts                 | Recharts 3                          |
| State Management       | Zustand 5                           |
| Server State / Caching | TanStack React Query 5              |
| Backend / Auth / DB    | Supabase (PostgreSQL)               |
| Routing                | React Router DOM 7                  |
| Date Handling          | Day.js                              |
| Styling                | SCSS Modules + Global CSS Variables |
| Deployment             | Vercel                              |

---

## Project Structure

```
finance-dashboard/
├── public/
│   └── favicon.svg
├── src/
│   ├── api/
│   │   ├── auth/
│   │   │   └── mutations.jsx        # signIn, signUp, signOut, resetPassword, updatePassword
│   │   └── transactions/
│   │       ├── mutations.jsx        # CRUD operations against Supabase
│   │       └── queries.jsx          # useGetTransactions (React Query hook)
│   ├── assets/                      # Static SVGs
│   ├── components/
│   │   ├── AppLayout/               # Main layout: sidebar, header, theme toggle
│   │   ├── BalanceChart/            # Area chart with tab switching (expense/income/savings/investment)
│   │   ├── SpendingChart/           # Donut pie chart with category legend
│   │   ├── SummaryCard/             # KPI cards (Balance, Income, Expenses)
│   │   └── TransactionModal/        # Add / Edit transaction modal form
│   ├── config/
│   │   └── supabaseClient.js        # Supabase client initialisation
│   ├── constants/
│   │   └── index.js                 # Categories, colors, types, sample data
│   ├── context/
│   │   └── AppContext.jsx           # Global state: auth, theme, mutations
│   ├── icons/
│   │   └── icons.jsx                # Custom SVG icon components
│   ├── pages/
│   │   ├── Analytics/               # Bar chart + pie chart analytics page
│   │   ├── Dashboard/               # Main dashboard page
│   │   ├── Login/                   # Sign in / Sign up page
│   │   ├── ResetPassword/           # Password reset flow
│   │   ├── Settings/                # Theme toggle + account info
│   │   └── Transactions/            # Full transaction table with filters
│   ├── utils/
│   │   └── helpers.jsx              # Currency formatting, aggregations, CSV/JSON export
│   ├── App.jsx                      # Route definitions + ConfigProvider
│   ├── index.css                    # Global styles + CSS variables (light/dark)
│   └── main.jsx                     # React root, QueryClient, AppProvider
├── index.html
├── package.json
├── vite.config.js
└── vercel.json                      # SPA rewrite rule for Vercel
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20.19.0 (required by Vite 8 / Rolldown)
- **npm** or **yarn**
- A free [Supabase](https://supabase.com) account

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/finance-dashboard.git
cd finance-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com) and create a new project.
2. Navigate to **SQL Editor** and run the following to create the transactions table:

```sql
create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  description text not null,
  amount numeric(12, 2) not null,
  type text check (type in ('income', 'expense')) not null,
  category text not null,
  date date not null,
  created_at timestamptz default now()
);

-- Row Level Security
alter table transactions enable row level security;

create policy "Users can view their own transactions"
  on transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own transactions"
  on transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own transactions"
  on transactions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own transactions"
  on transactions for delete
  using (auth.uid() = user_id);
```

#### Get Your API Keys

From your Supabase project dashboard → **Settings → API**:

- `Project URL`
- `anon / public` key

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> Never commit `.env` to version control. It is already listed in `.gitignore`.

### 5. Start the Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

---

## Available Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server with HMR        |
| `npm run build`   | Build for production (output to `dist/`) |
| `npm run preview` | Preview the production build locally     |
| `npm run lint`    | Run ESLint across all source files       |

---

## Authentication Flow

inFlow uses **Supabase Auth** for all user management:

| Flow                 | Description                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| **Sign Up**          | Creates account + sends email confirmation. User is redirected to a "check your email" screen. |
| **Sign In**          | Authenticates with email + password. Session persisted in `localStorage`.                      |
| **Forgot Password**  | Sends reset email via Supabase. Clicking link redirects to `/reset-password`.                  |
| **Reset Password**   | Supabase fires a `PASSWORD_RECOVERY` auth event; user sets a new password.                     |
| **Sign Out**         | Clears session and React Query cache.                                                          |
| **Protected Routes** | All dashboard routes redirect to `/login` if unauthenticated.                                  |

---

## 🗃 Data Layer

### Supabase Client (`src/config/supabaseClient.js`)

Initialised once using environment variables. Exported as a singleton used across all API files.

### Transactions API (`src/api/transactions/`)

| Function                                | Description                                                                 |
| --------------------------------------- | --------------------------------------------------------------------------- |
| `fetchTransactions()`                   | Fetches all transactions for the signed-in user, ordered by date descending |
| `createTransaction(payload)`            | Inserts a new transaction row                                               |
| `updateTransaction({ id, ...payload })` | Updates an existing transaction by ID                                       |
| `deleteTransaction(id)`                 | Deletes a transaction by ID                                                 |

### React Query

`useGetTransactions()` is the primary data hook. It caches results for 30 seconds (`staleTime: 30000`) and automatically refetches when auth state changes. All mutations call `queryClient.invalidateQueries` on success to keep the UI in sync.

---

## Theming

The app supports **light and dark modes** via CSS custom properties on the `<html>` element (`data-theme="light"` / `"dark"`).

### CSS Variables

Defined in `src/index.css`:

```css
:root,
[data-theme="light"] {
  --bg-layout: #f5f6fa;
  --bg-card: #ffffff;
  --text-primary: #111827;
  --primary: #f97316;
  /* ... */
}

[data-theme="dark"] {
  --bg-layout: #0a0a0a;
  --bg-card: #111111;
  --text-primary: #f0f0f0;
  /* ... */
}
```

Ant Design's `ConfigProvider` is wired to switch between `defaultAlgorithm` and `darkAlgorithm` based on the same theme state.

Theme preference is **persisted to `localStorage`** and defaults to the system preference via `window.matchMedia('(prefers-color-scheme: dark)')`.

---

## Pages & Components

### Dashboard (`/dashboard`)

- **SummaryCard** ×3 — Balance, Income This Month, Expenses This Month
- **BalanceChart** — Area chart with 4 tabs (Expense / Income / Savings / Investment) and a date range dropdown (7 / 14 / 30 days)
- **SpendingChart** — Donut chart toggling between income and expense category breakdown
- **Recent Transactions** — Last 4 transactions with a "View all" link

### Transactions (`/transactions`)

- Full data table with sortable columns (Date, Amount)
- **Search** by description or category
- **Filter** by type (income / expense) and category
- **Sort** by newest or oldest first
- **Add / Edit** via modal form (description, amount, date, type, category)
- **Delete** with confirmation popover
- **Export** to CSV or JSON

### Analytics (`/analytics`)

- Insight cards: Highest Spending Category, Savings Rate, Number of Expense Categories
- **Bar Chart** — Monthly income vs. expenses (last 6 months)
- **Pie Chart** — Expense category breakdown with legend

### Settings (`/settings`)

- Account information (email, active status, transaction count)
- Dark/light mode toggle

### Login (`/login`)

- Sign In / Sign Up tabs with form validation
- "Forgot password" modal with reset flow
- Email confirmation pending screen

---

## Key Architectural Decisions

### Global State (`AppContext`)

`AppContext` manages:

- **Auth state** (`user`, `authLoading`) — populated from Supabase session on mount, kept in sync via `onAuthStateChange`
- **Theme** (`theme`, `toggleTheme`) — persisted to localStorage
- **Mutations** — `addTransaction`, `editTransaction`, `deleteTransaction` exposed to all children to avoid prop drilling

### Component Colocation

Each component/page has its own `.module.scss` file colocated alongside it, keeping styles scoped and portable.

### SPA Routing on Vercel

`vercel.json` includes a catch-all rewrite so that direct URL access and page refreshes work correctly for client-side routes:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
```

---

## Deploying to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual Deploy

1. Push your code to GitHub.
2. Import the repository on [vercel.com](https://vercel.com).
3. Add environment variables in **Project Settings → Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Vercel auto-detects Vite and sets the build command to `npm run build` with output directory `dist`.
5. Click **Deploy**.

> The `vercel.json` rewrite rule is already included to handle SPA routing.

---

## Transaction Categories

The following categories are supported out of the box:

| Category      | Type           | Color     |
| ------------- | -------------- | --------- |
| Salary        | Income         | `#22c55e` |
| Bonus         | Income         | `#84cc16` |
| Allowance     | Income         | `#a78bfa` |
| Investment    | Income/Expense | `#14b8a6` |
| Food          | Expense        | `#10b981` |
| Household     | Expense        | `#4f46e5` |
| Transport     | Expense        | `#06b6d4` |
| Health        | Expense        | `#ec4899` |
| Entertainment | Expense        | `#f97316` |
| Clothing      | Expense        | `#f59e0b` |
| Savings       | Expense        | `#8b5cf6` |
| Other         | Any            | `#9ca3af` |

---

## Environment Variables Reference

| Variable                 | Required | Description                   |
| ------------------------ | -------- | ----------------------------- |
| `VITE_SUPABASE_URL`      | Yes      | Your Supabase project URL     |
| `VITE_SUPABASE_ANON_KEY` | Yes      | Your Supabase public anon key |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

This project is open-source and available under the [MIT License](LICENSE).

---

## Acknowledgements

- [Ant Design](https://ant.design/) — UI component library
- [Recharts](https://recharts.org/) — Composable charting library
- [Supabase](https://supabase.com/) — Open-source Firebase alternative
- [TanStack Query](https://tanstack.com/query) — Powerful data synchronisation
- [Vite](https://vite.dev/) — Next generation frontend tooling
