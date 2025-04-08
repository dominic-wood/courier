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
      const sheet = sheetRef.current
      if (open && sheet && !sheet.contains(e.target as Node)) {
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
      if (deltaY > 0) {
        setDragY(deltaY)
      }
    }
  }

  const handleTouchEnd = () => {
    if (dragY > 150) {
      onClose()
    } else if (dragY > 50) {
      setSnapped('half')
    } else {
      setSnapped('full')
    }
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
        id="bottom-sheet"
        ref={sheetRef}
        className="bg-gray-900 text-white rounded-t-2xl shadow-lg relative flex flex-col"
        style={{ height: sheetHeight }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="w-full flex justify-center items-center py-2 cursor-pointer"
          onClick={(e) => { e.stopPropagation(); setSnapped(snapped === 'full' ? 'half' : 'full') }}
        >
          <div className="w-12 h-1.5 bg-gray-500 rounded-full" />
        </div>
        <button
          className="absolute top-2 right-4 text-white text-sm"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

export default BottomSheet