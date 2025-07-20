import { useState, useEffect } from 'react';
import { User, Check, X } from 'lucide-react';
import { getPendingFriendRequests, acceptFriendRequest, declineFriendRequest } from '../lib/friendConnections';

interface FriendRequestsProps {
  currentUserId: string;
  onRequestHandled?: () => void;
}

interface PendingRequest {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: string;
  created_at: string;
  requester?: {
    id: string;
    first_name?: string;
    last_name?: string;
    full_name?: string;
  };
}

const FriendRequests = ({ currentUserId, onRequestHandled }: FriendRequestsProps) => {
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadPendingRequests();
  }, [currentUserId]);

  const loadPendingRequests = async () => {
    setIsLoading(true);
    try {
      const requests = await getPendingFriendRequests(currentUserId);
      setPendingRequests(requests);
    } catch (error) {
      console.error('Error loading pending requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      const result = await acceptFriendRequest(requestId);
      if (result.success) {
        setPendingRequests(prev => prev.filter(req => req.id !== requestId));
        onRequestHandled?.();
      } else {
        console.error('Failed to accept request:', result.error);
      }
    } catch (error) {
      console.error('Error accepting request:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      const result = await declineFriendRequest(requestId);
      if (result.success) {
        setPendingRequests(prev => prev.filter(req => req.id !== requestId));
        onRequestHandled?.();
      } else {
        console.error('Failed to decline request:', result.error);
      }
    } catch (error) {
      console.error('Error declining request:', error);
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="popup-window mb-4">
        <div className="window-content">
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Loading requests...</p>
          </div>
        </div>
      </div>
    );
  }

  if (pendingRequests.length === 0) {
    return null;
  }

  return (
    <div className="popup-window mb-4">
      <div className="window-content">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 flex justify-between items-center border-b-2 border-gray-800">
          <div className="font-bold text-sm pixel-font text-white drop-shadow-lg">
            Friend Requests ({pendingRequests.length})
          </div>
        </div>
        <div className="p-4 space-y-3">
          {pendingRequests.map((request) => {
            const requesterName = request.requester?.full_name || 
              `${request.requester?.first_name || ''} ${request.requester?.last_name || ''}`.trim() || 
              'Unknown User';
            
            return (
              <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 border-2 border-gray-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-400 border-2 border-gray-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="pixel-font font-bold text-sm">{requesterName}</p>
                    <p className="text-xs text-gray-600">wants to be your friend</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAccept(request.id)}
                    disabled={processingId === request.id}
                    className="w-8 h-8 bg-green-500 hover:bg-green-600 disabled:opacity-50 border-2 border-gray-600 flex items-center justify-center"
                    style={{ border: '2px outset #e0e0e0' }}
                  >
                    <Check className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => handleDecline(request.id)}
                    disabled={processingId === request.id}
                    className="w-8 h-8 bg-red-500 hover:bg-red-600 disabled:opacity-50 border-2 border-gray-600 flex items-center justify-center"
                    style={{ border: '2px outset #e0e0e0' }}
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FriendRequests; 