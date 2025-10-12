import { useEffect, useState } from 'react'
import { listBudgets, createBudget, currentBudget } from '../api'
import D3Bar from '../components/D3Bar'

export default function Budget(){
  const [budgets, setBudgets] = useState([])
  const [form, setForm] = useState({ year: new Date().getFullYear(), month: new Date().getMonth()+1, amount: '' })
  const [current, setCurrent] = useState(null)
  function set(k,v){ setForm(s=>({...s, [k]:v})) }
  async function load(){ setBudgets(await listBudgets()); setCurrent(await currentBudget()) }
  useEffect(()=>{ load() }, [])
  async function onSubmit(e){ e.preventDefault(); await createBudget({...form, amount: parseFloat(form.amount)}); await load() }
  const chartData = current?.budget ? [{label:'Budget', value: parseFloat(current.budget.amount)}, {label:'Actual', value: parseFloat(current.actual_expense)}] : []
  
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="w-full mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">Budget Management</h1>
            </div>
          </div>
        </div>
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">        
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white ml-3 sm:ml-4">Set Budget</h3>
            </div>
            <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Year</label>
                <input type="number" value={form.year} onChange={e=>set('year', parseInt(e.target.value||0))} required 
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/50 transition"/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Month</label>
                <input type="number" min="1" max="12" value={form.month} onChange={e=>set('month', parseInt(e.target.value||0))} required 
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/50 transition"/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Amount</label>
                <input type="number" step="0.01" value={form.amount} onChange={e=>set('amount', e.target.value)} required 
                  placeholder="0.00" className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/50 transition"/>
              </div>
              <button type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white font-semibold py-2.5 sm:py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transform hover:scale-105 transition-all shadow-lg">
                Save Budget
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white ml-3 sm:ml-4">Monthly Overview</h3>
            </div>
            {chartData.length ? (
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                <D3Bar data={chartData}/>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-gray-400 dark:text-gray-500">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                </svg>
                <p className="text-sm font-medium">No budget set for current month</p>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-xl transition-shadow lg:col-span-1">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white ml-3 sm:ml-4">All Budgets</h3>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="max-h-80 sm:max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900/50 sticky top-0">
                    <tr>
                      <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Year</th>
                      <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Month</th>
                      <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                    {(budgets.results||budgets).map(b=>
                      <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{b.year}</td>
                        <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-600 dark:text-gray-400">{b.month}</td>
                        <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-semibold text-green-600 dark:text-green-400">${b.amount}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}