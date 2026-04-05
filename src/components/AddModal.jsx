import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { CATEGORIES } from '../utils'

const today = new Date().toISOString().split('T')[0]

const empty = {
  description: '',
  amount: '',
  type: 'expense',
  category: 'Food',
  date: today,
}

export default function AddModal({ onClose }) {
  const { addTransaction } = useApp()
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.description.trim()) return setError('Description is required.')
    const amt = parseFloat(form.amount)
    if (!amt || amt <= 0) return setError('Enter a valid amount.')
    if (!form.date) return setError('Please pick a date.')

    addTransaction({ ...form, amount: amt })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">Add Transaction</div>

        <div className="form-row">
          <label className="form-label">Description</label>
          <input
            className="form-input"
            placeholder="e.g. Grocery shopping"
            value={form.description}
            onChange={e => set('description', e.target.value)}
          />
        </div>

        <div className="form-grid">
          <div>
            <label className="form-label">Amount (₹)</label>
            <input
              className="form-input"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Type</label>
            <select
              className="form-input"
              value={form.type}
              onChange={e => set('type', e.target.value)}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">Category</label>
          <select
            className="form-input"
            value={form.category}
            onChange={e => set('category', e.target.value)}
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label className="form-label">Date</label>
          <input
            className="form-input"
            type="date"
            value={form.date}
            onChange={e => set('date', e.target.value)}
          />
        </div>

        {error && (
          <p style={{ color: 'var(--danger)', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
            {error}
          </p>
        )}

        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  )
}
