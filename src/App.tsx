import { useState } from 'react'
import RequestForm from './components/RequestForm'
import ResponseViewer from './components/ResponseViewer'
import HeaderBar from './components/HeaderBar'

function App() {
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState<number | null>(null)

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="w-1/2 bg-white text-black p-0 relative flex flex-col">
        <HeaderBar />
        <div className="flex-1 p-6">
          <RequestForm
            onResponse={setResponse}
            onError={setError}
            onStatus={setStatus}
          />
        </div>
        <img
          src="/courier-logo.png"
          alt="Courier Logo"
          className="absolute bottom-4 right-4 w-28 transition duration-300 drop-shadow"
        />
      </div>

      {/* Right Panel */}
      <div className="w-1/2 bg-gray-900 text-white p-6 overflow-y-auto">
        <ResponseViewer response={response} error={error} status={status} />
      </div>
    </div>
  )
}

export default App
