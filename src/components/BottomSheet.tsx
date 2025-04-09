import { ReactNode, useEffect, useRef, useState } from 'react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

const BottomSheet = ({ open, onClose, children }: BottomSheetProps) => {
  const sheetRef = useRef<HTMLDivElement>(null)
  const [startY, setStartY] = useState<number | null>(null)
  const [dragY, setDragY] = useState(0)
  const [snapped, setSnapped] = useState<'half' | 'full'>('half')

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (open && sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [open, onClose])

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY !== null) {
      const currentY = e.touches[0].clientY
      const deltaY = currentY - startY
      if (deltaY > 0) setDragY(deltaY)
    }
  }

  const handleTouchEnd = () => {
    if (dragY > 150) onClose()
    else if (dragY > 50) setSnapped('half')
    else setSnapped('full')

    setStartY(null)
    setDragY(0)
  }

  const sheetHeight = snapped === 'full' ? '85vh' : '50vh'

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 sm:hidden transition-transform duration-300 ease-in-out ${
        open ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ transform: open ? `translateY(${dragY}px)` : 'translateY(100%)' }}
    >
      <div
        ref={sheetRef}
        className="bg-gray-900 text-white rounded-t-2xl shadow-lg relative flex flex-col"
        style={{ height: sheetHeight }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header Logo + Close */}
        <div className="relative pt-4 pb-5 flex items-center justify-center">
          {/* Centered Logo */}
          <img
            src="/response-logo-2.png"
            alt="Response Logo"
            className="h-6 opacity-90 mx-auto"
          />

          {/* Close Button aligned right but inline */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-2xl leading-none px-3 py-2"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Handle */}
        <div
          className="w-full flex justify-center items-center pb-2"
          onClick={(e) => {
            e.stopPropagation()
            setSnapped(snapped === 'full' ? 'half' : 'full')
          }}
        >
          <div className="w-12 h-1.5 bg-gray-500 rounded-full" />
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export default BottomSheet
