import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { CATEGORY_COLORS } from '../data/transactions'
import { fmtINR, fmtDate } from '../utils'
import AddModal from '../components/AddModal'

export default function Transactions() {
  const { transactions, deleteTransaction, role } = useApp()
  const isAdmin = role === 'admin'

  const [search, setSearch]   = useState('')
  const [typeF, setTypeF]     = useState('')
  const [catF, setCatF]       = useState('')
  const [monthF, setMonthF]   = useState('')
  const [sortKey, setSortKey] = useState('date')
  const [sortAsc, setSortAsc] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const categories = useMemo(() => [...new Set(transactions.map(t => t.category))].sort(), [transactions])
  const months = useMemo(() => {
    return [...new Set(transactions.map(t => t.date.slice(0, 7)))]
      .sort()
      .reverse()
  }, [transactions])

  const filtered = useMemo(() => {
    return transactions
      .filter(t => {
        const q = search.toLowerCase()
        return (
          (!q || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)) &&
          (!typeF || t.type === typeF) &&
          (!catF || t.category === catF) &&
          (!monthF || t.date.startsWith(monthF))
        )
      })
      .sort((a, b) => {
        let v = 0
        if (sortKey === 'amount') v = a.amount - b.amount
        else v = a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0
        return sortAsc ? v : -v
      })
  }, [transactions, search, typeF, catF, monthF, sortKey, sortAsc])

  const handleSort = key => {
    if (sortKey === key) setSortAsc(p => !p)
    else { setSortKey(key); setSortAsc(false) }
  }

  const arrow = key => (
    <span className={`sort-arrow ${sortKey === key ? 'active' : ''}`}>
      {sortKey === key ? (sortAsc ? '▲' : '▼') : '▼'}
    </span>
  )

  return (
    <div className="page-content">
      <div className="section-heading">
        <h2>Transactions</h2>
        <p>{filtered.length} record{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="card">
        <div className="tx-toolbar">
          <div className="search-wrap">
            <span className="search-icon"><Search size={13} /></span>
            <input
              className="search-input"
              placeholder="Search by name or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select className="filter-select" value={typeF} onChange={e => setTypeF(e.target.value)}>
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select className="filter-select" value={catF} onChange={e => setCatF(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select className="filter-select" value={monthF} onChange={e => setMonthF(e.target.value)}>
            <option value="">All Months</option>
            {months.map(m => {
              const d = new Date(m + '-01')
              return (
                <option key={m} value={m}>
                  {d.toLocaleString('en-IN', { month: 'long', year: 'numeric' })}
                </option>
              )
            })}
          </select>

          <button
            className="add-btn"
            onClick={() => setShowModal(true)}
            disabled={!isAdmin}
            title={!isAdmin ? 'Switch to Admin to add transactions' : ''}
          >
            + Add
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">No transactions match your current filters.</div>
        ) : (
          <div className="tx-table-wrap">
            <table className="tx-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('date')}>Date {arrow('date')}</th>
                  <th onClick={() => handleSort('description')}>Description {arrow('description')}</th>
                  <th onClick={() => handleSort('category')}>Category {arrow('category')}</th>
                  <th onClick={() => handleSort('type')}>Type {arrow('type')}</th>
                  <th onClick={() => handleSort('amount')} style={{ textAlign: 'right' }}>Amount {arrow('amount')}</th>
                  {isAdmin && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map(tx => (
                  <tr key={tx.id}>
                    <td className="tx-date-cell">{fmtDate(tx.date)}</td>
                    <td style={{ fontWeight: 500 }}>{tx.description}</td>
                    <td>
                      <span
                        className="cat-badge"
                        style={{
                          background: `${CATEGORY_COLORS[tx.category] || '#888'}18`,
                          color: CATEGORY_COLORS[tx.category] || '#888',
                        }}
                      >
                        <span
                          className="cat-dot"
                          style={{ background: CATEGORY_COLORS[tx.category] || '#888' }}
                        />
                        {tx.category}
                      </span>
                    </td>
                    <td>
                      <span className={`type-badge ${tx.type}`}>{tx.type}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={`amount ${tx.type}`}>
                        {tx.type === 'income' ? '+' : '-'}{fmtINR(tx.amount)}
                      </span>
                    </td>
                    {isAdmin && (
                      <td>
                        <button
                          className="del-btn"
                          onClick={() => deleteTransaction(tx.id)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && <AddModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
