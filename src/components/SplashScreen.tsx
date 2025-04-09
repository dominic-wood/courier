const SplashScreen = () => {
    return (
      <div className="h-screen w-screen overflow-hidden flex flex-col bg-white animate-fade-in px-4">
        <div className="flex-grow flex flex-col justify-center items-center">
          <img
            src="/courier-logo-splash.png"
            alt="Courier Logo"
            className="w-40 sm:w-48 md:w-56 lg:w-64 mb-4 animate-scale-fade-in"
          />
          <h1 className="text-lg sm:text-xl md:text-2xl text-[#ed1c24] opacity-0 animate-fade-in-up delay-300 text-center">
            Fast. Focused. Functional.
          </h1>
        </div>
  
        <div className="mb-6 flex justify-center space-x-1">
          <span className="h-2 w-2 bg-[#ed1c24] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="h-2 w-2 bg-[#ed1c24] rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
          <span className="h-2 w-2 bg-[#ed1c24] rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
        </div>
      </div>
    )
  }
  
  export default SplashScreen
  