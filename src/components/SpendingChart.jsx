import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useApp } from '../context/AppContext'
import { getCategoryTotals } from '../utils'
import { CATEGORY_COLORS } from '../data/transactions'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '0.5rem 0.8rem',
      fontSize: '0.75rem',
      color: 'var(--text)',
    }}>
      <strong>{name}</strong>: ₹{Math.round(value).toLocaleString('en-IN')}
    </div>
  )
}

export default function SpendingChart() {
  const { transactions } = useApp()
  const totals = getCategoryTotals(transactions).slice(0, 7)
  const total = totals.reduce((acc, [, v]) => acc + v, 0)

  const data = totals.map(([cat, val]) => ({ name: cat, value: val }))

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Spending Breakdown</div>
          <div className="card-subtitle">By category</div>
        </div>
      </div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={170}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={78}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map(entry => (
                <Cell
                  key={entry.name}
                  fill={CATEGORY_COLORS[entry.name] || '#888'}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="donut-legend">
          {data.map(entry => (
            <span key={entry.name} className="legend-item">
              <span
                className="legend-swatch"
                style={{ background: CATEGORY_COLORS[entry.name] || '#888' }}
              />
              {entry.name} {total > 0 ? Math.round((entry.value / total) * 100) : 0}%
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
