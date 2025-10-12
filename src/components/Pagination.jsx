// components/Pagination.jsx
import { 
  ChevronDoubleLeftIcon, 
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon 
} from '@heroicons/react/24/outline'

export default function Pagination({ page, setPage, count, pageSize = 10 }) {
  const totalPages = Math.ceil((count || 0) / pageSize)
  const startItem = ((page - 1) * pageSize) + 1
  const endItem = Math.min(page * pageSize, count)

  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []
    let l

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
        range.push(i)
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l !== 1) {
          rangeWithDots.push('...')
        }
      }
      rangeWithDots.push(i)
      l = i
    })

    return rangeWithDots
  }

  const pageNumbers = totalPages > 0 ? getPageNumbers() : []

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Results Info */}
      <div className="text-sm text-gray-700 dark:text-gray-300">
        {count > 0 ? (
          <>
            Showing <span className="font-semibold text-gray-900 dark:text-white">{startItem}</span> to{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{endItem}</span> of{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{count}</span> results
          </>
        ) : (
          'No results found'
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          {/* First Page Button */}
          <button
            onClick={() => setPage(1)}
            disabled={page <= 1}
            className={`
              p-2 rounded-lg transition-all duration-200 
              ${page <= 1
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }
            `}
            title="First page"
          >
            <ChevronDoubleLeftIcon className="h-5 w-5" />
          </button>

          {/* Previous Page Button */}
          <button
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            className={`
              p-2 rounded-lg transition-all duration-200 
              ${page <= 1
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }
            `}
            title="Previous page"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>

          {/* Page Numbers */}
          <div className="hidden sm:flex items-center gap-1 mx-2">
            {pageNumbers.map((pageNum, index) => (
              pageNum === '...' ? (
                <span key={`dots-${index}`} className="px-3 py-2 text-gray-400 dark:text-gray-500">
                  …
                </span>
              ) : (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`
                    min-w-[40px] px-3 py-2 rounded-lg font-medium transition-all duration-200
                    ${page === pageNum
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  {pageNum}
                </button>
              )
            ))}
          </div>

          {/* Mobile Page Indicator */}
          <div className="flex sm:hidden items-center gap-2 mx-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page
            </span>
            <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold">
              {page}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              of {totalPages}
            </span>
          </div>

          {/* Next Page Button */}
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
            className={`
              p-2 rounded-lg transition-all duration-200 
              ${page >= totalPages
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }
            `}
            title="Next page"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>

          {/* Last Page Button */}
          <button
            onClick={() => setPage(totalPages)}
            disabled={page >= totalPages}
            className={`
              p-2 rounded-lg transition-all duration-200 
              ${page >= totalPages
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }
            `}
            title="Last page"
          >
            <ChevronDoubleRightIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  )
}