export const MainApp = () => {
  return (
    <div className="min-h-screen p-8 bg-[hsl(var(--win2k-bg))]">
      <div className="max-w-4xl mx-auto">
        <div className="win2k-window p-0">
          {/* Title Bar */}
          <div className="bg-[hsl(var(--win2k-blue))] text-white px-2 py-1 text-sm font-bold">
            <span>BRIDGER_MAIN_v2.0</span>
          </div>
          
          {/* Window Content */}
          <div className="p-6">
            <div className="text-center">
              <h1 className="text-[hsl(var(--win2k-text))] font-bold text-2xl mb-4" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                Welcome to Bridger!
              </h1>
              <p className="text-[hsl(var(--win2k-text))] mb-6">
                You're now in the main application. This is where the magic happens.
              </p>
              
              {/* Terminal style content */}
              <div className="text-[hsl(var(--hacker-green))] font-mono text-sm p-4 bg-black border border-[hsl(var(--hacker-border))] text-left">
                <div>BRIDGER_SYSTEM_v2.0 initialized...</div>
                <div>Loading social reform protocols...</div>
                <div>Status: READY</div>
                <div className="mt-2 text-[hsl(var(--hacker-green))] animate-pulse">█</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};