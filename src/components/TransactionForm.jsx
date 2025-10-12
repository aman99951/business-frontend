// src/components/TransactionForm.jsx
import { useEffect, useState } from 'react'
import { listCategories, createTransaction, updateTransaction } from '../api'
import { 
  CalendarIcon, 
  CurrencyDollarIcon, 
  TagIcon, 
  DocumentTextIcon,
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline'

export default function TransactionForm({ initial, onSaved, onCancel }) {
  const [categories, setCats] = useState([])
  const [form, setForm] = useState(initial || { 
    category: '', 
    amount: '', 
    date: new Date().toISOString().split('T')[0], 
    description: '' 
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  useEffect(() => { 
    listCategories().then(setCats) 
  }, [])
  
  useEffect(() => { 
    setForm(initial || { 
      category: '', 
      amount: '', 
      date: new Date().toISOString().split('T')[0], 
      description: '' 
    }) 
  }, [initial])
  
  function set(k, v) { 
    setForm(s => ({ ...s, [k]: v }))
    // Clear error for this field when user types
    if (errors[k]) {
      setErrors(e => ({ ...e, [k]: null }))
    }
  }
  
  async function submit(e) { 
    e.preventDefault()
    setLoading(true)
    setErrors({})
    
    try {
      const payload = { ...form, amount: parseFloat(form.amount) }
      
      // Basic validation
      if (!payload.category) {
        setErrors({ category: 'Category is required' })
        setLoading(false)
        return
      }
      if (!payload.amount || payload.amount <= 0) {
        setErrors({ amount: 'Amount must be greater than 0' })
        setLoading(false)
        return
      }
      if (!payload.date) {
        setErrors({ date: 'Date is required' })
        setLoading(false)
        return
      }
      
      const resp = initial ? 
        await updateTransaction(initial.id, payload) : 
        await createTransaction(payload)
      
      // Reset form if creating new transaction
      if (!initial) {
        setForm({
          category: '',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          description: ''
        })
      }
      
      onSaved && onSaved(resp)
    } catch (error) {
      console.error('Error saving transaction:', error)
      setErrors({ 
        general: error.response?.data?.detail || 'An error occurred while saving' 
      })
    } finally {
      setLoading(false)
    }
  }

  // Get selected category details for visual feedback
  const selectedCategory = categories.results?.find(c => c.id == form.category) || 
                          categories.find?.(c => c.id == form.category)
  
  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Error Alert */}
      {errors.general && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
                      rounded-lg p-4 flex items-start gap-3">
          <ExclamationCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 dark:text-red-200">{errors.general}</p>
        </div>
      )}

      {/* Category Select */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-2 mb-2">
            <TagIcon className="w-4 h-4 text-gray-500" />
            <span>Category</span>
            <span className="text-red-500">*</span>
          </div>
        </label>
        <div className="relative">
          <select 
            value={form.category} 
            onChange={e => set('category', e.target.value)} 
            required
            className={`w-full px-4 py-3 pr-10 rounded-xl border transition-all duration-200
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     ${errors.category 
                       ? 'border-red-300 dark:border-red-600' 
                       : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                     }
                     ${selectedCategory ? 'font-medium' : ''}`}
          >
            <option value="" className="text-gray-500">Select a category</option>
            {(categories.results || categories).map(c => (
              <option key={c.id} value={c.id} className="py-2">
                {c.name} • {c.type === 'income' ? '💰' : '💸'} {c.type}
              </option>
            ))}
          </select>
          {selectedCategory && (
            <div className={`absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded-full text-xs font-medium
                          ${selectedCategory.type === 'income' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
              {selectedCategory.type}
            </div>
          )}
        </div>
        {errors.category && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
            <ExclamationCircleIcon className="w-4 h-4" />
            {errors.category}
          </p>
        )}
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-2 mb-2">
            <CurrencyDollarIcon className="w-4 h-4 text-gray-500" />
            <span>Amount</span>
            <span className="text-red-500">*</span>
          </div>
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 
                        font-medium pointer-events-none">
            $
          </div>
          <input 
            type="number" 
            step="0.01" 
            value={form.amount} 
            onChange={e => set('amount', e.target.value)} 
            required
            placeholder="0.00"
            className={`w-full pl-8 pr-4 py-3 rounded-xl border transition-all duration-200
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     ${errors.amount 
                       ? 'border-red-300 dark:border-red-600' 
                       : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'}`}
          />
          {form.amount && (
            <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold
                          ${selectedCategory?.type === 'income' 
                            ? 'text-green-600 dark:text-green-400' 
                            : selectedCategory?.type === 'expense'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-600 dark:text-gray-400'}`}>
              {selectedCategory?.type === 'income' ? '+' : selectedCategory?.type === 'expense' ? '-' : ''}
              ${parseFloat(form.amount || 0).toFixed(2)}
            </div>
          )}
        </div>
        {errors.amount && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
            <ExclamationCircleIcon className="w-4 h-4" />
            {errors.amount}
          </p>
        )}
      </div>

      {/* Date Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-2 mb-2">
            <CalendarIcon className="w-4 h-4 text-gray-500" />
            <span>Date</span>
            <span className="text-red-500">*</span>
          </div>
        </label>
        <div className="relative">
          <input 
            type="date" 
            value={form.date} 
            onChange={e => set('date', e.target.value)} 
            required
            max={new Date().toISOString().split('T')[0]}
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     ${errors.date 
                       ? 'border-red-300 dark:border-red-600' 
                       : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'}`}
          />
          <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 
                                 text-gray-400 pointer-events-none" />
        </div>
        {errors.date && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
            <ExclamationCircleIcon className="w-4 h-4" />
            {errors.date}
          </p>
        )}
      </div>

      {/* Description Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-2 mb-2">
            <DocumentTextIcon className="w-4 h-4 text-gray-500" />
            <span>Description</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">(Optional)</span>
          </div>
        </label>
        <div className="relative">
          <textarea
            value={form.description} 
            onChange={e => set('description', e.target.value)}
            rows={3}
            placeholder="Add notes about this transaction..."
            className="w-full px-4 py-3 rounded-xl border transition-all duration-200
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     border-gray-300 dark:border-gray-600 hover:border-gray-400
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     resize-none"
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            {form.description.length}/500
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 
                     dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 
                     transition-all duration-200 font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
        <button 
          type="submit"
          disabled={loading || !form.category || !form.amount || !form.date}
          className={`${onCancel ? 'flex-1' : 'w-full'} px-6 py-3 rounded-xl font-medium
                   transition-all duration-200 transform
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                   ${loading ? '' : 'hover:scale-[1.02] active:scale-[0.98]'}
                   ${initial 
                     ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' 
                     : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                   }
                   text-white shadow-lg hover:shadow-xl`}
        >
          <div className="flex items-center justify-center gap-2">
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <>
                {initial ? (
                  <>
                    <span>Update Transaction</span>
                  </>
                ) : (
                  <>
                    <span>Add Transaction</span>
                  </>
                )}
              </>
            )}
          </div>
        </button>
      </div>

      {/* Visual Summary (only when creating) */}
      {!initial && form.category && form.amount && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                selectedCategory?.type === 'income' ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="font-medium text-gray-900 dark:text-white">
                {selectedCategory?.name}
              </span>
            </div>
            <span className={`font-bold text-lg ${
              selectedCategory?.type === 'income' 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {selectedCategory?.type === 'income' ? '+' : '-'}${parseFloat(form.amount).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </form>
  )
}