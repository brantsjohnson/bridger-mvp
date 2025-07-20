import { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getHobbyEmoji } from '@/lib/hobbyMappings';

interface FriendPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  friend: {
    name: string;
    interests: string[];
    friendsInCommon: string[];
  };
  onFriendClick?: (friendName: string) => void;
  onProfileClick?: (userName: string) => void;
}

export const FriendPreview = ({ isOpen, onClose, friend, onFriendClick, onProfileClick }: FriendPreviewProps) => {
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleAddFriend = () => {
    setFriendRequestSent(true);
    // Here you would typically send the friend request to the backend
    console.log(`Friend request sent to ${friend.name}`);
  };

  const handleWithdraw = () => {
    setFriendRequestSent(false);
    // Here you would typically withdraw the friend request from the backend
    console.log(`Friend request to ${friend.name} withdrawn`);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div 
        className="bg-gray-200 border-2 border-gray-600 shadow-lg"
        style={{ 
          width: '500px', 
          maxWidth: '90vw',
          minWidth: '450px',
          border: '2px outset #e0e0e0'
        }}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 flex justify-between items-center border-b-2 border-gray-800">
          <span className="pixel-font font-bold">Friend Preview</span>
          <button onClick={onClose} className="w-6 h-6 bg-gray-300 hover:bg-gray-400 text-black border-2 border-gray-600 flex items-center justify-center pixel-font font-bold text-xs">
            <X className="w-3 h-3" />
          </button>
        </div>
        
        <div className="p-4 bg-gray-200">
          <div className="text-center">
            <div className="w-20 h-20 bg-yellow-400 border-2 border-black mx-auto mb-4 flex items-center justify-center">
              <div className="text-2xl">👤</div>
            </div>
            <h3 className="pixel-font text-xl mb-4">{friend.name}</h3>
            
            {/* Interests */}
            <div className="mb-4">
              <h4 className="pixel-font text-sm font-bold mb-2">Interests:</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {friend.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white border-2 border-black pixel-font text-xs"
                  >
                    {getHobbyEmoji(interest)}
                  </span>
                ))}
              </div>
            </div>

            {/* Friends in Common */}
            <div className="mb-6">
              <h4 className="pixel-font text-sm font-bold mb-2">Friends in common:</h4>
              <div className="flex justify-center space-x-4">
                {friend.friendsInCommon.map((commonFriend, idx) => (
                  <div key={idx} className="text-center">
                    <div 
                      className="w-12 h-12 bg-yellow-400 border-2 border-black mx-auto mb-1 flex items-center justify-center cursor-pointer hover:bg-yellow-300"
                      onClick={() => {
                        onClose(); // Close the modal first
                        navigate('/homies/profile');
                      }}
                    >
                      <div className="text-lg">👤</div>
                    </div>
                    <div 
                      className="pixel-font text-xs cursor-pointer hover:text-blue-600 hover:underline"
                      onClick={() => {
                        onClose(); // Close the modal first  
                        navigate('/homies/profile');
                      }}
                    >
                      {commonFriend}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Friend / Withdraw Button */}
            {friendRequestSent ? (
              <button 
                onClick={handleWithdraw}
                className="w-full px-6 py-3 bg-red-500 text-white pixel-font border-2 border-outset hover:bg-red-600"
              >
                Withdraw
              </button>
            ) : (
              <button 
                onClick={handleAddFriend}
                className="w-full px-6 py-3 bg-green-500 text-white pixel-font border-2 border-outset hover:bg-green-600"
              >
                Add Friend
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};