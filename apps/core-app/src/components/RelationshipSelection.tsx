import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { RetroLoadingBar } from './RetroLoadingBar';

interface RelationshipSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (relationship: string) => void;
  friendName: string;
}

export const RelationshipSelection = ({ isOpen, onClose, onContinue, friendName }: RelationshipSelectionProps) => {
  const [selectedRelationship, setSelectedRelationship] = useState<string>('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  const relationshipOptions = [
    { value: 'just-met', label: 'Just met' },
    { value: 'we-hang', label: 'We hang' },
    { value: 'share-tiktoks', label: 'Share TikToks' },
    { value: 'emergency-contact', label: 'Emergency contact' }
  ];

  // Loading bar animation - takes 7 seconds
  useEffect(() => {
    if (!isOpen) {
      setLoadingProgress(0);
      setIsLoadingComplete(false);
      return;
    }

    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          setIsLoadingComplete(true);
          clearInterval(interval);
          return 100;
        }
        return prev + (100 / 70); // 100% over 7 seconds (70 intervals of 100ms)
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedRelationship('');
      setLoadingProgress(0);
      setIsLoadingComplete(false);
    }
  }, [isOpen]);

  const handleOptionSelect = (value: string) => {
    setSelectedRelationship(value);
    
    // Speed up the loading bar when an option is selected
    if (!isLoadingComplete) {
      const speedUpInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            setIsLoadingComplete(true);
            clearInterval(speedUpInterval);
            return 100;
          }
          return prev + 8; // Much faster increment
        });
      }, 50); // Faster interval
    }
  };

  const handleContinue = () => {
    if (selectedRelationship && isLoadingComplete) {
      onContinue(selectedRelationship);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-300 z-50">
      <div className="w-full h-full">
        <div className="window-titlebar">
          <span>Building Connection with {friendName}</span>
          <button onClick={onClose} className="hover:bg-gray-200 p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="window-content h-full p-8">
          {/* Loading Animation - Legacy Windows Style */}
          <div className="text-center mb-8 mt-32">
            <div className="flex justify-center items-center space-x-8 mb-6">
              {/* Windows-style folder icons */}
              <div className="relative">
                <div className="w-16 h-12 bg-yellow-300 border border-black flex items-center justify-center shadow-md">
                  <div className="text-xs pixel-font flex items-center">
                    <span className="mr-1">📁</span>
                    <span>You</span>
                  </div>
                </div>
                
                {/* Animated files transferring - Windows style */}
                <div className="absolute top-1/2 left-full transform -translate-y-1/2 flex space-x-1 ml-2">
                  <div className="animate-pulse" style={{ animationDelay: '0s' }}>
                    <div className="w-3 h-4 bg-white border border-gray-400 shadow-sm"></div>
                  </div>
                  <div className="animate-pulse" style={{ animationDelay: '0.3s' }}>
                    <div className="w-3 h-4 bg-white border border-gray-400 shadow-sm"></div>
                  </div>
                  <div className="animate-pulse" style={{ animationDelay: '0.6s' }}>
                    <div className="w-3 h-4 bg-white border border-gray-400 shadow-sm"></div>
                  </div>
                </div>
              </div>
              
              <div className="w-16 h-12 bg-yellow-300 border border-black flex items-center justify-center shadow-md">
                <div className="text-xs pixel-font flex items-center">
                  <span className="mr-1">📁</span>
                  <span>{friendName}</span>
                </div>
              </div>
            </div>
            
            <RetroLoadingBar 
              progress={loadingProgress}
              text="Analyzing compatibility..."
              animate={false}
              segments={16}
            />
          </div>

          {/* Relationship Selection - Always visible */}
          <div className="mb-6">
            <h3 className="pixel-font text-lg font-bold text-center mb-4">
              How would you describe your relationship?
            </h3>
            
            <div className="space-y-3">
              {relationshipOptions.map((option) => (
                <label 
                  key={option.value}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 border-2 border-transparent hover:border-gray-300"
                >
                  <input
                    type="radio"
                    name="relationship"
                    value={option.value}
                    checked={selectedRelationship === option.value}
                    onChange={() => handleOptionSelect(option.value)}
                    className="w-4 h-4"
                  />
                  <span className="pixel-font text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Continue Button - Only show when loading is complete */}
          {isLoadingComplete && (
            <div className="text-center">
              <button
                onClick={handleContinue}
                disabled={!selectedRelationship}
                className={`px-8 py-2 pixel-font border-2 border-outset transition-colors ${
                  selectedRelationship 
                    ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};