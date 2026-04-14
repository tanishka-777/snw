import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { getMonthLabel, formatCurrency } from '../utils/helpers';

export default function BalanceTrendChart() {
  const { state } = useApp();
  const { transactions } = state;

  // Group transactions by month
  const monthlyData = {};
  transactions.forEach((t) => {
    const key = t.date.slice(0, 7); // YYYY-MM
    if (!monthlyData[key]) {
      monthlyData[key] = { income: 0, expense: 0 };
    }
    if (t.type === 'income') monthlyData[key].income += t.amount;
    else monthlyData[key].expense += t.amount;
  });

  const sortedMonths = Object.keys(monthlyData).sort();
  let runningBalance = 0;
  const chartData = sortedMonths.map((key) => {
    const { income, expense } = monthlyData[key];
    runningBalance += income - expense;
    return {
      month: getMonthLabel(`${key}-01`),
      income,
      expense,
      balance: runningBalance,
    };
  });

  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Balance Trend</h3>
        <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-600">
          No data to display
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 border border-gray-200 dark:border-gray-700">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Balance Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <defs>
              <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="balance" name="Balance" stroke="#6366f1" fill="url(#balanceGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="income" name="Income" stroke="#22c55e" fill="url(#incomeGrad)" strokeWidth={1.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
