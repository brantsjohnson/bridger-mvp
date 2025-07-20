import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const messages = [
  ">>ACCOUNT_CREATED", 
  " ",
  ">>IMPORTANT: The quality of our relationships determines how happy we are.", 
  " ", 
  "But we're busier and more distracted than ever.", 
  " ", 
  "We're on track to spend 80% of our free time on our phones. *shudders*", 
  " ",
  "We're here to help you show up for your friends", 
  "and make it easier for them to show up for you, too. <3", 
  " ", 
  "Looking for your people?",
  "We'll help with that too -- cause bye-bye to living life just on that damn phone.", 
  " ", 
  ">>REMINDER: Relationships take effort.", 
  " ", 
  "Bridger can help, but you've got to put in the *human* work to make them meaningful.", 
  " ", 
  "We're in this together.",
  "And together, we can fix society.", 
  " ",
];

export default function AccountCreatedTerminal({ onComplete }: { onComplete: () => void }) {
  const [crtDone, setCrtDone] = useState(false);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [currentLine, setCurrentLine] = useState("");
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (!crtDone || lineIndex >= messages.length) return;

    const line = messages[lineIndex];
    let intervalId: number;
    let pauseTimeoutId: number;

    const typeCharacter = () => {
      if (charIndex < line.length) {
        setCurrentLine((prev) => prev + line[charIndex]);
        setCharIndex((i) => i + 1);
      } else {
        // Line complete, pause then move to next line
        clearInterval(intervalId);
        pauseTimeoutId = setTimeout(() => {
          setDisplayedLines((prev) => [...prev, currentLine]);
          setLineIndex((i) => i + 1);
          setCharIndex(0);
          setCurrentLine("");
        }, 200); // 2x faster pause (was 400ms, now 200ms)
      }
    };

    // Start typing at 2x speed (20ms per character instead of 40ms)
    intervalId = setInterval(typeCharacter, 20);

    return () => {
      clearInterval(intervalId);
      clearTimeout(pauseTimeoutId);
    };
  }, [charIndex, crtDone, lineIndex, currentLine]);

  useEffect(() => {
    if (lineIndex === messages.length && !showButton) {
      // Show button after 500ms (2x faster than 1000ms)
      const timeoutId = setTimeout(() => {
        setShowButton(true);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [lineIndex]);

  return (
    <>
      <style>{`
        @keyframes electricity {
          0%, 100% { 
            opacity: 0.05;
            box-shadow: 0 0 2px rgba(34, 197, 94, 0.3), 0 0 4px rgba(34, 197, 94, 0.2);
          }
          50% { 
            opacity: 0.2;
            box-shadow: 0 0 6px rgba(34, 197, 94, 0.5), 0 0 12px rgba(34, 197, 94, 0.4), 0 0 18px rgba(34, 197, 94, 0.3);
          }
        }
        
        @keyframes electricityShimmer {
          0% { 
            transform: translateX(-100%);
            opacity: 0;
          }
          50% { 
            opacity: 1;
          }
          100% { 
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        @keyframes electricPulse {
          0%, 100% { 
            opacity: 0.2;
            transform: scale(1);
          }
          50% { 
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
      `}</style>
      <div
        className="relative w-full h-screen bg-black text-[hsl(var(--hacker-green))] p-4 pt-16 text-sm font-mono overflow-hidden"
        style={{ fontFamily: "'Share Tech Mono', monospace", lineHeight: "1.5" }}
      >
      {/* CRT Wave Distortion Effect with Enhanced Electricity */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 300 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px bg-[hsl(var(--hacker-green))] opacity-5"
            style={{ 
              top: `${i * 0.4}%`,
              transform: `translateX(${Math.sin(i * 0.1) * 3}px)`,
              animationDelay: `${i * 0.01}s`,
              animation: `electricity ${3 + (i % 2)}s linear infinite`
            }}
          />
        ))}
        {/* Electricity shimmer effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent 0%, rgba(34, 197, 94, 0.15) 50%, transparent 100%)`,
            animation: 'electricityShimmer 4s ease-in-out infinite',
            transform: 'translateX(-100%)'
          }}
        />
        {/* Additional electricity effects */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent 0%, rgba(0, 255, 0, 0.1) 50%, transparent 100%)`,
            animation: 'electricityShimmer 3s ease-in-out infinite',
            animationDelay: '1s',
            transform: 'translateX(-100%)'
          }}
        />
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent 0%, rgba(34, 197, 94, 0.2) 50%, transparent 100%)`,
            animation: 'electricityShimmer 5s ease-in-out infinite',
            animationDelay: '2s',
            transform: 'translateX(-100%)'
          }}
        />
      </div>

      {/* Subtle CRT curvature overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: `radial-gradient(ellipse at center, transparent 70%, hsl(var(--hacker-green)) 100%)`,
          animation: 'pulse 3s ease-in-out infinite alternate'
        }}
      />
      {/* Output Lines */}
      {crtDone &&
        displayedLines.map((line, idx) => (
          <div key={idx} className="whitespace-pre-wrap">{line}</div>
        ))}

      {/* Typing Line */}
      {crtDone && lineIndex < messages.length && (
        <div className="whitespace-pre-wrap">
          {currentLine}
          <span className="inline-block w-2 h-3 bg-[hsl(var(--hacker-green))] animate-pulse ml-1"></span>
        </div>
      )}

      {/* Button */}
      {showButton && (
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <button
            onClick={() => {
              // Send message to parent to navigate to core app
              if (window.parent && window.parent !== window) {
                window.parent.postMessage({ type: 'NAVIGATE_TO_CORE' }, '*');
              }
              onComplete();
            }}
            className="text-black bg-[hsl(var(--hacker-green))] py-2 px-4 rounded font-bold hover:bg-[hsl(var(--hacker-green-dim))] transition-colors"
          >
            LET&apos;S_FIX_SOCIETY
          </button>
        </motion.div>
      )}

      {/* CRT Startup Animation */}
      <AnimatePresence>
        {!crtDone && (
          <motion.div
            className="absolute inset-0 z-50 bg-white"
            initial={{ scaleY: 1, opacity: 1 }}
            animate={{ scaleY: 0, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            onAnimationComplete={() => setCrtDone(true)}
            style={{ transformOrigin: "center" }}
          />
        )}
      </AnimatePresence>
    </div>
    </>
  );
}