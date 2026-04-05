import { LayoutDashboard, ArrowLeftRight, Lightbulb } from 'lucide-react'
import { useApp } from '../context/AppContext'

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',    Icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', Icon: ArrowLeftRight  },
  { id: 'insights',     label: 'Insights',     Icon: Lightbulb       },
]

export default function Sidebar() {
  const { page, setPage } = useApp()

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-square">
          <svg viewBox="0 0 12 12">
            <polyline points="1,9 4,5 7,7 11,2" />
          </svg>
        </div>
        FinFlow
      </div>

      <nav className="sidebar-nav">
        {NAV.map(({ id, label, Icon }) => (
          <div
            key={id}
            className={`nav-item ${page === id ? 'active' : ''}`}
            onClick={() => setPage(id)}
          >
            <Icon size={15} strokeWidth={1.8} />
            {label}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        finflow · v0.1.0
      </div>
    </aside>
  )
}
