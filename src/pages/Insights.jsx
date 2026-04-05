import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { useApp } from '../context/AppContext'
import { calcSummary, getMonthlyData, getCategoryTotals, fmtINR } from '../utils'
import { CATEGORY_COLORS } from '../data/transactions'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '0.6rem 0.9rem',
      fontSize: '0.75rem',
    }}>
      <p style={{ color: 'var(--text2)', marginBottom: 4 }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.fill, margin: '2px 0' }}>
          {p.name}: ₹{Math.round(p.value).toLocaleString('en-IN')}
        </p>
      ))}
    </div>
  )
}

export default function Insights() {
  const { transactions } = useApp()

  const { income, expenses, balance, savingsRate } = calcSummary(transactions)
  const monthly = getMonthlyData(transactions, 6)
  const catTotals = getCategoryTotals(transactions)

  const allMonths = [...new Set(transactions.map(t => t.date.slice(0, 7)))].sort()
  const lastM = allMonths[allMonths.length - 1] || ''
  const prevM = allMonths[allMonths.length - 2] || ''

  const lastExp = transactions
    .filter(t => t.date.startsWith(lastM) && t.type === 'expense')
    .reduce((a, t) => a + t.amount, 0)
  const prevExp = transactions
    .filter(t => t.date.startsWith(prevM) && t.type === 'expense')
    .reduce((a, t) => a + t.amount, 0)

  const expChange = prevExp
    ? (((lastExp - prevExp) / prevExp) * 100).toFixed(1)
    : '0.0'

  const avgIncome   = allMonths.length ? income / allMonths.length : 0
  const avgExpenses = allMonths.length ? expenses / allMonths.length : 0
  const topCat      = catTotals[0]

  const insights = [
    {
      label: 'Top Spending Category',
      value: topCat ? topCat[0] : '—',
      desc:  topCat ? `${fmtINR(topCat[1])} spent total` : 'No expense data yet',
    },
    {
      label: 'Monthly Avg Income',
      value: fmtINR(Math.round(avgIncome)),
      desc: `Across ${allMonths.length} month${allMonths.length !== 1 ? 's' : ''}`,
    },
    {
      label: 'Monthly Avg Expenses',
      value: fmtINR(Math.round(avgExpenses)),
      desc: `Across ${allMonths.length} month${allMonths.length !== 1 ? 's' : ''}`,
    },
    {
      label: 'Expense Change (MoM)',
      value: `${expChange > 0 ? '+' : ''}${expChange}%`,
      desc: Number(expChange) > 0
        ? 'Higher than previous month'
        : Number(expChange) < 0
          ? 'Lower than previous month'
          : 'Same as previous month',
    },
    {
      label: 'Net Savings',
      value: fmtINR(balance),
      desc: 'Total income minus total expenses',
    },
    {
      label: 'Savings Rate',
      value: `${savingsRate}%`,
      desc: 'Percentage of income retained',
    },
  ]

  const maxCat = catTotals[0]?.[1] || 1

  return (
    <div className="page-content">
      <div className="section-heading">
        <h2>Insights</h2>
        <p>Patterns and observations from your data</p>
      </div>

      {/* KPI GRID */}
      <div className="insights-grid">
        {insights.map(ins => (
          <div className="insight-card" key={ins.label}>
            <div className="insight-label">{ins.label}</div>
            <div className="insight-value">{ins.value}</div>
            <div className="insight-desc">{ins.desc}</div>
          </div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div className="charts-row-equal">

        {/* BAR CHART */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Income vs Expenses</div>
              <div className="card-subtitle">Last 6 months comparison</div>
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthly} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: 'var(--text2)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'var(--text2)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `₹${Math.round(v / 1000)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="income"  name="Income"   fill="#34d399" radius={[4,4,0,0]} />
                <Bar dataKey="expense" name="Expenses" fill="#f87171" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              {[{ label: 'Income', color: '#34d399' }, { label: 'Expenses', color: '#f87171' }].map(l => (
                <span key={l.label} className="legend-item">
                  <span className="legend-swatch" style={{ background: l.color }} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* SPEND BARS */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Category Breakdown</div>
              <div className="card-subtitle">Total spend per category</div>
            </div>
          </div>
          <div className="card-body">
            {catTotals.length === 0 && (
              <div className="empty-state">No expense data yet.</div>
            )}
            {catTotals.map(([cat, val]) => (
              <div className="spend-bar-row" key={cat}>
                <div className="spend-bar-labels">
                  <span className="spend-bar-name">{cat}</span>
                  <span
                    className="spend-bar-amount"
                    style={{ color: CATEGORY_COLORS[cat] || '#888' }}
                  >
                    {fmtINR(val)}
                  </span>
                </div>
                <div className="spend-bar-track">
                  <div
                    className="spend-bar-fill"
                    style={{
                      width: `${Math.round((val / maxCat) * 100)}%`,
                      background: CATEGORY_COLORS[cat] || '#888',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
