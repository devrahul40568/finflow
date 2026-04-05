# FinFlow

A personal finance dashboard I built as a frontend assignment. Lets you track income and expenses, visualise spending patterns, and switch between an admin and viewer role to demo basic RBAC behaviour.

Built with React + Vite. No backend — all data is mock/static and persisted via localStorage.

---

## Getting started

```bash
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

To build for production:

```bash
npm run build
npm run preview
```

---

## What's inside

### Pages

**Dashboard** — the home screen. Shows four summary cards (net balance, income, expenses, savings rate), a line chart of income vs expenses over the last 6 or 12 months, a doughnut chart breaking spending down by category, and a list of the five most recent transactions.

**Transactions** — full table of every transaction. You can search by name or category, filter by type (income/expense), category, or month, and sort any column by clicking the header. Admins can add new entries via the modal and delete existing ones.

**Insights** — six KPI cards (top spending category, monthly averages, month-over-month expense change, net savings, savings rate), a grouped bar chart comparing income and expenses for the last six months, and a ranked horizontal bar chart showing how much was spent per category.

### Role-based UI

There's a role badge in the top bar that toggles between **Admin** and **Viewer** when you click it. Viewer mode hides the Add button and the delete column in the transactions table. Admin mode gives full access. The selected role persists across page refreshes.

### Theme

The sun/moon icon in the top bar switches between dark and light mode. Preference is saved to localStorage so it sticks between sessions.

---

## State management

Everything lives in a single React context (`AppContext`). The context holds:

- `transactions` — the list of transactions
- `role` — current user role (`admin` or `viewer`)
- `theme` — `dark` or `light`
- `page` — which page is currently active

Mutations go through dedicated functions (`addTransaction`, `deleteTransaction`, `toggleRole`, `toggleTheme`) that update state and write to localStorage at the same time. Components read from context and call those functions — no prop drilling.

Local filter and sort state lives inside the Transactions page component since it's only relevant there.

---

## Project structure

```
src/
  components/
    AddModal.jsx          modal for creating a new transaction
    RecentTransactions.jsx  mini tx list on the dashboard
    Sidebar.jsx
    SpendingChart.jsx     doughnut chart
    SummaryCards.jsx      four top-level KPI cards
    Topbar.jsx            includes role toggle and theme switch
    TrendChart.jsx        line chart with 6M/12M toggle
  context/
    AppContext.jsx        global state + localStorage sync
  data/
    transactions.js       mock data and category colours
  pages/
    Dashboard.jsx
    Insights.jsx
    Transactions.jsx
  App.jsx
  index.css
  main.jsx
  utils.js               formatting helpers, data aggregation
```

---

## Tech used

- React 18
- Vite 5
- Recharts — for all the charts
- Lucide React — icons
- localStorage — data persistence, no backend needed

---

## A few notes

- The date reference for "last 6/12 months" is hardcoded to June 2025 to match the mock data range. In a real app you'd use `new Date()`.
- Deleting all transactions and adding new ones works fine — the charts and insight cards all recalculate from whatever's in state.
- The viewer role restriction is frontend-only and purely for demonstration. There's no auth.
