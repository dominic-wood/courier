import hljs from 'highlight.js'
import 'highlight.js/styles/vs2015.css'
import { useState, useEffect, useRef } from 'react'

interface ResponseViewerProps {
  response: string
  error: string
  status: number | null
  duration: number | null
  isLoading: boolean
  contentType: string
}

const ResponseViewer = ({ response, error, status, duration, isLoading, contentType }: ResponseViewerProps) => {
  const [copied, setCopied] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if ((response || error) && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [response, error])

  useEffect(() => {
    if (codeRef.current && (response || error)) {
      hljs.highlightElement(codeRef.current)
    }
  }, [response, error, contentType])

  const handleCopy = () => {
    if (!response) return
    navigator.clipboard.writeText(response)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const getStatusStyle = (status: number) => {
    if (status >= 200 && status < 300) return 'border-green-500 text-green-300'
    if (status >= 400 && status < 500) return 'border-yellow-500 text-yellow-300'
    if (status >= 500) return 'border-red-500 text-red-300'
    return 'border-gray-600 text-white'
  }

  const detectedLang = contentType.includes('json')
    ? 'json'
    : contentType.includes('xml')
    ? 'xml'
    : 'plaintext'

  return (
    <div className="flex flex-col justify-between h-full" ref={containerRef}>
      <div className="space-y-6 text-sm">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
            <div className="flex items-center gap-2 text-gray-400 text-sm animate-pulse">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              <span>Sending request...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Status / Duration / Error */}
            {(status !== null || duration !== null || error) && (
              <div className="space-y-2">
                {status !== null && (
                  <div className={`bg-gray-800 border px-4 py-2 rounded flex items-center gap-2 ${getStatusStyle(status)}`}>
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
            )}

            {/* Syntax-highlighted Response */}
            {response ? (
              <div className="relative">
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 text-xs px-3 py-1 rounded bg-white text-black hover:bg-gray-200 transition shadow"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>

                <pre className="bg-gray-800 pt-10 p-4 rounded-md border border-gray-700 shadow-md overflow-auto sm:max-h-[61.8vh] whitespace-pre-wrap sm:whitespace-pre break-words">
                  <code ref={codeRef} className={`language-${detectedLang}`}>
                    {response}
                  </code>
                </pre>
              </div>
            ) : !error && !isLoading && (
              <p className="text-gray-400 text-sm italic">
                Submit a request to see the response here.
              </p>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 text-center text-xs text-gray-400 animate-fade-in">
        <img
          src="/response-icon.png"
          alt="Response Logo"
          className="h-6 mx-auto mb-2 opacity-70 hover:opacity-100 transition duration-500"
        />
        <p>© 2025 Courier – API Toolkit</p>
        <p>
          Created by{' '}
          <a
            href="https://github.com/dominic-wood"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5df464] hover:underline transition"
          >
            Dominic Wood
          </a>
        </p>
      </div>
    </div>
  )
}

export default ResponseViewer