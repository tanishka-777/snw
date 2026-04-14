import { useApp } from '../context/AppContext';
import SummaryCard from '../components/SummaryCard';
import BalanceTrendChart from '../components/BalanceTrendChart';
import SpendingBreakdownChart from '../components/SpendingBreakdownChart';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import RecentTransactions from '../components/RecentTransactions';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';

export default function Dashboard() {
  const { state } = useApp();
  const { transactions } = state;

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100) : 0;

  // Monthly comparison for trend
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const lastMonth = `${now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()}-${String(now.getMonth() === 0 ? 12 : now.getMonth()).padStart(2, '0')}`;

  const currentMonthIncome = transactions
    .filter((t) => t.type === 'income' && t.date.startsWith(currentMonth))
    .reduce((s, t) => s + t.amount, 0);
  const lastMonthIncome = transactions
    .filter((t) => t.type === 'income' && t.date.startsWith(lastMonth))
    .reduce((s, t) => s + t.amount, 0);
  const currentMonthExpenses = transactions
    .filter((t) => t.type === 'expense' && t.date.startsWith(currentMonth))
    .reduce((s, t) => s + t.amount, 0);
  const lastMonthExpenses = transactions
    .filter((t) => t.type === 'expense' && t.date.startsWith(lastMonth))
    .reduce((s, t) => s + t.amount, 0);

  const incomeTrend = lastMonthIncome > 0 ? ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 : 0;
  const expenseTrend = lastMonthExpenses > 0 ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Balance"
          amount={balance}
          icon={Wallet}
          color="indigo"
        />
        <SummaryCard
          title="Total Income"
          amount={totalIncome}
          icon={TrendingUp}
          trend={incomeTrend}
          color="green"
        />
        <SummaryCard
          title="Total Expenses"
          amount={totalExpenses}
          icon={TrendingDown}
          trend={expenseTrend}
          color="red"
        />
        <SummaryCard
          title="Savings"
          amount={balance > 0 ? balance : 0}
          icon={PiggyBank}
          color="amber"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BalanceTrendChart />
        <SpendingBreakdownChart />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IncomeExpenseChart />
        <RecentTransactions transactions={transactions} />
      </div>
    </div>
  );
}
