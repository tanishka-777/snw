import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, getMonthLabel } from '../utils/helpers';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import {
  TrendingUp, TrendingDown, AlertTriangle, Award,
  Calendar, Target, ArrowUpRight, ArrowDownRight, Zap,
} from 'lucide-react';

export default function Insights() {
  const { state } = useApp();
  const { transactions } = state;

  const insights = useMemo(() => {
    if (transactions.length === 0) return null;

    const expenses = transactions.filter((t) => t.type === 'expense');
    const incomes = transactions.filter((t) => t.type === 'income');

    // Category spending
    const categorySpending = {};
    expenses.forEach((t) => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
    });
    const sortedCategories = Object.entries(categorySpending).sort((a, b) => b[1] - a[1]);
    const highestCategory = sortedCategories[0] || ['N/A', 0];
    const lowestCategory = sortedCategories[sortedCategories.length - 1] || ['N/A', 0];

    // Monthly data
    const monthlyExpenses = {};
    const monthlyIncome = {};
    expenses.forEach((t) => {
      const key = t.date.slice(0, 7);
      monthlyExpenses[key] = (monthlyExpenses[key] || 0) + t.amount;
    });
    incomes.forEach((t) => {
      const key = t.date.slice(0, 7);
      monthlyIncome[key] = (monthlyIncome[key] || 0) + t.amount;
    });

    const months = [...new Set([...Object.keys(monthlyExpenses), ...Object.keys(monthlyIncome)])].sort();
    const monthlyComparison = months.map((m) => ({
      month: getMonthLabel(`${m}-01`),
      key: m,
      expenses: monthlyExpenses[m] || 0,
      income: monthlyIncome[m] || 0,
      savings: (monthlyIncome[m] || 0) - (monthlyExpenses[m] || 0),
    }));

    // Most expensive month
    const expensiveMonth = monthlyComparison.reduce(
      (max, m) => (m.expenses > max.expenses ? m : max),
      monthlyComparison[0]
    );

    // Best savings month
    const bestSavingsMonth = monthlyComparison.reduce(
      (max, m) => (m.savings > max.savings ? m : max),
      monthlyComparison[0]
    );

    // Average daily spending
    const totalExpenses = expenses.reduce((s, t) => s + t.amount, 0);
    const daySet = new Set(expenses.map((t) => t.date));
    const avgDailySpending = daySet.size > 0 ? totalExpenses / daySet.size : 0;

    // Average transaction amount
    const avgExpenseAmount = expenses.length > 0 ? totalExpenses / expenses.length : 0;
    const totalIncome = incomes.reduce((s, t) => s + t.amount, 0);
    const avgIncomeAmount = incomes.length > 0 ? totalIncome / incomes.length : 0;

    // Savings rate
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    // Category radar data
    const radarData = sortedCategories.slice(0, 6).map(([name, value]) => ({
      category: name.length > 10 ? name.slice(0, 10) + '…' : name,
      amount: value,
      fullMark: highestCategory[1],
    }));

    // Month over month growth
    const lastTwo = monthlyComparison.slice(-2);
    const expenseGrowth =
      lastTwo.length === 2 && lastTwo[0].expenses > 0
        ? ((lastTwo[1].expenses - lastTwo[0].expenses) / lastTwo[0].expenses) * 100
        : 0;

    return {
      highestCategory,
      lowestCategory,
      monthlyComparison,
      expensiveMonth,
      bestSavingsMonth,
      avgDailySpending,
      avgExpenseAmount,
      avgIncomeAmount,
      savingsRate,
      totalExpenses,
      totalIncome,
      radarData,
      expenseGrowth,
      sortedCategories,
    };
  }, [transactions]);

  if (!insights) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 dark:text-gray-600">No data available for insights</p>
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

  const insightCards = [
    {
      title: 'Highest Spending Category',
      value: insights.highestCategory[0],
      subtext: formatCurrency(insights.highestCategory[1]),
      icon: AlertTriangle,
      color: 'red',
    },
    {
      title: 'Lowest Spending Category',
      value: insights.lowestCategory[0],
      subtext: formatCurrency(insights.lowestCategory[1]),
      icon: Award,
      color: 'green',
    },
    {
      title: 'Most Expensive Month',
      value: insights.expensiveMonth?.month || 'N/A',
      subtext: formatCurrency(insights.expensiveMonth?.expenses || 0),
      icon: Calendar,
      color: 'amber',
    },
    {
      title: 'Best Savings Month',
      value: insights.bestSavingsMonth?.month || 'N/A',
      subtext: formatCurrency(insights.bestSavingsMonth?.savings || 0) + ' saved',
      icon: Target,
      color: 'indigo',
    },
  ];

  const colorMap = {
    red: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Financial Insights</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Key observations from your financial activity
        </p>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {insightCards.map((card) => (
          <div
            key={card.title}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-2 rounded-lg ${colorMap[card.color]}`}>
                <card.icon size={16} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{card.title}</p>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{card.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{card.subtext}</p>
          </div>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} className="text-amber-500" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">Avg Daily Spending</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(insights.avgDailySpending)}
          </p>
          <p className="text-xs text-gray-500 mt-1">per active spending day</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-indigo-500" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">Savings Rate</p>
          </div>
          <p className={`text-2xl font-bold ${
            insights.savingsRate >= 20
              ? 'text-green-600 dark:text-green-400'
              : insights.savingsRate >= 0
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-red-600 dark:text-red-400'
          }`}>
            {insights.savingsRate.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {insights.savingsRate >= 20
              ? 'Great! Above recommended 20%'
              : insights.savingsRate >= 0
              ? 'Consider saving more'
              : 'Spending exceeds income'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center gap-2 mb-2">
            {insights.expenseGrowth <= 0 ? (
              <TrendingDown size={16} className="text-green-500" />
            ) : (
              <TrendingUp size={16} className="text-red-500" />
            )}
            <p className="text-sm font-medium text-gray-900 dark:text-white">Expense Trend</p>
          </div>
          <p className={`text-2xl font-bold ${
            insights.expenseGrowth <= 0
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}>
            {insights.expenseGrowth > 0 ? '+' : ''}{insights.expenseGrowth.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">vs previous month</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Savings Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Monthly Savings</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={insights.monthlyComparison} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="savings" name="Savings" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending Radar */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Spending Pattern</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={insights.radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <PolarRadiusAxis tick={false} axisLine={false} />
                <Radar
                  name="Spending"
                  dataKey="amount"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Category Breakdown</h3>
        <div className="space-y-3">
          {insights.sortedCategories.map(([name, amount]) => {
            const pct = (amount / insights.totalExpenses) * 100;
            return (
              <div key={name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{name}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(amount)} ({pct.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
