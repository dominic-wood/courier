import { useState, useEffect, useRef } from 'react'

interface ResponseViewerProps {
  response: string
  error: string
  status: number | null
  duration: number | null
  isLoading: boolean
}

const ResponseViewer = ({ response, error, status, duration, isLoading }: ResponseViewerProps) => {
  const [copied, setCopied] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll on response
  useEffect(() => {
    if ((response || error) && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [response, error])

  useEffect(() => {
    if (status === null && !error && !response) {
    }
  }, [status, error, response])

  const handleCopy = () => {
    if (!response) return
    navigator.clipboard.writeText(response)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="space-y-6 text-sm" ref={containerRef}>
      <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-2">
        Response
      </h2>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="flex items-center gap-2 text-gray-400 text-sm animate-pulse">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          Sending request...
        </div>
      )}


      {/* Status / Duration / Error */}
      <div className="space-y-2">
        {status !== null && (
          <div className="bg-gray-800 border border-green-500 text-green-300 px-4 py-2 rounded flex items-center gap-2">
            <span>📤</span> <span>Status: {status}</span>
          </div>
        )}

        {duration !== null && (
          <div className="bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded">
            🕒 Duration: {duration}ms
          </div>
        )}

        {error && (
          <div className="bg-gray-800 border border-[#ed1c24] text-red-400 px-4 py-2 rounded">
            ❌ Error: {error}
          </div>
        )}
      </div>

      {/* JSON Response */}
      {response && (
        <div className="relative">
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 text-xs px-3 py-1 rounded bg-white text-black hover:bg-gray-200 transition shadow"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>

          <div className="bg-gray-800 p-4 rounded-md border border-gray-700 shadow-md overflow-auto max-h-[70vh]">
            <pre className="whitespace-pre-wrap break-words text-sm text-green-300 font-mono">
              {response}
            </pre>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!response && !error && !isLoading && (
        <p className="text-gray-400 text-sm italic">
          Submit a request to see the response here.
        </p>
      )}
    </div>
  )
}

export default ResponseViewer
