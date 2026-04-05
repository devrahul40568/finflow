import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { useApp } from '../context/AppContext'
import { getMonthlyData } from '../utils'

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
        <p key={p.name} style={{ color: p.color, margin: '2px 0' }}>
          {p.name}: ₹{Math.round(p.value).toLocaleString('en-IN')}
        </p>
      ))}
    </div>
  )
}

export default function TrendChart() {
  const { transactions } = useApp()
  const [period, setPeriod] = useState('6m')
  const months = period === '6m' ? 6 : 12
  const data = getMonthlyData(transactions, months)

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Balance Trend</div>
          <div className="card-subtitle">Monthly income vs expenses</div>
        </div>
        <div className="pill-group">
          {['6m', '12m'].map(p => (
            <div
              key={p}
              className={`pill ${period === p ? 'active' : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p.toUpperCase()}
            </div>
          ))}
        </div>
      </div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
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
            <Line
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#34d399"
              strokeWidth={2}
              dot={{ r: 3, fill: '#34d399' }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              name="Expenses"
              stroke="#f87171"
              strokeWidth={2}
              dot={{ r: 3, fill: '#f87171' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
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
  )
}
