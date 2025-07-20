import { X } from 'lucide-react';

interface UserProfilePageProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    interests: string[];
    status: string;
    connection: string;
    favoriteActivity: string;
    connectionSince: string;
    mutualFriends: number;
  };
}

export const UserProfilePage = ({ isOpen, onClose, user }: UserProfilePageProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-300 flex flex-col z-50">
      {/* Full Screen Header */}
      <div className="window-titlebar">
        <span>{user.name}</span>
        <button onClick={onClose} className="hover:bg-gray-200 p-1 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Profile Picture Section */}
        <div className="popup-window">
          <div className="window-titlebar flex justify-between items-center">
            <span>Profile Picture</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-gray-400 border border-black"></div>
              <div className="w-3 h-3 bg-gray-400 border border-black"></div>
              <div className="w-3 h-3 bg-gray-400 border border-black"></div>
            </div>
          </div>
          <div className="window-content text-center">
            <div className="w-24 h-24 bg-yellow-400 border-2 border-black mx-auto mb-4 flex items-center justify-center">
              <div className="text-3xl">👤</div>
            </div>
            <h3 className="pixel-font text-xl">{user.name}</h3>
          </div>
        </div>

        {/* About Me Section */}
        <div className="popup-window">
          <div className="window-titlebar flex justify-between items-center">
            <span>About Me</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-gray-400 border border-black"></div>
              <div className="w-3 h-3 bg-gray-400 border border-black"></div>
              <div className="w-3 h-3 bg-gray-400 border border-black"></div>
            </div>
          </div>
          <div className="window-content space-y-3">
            <div className="flex justify-between">
              <span className="pixel-font font-bold">Interests:</span>
              <span className="pixel-font">{user.interests.join(', ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="pixel-font font-bold">Status:</span>
              <span className="pixel-font">{user.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="pixel-font font-bold">Connection:</span>
              <span className="pixel-font">{user.connection}</span>
            </div>
          </div>
        </div>

        {/* Friend Info Section */}
        <div className="popup-window">
          <div className="window-titlebar flex justify-between items-center">
            <span>Friend Info</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-gray-400 border border-black"></div>
              <div className="w-3 h-3 bg-gray-400 border border-black"></div>
              <div className="w-3 h-3 bg-gray-400 border border-black"></div>
            </div>
          </div>
          <div className="window-content space-y-3">
            <div className="flex justify-between">
              <span className="pixel-font font-bold">Favorite Activity:</span>
              <span className="pixel-font">{user.favoriteActivity}</span>
            </div>
            <div className="flex justify-between">
              <span className="pixel-font font-bold">Connection Since:</span>
              <span className="pixel-font">{user.connectionSince}</span>
            </div>
            <div className="flex justify-between">
              <span className="pixel-font font-bold">Mutual Friends:</span>
              <span className="pixel-font">{user.mutualFriends}</span>
            </div>
          </div>
        </div>

        {/* Interests Section */}
        <div className="popup-window">
          <div className="window-titlebar flex justify-between items-center">
            <span>Interests</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-gray-400 border border-black"></div>
              <div className="w-3 h-3 bg-gray-400 border border-black"></div>
              <div className="w-3 h-3 bg-gray-400 border border-black"></div>
            </div>
          </div>
          <div className="window-content">
            <div className="flex flex-wrap gap-3">
              {user.interests.map((interest, idx) => (
                <button
                  key={idx}
                  className="px-4 py-2 bg-white border-2 border-black pixel-font text-sm hover:bg-gray-100"
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button className="flex-1 px-4 py-3 bg-blue-500 text-white pixel-font border-2 border-outset hover:bg-blue-600">
            Send Message
          </button>
          <button className="flex-1 px-4 py-3 bg-red-500 text-white pixel-font border-2 border-outset hover:bg-red-600">
            Remove Friend
          </button>
        </div>
      </div>
    </div>
  );
};