// components/RequestForm.tsx
import { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import RequestHistory, { RequestEntry } from './RequestHistory'
import AuthHelper, { AuthHeader } from './AuthHelper'

interface RequestFormProps {
  onResponse: (response: string, contentType: string) => void
  onError: (error: string) => void
  onStatus: (status: number | null) => void
  onDuration: (duration: number | null) => void
  onLoading: () => void
}

type TabId = 'auth' | 'headers'

const RequestForm: React.FC<RequestFormProps> = ({ onResponse, onError, onStatus, onDuration, onLoading }) => {
  const [url, setUrl] = useState('https://')
  const [method, setMethod] = useState('GET')
  const [body, setBody] = useState('')
  const [headers, setHeaders] = useState([{ key: '', value: '' }])
  const [authHeader, setAuthHeader] = useState<AuthHeader>({})
  const [activeTab, setActiveTab] = useState<TabId>('headers')

  const urlInputRef = useRef<HTMLInputElement>(null)

  interface TabButtonProps {
    id: TabId
    label: string
    disabled?: boolean
  }
  const TabButton: React.FC<TabButtonProps> = ({ id, label, disabled }) => (
    <button
      type="button"
      onClick={() => !disabled && setActiveTab(id)}
      disabled={disabled}
      className={
        `px-4 py-2 border-b-2 -mb-px font-medium ` +
        (disabled
          ? 'border-transparent text-gray-300'
          : activeTab === id
          ? 'border-[#ed1c24] text-[#ed1c24]'
          : 'border-transparent text-gray-500 hover:text-gray-700')
      }
    >
      {label}
    </button>
  )

  useEffect(() => {
    urlInputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (method === 'GET') {
      setBody('')
      setHeaders([{ key: '', value: '' }])
        setActiveTab('headers')
    }
  }, [method])

  const handleHistorySelect = (entry: RequestEntry) => {
    setUrl(entry.url)
    setMethod(entry.method)
    setHeaders(entry.headers || [{ key: '', value: '' }])
    setBody(entry.body || '')
  }

  const handleHeaderChange = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...headers]
    updated[index][field] = value
    setHeaders(updated)
  }

  const addHeader = () => setHeaders([...headers, { key: '', value: '' }])
  const removeHeader = (index: number) => setHeaders(headers.filter((_, i) => i !== index))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onLoading()

    try {
      // Build combined headers: custom + auth
      const headerObj: Record<string,string> = {}
      headers.forEach(({ key, value }) => {
        if (key.trim()) headerObj[key.trim()] = value.trim()
      })
      const finalHeaders = { ...headerObj, ...authHeader }
      console.log('🔑 Final Headers:', finalHeaders)

      const options: RequestInit = {
        method,
        headers: finalHeaders,
      }
      if (method !== 'GET' && body) options.body = body

      const finalUrl = /^(http|https):\/\//.test(url) ? url : `https://${url}`

      const start = performance.now()
      const res = await fetch(finalUrl, options)
      const end = performance.now()

      onDuration(Math.round(end - start))
      onStatus(res.status)

      const contentType = res.headers.get('Content-Type') || ''
      const text = await res.text()

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText || 'Something went wrong'}`)
      }

      if (contentType.includes('application/json')) {
        try {
          const json = JSON.parse(text)
          onResponse(JSON.stringify(json, null, 2), contentType)
        } catch {
          onResponse(text, contentType)
        }
      } else {
        onResponse(text, contentType)
      }

      // Save history
      const entry: RequestEntry = {
        id: uuidv4(),
        url: finalUrl,
        method,
        timestamp: new Date().toISOString(),
        body,
        headers,
      }
      const existing = localStorage.getItem('requestHistory')
      const history: RequestEntry[] = existing ? JSON.parse(existing) : []
      const updatedHistory = [entry, ...history.slice(0,19)]
      localStorage.setItem('requestHistory', JSON.stringify(updatedHistory))
      window.dispatchEvent(new Event('request-history-updated'))
    } catch (err: any) {
      onError(err.message || 'Request failed')
      onStatus(null)
    }
  }

  return (
    <div className="flex flex-col justify-between h-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* URL Input */}
        <div>
          <label className="block mb-1 font-medium text-black">Request URL</label>
          <input
            ref={urlInputRef}
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com/api"
            className="w-full px-4 py-2 border border-black rounded-md"
            required
          />
        </div>

        {/* Method Selector */}
        <div>
          <label className="block mb-1 font-medium text-black">Method</label>
          <select
            value={method}
            onChange={e => setMethod(e.target.value)}
            className="w-full px-4 py-2 border border-black rounded-md"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
            <option>PATCH</option>
          </select>
        </div>

        {/* Tabs for Auth / Headers */}
        <div className="mb-4">
          <div className="flex justify-center space-x-4 border-b">
            <TabButton id="auth" label="Authentication" />
            <TabButton id="headers" label="Headers" />
          </div>
        </div>

           {/* Panels (persistent mounts) */}
           <div className={activeTab === 'auth' ? '' : 'hidden'}>
          <AuthHelper onAuthChange={setAuthHeader} />
        </div>
        {activeTab === 'headers' && (
          <div>
            <div className="space-y-2">
              {headers.map((h, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Header Key"
                    value={h.key}
                    onChange={e => handleHeaderChange(i, 'key', e.target.value)}
                    className="w-1/2 px-3 py-1 border border-black rounded"
                  />
                  <input
                    type="text"
                    placeholder="Header Value"
                    value={h.value}
                    onChange={e => handleHeaderChange(i, 'value', e.target.value)}
                    className="w-1/2 px-3 py-1 border border-black rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeHeader(i)}
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
        )}


          <div>
            <label className="block mb-1 font-medium text-black">Request Body (JSON):</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder={
`{
  "key": "value"
}`
              }
              className="w-full px-4 py-2 border border-black rounded-md font-mono text-sm min-h-[100px]"
              disabled={method === 'GET'}
            />
          </div>

                  {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#ed1c24] text-white px-6 py-2 rounded-md hover:bg-red-700"
          >
            Send Request
          </button>
        </div>
      </form>


      <RequestHistory onSelect={handleHistorySelect} />

      <div className="pt-4 text-center text-xs text-gray-400 animate-fade-in">
        <img
          src="/courier-icon.png"
          alt="Courier Logo"
          className="h-6 mx-auto mb-2 opacity-70 hover:opacity-100 transition duration-500"
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
