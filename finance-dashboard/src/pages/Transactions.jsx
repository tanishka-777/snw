import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/transactions';
import { formatCurrency, formatDate, exportToCSV, exportToJSON } from '../utils/helpers';
import TransactionModal from '../components/TransactionModal';
import {
  Search, Filter, Plus, Pencil, Trash2, ArrowUpDown,
  ArrowUpRight, ArrowDownRight, Download, X, ChevronLeft, ChevronRight,
} from 'lucide-react';

const PAGE_SIZE = 10;

export default function Transactions() {
  const { state, dispatch } = useApp();
  const { transactions, role, filters } = state;
  const isAdmin = role === 'admin';

  const [showModal, setShowModal] = useState(false);
  const [editingTxn, setEditingTxn] = useState(null);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Apply filters
  const filtered = useMemo(() => {
    let result = [...transactions];

    // Search
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(s) ||
          t.category.toLowerCase().includes(s)
      );
    }

    // Type
    if (filters.type !== 'all') {
      result = result.filter((t) => t.type === filters.type);
    }

    // Category
    if (filters.category !== 'all') {
      result = result.filter((t) => t.category === filters.category);
    }

    // Date range
    if (filters.dateFrom) {
      result = result.filter((t) => t.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      result = result.filter((t) => t.date <= filters.dateTo);
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      if (filters.sortBy === 'date') cmp = a.date.localeCompare(b.date);
      else if (filters.sortBy === 'amount') cmp = a.amount - b.amount;
      else if (filters.sortBy === 'category') cmp = a.category.localeCompare(b.category);
      return filters.sortOrder === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [transactions, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const setFilter = (key, value) => {
    dispatch({ type: 'SET_FILTER', payload: { key, value } });
    setPage(1);
  };

  const toggleSort = (column) => {
    if (filters.sortBy === column) {
      setFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setFilter('sortBy', column);
      setFilter('sortOrder', 'desc');
    }
  };

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  const handleEdit = (txn) => {
    setEditingTxn(txn);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTxn(null);
  };

  const activeFiltersCount = [
    filters.type !== 'all',
    filters.category !== 'all',
    filters.dateFrom,
    filters.dateTo,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Transactions</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filtered.length} transaction{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Export */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Download size={15} />
              <span className="hidden sm:inline">Export</span>
            </button>
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 hidden group-hover:block z-10 min-w-[120px]">
              <button
                onClick={() => exportToCSV(filtered)}
                className="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Export CSV
              </button>
              <button
                onClick={() => exportToJSON(filtered)}
                className="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Export JSON
              </button>
            </div>
          </div>

          {/* Add Transaction (Admin only) */}
          {isAdmin && (
            <button
              onClick={() => { setEditingTxn(null); setShowModal(true); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
            >
              <Plus size={15} />
              <span className="hidden sm:inline">Add Transaction</span>
            </button>
          )}
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
              showFilters || activeFiltersCount > 0
                ? 'border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
                : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <Filter size={15} />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilter('type', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilter('category', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">From Date</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilter('dateFrom', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">To Date</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilter('dateTo', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
              <button
                onClick={() => { dispatch({ type: 'RESET_FILTERS' }); setPage(1); }}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={13} />
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {paginated.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-400 dark:text-gray-600 text-sm">No transactions match your filters</p>
            <button
              onClick={() => dispatch({ type: 'RESET_FILTERS' })}
              className="mt-2 text-indigo-600 dark:text-indigo-400 text-sm hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    {[
                      { key: 'date', label: 'Date' },
                      { key: null, label: 'Description' },
                      { key: 'category', label: 'Category' },
                      { key: 'amount', label: 'Amount' },
                    ].map(({ key, label }) => (
                      <th
                        key={label}
                        className={`px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                          key ? 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none' : ''
                        }`}
                        onClick={key ? () => toggleSort(key) : undefined}
                      >
                        <span className="flex items-center gap-1">
                          {label}
                          {key && filters.sortBy === key && (
                            <ArrowUpDown size={12} className="text-indigo-500" />
                          )}
                        </span>
                      </th>
                    ))}
                    {isAdmin && (
                      <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {paginated.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-5 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {formatDate(t.date)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              t.type === 'income'
                                ? 'bg-green-50 dark:bg-green-500/10'
                                : 'bg-red-50 dark:bg-red-500/10'
                            }`}
                          >
                            {t.type === 'income' ? (
                              <ArrowUpRight size={13} className="text-green-600 dark:text-green-400" />
                            ) : (
                              <ArrowDownRight size={13} className="text-red-600 dark:text-red-400" />
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {t.description}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                          {t.category}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-sm font-semibold ${
                            t.type === 'income'
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEdit(t)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-500/10 transition-colors"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(t.id)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
              {paginated.map((t) => (
                <div key={t.id} className="p-4 flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      t.type === 'income'
                        ? 'bg-green-50 dark:bg-green-500/10'
                        : 'bg-red-50 dark:bg-red-500/10'
                    }`}
                  >
                    {t.type === 'income' ? (
                      <ArrowUpRight size={16} className="text-green-600 dark:text-green-400" />
                    ) : (
                      <ArrowDownRight size={16} className="text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{t.description}</p>
                    <p className="text-xs text-gray-500">{t.category} · {formatDate(t.date)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-semibold ${
                      t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </p>
                    {isAdmin && (
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <button onClick={() => handleEdit(t)} className="p-1 text-gray-400 hover:text-indigo-600">
                          <Pencil size={12} />
                        </button>
                        <button onClick={() => handleDelete(t.id)} className="p-1 text-gray-400 hover:text-red-600">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                      pageNum === currentPage
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <TransactionModal transaction={editingTxn} onClose={handleCloseModal} />
      )}
    </div>
  );
}
