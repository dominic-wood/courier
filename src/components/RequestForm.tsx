// src/components/RequestForm.tsx
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import RequestHistory, { RequestEntry } from './RequestHistory'

interface RequestFormProps {
  onResponse: (response: string) => void
  onError: (error: string) => void
  onStatus: (status: number | null) => void
  onDuration: (duration: number | null) => void
  onLoading: () => void
}

const RequestForm = ({ onResponse, onError, onStatus, onDuration, onLoading }: RequestFormProps) => {
  const [url, setUrl] = useState('https://')
  const [method, setMethod] = useState('GET')
  const [body, setBody] = useState('')
  const [headers, setHeaders] = useState([{ key: '', value: '' }])

  const handleHistorySelect = (entry: RequestEntry) => {
    setUrl(entry.url)
    setMethod(entry.method)
  }

  const handleHeaderChange = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...headers]
    updated[index][field] = value
    setHeaders(updated)
  }

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }])
  }

  const removeHeader = (index: number) => {
    const updated = headers.filter((_, i) => i !== index)
    setHeaders(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onLoading()
    onError('')
    onResponse('')
    onStatus(null)

    try {
      const headerObj: Record<string, string> = {}
      headers.forEach(({ key, value }) => {
        if (key.trim()) {
          headerObj[key.trim()] = value.trim()
        }
      })

      const options: RequestInit = {
        method,
        headers: headerObj,
      }

      if (method !== 'GET' && body) {
        options.body = body
      }

      const finalUrl = /^(http|https):\/\//.test(url) ? url : `https://${url}`

      const start = performance.now()
      const res = await fetch(finalUrl, options)
      const end = performance.now()

      onDuration(Math.round(end - start))

      const text = await res.text()

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText || 'Something went wrong'}`)
      }

      onStatus(res.status)

      try {
        const json = JSON.parse(text)
        onResponse(JSON.stringify(json, null, 2))
      } catch {
        onResponse(text)
      }

      // Save to request history
      const entry: RequestEntry = {
        id: uuidv4(),
        url: finalUrl,
        method,
        timestamp: new Date().toISOString(),
      }

      const existing = localStorage.getItem('requestHistory')
      const history: RequestEntry[] = existing ? JSON.parse(existing) : []
      const updatedHistory = [entry, ...history.slice(0, 19)]
      localStorage.setItem('requestHistory', JSON.stringify(updatedHistory))
      window.dispatchEvent(new Event('request-history-updated'))
    } catch (err: any) {
      onError(err.message || 'Request failed')
    }
  }

  return (
    <div className="flex flex-col justify-between h-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-black">Request URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/api"
            className="w-full px-4 py-2 border border-black rounded-md"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-black">Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full px-4 py-2 border border-black rounded-md"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
            <option>PATCH</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-black">Headers</label>
          <div className="space-y-2">
            {headers.map((header, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Header Key"
                  value={header.key}
                  onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                  className="w-1/2 px-3 py-1 border border-black rounded"
                />
                <input
                  type="text"
                  placeholder="Header Value"
                  value={header.value}
                  onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                  className="w-1/2 px-3 py-1 border border-black rounded"
                />
                <button
                  type="button"
                  onClick={() => removeHeader(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addHeader}
              className="text-[#ed1c24] hover:underline text-sm"
            >
              + Add Header
            </button>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium text-black">Request Body (JSON)</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={`{
  "title": "Hello World"
}`}
            className="w-full px-4 py-2 border border-black rounded-md font-mono text-sm min-h-[100px]"
            disabled={method === 'GET'}
          />
        </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-[#ed1c24] text-white px-6 py-2 rounded-md hover:bg-red-700"
        >
          Send Request
        </button>
      </div>
      </form>

      {/* Request History */}
      <RequestHistory onSelect={handleHistorySelect} />

      {/* Footer */}
      <div className="mt-8 pt-4 text-center text-xs text-gray-400 animate-fade-in">
        <img
          src="/courier-icon.png"
          alt="Courier Logo"
          className="h-6 mx-auto mb-2 opacity-90 hover:opacity-100 transition duration-300"
        />
        <p>© 2025 Courier – API Toolkit</p>
        <p>
          Created by{' '}
          <a
            href="https://github.com/dominic-wood"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ed1c24] hover:underline transition"
          >
            Dominic Wood
          </a>
        </p>
      </div>
    </div>
  )
}

export default RequestForm
