export function fmtINR(amount) {
  return '₹' + Math.round(amount).toLocaleString('en-IN')
}

export function fmtDate(dateStr) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function fmtShortDate(dateStr) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  })
}

export function calcSummary(transactions) {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0)
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0)
  const balance = income - expenses
  const savingsRate = income > 0 ? ((balance / income) * 100).toFixed(1) : '0.0'
  return { income, expenses, balance, savingsRate }
}

export function getMonthlyData(transactions, months = 6) {
  const result = []
  const ref = new Date('2025-06-30')
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(ref)
    d.setMonth(d.getMonth() - i)
    const key = d.toISOString().slice(0, 7)
    const label = d.toLocaleString('en-IN', { month: 'short' })
    const income = transactions
      .filter(t => t.date.startsWith(key) && t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0)
    const expense = transactions
      .filter(t => t.date.startsWith(key) && t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0)
    result.push({ label, income, expense, net: income - expense })
  }
  return result
}

export function getCategoryTotals(transactions) {
  const map = {}
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount
    })
  return Object.entries(map).sort((a, b) => b[1] - a[1])
}

export const CATEGORIES = [
  'Food', 'Housing', 'Transport', 'Entertainment',
  'Shopping', 'Health', 'Education', 'Utilities',
  'Salary', 'Freelance', 'Investment', 'Other',
]
