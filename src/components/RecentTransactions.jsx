import { useApp } from '../context/AppContext'
import { CATEGORY_COLORS } from '../data/transactions'
import { fmtINR, fmtShortDate } from '../utils'

export default function RecentTransactions() {
  const { transactions, setPage } = useApp()

  const recent = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)

  return (
    <div className="card" style={{ marginBottom: '1.25rem' }}>
      <div className="card-header">
        <div>
          <div className="card-title">Recent Activity</div>
          <div className="card-subtitle">Last 5 transactions</div>
        </div>
        <div
          className="pill active"
          style={{ cursor: 'pointer' }}
          onClick={() => setPage('transactions')}
        >
          View all →
        </div>
      </div>
      <div className="card-body">
        {recent.length === 0 && (
          <div className="empty-state">No transactions yet.</div>
        )}
        {recent.map(tx => (
          <div className="mini-tx-item" key={tx.id}>
            <div className="mini-tx-left">
              <div
                className="cat-icon"
                style={{
                  background: `${CATEGORY_COLORS[tx.category] || '#888'}20`,
                  color: CATEGORY_COLORS[tx.category] || '#888',
                }}
              >
                {tx.category[0]}
              </div>
              <div>
                <div className="mini-tx-name">{tx.description}</div>
                <div className="mini-tx-meta">
                  {tx.category} · {fmtShortDate(tx.date)}
                </div>
              </div>
            </div>
            <div className={`amount ${tx.type}`}>
              {tx.type === 'income' ? '+' : '-'}{fmtINR(tx.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
