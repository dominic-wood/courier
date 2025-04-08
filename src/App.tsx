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
      <div className="w-full sm:w-1/2 bg-white text-black p-0 flex flex-col">
        <HeaderBar />
        <div className="flex-1 flex flex-col p-6 overflow-y-auto min-h-screen sm:min-h-0">
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
      </div>

      {/* Right Panel */}
      <div className="hidden sm:block w-1/2 bg-gray-900 text-white p-6 overflow-y-auto">
        <ResponseViewer
          response={response}
          error={error}
          status={status}
          duration={duration}
        />
      </div>

      {/* Mobile Bottom Sheet Viewer */}
      <BottomSheet open={showSheet} onClose={() => setShowSheet(false)}>
        <ResponseViewer
          response={response}
          error={error}
          status={status}
          duration={duration}
        />
      </BottomSheet>
    </div>
  )
}

export default App
