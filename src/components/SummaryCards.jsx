import { useApp } from '../context/AppContext'
import { calcSummary, fmtINR } from '../utils'

export default function SummaryCards() {
  const { transactions } = useApp()
  const { income, expenses, balance, savingsRate } = calcSummary(transactions)

  const cards = [
    {
      label: 'Net Balance',
      value: fmtINR(balance),
      valueClass: balance >= 0 ? 'green' : 'red',
      sub: balance >= 0 ? 'positive balance' : 'in the red',
      accentColor: '#4f8ef7',
    },
    {
      label: 'Total Income',
      value: fmtINR(income),
      valueClass: 'green',
      sub: 'all time',
      accentColor: '#34d399',
    },
    {
      label: 'Total Expenses',
      value: fmtINR(expenses),
      valueClass: 'red',
      sub: 'all time',
      accentColor: '#f87171',
    },
    {
      label: 'Savings Rate',
      value: `${savingsRate}%`,
      valueClass: 'yellow',
      sub: 'of income retained',
      accentColor: '#fbbf24',
    },
  ]

  return (
    <div className="summary-grid">
      {cards.map(card => (
        <div className="sum-card" key={card.label}>
          <div
            className="sum-card-accent"
            style={{ background: card.accentColor }}
          />
          <div className="card-label">{card.label}</div>
          <div className={`card-value ${card.valueClass}`}>{card.value}</div>
          <div className="card-sub">{card.sub}</div>
        </div>
      ))}
    </div>
  )
}
