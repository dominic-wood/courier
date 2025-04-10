import { useState, useEffect } from 'react'
import SplashScreen from './components/SplashScreen'
import RequestForm from './components/RequestForm'
import ResponseViewer from './components/ResponseViewer'
import HeaderBar from './components/HeaderBar'
import BottomSheet from './components/BottomSheet'

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [fadeOutSplash, setFadeOutSplash] = useState(false)
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState<number | null>(null)
  const [duration, setDuration] = useState<number | null>(null)
  const [showSheet, setShowSheet] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [contentType, setContentType] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setFadeOutSplash(true), 2500)
    const removeSplash = setTimeout(() => setShowSplash(false), 3000)
    return () => {
      clearTimeout(timer)
      clearTimeout(removeSplash)
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('bg-gray-900', showSheet)
  }, [showSheet])

  const resetResponseViewer = () => {
    setResponse('')
    setError('')
    setStatus(null)
    setDuration(null)
    setContentType('')
  }

  if (showSplash) return <SplashScreen fadeOut={fadeOutSplash} />

  return (
    <div className="fade-in">
      <div className="min-h-screen flex flex-col sm:flex-row bg-white">
        {/* Left Panel */}
        <div className="w-full sm:w-1/2 bg-white text-black p-0 flex flex-col">
          <HeaderBar
            onReset={() => {
              resetResponseViewer()
              setShowSheet(false)
            }}
          />
          <div className="flex-grow flex flex-col p-6 overflow-y-auto h-[calc(100svh-64px)] sm:h-auto">
            <RequestForm
              onResponse={(res, contentType) => {
                setIsLoading(false)
                setResponse(res)
                setContentType(contentType)
                setShowSheet(true)
              }}
              onError={(err) => {
                setIsLoading(false)
                setError(err)
                setShowSheet(true)
              }}
              onStatus={setStatus}
              onDuration={setDuration}
              onLoading={() => {
                resetResponseViewer()
                setIsLoading(true)
                setShowSheet(true)
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
              isLoading={isLoading}
              response={response}
              error={error}
              status={status}
              duration={duration}
              contentType={contentType}
            />
          </div>
        </div>

        {/* Bottom Sheet (Mobile Only) */}
        <BottomSheet open={showSheet} onClose={() => setShowSheet(false)}>
          <ResponseViewer
            isLoading={isLoading}
            response={response}
            error={error}
            status={status}
            duration={duration}
            contentType={contentType}
          />
        </BottomSheet>
      </div>
    </div>
  )
}

export default App