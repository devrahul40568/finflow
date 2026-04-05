import SummaryCards from '../components/SummaryCards'
import TrendChart from '../components/TrendChart'
import SpendingChart from '../components/SpendingChart'
import RecentTransactions from '../components/RecentTransactions'

export default function Dashboard() {
  return (
    <div className="page-content">
      <SummaryCards />
      <div className="charts-row">
        <TrendChart />
        <SpendingChart />
      </div>
      <RecentTransactions />
    </div>
  )
}
