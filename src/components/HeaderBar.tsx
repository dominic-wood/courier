interface HeaderBarProps {
  onReset?: () => void
}

const HeaderBar = ({ onReset }: HeaderBarProps) => {
  return (
    <header className="bg-white py-5 px-4 flex justify-center items-center">
      <button
        onClick={onReset}
        className="focus:outline-none"
        aria-label="Reset Request Form"
      >
        <img
          src="/courier-logo.png"
          alt="Courier Logo"
          className="h-10 w-auto mr-4 hover:opacity-80 transition"
        />
      </button>
    </header>
  )
}

export default HeaderBar
