import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FriendPreview } from './FriendPreview';
import { UserProfilePage } from './UserProfilePage';
import { RelationshipSelection } from './RelationshipSelection';
import { getHobbyEmoji } from '@/lib/hobbyMappings';

interface FriendRequest {
  from: string;
  profile?: {
    movieCharacters?: string[];
    hobbies?: string[];
    question?: string;
    diveDeeper?: string;
    mutualConnections?: {
      person1ShouldKnow?: string[];
      person2ShouldKnow?: string[];
    };
  };
}

interface FriendRequestCarouselProps {
  isOpen: boolean;
  onClose: () => void;
  requests: FriendRequest[];
  onRequestsProcessed?: (processedRequests: string[]) => void;
  isReviewingExistingFriend?: boolean;
}

export const FriendRequestCarousel = ({ isOpen, onClose, requests, onRequestsProcessed, isReviewingExistingFriend = false }: FriendRequestCarouselProps) => {
  const [currentRequestIndex, setCurrentRequestIndex] = useState(0);
  const [currentBoxIndex, setCurrentBoxIndex] = useState(0);
  const [approvedRequests, setApprovedRequests] = useState<string[]>([]);
  const [deniedRequests, setDeniedRequests] = useState<string[]>([]);
  const [revealedBoxes, setRevealedBoxes] = useState<{ [key: number]: boolean[] }>({});
  const [requestSteps, setRequestSteps] = useState<{ [key: number]: 'info' | 'relationship' | 'results' | 'boxes' | 'connections' }>({});
  const [friendPreview, setFriendPreview] = useState<{ isOpen: boolean; friend: { name: string; interests: string[]; friendsInCommon: string[] } | null }>({
    isOpen: false,
    friend: null
  });
  const [profilePage, setProfilePage] = useState<{ isOpen: boolean; user: any | null }>({
    isOpen: false,
    user: null
  });
  const [showRelationshipSelection, setShowRelationshipSelection] = useState(false);
  const [selectedRelationship, setSelectedRelationship] = useState<string>('');

  // Mock detailed user profile data
  const mockUserProfiles = {
    Taylor: {
      name: 'Taylor',
      interests: ['Movies', 'Gaming', 'Fun'],
      status: 'Friend',
      connection: 'Mutual friend',
      favoriteActivity: 'Movies',
      connectionSince: '2024',
      mutualFriends: 5
    },
    Jordan: {
      name: 'Jordan',
      interests: ['Music', 'Art', 'Vibes'],
      status: 'Friend',
      connection: 'Mutual friend',
      favoriteActivity: 'Music',
      connectionSince: '2024',
      mutualFriends: 5
    },
    Alex: {
      name: 'Alex',
      interests: ['Social', 'Tech', 'Gaming'],
      status: 'Friend',
      connection: 'Mutual friend',
      favoriteActivity: 'Gaming',
      connectionSince: '2024',
      mutualFriends: 3
    },
    Sarah: {
      name: 'Sarah',
      interests: ['Art', 'Music', 'Photography'],
      status: 'Friend',
      connection: 'Mutual friend',
      favoriteActivity: 'Art',
      connectionSince: '2024',
      mutualFriends: 4
    },
    Mike: {
      name: 'Mike',
      interests: ['Sports', 'Travel', 'Cooking'],
      status: 'Friend',
      connection: 'Mutual friend',
      favoriteActivity: 'Sports',
      connectionSince: '2024',
      mutualFriends: 6
    },
    Emma: {
      name: 'Emma',
      interests: ['Reading', 'Fitness', 'Nature'],
      status: 'Friend',
      connection: 'Mutual friend',
      favoriteActivity: 'Reading',
      connectionSince: '2024',
      mutualFriends: 4
    },
    Casey: {
      name: 'Casey',
      interests: ['Music', 'Art', 'Dancing'],
      status: 'Friend',
      connection: 'Mutual friend',
      favoriteActivity: 'Dancing',
      connectionSince: '2024',
      mutualFriends: 3
    },
    Riley: {
      name: 'Riley',
      interests: ['Photography', 'Travel', 'Food'],
      status: 'Friend',
      connection: 'Mutual friend',
      favoriteActivity: 'Photography',
      connectionSince: '2024',
      mutualFriends: 5
    }
  };

  // Mock friend data for demo
  const mockFriends = {
    Alex: { name: 'Alex', interests: ['Social', 'Tech', 'Gaming'], friendsInCommon: ['Jordan', 'Casey'] },
    Sarah: { name: 'Sarah', interests: ['Art', 'Music', 'Photography'], friendsInCommon: ['Taylor', 'Mike'] },
    Mike: { name: 'Mike', interests: ['Sports', 'Travel', 'Cooking'], friendsInCommon: ['Emma', 'Jordan'] },
    Emma: { name: 'Emma', interests: ['Reading', 'Fitness', 'Nature'], friendsInCommon: ['Alex', 'Riley'] },
    Jordan: { name: 'Jordan', interests: ['Gaming', 'Tech', 'Movies'], friendsInCommon: ['Casey', 'Sam'] },
    Casey: { name: 'Casey', interests: ['Music', 'Art', 'Dancing'], friendsInCommon: ['Riley', 'Taylor'] },
    Riley: { name: 'Riley', interests: ['Photography', 'Travel', 'Food'], friendsInCommon: ['Sam', 'Emma'] }
  };

  // Mock data for demo
  const mockProfiles = {
    Taylor: {
      interests: ['Social', 'Tech', 'Gaming'],
      friendsInCommon: ['Jordan', 'Casey'],
      movieCharacters: [
        { name: 'Hermione Granger', description: 'Brilliant, loyal, and always ready to help friends' },
        { name: 'Tony Stark', description: 'Innovative genius with a passion for technology' }
      ],
      hobbies: ['Reading', 'Coding', 'Rock Climbing'],
      question: 'What\'s your favorite way to spend a weekend?',
      diveDeeper: 'I love exploring new technologies and building cool projects!',
      mutualConnections: {
        person1ShouldKnow: ['Alex', 'Sarah'],
        person2ShouldKnow: ['Mike', 'Emma']
      }
    },
    Sam: {
      interests: ['Music', 'Art', 'Vibes'],
      friendsInCommon: ['Alex', 'Riley'],
      movieCharacters: [
        { name: 'Spider-Man', description: 'Quick-witted hero who balances responsibility with fun' },
        { name: 'Elsa', description: 'Independent spirit who creates their own path' }
      ],
      hobbies: ['Photography', 'Hiking', 'Cooking'],
      question: 'What\'s the most adventurous thing you\'ve done?',
      diveDeeper: 'I documented a month-long solo hiking trip across Europe!',
      mutualConnections: {
        person1ShouldKnow: ['Jordan', 'Casey'],
        person2ShouldKnow: ['Riley', 'Alex']
      }
    }
  };

  const currentRequest = requests[currentRequestIndex];
  const currentProfile = mockProfiles[currentRequest?.from as keyof typeof mockProfiles];

  const boxLabels = ['Hobbies', 'Question', 'Dive Deeper'];
  const boxContent = [
    currentProfile?.hobbies?.join(', ') || '',
    currentProfile?.question || '',
    currentProfile?.diveDeeper || ''
  ];

  // Helper to get current step for a request
  const getCurrentStep = (requestIndex: number) => {
    return requestSteps[requestIndex] || 'info';
  };

  // Helper to set step for a specific request
  const setStepForRequest = (requestIndex: number, step: 'info' | 'relationship' | 'results' | 'boxes' | 'connections') => {
    setRequestSteps(prev => ({ ...prev, [requestIndex]: step }));
  };

  useEffect(() => {
    if (!isOpen) {
      setCurrentRequestIndex(0);
      setCurrentBoxIndex(0);
      setApprovedRequests([]);
      setDeniedRequests([]);
      setRevealedBoxes({});
      setRequestSteps({});
    } else if (isReviewingExistingFriend) {
      // For existing friends, skip approval and go straight to results
      setRequestSteps({ 0: 'results' });
    }
  }, [isOpen, isReviewingExistingFriend]);

  const handleApprove = () => {
    setApprovedRequests(prev => [...prev, currentRequest.from]);
    setShowRelationshipSelection(true);
  };

  const handleRelationshipContinue = (relationship: string) => {
    setSelectedRelationship(relationship);
    setShowRelationshipSelection(false);
    setStepForRequest(currentRequestIndex, 'results');
  };

  const handleRelationshipClose = () => {
    setShowRelationshipSelection(false);
    // Remove from approved requests if they close without selecting
    setApprovedRequests(prev => prev.filter(name => name !== currentRequest.from));
  };

  const handleDeny = () => {
    console.log('=== DENY CLICKED FOR:', currentRequest.from, '===');
    const deniedName = currentRequest.from;
    
    setDeniedRequests(prev => {
      const newDenied = [...prev, deniedName];
      console.log('DENY: Updated denied requests:', newDenied);
      
      // Call goToNextRequest with the updated denied list
      setTimeout(() => {
        goToNextRequestWithDenied(newDenied);
      }, 0);
      
      return newDenied;
    });
  };

  const goToNextRequestWithDenied = (updatedDenied: string[]) => {
    console.log('=== GO TO NEXT REQUEST WITH DENIED ===');
    console.log('Current index:', currentRequestIndex, 'Total requests:', requests.length);
    console.log('Current approved:', approvedRequests);
    console.log('Updated denied:', updatedDenied);
    
    if (currentRequestIndex < requests.length - 1) {
      console.log('Moving to next request...');
      setCurrentRequestIndex(prev => prev + 1);
      setCurrentBoxIndex(0);
      setRevealedBoxes(prev => {
        const newState = { ...prev };
        delete newState[currentRequestIndex + 1];
        return newState;
      });
    } else {
      console.log('=== ALL REQUESTS PROCESSED ===');
      const processedRequests = [...approvedRequests, ...updatedDenied];
      console.log('FINAL: Approved requests:', approvedRequests);
      console.log('FINAL: Denied requests:', updatedDenied);
      console.log('FINAL: Combined processed requests:', processedRequests);
      
      showCompletionConfetti();
      onClose();
      
      if (onRequestsProcessed) {
        console.log('CALLING onRequestsProcessed with:', processedRequests);
        onRequestsProcessed(processedRequests);
      }
    }
  };

  const goToNextRequest = () => {
    console.log('=== GO TO NEXT REQUEST ===');
    console.log('Current index:', currentRequestIndex, 'Total requests:', requests.length);
    console.log('Current approved:', approvedRequests);
    console.log('Current denied:', deniedRequests);
    
    if (currentRequestIndex < requests.length - 1) {
      console.log('Moving to next request...');
      setCurrentRequestIndex(prev => prev + 1);
      setCurrentBoxIndex(0);
      // Reset revealed boxes state for the new person - they start fresh
      setRevealedBoxes(prev => {
        const newState = { ...prev };
        delete newState[currentRequestIndex + 1]; // Clear any existing state for next person
        return newState;
      });
    } else {
      console.log('=== ALL REQUESTS PROCESSED ===');
      // All done - pass back processed requests and close
      const processedRequests = [...approvedRequests, ...deniedRequests];
      console.log('FINAL: Approved requests:', approvedRequests);
      console.log('FINAL: Denied requests:', deniedRequests);
      console.log('FINAL: Combined processed requests:', processedRequests);
      
      showCompletionConfetti();
      onClose();
      
      // Call the callback with processed request names
      if (onRequestsProcessed) {
        console.log('CALLING onRequestsProcessed with:', processedRequests);
        onRequestsProcessed(processedRequests);
      }
    }
  };

  const showCompletionConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleStepNavigation = () => {
    const currentStep = getCurrentStep(currentRequestIndex);
    if (currentStep === 'results') {
      setStepForRequest(currentRequestIndex, 'boxes');
      // Initialize revealed boxes for this request (only hobbies revealed by default)
      setRevealedBoxes(prev => ({
        ...prev,
        [currentRequestIndex]: [true, false, false] // hobbies, question, dive deeper
      }));
    } else if (currentStep === 'boxes') {
      setStepForRequest(currentRequestIndex, 'connections');
    } else if (currentStep === 'connections') {
      goToNextRequest();
    }
  };

  const swipeToNextBox = () => {
    if (currentBoxIndex < boxLabels.length - 1) {
      setCurrentBoxIndex(prev => prev + 1);
    }
  };

  const swipeToPrevBox = () => {
    if (currentBoxIndex > 0) {
      setCurrentBoxIndex(prev => prev - 1);
    }
  };

  const handleRevealBox = (boxIndex: number) => {
    setRevealedBoxes(prev => ({
      ...prev,
      [currentRequestIndex]: prev[currentRequestIndex]?.map((revealed, idx) => 
        idx === boxIndex ? true : revealed
      ) || [true, false, false].map((revealed, idx) => 
        idx === boxIndex ? true : revealed
      )
    }));
  };

  const handleFriendClick = (friendName: string) => {
    const friend = mockFriends[friendName as keyof typeof mockFriends];
    if (friend) {
      setFriendPreview({ isOpen: true, friend });
    }
  };

  const closeFriendPreview = () => {
    setFriendPreview({ isOpen: false, friend: null });
  };

  const handleProfileClick = (userName: string) => {
    const user = mockUserProfiles[userName as keyof typeof mockUserProfiles];
    if (user) {
      setProfilePage({ isOpen: true, user });
    }
  };

  const closeProfilePage = () => {
    setProfilePage({ isOpen: false, user: null });
  };

  if (!isOpen || requests.length === 0) return null;

  return (
    <>
      {/* Full screen results view */}
      {getCurrentStep(currentRequestIndex) === 'results' && (
        <div className="fixed inset-0 bg-gray-200 z-50 flex flex-col">
          <div className="window-titlebar flex-shrink-0">
            <span>Review Friend Request</span>
            <button onClick={onClose} className="hover:bg-gray-200 p-1 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
            
          <div 
            className="flex-1 cursor-pointer flex flex-col p-4"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const containerWidth = rect.width;
              
              if (clickX < containerWidth / 3) {
                // Left third - go back (no action for first screen)
              } else if (clickX > (containerWidth * 2) / 3) {
                // Right third - go forward
                handleStepNavigation();
              }
            }}
          >
            {/* Stories Progress Bar */}
            <div className="flex space-x-1 mb-4">
              {['results', 'boxes', 'connections'].map((step, stepIdx) => (
                <div 
                  key={step}
                  className={`h-1 flex-1 rounded-full ${
                    stepIdx === 0 ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <div className="animate-fade-in flex flex-col justify-center flex-1">
              <h3 className="pixel-font text-lg mb-6">This duo is like...</h3>
              
              <div className="space-y-6">
                {currentProfile?.movieCharacters?.map((character, idx) => (
                  <div 
                    key={idx} 
                    className="animate-fade-in"
                    style={{ animationDelay: `${(idx + 1) * 0.3}s` }}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <div className="text-3xl mr-3">🎬</div>
                      <div className="text-left">
                        <div className="pixel-font text-lg font-bold">{idx === 0 ? 'You' : currentRequest.from} - {character.name}</div>
                        <div className="pixel-font text-sm text-gray-600">{character.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full screen boxes view */}
      {getCurrentStep(currentRequestIndex) === 'boxes' && (
        <div className="fixed inset-0 bg-gray-200 z-50 flex flex-col">
          <div className="window-titlebar flex-shrink-0">
            <span>Review Friend Request</span>
            <button onClick={onClose} className="hover:bg-gray-200 p-1 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
            
          <div 
            className="flex-1 cursor-pointer flex flex-col p-4"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const containerWidth = rect.width;
              
              if (clickX < containerWidth / 3) {
                // Left third - go back
                setStepForRequest(currentRequestIndex, 'results');
              } else if (clickX > (containerWidth * 2) / 3) {
                // Right third - go forward
                handleStepNavigation();
              }
            }}
          >
            {/* Stories Progress Bar */}
            <div className="flex space-x-1 mb-4">
              {['results', 'boxes', 'connections'].map((step, stepIdx) => (
                <div 
                  key={step}
                  className={`h-1 flex-1 rounded-full ${
                    stepIdx === 1 ? 'bg-blue-500' : stepIdx === 0 ? 'bg-blue-300' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <div className="animate-fade-in flex flex-col flex-1 space-y-4">
              <h2 className="text-xl font-bold text-center mb-4">Learn More About {currentRequest.from}</h2>
              
              {boxLabels.map((label, index) => {
                const isRevealed = revealedBoxes[currentRequestIndex]?.[index] || (index === 0);
                return (
                  <div key={index} className="window-inset p-4">
                    <div className="window-button-primary text-white font-bold py-2 px-4 mb-3 text-center">
                      {label}
                    </div>
                    <div className="bg-gray-300 border-2 border-gray-400 p-4 min-h-[80px] flex flex-col justify-center">
                      {isRevealed ? (
                        <div className="text-center">
                          {label === 'Hobbies' && boxContent[index] && (
                            <div className="flex flex-wrap justify-center gap-2">
                              {boxContent[index].split(', ').map((hobby, hobbyIdx) => (
                                <span key={hobbyIdx} className="flex items-center gap-1">
                                  <span>{getHobbyEmoji(hobby)}</span>
                                  <span>{hobby}</span>
                                </span>
                              ))}
                            </div>
                          )}
                          {label !== 'Hobbies' && (
                            <p className="text-sm">{boxContent[index]}</p>
                          )}
                        </div>
                      ) : (
                        <div 
                          className="text-center text-gray-600 cursor-pointer flex flex-col items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRevealBox(index);
                          }}
                        >
                          <div className="text-2xl mb-2">👆</div>
                          <div>Tap to reveal</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Full screen connections view */}
      {getCurrentStep(currentRequestIndex) === 'connections' && (
        <div className="fixed inset-0 bg-gray-200 z-50 flex flex-col">
          <div className="window-titlebar flex-shrink-0">
            <span>Review Friend Request</span>
            <button onClick={onClose} className="hover:bg-gray-200 p-1 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
            
          <div 
            className="flex-1 cursor-pointer flex flex-col p-4"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const containerWidth = rect.width;
              
              if (clickX < containerWidth / 3) {
                // Left third - go back
                setStepForRequest(currentRequestIndex, 'boxes');
              } else if (clickX > (containerWidth * 2) / 3) {
                // Right third - go forward
                handleStepNavigation();
              }
            }}
          >
            {/* Stories Progress Bar */}
            <div className="flex space-x-1 mb-4">
              {['results', 'boxes', 'connections'].map((step, stepIdx) => (
                <div 
                  key={step}
                  className={`h-1 flex-1 rounded-full ${
                    stepIdx === 2 ? 'bg-blue-500' : stepIdx < 2 ? 'bg-blue-300' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <div className="animate-fade-in flex flex-col flex-1 space-y-4">
              <h2 className="text-xl font-bold text-center mb-4">Mutual Connections</h2>
              
              {/* You should know section */}
              <div className="window-inset p-4">
                <div className="window-button-primary text-white font-bold py-2 px-4 mb-3 text-center">
                  You should know
                </div>
                <div className="bg-gray-300 border-2 border-gray-400 p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {currentProfile?.mutualConnections?.person1ShouldKnow?.map((name, idx) => (
                      <div 
                        key={idx}
                        className="flex flex-col items-center cursor-pointer p-2 hover:bg-gray-400 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFriendClick(name);
                        }}
                      >
                        <div className="w-16 h-16 bg-yellow-400 border-2 border-black flex items-center justify-center mb-2">
                          <div className="text-blue-600">👤</div>
                        </div>
                        <span className="text-sm font-bold">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Taylor should know section */}
              <div className="window-inset p-4">
                <div className="window-button-primary text-white font-bold py-2 px-4 mb-3 text-center">
                  {currentRequest.from} should know
                </div>
                <div className="bg-gray-300 border-2 border-gray-400 p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {currentProfile?.mutualConnections?.person2ShouldKnow?.map((name, idx) => (
                      <div 
                        key={idx}
                        className="flex flex-col items-center cursor-pointer p-2 hover:bg-gray-400 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFriendClick(name);
                        }}
                      >
                        <div className="w-16 h-16 bg-yellow-400 border-2 border-black flex items-center justify-center mb-2">
                          <div className="text-blue-600">👤</div>
                        </div>
                        <span className="text-sm font-bold">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Go to profile button */}
              <div className="mt-auto">
                <button 
                  className="window-button-primary w-full text-white font-bold py-3 px-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProfileClick(currentRequest.from);
                  }}
                >
                  Go to {currentRequest.from}'s page
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regular carousel view for initial approval step */}
      {getCurrentStep(currentRequestIndex) === 'info' && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative w-full flex items-center justify-center">
            {/* Cards Container */}
            <div className="flex items-center justify-center min-h-[500px]">
              {requests.map((request, index) => {
                const profile = mockProfiles[request.from as keyof typeof mockProfiles];
                const isActive = index === currentRequestIndex;
                const distance = Math.abs(index - currentRequestIndex);
                const position = index - currentRequestIndex; // -1 for left, 0 for center, 1 for right
                
                return (
                  <div
                    key={index}
                    className={`popup-window transition-all duration-300 absolute ${
                      isActive 
                        ? 'scale-100 z-20' 
                        : distance === 1 
                          ? 'scale-75 z-10' 
                          : 'scale-50 z-0'
                    } ${distance > 1 ? 'hidden' : ''}`}
                    style={{
                      width: '320px', // Keep consistent size for all states
                      cursor: !isActive ? 'pointer' : 'default',
                      transform: `translateX(${position * 300}px) scale(${
                        isActive ? 1 : distance === 1 ? 0.75 : 0.5
                      })`,
                      left: '50%',
                      marginLeft: '-160px' // Always center based on 320px width
                    }}
                    onClick={() => !isActive && setCurrentRequestIndex(index)}
                  >
                      <div className="window-titlebar">
                        <span>Review Friend Request</span>
                        {isActive && (
                          <button onClick={onClose} className="hover:bg-gray-200 p-1 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="window-content min-h-96">
                        {!isReviewingExistingFriend && (getCurrentStep(index) === 'info' || index !== currentRequestIndex) ? (
                          <div className="text-center h-full flex flex-col justify-between">
                            <div>
                              <div className="w-20 h-20 bg-yellow-400 border-2 border-black mx-auto mb-4 flex items-center justify-center">
                                <div className="text-2xl">👤</div>
                              </div>
                              <h3 className="pixel-font text-xl mb-4">{request.from}</h3>
                              
                              {/* Interests */}
                              <div className="mb-4">
                                <h4 className="pixel-font text-sm font-bold mb-2">Interests:</h4>
                                 <div className="flex flex-wrap justify-center gap-2">
                                   {profile?.interests?.map((interest, idx) => (
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
                                  {profile?.friendsInCommon?.map((friend, idx) => (
                                    <div key={idx} className="text-center">
                                       <div 
                                         className="w-12 h-12 bg-yellow-400 border-2 border-black mx-auto mb-1 flex items-center justify-center cursor-pointer hover:bg-yellow-300"
                                         onClick={() => handleProfileClick(friend)}
                                       >
                                        <div className="text-lg">👤</div>
                                      </div>
                                       <div 
                                         className="pixel-font text-xs cursor-pointer hover:text-blue-600 hover:underline"
                                         onClick={() => handleProfileClick(friend)}
                                       >
                                         {friend}
                                       </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Show buttons only on active card */}
                            {isActive && (
                              <div className="flex space-x-4 justify-center">
                                <button
                                  onClick={handleDeny}
                                  className="px-6 py-2 bg-red-500 text-white pixel-font border-2 border-outset hover:bg-red-600"
                                >
                                  Deny
                                </button>
                                <button
                                  onClick={handleApprove}
                                  className="px-6 py-2 bg-green-500 text-white pixel-font border-2 border-outset hover:bg-green-600"
                                >
                                  Approve
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          // Results screens for approved requests or existing friends
                          <>
                            {getCurrentStep(index) === 'boxes' && (
                              <div 
                                className="text-center relative h-full min-h-[400px] cursor-pointer flex flex-col"
                                onClick={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  const clickX = e.clientX - rect.left;
                                  const containerWidth = rect.width;
                                  
                                  if (clickX < containerWidth / 3) {
                                    // Left third - go back
                                    setStepForRequest(currentRequestIndex, 'results');
                                  } else if (clickX > (containerWidth * 2) / 3) {
                                    // Right third - go forward
                                    handleStepNavigation();
                                  }
                                }}
                              >
                                {/* Stories Progress Bar */}
                                <div className="flex space-x-1 p-2 mb-4">
                                  {['results', 'boxes', 'connections'].map((step, stepIdx) => (
                                    <div 
                                      key={step}
                                      className={`h-1 flex-1 rounded-full ${
                                        stepIdx === 1 ? 'bg-blue-500' : stepIdx === 0 ? 'bg-blue-300' : 'bg-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>

                                <div className="flex flex-col flex-1">
                                  <h3 className="pixel-font text-lg mb-4">Learn More About {currentRequest.from}</h3>
                                  
                                  {/* All 3 boxes stacked vertically */}
                                  <div className="space-y-3 flex-1">
                                    {boxLabels.map((label, idx) => {
                                      const isRevealed = revealedBoxes[currentRequestIndex]?.[idx] ?? (idx === 0); // Hobbies always revealed
                                      const needsReveal = idx === 1 || idx === 2; // Question and Dive Deeper need reveal
                                      
                                      return (
                                        <div key={idx} className="popup-window relative">
                                          <div className="window-titlebar">
                                            <span>{label}</span>
                                          </div>
                                          <div className="window-content relative">
                                            <p className="pixel-font text-sm">{boxContent[idx]}</p>
                                            
                                            {/* Overlay for unrevealed boxes */}
                                            {needsReveal && !isRevealed && (
                                              <div 
                                                className="absolute inset-0 bg-gray-400 flex items-center justify-center cursor-pointer hover:bg-gray-500 transition-colors"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleRevealBox(idx);
                                                }}
                                              >
                                                <div className="text-center">
                                                  <div className="text-2xl mb-2">👆</div>
                                                  <div className="pixel-font text-sm text-white font-bold">Tap to reveal</div>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            )}

                            {getCurrentStep(index) === 'connections' && (
                              <div 
                                className="text-center relative h-full min-h-[400px] cursor-pointer flex flex-col"
                                onClick={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  const clickX = e.clientX - rect.left;
                                  const containerWidth = rect.width;
                                  
                                  if (clickX < containerWidth / 3) {
                                    // Left third - go back
                                    setStepForRequest(currentRequestIndex, 'boxes');
                                  } else if (clickX > (containerWidth * 2) / 3) {
                                    // Right third - go forward
                                    handleStepNavigation();
                                  }
                                }}
                              >
                                {/* Stories Progress Bar */}
                                <div className="flex space-x-1 p-2 mb-4">
                                  {['results', 'boxes', 'connections'].map((step, stepIdx) => (
                                    <div 
                                      key={step}
                                      className={`h-1 flex-1 rounded-full ${
                                        stepIdx === 2 ? 'bg-blue-500' : stepIdx < 2 ? 'bg-blue-300' : 'bg-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>

                                <div className="flex flex-col flex-1">
                                  <h3 className="pixel-font text-lg mb-4">Mutual Connections</h3>
                                  
                                  <div className="space-y-4 flex-1">
                                    <div className="popup-window">
                                      <div className="window-titlebar">
                                        <span>You should know</span>
                                      </div>
                                      <div className="window-content">
                                        <div className="flex justify-center space-x-6">
                                          {currentProfile?.mutualConnections?.person1ShouldKnow?.map((person, idx) => (
                                            <div key={idx} className="text-center">
                                               <div 
                                                 className="w-16 h-16 bg-yellow-400 border-2 border-black mx-auto mb-2 flex items-center justify-center cursor-pointer hover:bg-yellow-300"
                                                 onClick={() => handleFriendClick(person)}
                                               >
                                                <div className="text-xl">👤</div>
                                              </div>
                                               <div 
                                                 className="pixel-font text-sm cursor-pointer hover:text-blue-600 hover:underline"
                                                 onClick={() => handleFriendClick(person)}
                                               >
                                                 {person}
                                               </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="popup-window">
                                      <div className="window-titlebar">
                                        <span>{currentRequest.from} should know</span>
                                      </div>
                                      <div className="window-content">
                                        <div className="flex justify-center space-x-6">
                                          {currentProfile?.mutualConnections?.person2ShouldKnow?.map((person, idx) => (
                                            <div key={idx} className="text-center">
                                               <div 
                                                 className="w-16 h-16 bg-yellow-400 border-2 border-black mx-auto mb-2 flex items-center justify-center cursor-pointer hover:bg-yellow-300"
                                                 onClick={() => handleFriendClick(person)}
                                               >
                                                <div className="text-xl">👤</div>
                                              </div>
                                               <div 
                                                 className="pixel-font text-sm cursor-pointer hover:text-blue-600 hover:underline"
                                                 onClick={() => handleFriendClick(person)}
                                               >
                                                 {person}
                                               </div>
                                            </div>
                                          ))}
                                        </div>
                                       </div>
                                     </div>
                                      
                                      {/* Go to Person's Page Button - only show for new friend requests */}
                                      {!isReviewingExistingFriend && (
                                        <div className="mt-6">
                                          <button 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleProfileClick(currentRequest.from);
                                            }}
                                            className="w-full px-6 py-3 bg-blue-500 text-white pixel-font border-2 border-outset hover:bg-blue-600"
                                          >
                                            Go to {currentRequest.from}'s page
                                          </button>
                                        </div>
                                      )}
                                   </div>
                                  </div>
                                </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
              })}
            </div>

            {/* Progress indicator */}
            <div className="mt-8 text-center pixel-font text-sm text-white">
              Request {currentRequestIndex + 1} of {requests.length}
            </div>
          </div>

          {/* Friend Preview Modal */}
          {friendPreview.friend && (
            <FriendPreview
              isOpen={friendPreview.isOpen}
              onClose={closeFriendPreview}
              friend={friendPreview.friend}
              onFriendClick={handleFriendClick}
              onProfileClick={handleProfileClick}
            />
          )}

          {/* User Profile Page Modal */}
          {profilePage.user && (
            <UserProfilePage
              isOpen={profilePage.isOpen}
              onClose={closeProfilePage}
              user={profilePage.user}
            />
          )}

          {/* Relationship Selection Modal */}
          <RelationshipSelection
            isOpen={showRelationshipSelection}
            onClose={handleRelationshipClose}
            onContinue={handleRelationshipContinue}
            friendName={currentRequest?.from || ''}
          />
        </div>
      )}
    </>
  );
};