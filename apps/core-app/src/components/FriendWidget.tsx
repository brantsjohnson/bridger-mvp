import { User, X } from 'lucide-react';
import { useState } from 'react';
import { getHobbyEmoji } from '@/lib/hobbyMappings';

interface FriendWidgetProps {
  name: string;
  categories: string[];
  avatar?: string;
  isPending?: boolean;
  onPendingChange?: (name: string, pending: boolean) => void;
  onClick?: () => void;
}

export const FriendWidget = ({ name, categories, isPending: propIsPending = false, onPendingChange, onClick }: FriendWidgetProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const isPending = propIsPending; // Use the prop value directly instead of local state
  const [showFriendProfile, setShowFriendProfile] = useState(false);
  const [selectedMutualFriend, setSelectedMutualFriend] = useState<string | null>(null);

  const mutualFriends = [
    { name: "Jordan", avatar: "" },
    { name: "Casey", avatar: "" }
  ]; // Mock data

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPendingChange) onPendingChange(name, true);
  };

  const handleAddFriend = () => {
    setShowPreview(false);
    if (onPendingChange) onPendingChange(name, true);
  };

  const handleWithdrawRequest = () => {
    setShowPreview(false);
    if (onPendingChange) onPendingChange(name, false);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setShowFriendProfile(false);
    setSelectedMutualFriend(null);
  };

  const handleMutualFriendClick = (friendName: string) => {
    setSelectedMutualFriend(friendName);
    setShowFriendProfile(true);
  };

  const handleBackToPreview = () => {
    setShowFriendProfile(false);
    setSelectedMutualFriend(null);
  };

  return (
    <>
      <div 
        className={`bg-gray-300 border-2 border-gray-600 p-3 cursor-pointer flex items-center gap-3 hover:bg-gray-200 transition-colors ${
          isPending ? 'border-dashed border-yellow-600 bg-yellow-50 opacity-75' : ''
        }`}
        style={{ border: isPending ? '2px dashed #ca8a04' : '2px outset #e0e0e0' }}
        onClick={() => setShowPreview(true)}
      >
        <div className="w-8 h-8 bg-yellow-300 border-2" style={{ border: '2px outset #f0f0a0' }}>
          <User size={16} style={{ color: '#000080', margin: '6px auto' }} />
        </div>
        <div className="flex-1">
          <h3 className="pixel-font font-bold">{name}</h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {categories.map((category, index) => (
              <span 
                key={index}
                className="pixel-font text-xs px-1 py-0.5 bg-white border"
                style={{ border: '1px inset #c0c0c0' }}
              >
                {category}
              </span>
            ))}
          </div>
        </div>
        {isPending ? (
          <div className="pixel-font text-xs text-gray-600 font-bold">
            PENDING
          </div>
        ) : (
          <button 
            className="w-8 h-8 bg-green-400 border-2 border-gray-800 flex items-center justify-center hover:bg-green-300 transition-colors text-black font-bold text-lg"
            style={{ border: '2px outset #90EE90' }}
            onClick={handleAddClick}
          >
            +
          </button>
        )}
      </div>

      {/* Friend Preview Popup */}
      {showPreview && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black bg-opacity-50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh' }}>
          <div className="popup-window max-w-sm mx-4">
            <div className="window-titlebar">
              <span>Friend Preview</span>
              <button 
                onClick={handleClosePreview}
                className="w-6 h-6 bg-gray-300 border border-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
                style={{ border: '2px outset #e0e0e0' }}
              >
                <X className="w-3 h-3 text-black" />
              </button>
            </div>
            <div className="window-content p-4">
              <div className="space-y-4">
                {/* Profile section */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-400 border-2 border-gray-600 flex items-center justify-center mx-auto mb-2">
                    <User className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="pixel-font font-bold text-lg">{name}</h3>
                </div>

                {/* Hobbies */}
                <div>
                  <h4 className="pixel-font font-bold text-sm mb-2">Interests:</h4>
                  <div className="flex flex-wrap gap-1">
                    {categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 pixel-font text-xs bg-white border-2 border-gray-600"
                        style={{ border: '2px outset #e0e0e0' }}
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mutual friends */}
                <div>
                  <h4 className="pixel-font font-bold text-sm mb-2">Friends in common:</h4>
                  <div className="flex gap-2">
                    {mutualFriends.map((friend, index) => (
                      <button
                        key={index}
                        onClick={() => handleMutualFriendClick(friend.name)}
                        className="flex flex-col items-center gap-1 hover:bg-gray-100 p-1 transition-colors"
                      >
                        <div className="w-8 h-8 bg-yellow-300 border-2 border-gray-600 flex items-center justify-center">
                          <User className="w-4 h-4 text-black" />
                        </div>
                        <span className="pixel-font text-xs">{friend.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add/Withdraw button */}
                <button
                  onClick={isPending ? handleWithdrawRequest : handleAddFriend}
                  className={`w-full border-2 border-gray-600 p-2 pixel-font text-center font-bold transition-colors text-black ${
                    isPending 
                      ? 'bg-yellow-400 hover:bg-yellow-300' 
                      : 'bg-green-400 hover:bg-green-300'
                  }`}
                  style={{ 
                    border: isPending 
                      ? '2px outset #FFFF00' 
                      : '2px outset #90EE90' 
                  }}
                >
                  {isPending ? "Withdraw Request" : "Add Friend"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Friend Profile Window */}
      {showFriendProfile && selectedMutualFriend && (
        <div 
          className="fixed bg-gray-400"
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh',
            zIndex: 99999,
            margin: 0,
            padding: '16px'
          }}
        >
          {/* Main Window */}
          <div className="popup-window w-full h-full flex flex-col">
            <div className="window-titlebar">
              <span>{selectedMutualFriend}</span>
              <button 
                onClick={handleBackToPreview}
                className="w-6 h-6 bg-gray-300 border border-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
                style={{ border: '2px outset #e0e0e0' }}
              >
                <X className="w-3 h-3 text-black" />
              </button>
            </div>
            
            <div className="window-content flex-1 p-4 space-y-4 overflow-y-auto">
              {/* Profile Picture Section */}
              <div className="popup-window">
                <div className="window-titlebar">
                  <span>Profile Picture</span>
                </div>
                <div className="window-content p-6 text-center">
                  <div className="w-24 h-24 bg-yellow-400 border-2 border-gray-600 flex items-center justify-center mx-auto mb-4">
                    <User className="w-12 h-12 text-black" />
                  </div>
                  <h3 className="pixel-font font-bold text-2xl">{selectedMutualFriend}</h3>
                </div>
              </div>

              {/* About Me Section */}
              <div className="popup-window">
                <div className="window-titlebar">
                  <span>About Me</span>
                </div>
                <div className="window-content p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="pixel-font font-bold">Interests:</span>
                    <span className="pixel-font">
                      {selectedMutualFriend === "Jordan" && "Music, Art, Vibes"}
                      {selectedMutualFriend === "Casey" && "Fitness, Nature, Chill"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="pixel-font font-bold">Status:</span>
                    <span className="pixel-font">Friend</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="pixel-font font-bold">Connection:</span>
                    <span className="pixel-font">Mutual friend</span>
                  </div>
                </div>
              </div>

              {/* Friend Info Section */}
              <div className="popup-window">
                <div className="window-titlebar">
                  <span>Friend Info</span>
                </div>
                <div className="window-content p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="pixel-font font-bold">Favorite Activity:</span>
                    <span className="pixel-font">
                      {selectedMutualFriend === "Jordan" && "Music"}
                      {selectedMutualFriend === "Casey" && "Fitness"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="pixel-font font-bold">Connection Since:</span>
                    <span className="pixel-font">2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="pixel-font font-bold">Mutual Friends:</span>
                    <span className="pixel-font">5</span>
                  </div>
                </div>
              </div>

              {/* Interests Section */}
              <div className="popup-window">
                <div className="window-titlebar">
                  <span>Interests</span>
                </div>
                <div className="window-content p-4">
                  <div className="flex flex-wrap gap-2">
                     {selectedMutualFriend === "Jordan" && ["Music", "Art", "Vibes"].map((interest, index) => (
                       <span
                         key={index}
                         className="px-3 py-2 pixel-font text-sm bg-white border-2 border-gray-600"
                         style={{ border: '2px outset #e0e0e0' }}
                       >
                         {getHobbyEmoji(interest)} {interest}
                       </span>
                     ))}
                     {selectedMutualFriend === "Casey" && ["Fitness", "Nature", "Chill"].map((interest, index) => (
                       <span
                         key={index}
                         className="px-3 py-2 pixel-font text-sm bg-white border-2 border-gray-600"
                         style={{ border: '2px outset #e0e0e0' }}
                       >
                         {getHobbyEmoji(interest)} {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  className="flex-1 bg-gray-300 border-2 border-gray-600 p-3 pixel-font font-bold hover:bg-gray-200 transition-colors"
                  style={{ border: '2px outset #e0e0e0' }}
                >
                  Send Message
                </button>
                <button
                  className="flex-1 bg-gray-300 border-2 border-gray-600 p-3 pixel-font font-bold hover:bg-gray-200 transition-colors"
                  style={{ border: '2px outset #e0e0e0' }}
                >
                  Remove Friend
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};