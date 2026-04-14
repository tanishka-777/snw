import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';

const COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#22c55e',
  '#06b6d4', '#f97316', '#14b8a6', '#ef4444', '#64748b',
];

export default function SpendingBreakdownChart() {
  const { state } = useApp();
  const { transactions } = state;

  const expenses = transactions.filter((t) => t.type === 'expense');
  const categoryMap = {};
  expenses.forEach((t) => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
  });

  const data = Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((s, d) => s + d.value, 0);

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Spending Breakdown</h3>
        <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-600">
          No expense data
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const { name, value } = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 border border-gray-200 dark:border-gray-700">
        <p className="text-xs font-medium text-gray-900 dark:text-white">{name}</p>
        <p className="text-xs text-gray-500">{formatCurrency(value)} ({((value / total) * 100).toFixed(1)}%)</p>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Spending Breakdown</h3>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-48 h-48 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1.5 w-full">
          {data.slice(0, 8).map((item, i) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {item.name}
              </span>
              <span className="text-xs font-medium text-gray-900 dark:text-gray-200 ml-auto">
                {((item.value / total) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
