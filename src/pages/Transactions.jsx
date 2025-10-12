// src/pages/Transactions.jsx
import { useEffect, useState } from 'react'
import { listCategories, listTransactions, deleteTransaction } from '../api'
import TransactionForm from '../components/TransactionForm'
import Pagination from '../components/Pagination'
import { 
  FunnelIcon, 
  PlusCircleIcon, 
  PencilSquareIcon, 
  TrashIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  TagIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'

function Transactions() {
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    min_amount: '',
    max_amount: '',
    start_date: '',
    end_date: ''
  })
  const [editing, setEditing] = useState(null)
  const [cats, setCats] = useState([])
  const [list, setList] = useState({ results: [], count: 0 })
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    listCategories().then(setCats)
  }, [])

  useEffect(() => {
    load()
  }, [page, filters])

  async function load() {
    const params = {
      page,
      ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
    }
    const data = await listTransactions(params)
    setList(data || { results: [], count: 0 })
  }

  async function onDelete(id) {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id)
      load()
    }
  }

  function setFilter(k, v) {
    setFilters(s => ({ ...s, [k]: v }))
    setPage(1)
  }

  function handleEdit(transaction) {
    setEditing({
      id: transaction.id,
      category: transaction.category,
      amount: transaction.amount,
      date: transaction.date,
      description: transaction.description
    })
    setShowModal(true)
  }

  function handleCloseModal() {
    setShowModal(false)
    setEditing(null)
  }

  function handleSaved() {
    handleCloseModal()
    load()
  }

  function resetFilters() {
    setFilters({
      type: '',
      category: '',
      min_amount: '',
      max_amount: '',
      start_date: '',
      end_date: ''
    })
  }

  const hasActiveFilters = Object.values(filters).some(v => v)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Transactions
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Manage your income and expenses
              </p>
            </div>
            <button
              onClick={() => {
                setEditing(null)
                setShowModal(true)
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 
                       text-white px-6 py-3 rounded-xl font-semibold
                       hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 
                       transition-all duration-200 shadow-lg"
            >
              <PlusCircleIcon className="w-5 h-5" />
              Add Transaction
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl mb-6 overflow-hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full p-6 flex items-center justify-between hover:bg-gray-50 
                     dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <FunnelIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-semibold text-gray-900 dark:text-white">
                Filters
              </span>
              {hasActiveFilters && (
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 
                               text-xs px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </div>
            <ChevronDownIcon 
              className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform duration-200 
                        ${showFilters ? 'rotate-180' : ''}`}
            />
          </button>

          <div className={`transition-all duration-300 ${showFilters ? 'max-h-96' : 'max-h-0'} overflow-hidden`}>
            <div className="p-6 pt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <ArrowTrendingUpIcon className="w-4 h-4" />
                  Type
                </label>
                <select
                  value={filters.type}
                  onChange={e => setFilter('type', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <TagIcon className="w-4 h-4" />
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={e => setFilter('category', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">All Categories</option>
                  {(cats.results || cats).map(c =>
                    <option key={c.id} value={c.id}>{c.name}</option>
                  )}
                </select>
              </div>

              {/* Amount Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <CurrencyDollarIcon className="w-4 h-4" />
                  Amount Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.min_amount}
                    onChange={e => setFilter('min_amount', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.max_amount}
                    onChange={e => setFilter('max_amount', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <CalendarDaysIcon className="w-4 h-4" />
                  Date Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={filters.start_date}
                    onChange={e => setFilter('start_date', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <input
                    type="date"
                    value={filters.end_date}
                    onChange={e => setFilter('end_date', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Reset Button */}
              {hasActiveFilters && (
                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 
                             dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 
                             transition-colors duration-200 font-medium"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 
                               dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 
                               dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 
                               dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 
                               dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 
                               dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                    Description
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 
                               dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {(list.results || []).map((t, index) => (
                  <tr key={t.id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold 
                                     rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 
                                     dark:text-blue-200">
                        {t.category_detail?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {t.category_detail?.type === 'income' ? (
                          <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${
                          t.category_detail?.type === 'income' 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {t.category_detail?.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-bold ${
                        t.category_detail?.type === 'income' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        ${t.amount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                      <div className="max-w-xs truncate">
                        {t.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(t)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 
                                   dark:hover:text-blue-300 transition-colors duration-150"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onDelete(t.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 
                                   dark:hover:text-red-300 transition-colors duration-150"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {list.results?.length === 0 && (
              <div className="text-center py-12">
                <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No transactions
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Get started by creating a new transaction.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {list.count > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
              <Pagination
                page={page}
                setPage={setPage}
                count={list.count || 0}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 bg-opacity-50 transition-opacity"
              onClick={handleCloseModal}
            />

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl 
                          max-w-md w-full p-6 transform transition-all animate-slideUp">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editing ? 'Edit Transaction' : 'New Transaction'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 
                           transition-colors duration-150"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <TransactionForm
                initial={editing}
                onSaved={handleSaved}
                onCancel={handleCloseModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Transactions