import React from 'react';

interface ProfileWindowProps {
  isOpen: boolean;
  onClose: () => void;
  friendId?: number | null;
}

const ProfileWindow = ({ isOpen, onClose, friendId }: ProfileWindowProps) => {
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

  // Friend data
  const friendsData = {
    1: { name: "Alex" },
    2: { name: "Jordan" },
    3: { name: "Casey" },
    4: { name: "Riley" },
    5: { name: "Sam" },
    6: { name: "Taylor" },
  };

  const currentProfile = friendId ? friendsData[friendId] : null;
  const isViewingFriend = !!friendId && currentProfile;

  return (
    <div 
      className="fixed inset-0 z-50"
      style={{
        backgroundImage: 'url(/lovable-uploads/32772003-58aa-43aa-b39d-a2551499e39b.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      {/* Windows-style title bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 flex justify-between items-center border-b-2 border-gray-800">
        <div className="font-bold text-sm pixel-font">
          {isViewingFriend ? currentProfile.name : "Brant Johnson"}
        </div>
        <button
          onClick={onClose}
          className="bg-gray-300 hover:bg-gray-400 text-black px-2 py-1 text-xs border border-gray-600 pixel-font font-bold"
        >
          X
        </button>
      </div>
      
      {/* Content area - will be filled in next steps */}
      <div className="flex-1">
        {/* Content will go here */}
      </div>
    </div>
  );
};

export default ProfileWindow;
