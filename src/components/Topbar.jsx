import { Sun, Moon } from 'lucide-react'
import { useApp } from '../context/AppContext'

const PAGE_TITLES = {
  dashboard:    'Overview',
  transactions: 'Transactions',
  insights:     'Insights',
}

export default function Topbar() {
  const { page, role, toggleRole, theme, toggleTheme } = useApp()

  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  return (
    <div className="topbar">
      <span className="topbar-title">{PAGE_TITLES[page]}</span>

      <div className="topbar-right">
        <div className="role-wrap">
          <span>Role:</span>
          <div
            className={`role-badge ${role}`}
            onClick={toggleRole}
            title="Click to switch role"
          >
            {role.toUpperCase()}
          </div>
        </div>

        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <span className="topbar-date">{today}</span>
      </div>
    </div>
  )
}
