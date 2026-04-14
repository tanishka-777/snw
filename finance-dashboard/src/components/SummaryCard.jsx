import { formatCurrency } from '../utils/helpers';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function SummaryCard({ title, amount, icon: Icon, trend, color }) {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-500/10',
      icon: 'text-indigo-600 dark:text-indigo-400',
      trend: 'text-indigo-600 dark:text-indigo-400',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-500/10',
      icon: 'text-green-600 dark:text-green-400',
      trend: 'text-green-600 dark:text-green-400',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-500/10',
      icon: 'text-red-600 dark:text-red-400',
      trend: 'text-red-600 dark:text-red-400',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      icon: 'text-amber-600 dark:text-amber-400',
      trend: 'text-amber-600 dark:text-amber-400',
    },
  };

  const c = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(amount)}
          </p>
        </div>
        <div className={`p-2.5 rounded-lg ${c.bg}`}>
          <Icon size={20} className={c.icon} />
        </div>
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-3">
          {trend > 0 ? (
            <TrendingUp size={14} className="text-green-500" />
          ) : trend < 0 ? (
            <TrendingDown size={14} className="text-red-500" />
          ) : (
            <Minus size={14} className="text-gray-400" />
          )}
          <span
            className={`text-xs font-medium ${
              trend > 0
                ? 'text-green-600 dark:text-green-400'
                : trend < 0
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-500'
            }`}
          >
            {trend > 0 ? '+' : ''}
            {trend?.toFixed(1)}% vs last month
          </span>
        </div>
      )}
    </div>
  );
}
