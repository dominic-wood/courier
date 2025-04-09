import { useState, useEffect } from 'react'
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
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (showSheet) {
      document.body.classList.add('bg-gray-900')
    } else {
      document.body.classList.remove('bg-gray-900')
    }
  }, [showSheet])

  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-white">
      {/* Left Panel */}
      <div className="w-full sm:w-1/2 bg-white text-black p-0 flex flex-col">
        <HeaderBar />
        <div className="flex-grow flex flex-col p-6 overflow-y-auto h-[calc(100svh-64px)] sm:h-auto">
          <RequestForm
            onResponse={(res) => {
              setResponse(res)
              setShowSheet(true)
              setIsLoading(false)
            }}
            onError={(err) => {
              setError(err)
              setShowSheet(true)
              setIsLoading(false)
            }}
            onStatus={setStatus}
            onDuration={setDuration}
            onLoading={() => {
              setIsLoading(true)
              setResponse('')
              setError('')
              setStatus(null)
              setDuration(null)
            }}
          />
        </div>
      </div>

      {/* Right Panel (Desktop Only) */}
      <div className="hidden sm:flex flex-col w-1/2 bg-gray-900 text-white">
        <div className="py-5 px-4 flex justify-center items-center">
          <img
            src="/response-logo-2.png"
            alt="Response Logo"
            className="h-10 w-auto"
          />
        </div>

        <div className="flex-grow p-6 overflow-y-auto">
          <ResponseViewer
            response={response}
            error={error}
            status={status}
            duration={duration}
            isLoading={isLoading}
          />
        </div>
      </div>


      {/* Bottom Sheet (Mobile Only) */}
      <BottomSheet open={showSheet} onClose={() => setShowSheet(false)}>
        <ResponseViewer
          response={response}
          error={error}
          status={status}
          duration={duration}
          isLoading={isLoading}
        />
      </BottomSheet>
    </div>
  )
}

export default App
