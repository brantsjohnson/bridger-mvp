import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { parseConnectionCode, sendFriendRequest } from '../lib/friendConnections';
import { supabase } from '../integrations/supabase/client';
interface ConnectionHandlerProps {
  currentUserId: string;
  currentUserName?: string;
}

const ConnectionHandler = ({ currentUserId, currentUserName }: ConnectionHandlerProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [requesterName, setRequesterName] = useState<string>('');

  useEffect(() => {
    const handleConnection = async () => {
      setIsProcessing(true);
      setError(null);

      try {
        // Get parameters from URL
        const code = searchParams.get('code');
        const requesterId = searchParams.get('user');
        const name = searchParams.get('name');

        if (!code || !requesterId) {
          setError('Invalid connection link');
          return;
        }

        // Don't allow self-connection
        if (requesterId === currentUserId) {
          setError('You cannot connect with yourself');
          return;
        }

        // Get requester's name
        if (name) {
          setRequesterName(name);
        } else {
          // Try to get name from database
          const { data: userData } = await supabase
            .from('users')
            .select('first_name, last_name, full_name')
            .eq('id', requesterId)
            .single();

          if (userData) {
            const name = userData.full_name || `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
            setRequesterName(name || 'Unknown User');
          } else {
            setRequesterName('Unknown User');
          }
        }

        // Send friend request
        const result = await sendFriendRequest(requesterId, currentUserId);

        if (result.success) {
          setSuccess(true);
        } else {
          setError(result.error || 'Failed to send friend request');
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error('Connection error:', err);
      } finally {
        setIsProcessing(false);
      }
    };

    // Only process if we have the required parameters
    if (searchParams.get('code') && searchParams.get('user')) {
      handleConnection();
    }
  }, [searchParams, currentUserId]);

  const handleBack = () => {
    navigate('/');
  };

  const handleGoToFriends = () => {
    navigate('/friends');
  };

  if (isProcessing) {
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
          <div className="font-bold text-sm pixel-font text-white drop-shadow-lg">Connecting...</div>
          <button 
            onClick={handleBack}
            className="w-6 h-6 bg-gray-300 hover:bg-gray-400 text-black border-2 border-gray-600 flex items-center justify-center pixel-font font-bold text-xs"
            style={{ border: '2px outset #e0e0e0' }}
          >
            ×
          </button>
        </div>

        {/* Loading content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="shadow-2xl flex flex-col" style={{ border: '4px outset #c0c0c0' }}>
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 flex justify-between items-center border-b-2 border-gray-800">
              <div className="font-bold text-sm pixel-font text-white drop-shadow-lg">Processing Connection</div>
            </div>
            <div className="bg-white w-80 h-60 shadow-inner flex items-center justify-center p-4" 
                 style={{ 
                   background: 'linear-gradient(145deg, #f0f0f0, #e0e0e0)'
                 }}>
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-700 font-medium">Processing friend request...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        {/* Windows-style title bar */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 flex justify-between items-center border-b-2 border-gray-800">
          <div className="font-bold text-sm pixel-font text-white drop-shadow-lg">Connection Error</div>
          <button 
            onClick={handleBack}
            className="w-6 h-6 bg-gray-300 hover:bg-gray-400 text-black border-2 border-gray-600 flex items-center justify-center pixel-font font-bold text-xs"
            style={{ border: '2px outset #e0e0e0' }}
          >
            ×
          </button>
        </div>

        {/* Error content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="shadow-2xl flex flex-col" style={{ border: '4px outset #c0c0c0' }}>
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-2 flex justify-between items-center border-b-2 border-gray-800">
              <div className="font-bold text-sm pixel-font text-white drop-shadow-lg">Error</div>
            </div>
            <div className="bg-white w-80 h-60 shadow-inner flex items-center justify-center p-4" 
                 style={{ 
                   background: 'linear-gradient(145deg, #f0f0f0, #e0e0e0)'
                 }}>
              <div className="text-center">
                <div className="text-red-600 text-4xl mb-4">⚠️</div>
                <p className="text-gray-700 font-medium mb-2">Connection Failed</p>
                <p className="text-gray-600 text-sm mb-4">{error}</p>
                <button 
                  onClick={handleBack}
                  className="px-4 py-2 bg-gray-300 text-black border-2 font-bold text-sm pixel-font hover:bg-gray-400"
                  style={{ border: '2px outset #e0e0e0' }}
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
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
          <div className="font-bold text-sm pixel-font text-white drop-shadow-lg">Connection Successful</div>
          <button 
            onClick={handleBack}
            className="w-6 h-6 bg-gray-300 hover:bg-gray-400 text-black border-2 border-gray-600 flex items-center justify-center pixel-font font-bold text-xs"
            style={{ border: '2px outset #e0e0e0' }}
          >
            ×
          </button>
        </div>

        {/* Success content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="shadow-2xl flex flex-col" style={{ border: '4px outset #c0c0c0' }}>
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-2 flex justify-between items-center border-b-2 border-gray-800">
              <div className="font-bold text-sm pixel-font text-white drop-shadow-lg">Success</div>
            </div>
            <div className="bg-white w-80 h-60 shadow-inner flex items-center justify-center p-4" 
                 style={{ 
                   background: 'linear-gradient(145deg, #f0f0f0, #e0e0e0)'
                 }}>
              <div className="text-center">
                <div className="text-green-600 text-4xl mb-4">✅</div>
                <p className="text-gray-700 font-medium mb-2">Friend Request Sent!</p>
                <p className="text-gray-600 text-sm mb-4">
                  Your friend request to <span className="font-semibold">{requesterName}</span> has been sent.
                </p>
                <div className="space-y-2">
                  <button 
                    onClick={handleGoToFriends}
                    className="px-4 py-2 bg-blue-600 text-white border-2 font-bold text-sm pixel-font hover:bg-blue-700 mr-2"
                    style={{ border: '2px outset #e0e0e0' }}
                  >
                    View Friends
                  </button>
                  <button 
                    onClick={handleBack}
                    className="px-4 py-2 bg-gray-300 text-black border-2 font-bold text-sm pixel-font hover:bg-gray-400"
                    style={{ border: '2px outset #e0e0e0' }}
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If no connection parameters, show nothing
  return null;
};

export default ConnectionHandler; 