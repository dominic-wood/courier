import { useEffect, useState } from 'react'

export interface RequestEntry {
  id: string
  url: string
  method: string
  timestamp: string
}

interface RequestHistoryProps {
  onSelect: (entry: RequestEntry) => void
}

const RequestHistory = ({ onSelect }: RequestHistoryProps) => {
  const [history, setHistory] = useState<RequestEntry[]>([])

  useEffect(() => {
    const loadHistory = () => {
      const stored = localStorage.getItem('requestHistory')
      if (stored) {
        setHistory(JSON.parse(stored))
      }
    }

    loadHistory()
    window.addEventListener('request-history-updated', loadHistory)
    return () => {
      window.removeEventListener('request-history-updated', loadHistory)
    }
  }, [])

  const handleSelect = (entry: RequestEntry) => {
    onSelect(entry)
  }

  const handleClear = () => {
    localStorage.removeItem('requestHistory')
    setHistory([])
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const then = new Date(timestamp)
    const diff = Math.floor((now.getTime() - then.getTime()) / 1000)

    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return then.toLocaleDateString()
  }

  const getMethodStyle = (method: string) => {
    const base = 'text-white px-2 py-0.5 rounded font-mono text-xs'
    switch (method) {
      case 'GET': return `${base} bg-green-600`
      case 'POST': return `${base} bg-blue-600`
      case 'PUT': return `${base} bg-yellow-600`
      case 'DELETE': return `${base} bg-red-600`
      case 'PATCH': return `${base} bg-purple-600`
      default: return `${base} bg-black`
    }
  }

  return (
    <div className="mt-6 border-t border-gray-300 pt-4 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-black">Request History</h3>
        <button
          className="text-xs text-[#ed1c24] hover:underline"
          onClick={handleClear}
        >
          Clear
        </button>
      </div>
      <div className="overflow-y-auto max-h-[160px] sm:max-h-[160px]">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {history.map((entry) => (
            <li key={entry.id}>
              <button
                className="w-full text-left p-3 border border-gray-300 rounded hover:border-black transition"
                onClick={() => handleSelect(entry)}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={getMethodStyle(entry.method)}>{entry.method}</span>
                  <span className="text-gray-400">{getTimeAgo(entry.timestamp)}</span>
                </div>
                <div className="text-sm text-gray-700 break-words">
                  {entry.url}
                </div>
              </button>
            </li>
          ))}
          {history.length === 0 && (
            <li className="text-xs text-gray-400">No requests made yet.</li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default RequestHistory