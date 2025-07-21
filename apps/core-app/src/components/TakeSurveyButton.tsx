import React, { useState, useEffect } from "react";
import "./TakeSurveyButton.css"; // we'll add this for custom animations

const TakeSurveyButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);

  // Check if quiz is completed on component mount
  useEffect(() => {
    const checkQuizCompletion = () => {
      try {
        // Check if user has profile data (indicates quiz completion)
        const userData = localStorage.getItem('bridger_user_data');
        if (userData) {
          const user = JSON.parse(userData);
          const userProfile = localStorage.getItem(`bridger_profile_${user.id}`);
          if (userProfile) {
            const profileData = JSON.parse(userProfile);
            setIsQuizCompleted(!!profileData.quizCompletedAt);
          }
        }
      } catch (error) {
        console.error('Error checking quiz completion:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkQuizCompletion();
  }, []);

  const handleClick = () => {
    // If quiz is completed, show the meme dialog
    if (isQuizCompleted) {
      setShowDialog(true);
    } else {
      // If quiz is not completed, redirect to quiz app
      onClick?.();
    }
  };

  // Don't render if still loading
  if (isLoading) {
    return null; // Show nothing while loading
  }

  // If quiz is completed, show the meme image
  if (isQuizCompleted) {
    return (
      <>
        <div className="w-full flex justify-center items-center">
          <div 
            className="w-40 h-auto cursor-pointer"
            onClick={() => setShowDialog(true)}
          >
            <img 
              src="/lovable-uploads/5ca7c64d-46aa-400b-872f-e2a35f5bc63c.png" 
              alt="You did it!"
              className="w-full h-auto"
            />
          </div>
        </div>
        
        {showDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-200 border-2 border-gray-400 border-t-gray-100 border-l-gray-100 shadow-lg" style={{
              borderStyle: 'outset',
              borderWidth: '2px',
              fontFamily: 'MS Sans Serif, sans-serif',
              fontSize: '11px'
            }}>
              {/* Title bar */}
              <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-2 py-1 flex justify-between items-center">
                <span className="font-bold text-sm">Alert</span>
                <button 
                  onClick={() => setShowDialog(false)}
                  className="bg-gray-200 text-black px-2 py-0 text-xs font-bold border border-gray-400 hover:bg-gray-300"
                  style={{ borderStyle: 'outset' }}
                >
                  ×
                </button>
              </div>
              
              {/* Content */}
              <div className="p-4 bg-gray-200">
                <div className="text-black font-bold mb-3">You already took the survey</div>
                <div className="mb-3">
                  <div className="text-center">
                    <img 
                      src="https://i.imgur.com/8iJapYK.gif" 
                      alt="Best GIF ever made"
                      className="mx-auto max-w-full h-auto"
                    />
                  </div>
                </div>
                
                {/* OK Button */}
                <div className="flex justify-center">
                  <button 
                    onClick={() => setShowDialog(false)}
                    className="bg-gray-200 border-2 border-gray-400 border-t-gray-100 border-l-gray-100 px-6 py-1 text-black font-bold hover:bg-gray-300"
                    style={{ borderStyle: 'outset' }}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // If quiz is not completed, show the normal button
  return (
    <div className="w-full flex justify-center items-center perspective">
      <div className="button-container">
        <button
          onClick={handleClick}
          className="retro-button"
        >
          <span>Take New Survey</span>
        </button>
      </div>
    </div>
  );
};

export default TakeSurveyButton;