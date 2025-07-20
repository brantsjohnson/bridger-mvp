import { useState, useEffect } from 'react';
import { Minus, Square, X } from 'lucide-react';

interface RetroLoadingBarProps {
  progress?: number;
  text?: string;
  animate?: boolean;
  segments?: number;
}

export const RetroLoadingBar = ({ 
  progress = 0, 
  text = "Loading...", 
  animate = true,
  segments = 16 
}: RetroLoadingBarProps) => {
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    if (!animate) {
      setCurrentProgress(progress);
      return;
    }

    // Animate the progress bar filling up
    const interval = setInterval(() => {
      setCurrentProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 3;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [animate, progress]);

  const filledSegments = Math.floor((currentProgress / 100) * segments);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Loading text */}
      <div className="pixel-font text-sm text-black font-bold">{text}</div>
      
      {/* Progress bar container */}
      <div className="w-full max-w-xs h-6 border-2 border-inset bg-white" style={{
        borderColor: '#808080 #e0e0e0 #e0e0e0 #808080'
      }}>
        <div className="flex h-full gap-[1px] p-[1px]">
          {Array.from({ length: segments }, (_, index) => (
            <div
              key={index}
              className={`flex-1 transition-colors duration-300 ${
                index < filledSegments 
                  ? 'bg-blue-600' 
                  : 'bg-white'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};