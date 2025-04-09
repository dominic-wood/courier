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
    setStartY(null)
    setDragY(0)
  }

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 sm:hidden transition-transform duration-300 ease-in-out ${
        open ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ transform: open ? `translateY(${dragY}px)` : 'translateY(100%)' }}
    >
      <div
        ref={sheetRef}
        className="bg-gray-900 text-white rounded-t-2xl shadow-lg flex flex-col"
        style={{ height: '85vh' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <div className="relative flex items-center justify-center py-5 px-4">
          <img
            src="/response-logo-2.png"
            alt="Response Logo"
            className="h-6 opacity-90"
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-2xl px-3 py-2"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  )
}

export default BottomSheet
