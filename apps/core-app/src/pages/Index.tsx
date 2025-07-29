import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DesktopIcon } from '@/components/DesktopIcon';
import TakeSurveyButton from '@/components/TakeSurveyButton';
import { FriendRequestNotification } from '@/components/FriendRequestNotification';
import { FriendWidget } from '@/components/FriendWidget';
import { AddFriendModal } from '@/components/AddFriendModal';
import { FriendRequestCarousel } from '@/components/FriendRequestCarousel';
import { getHobbyEmoji } from '@/lib/hobbyMappings';
import FriendsWindow from '@/components/FriendsWindow';
import ProfileWindow from '@/components/ProfileWindow';
import BridgerMenu from '@/components/BridgerMenu';


import profileIcon from '/lovable-uploads/a0496708-746f-43fc-bd69-9dac67a76d55.png';
import suggestionsIcon from '/lovable-uploads/3d32349b-0c38-46d1-a55b-2021f9115399.png';
import surveyIcon from '/lovable-uploads/f87ac89d-2efb-46a5-b083-ecf3dab39a93.png';


const Index = () => {
  // User data state
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [showFriendsWindow, setShowFriendsWindow] = useState(false);
  const [showProfileWindow, setShowProfileWindow] = useState(false);
  const [showBridgerMenu, setShowBridgerMenu] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);
  const [pendingFriends, setPendingFriends] = useState<string[]>([]);
  const [shouldSortPending, setShouldSortPending] = useState(false);
  const [showFriendRequestCarousel, setShowFriendRequestCarousel] = useState(false);
  const [friendRequestCount, setFriendRequestCount] = useState(2);
  const navigate = useNavigate();
  
  // Load user data on component mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedUserData = localStorage.getItem('bridger_user_data');
        console.log('Checking for user data in localStorage:', storedUserData);
        if (storedUserData) {
          const user = JSON.parse(storedUserData);
          setUserData(user);
          console.log('✅ Loaded user data:', user);
        } else {
          console.log('No user data found, showing demo mode');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);
  
  // Mock data - each object represents one individual friend request
  const [friendRequests, setFriendRequests] = useState([
    { from: "Taylor" },
    { from: "Sam" },
  ]);
  
  const allFriends = [
    { name: "Alex", categories: ["Social", "Tech", "Gaming"] },
    { name: "Jordan", categories: ["Music", "Art", "Vibes"] },
    { name: "Casey", categories: ["Fitness", "Nature", "Chill"] },
    { name: "Riley", categories: ["Books", "Coffee", "Deep"] },
  ];

  // Sort friends - pending ones go to bottom after "refresh" (closing windows)
  const friends = shouldSortPending 
    ? [...allFriends.filter(f => !pendingFriends.includes(f.name)), 
       ...allFriends.filter(f => pendingFriends.includes(f.name))]
    : allFriends;

  const handleIconClick = (iconType: string) => {
    console.log(`Clicked ${iconType} icon`);
    if (iconType === 'Profile') {
      navigate('/profile');
    } else if (iconType === 'Suggestions') {
      navigate('/homies');
    } else if (iconType === 'Add') {
      navigate('/add');
    }
  };

  const handleOpenFriendProfile = (friendId: number) => {
    setShowFriendsWindow(false);
    setSelectedFriendId(friendId);
    setShowProfileWindow(true);
  };




  const handleSurveyClick = () => {
    console.log("Taking new survey...");
    // Send message to parent to navigate to quiz app
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ 
        type: 'NAVIGATE_TO_QUIZ'
      }, '*');
    } else {
      // Fallback: direct navigation if not in iframe
      window.location.href = 'http://localhost:3000/quiz';
    }
  };

  const handleReviewRequests = () => {
    console.log("Review friend requests");
    setShowFriendRequestCarousel(true);
  };

  const handleRequestsProcessed = (processedRequests: string[]) => {
    console.log('=== PROCESSING REQUESTS ===');
    console.log('Processed requests received:', processedRequests);
    console.log('Current friend requests before filtering:', friendRequests);
    
    // Remove processed requests from the friend requests array
    setFriendRequests(prev => {
      console.log('Filtering out processed requests...');
      prev.forEach(req => {
        console.log(`Request from ${req.from}: included in processed? ${processedRequests.includes(req.from)}`);
      });
      
      const remaining = prev.filter(req => !processedRequests.includes(req.from));
      console.log('Remaining friend requests after filter:', remaining);
      return remaining;
    });
    
    // Update the count to match remaining requests
    setFriendRequestCount(prev => {
      const newCount = prev - processedRequests.length;
      console.log(`Friend request count: ${prev} - ${processedRequests.length} = ${newCount}`);
      return newCount;
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <div className="text-white text-xl pixel-font">
          Loading your Bridger experience...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="relative z-10 p-6 space-y-8">
        {/* Bridger clickable title in top left */}
        <div className="absolute top-10 left-8 flex items-center">
          <button
            onClick={() => setShowBridgerMenu(!showBridgerMenu)}
            className="pixel-font text-white text-2xl font-bold hover:scale-105 transition-transform cursor-pointer"
            style={{ 
              textShadow: '2px 2px 2px rgba(0,0,0,0.8)',
              background: 'none',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '4px'
            }}
          >
            Bridger
          </button>
        </div>
        
        {/* Personalized welcome message */}
        {userData && (
          <div className="absolute top-10 right-8 text-white text-sm pixel-font">
            Welcome back, {userData.name || userData.email}!
          </div>
        )}

        {/* Bridger Menu */}
        <BridgerMenu
          isOpen={showBridgerMenu}
          onClose={() => setShowBridgerMenu(false)}
          onOpenProfile={() => {
            setSelectedFriendId(null);
            setShowProfileWindow(true);
          }}
          onOpenFriends={() => setShowFriendsWindow(true)}
        />

        {/* Desktop Icons - Two on top, one on bottom - Left aligned */}
        <div className="flex flex-col items-start space-y-6 pt-8 pl-8">
          {/* Top row - Profile and Suggestions */}
          <div className="flex space-x-12">
            <DesktopIcon 
              iconSrc={profileIcon}
              label="Profile" 
              onClick={() => handleIconClick('Profile')}
            />
            <DesktopIcon 
              iconSrc={suggestionsIcon}
              label="Homies" 
              onClick={() => handleIconClick('Suggestions')}
            />
          </div>
          
          {/* Bottom row - Survey */}
          <div className="flex">
            <DesktopIcon 
              iconSrc={surveyIcon}
              label="Add" 
              onClick={() => handleIconClick('Add')}
            />
          </div>
        </div>




        {/* Take New Survey Button - Above Friend Requests */}
        <div className="flex justify-center mb-6">
          <TakeSurveyButton onClick={handleSurveyClick} />
        </div>

        {/* Add Friend Modal */}
        <AddFriendModal 
          isOpen={showAddFriendModal}
          onClose={() => {
            setShowAddFriendModal(false);
            setShouldSortPending(true);
          }}
        />

        {/* Friend Request Notifications */}
        {friendRequestCount > 0 && (
          <div className="flex justify-center relative">
            <div className="relative">
              {/* Background stacked windows for visual effect */}
              {friendRequestCount > 1 && friendRequests.slice(1).map((_, index) => {
                const offsetIndex = index + 1;
                return (
                  <div
                    key={`bg-${index}`}
                    className="popup-window min-w-[260px] absolute"
                     style={{
                       transform: `translate(${offsetIndex * 12}px, ${offsetIndex * 12}px)`,
                       zIndex: 8 - index
                     }}
                  >
                  <div className="window-titlebar">
                    <span>Friend Request Alert</span>
                  </div>
                  <div className="window-content">
                    <div className="pixel-font text-center mb-2">
                      !!! 1 NEW FRIEND REQUEST !!!
                    </div>
                    <div className="text-center pixel-font text-xs mb-3">
                      People want to connect with you
                    </div>
                    <div className="w-full px-4 py-1 pixel-font bg-gray-300 border-2" style={{ border: '2px outset #e0e0e0' }}>
                      Review Requests
                    </div>
                  </div>
                </div>
                );
              })}
              
              {/* Main interactive window */}
              <div className="popup-window min-w-[260px] relative" style={{ zIndex: 10 }}>
                <div className="window-titlebar">
                  <span>Friend Request Alert</span>
                </div>
                <div className="window-content">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl mt-1">🚨</div>
                      <div className="flex-1">
                        <div className="pixel-font text-center mb-2">
                          !!! {friendRequestCount} NEW FRIEND REQUEST{friendRequestCount > 1 ? 'S' : ''} !!!
                        </div>
                      <div className="text-center pixel-font text-xs mb-3">
                        People want to connect with you
                      </div>
                      <button 
                        onClick={handleReviewRequests}
                        className="w-full px-4 py-1 pixel-font bg-gray-300 border-2 border-outset hover:bg-gray-200 transition-colors"
                        style={{ border: '2px outset #e0e0e0' }}
                      >
                        Review Requests
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}



        {/* Friends List */}
        <div className="space-y-4 max-w-md mx-auto mt-8">
          <h2 className="pixel-font text-center text-lg font-bold" style={{ color: 'white', textShadow: '1px 1px 1px rgba(0,0,0,0.8)' }}>
            Suggestions
          </h2>
          {friends.map((friend, index) => {
            const isPending = pendingFriends.includes(friend.name);
            return (
              <FriendWidget
                key={index}
                name={friend.name}
                categories={friend.categories.map(getHobbyEmoji)}
                isPending={isPending}
                onPendingChange={(name: string, pending: boolean) => {
                  if (pending) {
                    setPendingFriends(prev => [...prev, name]);
                  } else {
                    setPendingFriends(prev => prev.filter(f => f !== name));
                  }
                }}
                onClick={() => console.log(`View ${friend.name}`)}
              />
            );
          })}
        </div>

        {/* Windows */}
        <FriendsWindow
          isOpen={showFriendsWindow}
          onClose={() => {
            setShowFriendsWindow(false);
            setShouldSortPending(true);
          }}
          onOpenProfile={handleOpenFriendProfile}
        />
        
        <ProfileWindow
          isOpen={showProfileWindow}
          onClose={() => {
            setShowProfileWindow(false);
            setShouldSortPending(true);
          }}
          friendId={selectedFriendId}
        />

        {/* Friend Request Carousel */}
        <FriendRequestCarousel
          isOpen={showFriendRequestCarousel}
          onClose={() => setShowFriendRequestCarousel(false)}
          requests={friendRequests}
          onRequestsProcessed={handleRequestsProcessed}
        />
      </div>
    </div>
  );
};

export default Index;
