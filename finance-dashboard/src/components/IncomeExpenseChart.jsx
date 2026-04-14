import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { getMonthLabel, formatCurrency } from '../utils/helpers';

export default function IncomeExpenseChart() {
  const { state } = useApp();
  const { transactions } = state;

  const monthlyData = {};
  transactions.forEach((t) => {
    const key = t.date.slice(0, 7);
    if (!monthlyData[key]) monthlyData[key] = { income: 0, expense: 0 };
    if (t.type === 'income') monthlyData[key].income += t.amount;
    else monthlyData[key].expense += t.amount;
  });

  const chartData = Object.keys(monthlyData)
    .sort()
    .map((key) => ({
      month: getMonthLabel(`${key}-01`),
      Income: monthlyData[key].income,
      Expenses: monthlyData[key].expense,
    }));

  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Income vs Expenses</h3>
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
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Income vs Expenses</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
