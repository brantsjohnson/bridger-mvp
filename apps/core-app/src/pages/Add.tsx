import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import QRCodeDisplay from '../components/QRCodeDisplay';
import CameraScanner from '../components/CameraScanner';
import { generateQRCodeData, createShareableLink, copyToClipboard } from '../lib/friendConnections';
import { supabase } from '../integrations/supabase/client';
const Add = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [qrCodeValue, setQrCodeValue] = useState<string>("");
  const [shareableLink, setShareableLink] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get current user info (using Fox Red for testing)
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        // For testing, use Fox Red as the current user
        // Since we don't have a users table set up yet, use hardcoded values
        const currentUserId = "fox_red_user_123";
        const userName = "Fox Red";
        
        setUserId(currentUserId);
        setUserName(userName);
        
        // Generate QR code and shareable link
        const qrData = generateQRCodeData(currentUserId, userName);
        const link = createShareableLink(currentUserId, userName);
        
        setQrCodeValue(qrData);
        setShareableLink(link);
        
        console.log('Using hardcoded Fox Red user for testing');
      } catch (error) {
        console.error('Error setting up user:', error);
        // Fallback to hardcoded values
        setUserId("fox_red_user_123");
        setUserName("Fox Red");
        const qrData = generateQRCodeData("fox_red_user_123", "Fox Red");
        const link = createShareableLink("fox_red_user_123", "Fox Red");
        setQrCodeValue(qrData);
        setShareableLink(link);
      } finally {
        setIsLoading(false);
      }
    };
    
    getCurrentUser();
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  const handleShareLink = async () => {
    const success = await copyToClipboard(shareableLink);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Show loading state while data is loading
  if (isLoading) {
    return (
      <div 
        className="fixed inset-0 z-50 flex flex-col"
        style={{
          backgroundImage: 'url(/lovable-uploads/85235327-7f7b-4224-a40c-beaaa80c7f26.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-white font-medium">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error if there's an issue
  if (error) {
    return (
      <div 
        className="fixed inset-0 z-50 flex flex-col"
        style={{
          backgroundImage: 'url(/lovable-uploads/85235327-7f7b-4224-a40c-beaaa80c7f26.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 flex justify-between items-center border-b-2 border-gray-800">
          <div className="font-bold text-sm pixel-font text-white drop-shadow-lg">Add Friends</div>
          <button 
            onClick={handleBack}
            className="w-6 h-6 bg-gray-300 hover:bg-gray-400 text-black border-2 border-gray-600 flex items-center justify-center pixel-font font-bold text-xs"
            style={{ border: '2px outset #e0e0e0' }}
          >
            ×
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-white font-medium mb-2">Error</p>
            <p className="text-white text-sm mb-4">{error}</p>
            <button 
              onClick={handleBack}
              className="px-4 py-2 bg-blue-600 text-white border-2 font-bold text-sm pixel-font hover:bg-blue-700"
              style={{ border: '2px outset #e0e0e0' }}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        backgroundImage: 'url(/lovable-uploads/85235327-7f7b-4224-a40c-beaaa80c7f26.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Windows-style title bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 flex justify-between items-center border-b-2 border-gray-800">
        <div className="font-bold text-sm pixel-font text-white drop-shadow-lg">Add</div>
        <button 
          onClick={handleBack}
          className="w-6 h-6 bg-gray-300 hover:bg-gray-400 text-black border-2 border-gray-600 flex items-center justify-center pixel-font font-bold text-xs"
          style={{ border: '2px outset #e0e0e0' }}
        >
          ×
        </button>
      </div>

      {/* Main content area with two square windows */}
      <div className="flex-1 flex flex-col items-center justify-evenly px-4 py-2">
        {/* First window */}
        <div className="shadow-2xl flex flex-col" style={{ border: '4px outset #c0c0c0' }}>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 flex justify-between items-center border-b-2 border-gray-800">
            <div className="font-bold text-sm pixel-font text-white drop-shadow-lg">Camera</div>
          </div>
          <div className="bg-white w-60 h-60 md:w-72 md:h-72 shadow-inner"
               style={{ 
                 background: 'linear-gradient(145deg, #f0f0f0, #e0e0e0)'
               }}>
            <CameraScanner />
          </div>
        </div>

        {/* Second window */}
        <div className="shadow-2xl flex flex-col" style={{ border: '4px outset #c0c0c0' }}>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 flex justify-between items-center border-b-2 border-gray-800">
            <div className="font-bold text-sm pixel-font text-white drop-shadow-lg">{userName}'s QR Code</div>
          </div>
          <div className="bg-white w-60 h-60 md:w-72 md:h-72 shadow-inner flex items-center justify-center p-4" 
               style={{ 
                 background: 'linear-gradient(145deg, #f0f0f0, #e0e0e0)'
               }}>
            {isLoading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600 text-sm">Loading...</p>
              </div>
            ) : (
              <QRCodeDisplay value={qrCodeValue} size={220} />
            )}
          </div>
        </div>
        
        {/* Share a link button */}
        <button 
          onClick={handleShareLink}
          disabled={isLoading}
          className="px-6 py-3 bg-gray-300 text-black border-2 font-bold text-sm pixel-font hover:bg-gray-400 active:bg-gray-500 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            border: '2px outset #e0e0e0',
            background: 'linear-gradient(145deg, #f0f0f0, #d0d0d0)'
          }}
        >
          {copySuccess ? 'Link Copied!' : 'Share a link'}
        </button>
      </div>
    </div>
  );
};

export default Add;