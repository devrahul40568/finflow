import React, { createContext, useContext, useState, useCallback } from 'react'
import { DEFAULT_TRANSACTIONS } from '../data/transactions'

const AppContext = createContext(null)

const stored = localStorage.getItem('finflow_txs')
const storedRole = localStorage.getItem('finflow_role')
const storedTheme = localStorage.getItem('finflow_theme')

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(
    stored ? JSON.parse(stored) : DEFAULT_TRANSACTIONS
  )
  const [role, setRole] = useState(storedRole || 'admin')
  const [theme, setTheme] = useState(storedTheme || 'dark')
  const [page, setPage] = useState('dashboard')

  const addTransaction = useCallback((tx) => {
    const next = { ...tx, id: Date.now() }
    setTransactions(prev => {
      const updated = [next, ...prev]
      localStorage.setItem('finflow_txs', JSON.stringify(updated))
      return updated
    })
  }, [])

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => {
      const updated = prev.filter(t => t.id !== id)
      localStorage.setItem('finflow_txs', JSON.stringify(updated))
      return updated
    })
  }, [])

  const toggleRole = useCallback(() => {
    setRole(prev => {
      const next = prev === 'admin' ? 'viewer' : 'admin'
      localStorage.setItem('finflow_role', next)
      return next
    })
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('finflow_theme', next)
      return next
    })
  }, [])

  return (
    <AppContext.Provider value={{
      transactions, addTransaction, deleteTransaction,
      role, toggleRole,
      theme, toggleTheme,
      page, setPage,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
