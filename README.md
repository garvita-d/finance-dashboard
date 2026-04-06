# inFlow — Personal Finance Dashboard

> A modern, full-stack personal finance dashboard built with React, Ant Design, Supabase, and Recharts. Track income, expenses, investments, and savings — all in one sleek interface.

🔗 **Live Demo:** [https://finance-dashboard-one-neon.vercel.app](https://finance-dashboard-one-neon.vercel.app)

---

## 🧪 Test Account

Want to explore the app without signing up?

| Field    | Value                          |
| -------- | ------------------------------ |
| Email    | `garvita.expenses@example.com` |
| Password | `test1234`                     |

> This account has pre-loaded sample transactions so you can explore all features immediately.

---

## Features at a Glance

- 🔐 **Authentication** — Sign up, sign in, email confirmation, and password reset via Supabase Auth
- 📊 **Dashboard** — Balance overview, real-time % change vs last month, area charts, pie charts, recent transactions
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
│   │   └── index.js                 # Categories, colors, types
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
git clone https://github.com/garvita-d/finance-dashboard.git
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

create policy "select_own" on transactions
  for select using (auth.uid() = user_id);

create policy "insert_own" on transactions
  for insert with check (auth.uid() = user_id);

create policy "update_own" on transactions
  for update using (auth.uid() = user_id);

create policy "delete_own" on transactions
  for delete using (auth.uid() = user_id);
```

> ⚠️ **Important:** Never add policies named "Allow authenticated users" or any `ALL` policy without a `user_id` filter — these bypass RLS and expose every user's data to everyone.

#### Enable Email Confirmation

In your Supabase Dashboard → **Authentication → Providers → Email**, turn on **"Confirm email"**. New users must verify their email before accessing the dashboard.

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

| Flow                 | Description                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Sign Up**          | Creates account + sends email confirmation. User sees a "check your email" screen until verified.                        |
| **Sign In**          | Authenticates with email + password. Shows a warning if email is not yet confirmed. Session persisted in `localStorage`. |
| **Forgot Password**  | Sends reset email via Supabase. Clicking link redirects to `/reset-password`.                                            |
| **Reset Password**   | Supabase fires a `PASSWORD_RECOVERY` auth event; user sets a new password.                                               |
| **Sign Out**         | Clears session and React Query cache.                                                                                    |
| **Protected Routes** | All dashboard routes redirect to `/login` if unauthenticated.                                                            |

---

## Data Layer

### Supabase Client (`src/config/supabaseClient.js`)

Initialised once using environment variables. Exported as a singleton used across all API files.

### Transactions API (`src/api/transactions/`)

| Function                                | Description                                                                 |
| --------------------------------------- | --------------------------------------------------------------------------- |
| `fetchTransactions()`                   | Fetches all transactions for the signed-in user, ordered by date descending |
| `createTransaction(payload)`            | Inserts a new transaction row with the current user's `user_id`             |
| `updateTransaction({ id, ...payload })` | Updates an existing transaction by ID                                       |
| `deleteTransaction(id)`                 | Deletes a transaction by ID                                                 |

### React Query

`useGetTransactions()` is the primary data hook. It uses `["transactions", user?.id]` as the query key — ensuring different users never share cached data. It has `staleTime: 30000` and `enabled: !!user` so it only fetches when a user is logged in. All mutations call `queryClient.invalidateQueries` on success to keep the UI in sync.

---

## Dashboard — Real Percentage Changes

The three summary cards (Balance, Income, Expenses) show **real percentage changes** compared to the previous calendar month — not hardcoded values.

| Card         | Calculation                                               |
| ------------ | --------------------------------------------------------- |
| **Balance**  | This month's net (income − expenses) vs last month's net  |
| **Income**   | This month's total income vs last month's total income    |
| **Expenses** | This month's expenses vs last month's (↑ = bad, ↓ = good) |

New users with no transactions see `0.00%` on all cards.

---

## Theming

The app supports **light and dark modes** via CSS custom properties on the `<html>` element (`data-theme="light"` / `"dark"`).

```css
:root,
[data-theme="light"] {
  --bg-layout: #f5f6fa;
  --bg-card: #ffffff;
  --text-primary: #111827;
  --primary: #f97316;
}

[data-theme="dark"] {
  --bg-layout: #0a0a0a;
  --bg-card: #111111;
  --text-primary: #f0f0f0;
}
```

Ant Design's `ConfigProvider` switches between `defaultAlgorithm` and `darkAlgorithm` based on the same theme state. Preference is persisted to `localStorage` and defaults to the system setting via `prefers-color-scheme`.

---

## Pages & Components

### Dashboard (`/dashboard`)

- **SummaryCard** ×3 — Balance, Income This Month, Expenses This Month with real % vs last month
- **BalanceChart** — Area chart with 4 tabs (Expense / Income / Savings / Investment) and a date range dropdown (7 / 14 / 30 days)
- **SpendingChart** — Donut chart toggling between income and expense category breakdown
- **Recent Transactions** — Last 4 transactions with a "View all" link. Shows "No transactions yet" for new users.

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
- Warning shown if email is not yet confirmed
- "Forgot password" modal with reset flow
- Email confirmation pending screen after sign up

---

## Security

- **Row Level Security (RLS)** is enabled on the `transactions` table
- Every query explicitly filters by `user_id = auth.uid()`
- The React Query key includes `user?.id` — different users never share cached data
- `queryClient.clear()` is called on every auth state change (sign in, sign out, token refresh)
- New users see an empty dashboard (₹0.00) with no data from other accounts

---

## Deploying to Vercel

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
