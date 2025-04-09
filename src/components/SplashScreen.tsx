interface SplashScreenProps {
    fadeOut: boolean
  }
  
  const SplashScreen = ({ fadeOut }: SplashScreenProps) => {
    return (
      <div className={`min-h-screen w-screen flex flex-col items-center justify-center bg-white relative animate-fade-in ${fadeOut ? 'animate-fade-out' : ''}`}>
        <img
          src="/courier-logo-splash.png"
          alt="Courier Logo"
          className="h-36 w-auto mb-4 animate-scale-fade-in"
        />
        <h1 className="text-lg sm:text-xl text-[#ed1c24] opacity-0 animate-fade-in-up delay-300">
            Fast. Focused. Functional.
        </h1>

        <div className="absolute bottom-6 flex justify-center space-x-1">
          <span className="h-2 w-2 bg-[#ed1c24] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="h-2 w-2 bg-[#ed1c24] rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
          <span className="h-2 w-2 bg-[#ed1c24] rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
        </div>
      </div>
    )
  }
  
  export default SplashScreen
  