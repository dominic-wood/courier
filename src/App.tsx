import { useState } from 'react'
import RequestForm from './components/RequestForm'
import ResponseViewer from './components/ResponseViewer'
import HeaderBar from './components/HeaderBar'
import BottomSheet from './components/BottomSheet'

function App() {
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState<number | null>(null)
  const [duration, setDuration] = useState<number | null>(null)
  const [showSheet, setShowSheet] = useState(false)

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Left Panel */}
      <div className="w-full sm:w-1/2 bg-white text-black p-0 relative flex flex-col">
        <HeaderBar />
        <div className="flex-1 p-6">
          <RequestForm
            onResponse={(res) => {
              setResponse(res)
              setShowSheet(true)
            }}
            onError={(err) => {
              setError(err)
              setShowSheet(true)
            }}
            onStatus={setStatus}
            onDuration={setDuration}
          />
        </div>
        <img
          src="/courier-logo.png"
          alt="Courier Logo"
          className="absolute bottom-4 right-4 w-28 transition duration-300 drop-shadow"
        />
      </div>

      {/* Right Panel */}
      <div className="hidden sm:block w-full sm:w-1/2 bg-gray-900 text-white p-6 overflow-y-auto flex-1 min-h-[50vh]">
        <ResponseViewer response={response} error={error} status={status} duration={duration} />
      </div>

      {/* Mobile Bottom Sheet */}
      <BottomSheet open={showSheet} onClose={() => setShowSheet(false)}>
        <ResponseViewer response={response} error={error} status={status} duration={duration} />
      </BottomSheet>
    </div>
  )
}

export default App