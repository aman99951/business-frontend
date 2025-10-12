// pages/Dashboard.jsx
import { useEffect, useState } from 'react'
import { getSummary } from '../api'
import D3Donut from '../components/D3Donut'
import D3Bar from '../components/D3Bar'
import { 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  ChartPieIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  WalletIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeRange, setTimeRange] = useState('month')

  useEffect(() => {
    loadSummary()
  }, [timeRange])

  async function loadSummary() {
    setLoading(true)
    try {
      const data = await getSummary()
      console.log('Summary data:', data)
      setSummary(data)
      setError(null)
    } catch (err) {
      console.error('Error loading summary:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
              <ArrowTrendingDownIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Error loading data</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{error}</p>
            <button 
              onClick={loadSummary}
              className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-xl 
                       hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No data available</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Start by adding some transactions.</p>
        </div>
      </div>
    )
  }

  // Parse data
  const income = summary.by_category
    ?.filter(c => c.category__type === 'income')
    ?.map(c => ({ label: c.category__name, value: parseFloat(c.total) || 0 })) || []

  const expense = summary.by_category
    ?.filter(c => c.category__type === 'expense')
    ?.map(c => ({ label: c.category__name, value: parseFloat(c.total) || 0 })) || []

  const totalIncome = parseFloat(summary.total_income) || 0
  const totalExpense = parseFloat(summary.total_expense) || 0
  const balance = parseFloat(summary.balance) || 0
  
  const balancePercentage = totalIncome > 0 
    ? ((balance / totalIncome) * 100).toFixed(1)
    : 0

  const isPositiveBalance = balance >= 0

  // Calculate changes (mock data for demo - replace with real data)
  const incomeChange = 12.5
  const expenseChange = -8.2
  const incomeMonthlyChange = 23
  const expenseMonthlyChange = -15

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="w-full mx-auto">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Financial Dashboard
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Track your income, expenses and savings
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                <button 
                  onClick={() => setTimeRange('week')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    timeRange === 'week' 
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-md' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Week
                </button>
                <button 
                  onClick={() => setTimeRange('month')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    timeRange === 'month' 
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-md' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Month
                </button>
                <button 
                  onClick={() => setTimeRange('year')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    timeRange === 'year' 
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-md' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Year
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Total Income Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 
                        transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 
                            dark:from-green-900 dark:to-green-800 rounded-xl">
                <ArrowTrendingUpIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex items-center gap-1">
                {incomeChange > 0 ? (
                  <ArrowUpIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                )}
                <span className={`text-sm font-bold ${
                  incomeChange > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {Math.abs(incomeChange)}%
                </span>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Total Income
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              ${totalIncome.toLocaleString()}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: '75%' }}
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {incomeMonthlyChange > 0 ? '+' : ''}{incomeMonthlyChange}%
              </span>
            </div>
          </div>

          {/* Total Expenses Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 
                        transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-red-100 to-red-200 
                            dark:from-red-900 dark:to-red-800 rounded-xl">
                <ArrowTrendingDownIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex items-center gap-1">
                {expenseChange < 0 ? (
                  <ArrowDownIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <ArrowUpIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                )}
                <span className={`text-sm font-bold ${
                  expenseChange < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {Math.abs(expenseChange)}%
                </span>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Total Expenses
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              ${totalExpense.toLocaleString()}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: '60%' }}
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {expenseMonthlyChange}%
              </span>
            </div>
          </div>

          {/* Balance Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 
                        transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                isPositiveBalance 
                  ? 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800' 
                  : 'bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800'
              }`}>
                <WalletIcon className={`h-6 w-6 ${
                  isPositiveBalance ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'
                }`} />
              </div>
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                isPositiveBalance 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                  : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
              }`}>
                {balancePercentage}%
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Current Balance
            </h3>
            <p className={`text-3xl font-bold mb-2 ${
              isPositiveBalance ? 'text-gray-900 dark:text-white' : 'text-orange-600 dark:text-orange-400'
            }`}>
              ${Math.abs(balance).toLocaleString()}
              {!isPositiveBalance && <span className="text-lg ml-2">(Deficit)</span>}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    isPositiveBalance 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                      : 'bg-gradient-to-r from-orange-500 to-orange-600'
                  }`}
                  style={{ width: `${Math.min(Math.abs(balancePercentage), 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Income Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <ChartPieIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Income by Category
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Distribution of income sources
                  </p>
                </div>
              </div>

         
            </div>
            <div className="relative">
              {income.length > 0 ? (
                <D3Donut 
                  data={income} 
                  width={400} 
                  height={300}
                  colorScheme={['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5']}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  <BanknotesIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No income data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Expense Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <ChartPieIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Expenses by Category
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Breakdown of spending
                  </p>
                </div>
              </div>
            
            </div>
            <div className="relative">
              {expense.length > 0 ? (
                <D3Donut 
                  data={expense} 
                  width={400} 
                  height={300}
                  colorScheme={['#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2']}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  <CurrencyDollarIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No expense data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Monthly Trend Chart */}
        {(expense.length > 0 || income.length > 0) && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <ChartBarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Monthly Comparison
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Track your monthly spending patterns
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Expenses</span>
                </div>
              </div>
            </div>
            <D3Bar 
              data={expense.length > 0 ? expense : income} 
              width={1200} 
              height={320}
              colorScheme={['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe']}
            />
          </div>
        )}

        {/* Quick Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <CalendarDaysIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Quick Statistics
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
              <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Avg. Daily Income</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                ${(totalIncome / 30).toFixed(0)}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl">
              <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">Avg. Daily Expense</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                ${(totalExpense / 30).toFixed(0)}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
              <p className="text-xs text-green-600 dark:text-green-400 mb-1">Savings Rate</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {totalIncome > 0 ? ((balance / totalIncome * 100).toFixed(0)) : 0}%
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl">
              <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">Transactions</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {(income.length + expense.length)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}