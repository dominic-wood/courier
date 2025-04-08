// src/components/ResponseViewer.tsx
import { useState } from 'react'

interface ResponseViewerProps {
  response: string
  error: string
  status: number | null
}

const ResponseViewer = ({ response, error, status }: ResponseViewerProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!response) return
    navigator.clipboard.writeText(response)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white border-gray-700 pb-2">Response</h2>

      {status && (
        <div className="text-sm text-green-400 font-medium">
          ✅ Status: {status}
        </div>
      )}

      {error && (
        <div className="text-sm text-red-400 font-medium">
          ❌ Error: {error}
        </div>
      )}

      {response && (
        <div className="relative">
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 text-xs px-3 py-1 rounded bg-white text-black hover:bg-gray-200 transition"
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

      {!response && !error && (
        <p className="text-gray-400 text-sm">Submit a request to see the response here.</p>
      )}
    </div>
  )
}

export default ResponseViewer
