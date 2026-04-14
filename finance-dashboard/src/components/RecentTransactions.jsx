import { formatCurrency, formatDate } from '../utils/helpers';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function RecentTransactions({ transactions }) {
  const recent = transactions.slice(0, 5);

  if (recent.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
        <div className="py-8 text-center text-gray-400 dark:text-gray-600 text-sm">
          No transactions yet
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
      <div className="space-y-3">
        {recent.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 group"
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                t.type === 'income'
                  ? 'bg-green-50 dark:bg-green-500/10'
                  : 'bg-red-50 dark:bg-red-500/10'
              }`}
            >
              {t.type === 'income' ? (
                <ArrowUpRight size={14} className="text-green-600 dark:text-green-400" />
              ) : (
                <ArrowDownRight size={14} className="text-red-600 dark:text-red-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {t.description}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {t.category} · {formatDate(t.date)}
              </p>
            </div>
            <span
              className={`text-sm font-semibold whitespace-nowrap ${
                t.type === 'income'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
