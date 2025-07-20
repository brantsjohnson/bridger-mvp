
import React, { useState } from 'react';
import { User, X } from 'lucide-react';
import ProfileWindow from './ProfileWindow';

interface FriendsWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProfile: (friendId: number) => void;
}

const FriendsWindow = ({ isOpen, onClose, onOpenProfile }: FriendsWindowProps) => {
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showPreview, setShowPreview] = useState<number | null>(null);
  const [pendingFriends, setPendingFriends] = useState<number[]>([]);

  // Add body overflow control
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const friends = [
    { id: 1, name: "Alex", categories: ["Social", "Tech", "Gaming"], mutualFriends: ["Jordan", "Casey"] },
    { id: 2, name: "Jordan", categories: ["Music", "Art", "Vibes"], mutualFriends: ["Alex", "Riley"] },
    { id: 3, name: "Casey", categories: ["Fitness", "Nature", "Chill"], mutualFriends: ["Alex", "Sam"] },
    { id: 4, name: "Riley", categories: ["Books", "Coffee", "Deep"], mutualFriends: ["Jordan", "Taylor"] },
    { id: 5, name: "Sam", categories: ["Travel", "Food", "Adventure"], mutualFriends: ["Casey", "Taylor"] },
    { id: 6, name: "Taylor", categories: ["Movies", "Gaming", "Fun"], mutualFriends: ["Riley", "Sam"] },
  ];

  // Separate friends into available and pending
  const availableFriends = friends.filter(friend => !pendingFriends.includes(friend.id));
  const pendingFriendsList = friends.filter(friend => pendingFriends.includes(friend.id));

  const handleCheckboxClick = (friendId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPreview(friendId);
  };

  const handleAddFriend = (friendId: number) => {
    setPendingFriends(prev => [...prev, friendId]);
    setShowPreview(null);
  };

  const handleClosePreview = () => {
    setShowPreview(null);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-gray-300">
        <div className="popup-window bg-gray-300 w-full h-full border-none">
          <div className="window-titlebar">
            <span>Friends</span>
            <button 
              onClick={onClose}
              className="w-6 h-6 bg-gray-300 border border-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
              style={{ border: '2px outset #e0e0e0' }}
            >
              <X className="w-3 h-3 text-black" />
            </button>
          </div>
          
          <div className="window-content h-full overflow-y-auto p-6">
            <div className="space-y-3 max-w-3xl mx-auto">
              {/* Available Friends */}
              {/* UPDATED FRIENDS LIST */}
              {availableFriends.map((friend) => (
                <div 
                  key={friend.id}
                  className="bg-gray-300 border-2 border-gray-600 p-3 cursor-pointer flex items-center gap-3 hover:bg-gray-200 transition-colors"
                  style={{ border: '2px outset #e0e0e0' }}
                  onClick={() => {
                    setSelectedFriendId(friend.id);
                    setIsProfileOpen(true);
                  }}
                >
                  {/* Profile Icon */}
                  <div className="w-10 h-10 bg-yellow-400 border-2 border-gray-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-black" />
                  </div>
                  
                  {/* Friend Info */}
                  <div className="flex-1">
                    <h3 className="pixel-font font-bold text-base mb-1">{friend.name}</h3>
                    <div className="flex flex-wrap gap-1">
                      {friend.categories.map((category, index) => (
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
                  
                  {/* Arrow button */}
                  <div className="pixel-font text-xl font-bold text-gray-800">
                    &gt;
                  </div>
                </div>
              ))}

              {/* Pending Friends Section */}
              {pendingFriendsList.length > 0 && (
                <>
                  <div className="pixel-font text-sm font-bold text-gray-600 mt-6 mb-3">
                    PENDING REQUESTS:
                  </div>
                  {pendingFriendsList.map((friend) => (
                    <div 
                      key={friend.id}
                      className="friend-widget p-3 flex items-center gap-3 border-2 border-dashed border-yellow-600 bg-yellow-50 opacity-75"
                    >
                      {/* Profile Icon */}
                      <div className="w-10 h-10 bg-yellow-300 border-2 border-gray-600 flex items-center justify-center">
                        <User className="w-5 h-5 text-black" />
                      </div>
                      
                      {/* Friend Info */}
                      <div className="flex-1">
                        <h3 className="pixel-font font-bold text-base mb-1">{friend.name}</h3>
                        <div className="flex flex-wrap gap-1">
                          {friend.categories.map((category, index) => (
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
                      
                      {/* Pending indicator */}
                      <div className="pixel-font text-xs text-gray-600 font-bold">
                        PENDING
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Friend Preview Popup */}
      {showPreview && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black bg-opacity-50">
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
              {(() => {
                const friend = friends.find(f => f.id === showPreview);
                if (!friend) return null;
                
                return (
                  <div className="space-y-4">
                    {/* Profile section */}
                    <div className="text-center">
                      <div className="w-16 h-16 bg-yellow-400 border-2 border-gray-600 flex items-center justify-center mx-auto mb-2">
                        <User className="w-8 h-8 text-black" />
                      </div>
                      <h3 className="pixel-font font-bold text-lg">{friend.name}</h3>
                    </div>

                    {/* Hobbies */}
                    <div>
                      <h4 className="pixel-font font-bold text-sm mb-2">Interests:</h4>
                      <div className="flex flex-wrap gap-1">
                        {friend.categories.map((category, index) => (
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
                      <div className="pixel-font text-sm">
                        {friend.mutualFriends.join(", ")}
                      </div>
                    </div>

                    {/* Add button */}
                    <button
                      onClick={() => handleAddFriend(friend.id)}
                      className="w-full friend-widget p-2 pixel-font text-center font-bold hover:bg-gray-200 transition-colors"
                    >
                      Add Friend
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Profile Window */}
      <ProfileWindow 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        friendId={selectedFriendId}
      />
    </>
  );
};

export default FriendsWindow;
