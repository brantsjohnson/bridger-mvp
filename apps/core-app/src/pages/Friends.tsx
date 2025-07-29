import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ChevronRight, X, Search } from 'lucide-react';
import FriendRequests from '../components/FriendRequests';
const Friends = () => {
  const navigate = useNavigate();
  const currentUserId = "fox_red_user_123"; // For testing
  const [searchQuery, setSearchQuery] = useState('');
  
  const friends = [
    { id: 1, firstName: "Alex", lastName: "Johnson", categories: ["Social", "Tech", "Gaming"] },
    { id: 2, firstName: "Jordan", lastName: "Smith", categories: ["Music", "Art", "Vibes"] },
    { id: 3, firstName: "Casey", lastName: "Brown", categories: ["Fitness", "Nature", "Chill"] },
    { id: 4, firstName: "Riley", lastName: "Davis", categories: ["Books", "Coffee", "Deep"] },
    { id: 5, firstName: "Sam", lastName: "Wilson", categories: ["Travel", "Food", "Adventure"] },
    { id: 6, firstName: "Taylor", lastName: "Martinez", categories: ["Movies", "Gaming", "Fun"] },
  ];

  // Filter friends based on search query
  const filteredFriends = friends.filter(friend => 
    `${friend.firstName} ${friend.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFriendClick = (friendId: number) => {
    navigate(`/profile?friend=${friendId}`);
  };

  const handleBackClick = () => {
    navigate('/');
  };

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
          Homies
        </div>
        <button
          onClick={handleBackClick}
          className="bg-gray-300 hover:bg-gray-400 text-black px-2 py-1 text-xs border border-gray-600 pixel-font font-bold"
        >
          X
        </button>
      </div>
      
      {/* Content area */}
      <div className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-40px)]">
        {/* Friend Requests */}
        <div className="max-w-2xl mx-auto mb-6">
          <FriendRequests currentUserId={currentUserId} />
        </div>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="popup-window">
            <div className="window-content">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-black" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search friends..."
                  className="flex-1 px-3 py-2 pixel-font text-sm bg-white border-2"
                  style={{ border: '2px inset #e0e0e0' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Friends List */}
        <div className="max-w-2xl mx-auto space-y-4">
          {filteredFriends.map((friend) => (
            <div 
              key={friend.id}
              className="friend-widget p-4 cursor-pointer flex items-center gap-4"
              onClick={() => handleFriendClick(friend.id)}
            >
              {/* Profile Icon */}
              <div className="w-12 h-12 bg-yellow-400 border-2 border-gray-600 flex items-center justify-center">
                <User className="w-6 h-6 text-black" />
              </div>
              
              {/* Friend Info - Full name */}
              <div className="flex-1">
                <h3 className="pixel-font font-bold text-lg">{friend.firstName} {friend.lastName}</h3>
              </div>
              
              {/* Arrow Button */}
              <button className="w-8 h-8 bg-gray-300 border-2 border-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      style={{ border: '2px outset #e0e0e0' }}>
                <ChevronRight className="w-4 h-4 text-black" />
              </button>
            </div>
          ))}
          
          {filteredFriends.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <p className="pixel-font text-gray-600">No friends found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Friends;