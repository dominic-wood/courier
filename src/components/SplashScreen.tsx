interface SplashScreenProps {
    fadeOut: boolean
  }
  
  const SplashScreen = ({ fadeOut }: SplashScreenProps) => {
    return (
      <div
        className={`h-screen w-screen bg-white flex flex-col justify-between items-center overflow-hidden transition-opacity duration-500 ease-in-out ${
          fadeOut ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Centered Logo and Tagline */}
        <div className="flex flex-col items-center justify-center flex-1 px-4 text-center">
          <img
            src="/courier-logo-splash.png"
            alt="Courier Logo"
            className="w-40 sm:w-48 md:w-56 lg:w-64 mb-4 animate-scale-fade-in"
          />
          <h1 className="text-lg sm:text-xl md:text-2xl text-[#ed1c24] opacity-0 animate-fade-in-up delay-300">
            Fast. Focused. Functional.
          </h1>
        </div>
  
        {/* Loading Dots - Fixed at the bottom with safe area padding */}
        <div className="mb-6 pb-[env(safe-area-inset-bottom)]">
          <div className="flex space-x-1">
            <span className="h-2 w-2 bg-[#ed1c24] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="h-2 w-2 bg-[#ed1c24] rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
            <span className="h-2 w-2 bg-[#ed1c24] rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
          </div>
        </div>
      </div>
    )
  }
  
  export default SplashScreen