import { User, Edit, Save, X, Eye, EyeOff } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCategorizedHobbies, getHobbyEmoji, getAllHobbies } from "@/lib/hobbyMappings";
import { useState, useEffect } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const friendId = searchParams.get('friend');
  
  // User data state
  const [userData, setUserData] = useState<any>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  
  // Load friend data when viewing friend profiles
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  
  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [editedAboutMe, setEditedAboutMe] = useState({});
  const [editedFavorites, setEditedFavorites] = useState({});
  const [editedHobbies, setEditedHobbies] = useState<string[]>([]);
  
  // Privacy state - tracks which fields are private (true = private/hidden)
  const [privacySettings, setPrivacySettings] = useState<{ [key: string]: boolean }>({});
  const [showExitModal, setShowExitModal] = useState(false);

  // Load user data
  useEffect(() => {
    const storedUserData = localStorage.getItem('bridger_user_data');
    console.log('Profile: Checking for user data:', storedUserData);
    
    if (storedUserData) {
      const user = JSON.parse(storedUserData);
      setUserData(user);
      console.log('Profile: User data loaded:', user);
      
      if (friendId && currentProfile) {
        // Viewing a friend's profile - use friend data
        console.log('Profile: Viewing friend profile');
        setAboutMeData(getFriendAboutMeData());
        setFavoritesData(getFriendFavoritesData());
        setHobbies(getFriendHobbies());
        setIsNewUser(false);
      } else if (!friendId) {
        // Viewing own profile
        console.log('Profile: Viewing own profile');
        const userProfile = localStorage.getItem(`bridger_profile_${user.id}`);
        console.log('Profile: User profile data:', userProfile);
        
        if (userProfile) {
          setIsNewUser(false);
          // Load quiz data for profile
          try {
            const profileData = JSON.parse(userProfile);
            // Set the profile data from quiz results
            setAboutMeData(profileData.aboutMe || []);
            setFavoritesData(profileData.favorites || []);
            setHobbies(profileData.hobbies || []);
            setPrivacySettings(profileData.privacySettings || {});
            console.log('Profile: Quiz data loaded successfully');
          } catch (error) {
            console.error('Error loading profile data:', error);
            setIsNewUser(true);
          }
        } else {
          console.log('Profile: No quiz data found - showing null state');
          setIsNewUser(true);
        }
      }
    } else {
      console.log('Profile: No user data found - showing null state');
      setIsNewUser(true);
    }
    
    // Debug logging
    console.log('Profile state:', {
      isNewUser,
      friendId,
      hasUserData: !!storedUserData,
      hasProfileData: !!localStorage.getItem(`bridger_profile_${userData?.id}`)
    });
  }, [friendId, currentProfile]);

  useEffect(() => {
    if (friendId) {
      // Load friend data from localStorage
      const storedUserData = localStorage.getItem('bridger_user_data');
      if (storedUserData) {
        const user = JSON.parse(storedUserData);
        const userFriends = localStorage.getItem(`bridger_friends_${user.id}`);
        
        if (userFriends) {
          const friends = JSON.parse(userFriends);
          const friend = friends.find((f: any) => f.id === parseInt(friendId));
          setCurrentProfile(friend);
        }
      }
    }
  }, [friendId]);
  
  const isViewingFriend = !!friendId && currentProfile;

  // State for profile data
  const [aboutMeData, setAboutMeData] = useState<any[]>([]);
  const [favoritesData, setFavoritesData] = useState<any[]>([]);
  const [hobbies, setHobbies] = useState<string[]>([]);

  // Default data for friends (when viewing friend profiles)
  const getFriendAboutMeData = () => {
    if (!currentProfile) return [];
    
    // Use friend's profile data if available
    if (currentProfile.profileData?.aboutMe) {
      return currentProfile.profileData.aboutMe;
    }
    
    // Fallback to basic info
    return [
      { label: "Interests", value: currentProfile.categories?.join(", ") || "No interests listed" },
      { label: "Status", value: "Friend" },
      { label: "Connection", value: "Connected via Bridger" },
    ];
  };

  const getFriendFavoritesData = () => {
    if (!currentProfile) return [];
    
    // Use friend's profile data if available
    if (currentProfile.profileData?.favorites) {
      return currentProfile.profileData.favorites;
    }
    
    // Fallback to basic info
    return [
      { label: "Favorite Activity", value: currentProfile.categories?.[0] || "Not specified" },
      { label: "Connection Since", value: "Recently" },
      { label: "Shared Interests", value: currentProfile.categories?.length || 0 },
    ];
  };

  const getFriendHobbies = () => {
    if (!currentProfile) return [];
    
    // Use friend's profile data if available
    if (currentProfile.profileData?.hobbies) {
      return currentProfile.profileData.hobbies;
    }
    
    // Fallback to categories
    return currentProfile.categories || [];
  };
  
  // Get categorized hobbies for profile page display
  const categorizedHobbies = !isViewingFriend ? getCategorizedHobbies(hobbies) : null;
  const allHobbies = getAllHobbies();

  // Initialize edit states
  const initializeEditState = () => {
    const aboutMeState: { [key: string]: string } = {};
    aboutMeData.forEach(item => {
      aboutMeState[item.label] = item.value;
    });
    setEditedAboutMe(aboutMeState);

    const favoritesState: { [key: string]: string } = {};
    favoritesData.forEach(item => {
      favoritesState[item.label] = item.value;
    });
    setEditedFavorites(favoritesState);

    setEditedHobbies([...hobbies]);
  };

  const handleEdit = () => {
    initializeEditState();
    setIsEditing(true);
  };

  const handleSave = () => {
    // Here you would save the changes to your data store
    setIsEditing(false);
  };

  const handleDiscard = () => {
    setIsEditing(false);
    setShowDiscardModal(false);
  };

  const handleBack = () => {
    if (isEditing) {
      setShowDiscardModal(true);
      return;
    }
    
    if (isViewingFriend) {
      navigate('/homies');
      // Update parent window URL
      window.parent.postMessage({ type: 'UPDATE_URL', url: '/core/homies' }, '*');
    } else {
      navigate('/');
      // Update parent window URL
      window.parent.postMessage({ type: 'UPDATE_URL', url: '/core' }, '*');
    }
  };

  const toggleHobby = (hobby: string) => {
    if (editedHobbies.includes(hobby)) {
      setEditedHobbies(editedHobbies.filter(h => h !== hobby));
    } else {
      setEditedHobbies([...editedHobbies, hobby]);
    }
  };

  const togglePrivacy = (fieldKey: string) => {
    setPrivacySettings(prev => ({
      ...prev,
      [fieldKey]: !prev[fieldKey]
    }));
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        backgroundImage: 'url(/lovable-uploads/d2f984d2-96cd-45ce-9cb0-c1ea8d953964.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Windows-style title bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 flex justify-between items-center border-b-2 border-gray-800">
        <div className="font-bold text-sm pixel-font text-white drop-shadow-lg">
          {isViewingFriend ? currentProfile?.name : (userData?.name || userData?.email || "Profile")}
        </div>
        <button 
          onClick={() => {
            if (isEditing) {
              setShowExitModal(true);
            } else {
              handleBack();
            }
          }}
          className="w-6 h-6 bg-gray-300 hover:bg-gray-400 text-black border-2 border-gray-600 flex items-center justify-center pixel-font font-bold text-xs"
          style={{ border: '2px outset #e0e0e0' }}
        >
          ×
        </button>
      </div>

      {/* Sticky action buttons when editing */}
      {isEditing && (
        <div className="sticky top-0 z-10 bg-gray-100 border-b-2 border-gray-600 px-6 py-3">
          <div className="max-w-2xl mx-auto flex gap-4">
            <button 
              onClick={() => setShowDiscardModal(true)}
              className="friend-widget flex-1 px-4 py-2 pixel-font text-center bg-red-500 hover:bg-red-600 text-white"
            >
              Discard Changes
            </button>
            <button 
              onClick={handleSave}
              className="friend-widget flex-1 px-4 py-2 pixel-font text-center flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto p-6">

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Picture */}
          <div className="relative w-28 h-28 bg-yellow-400 border-2 border-gray-600 flex items-center justify-center mx-auto">
            <User className="w-12 h-12 text-black" />

          </div>

          {/* New User Null State */}
          {isNewUser && !isViewingFriend && (
            <div className="popup-window">
              <div className="window-content text-center p-6">
                <div className="text-2xl mb-4">📝</div>
                <h3 className="pixel-font font-bold text-lg mb-2">Take the quiz</h3>
                <p className="pixel-font text-sm mb-4 text-gray-600">
                  Complete your personality quiz to discover your interests and build your profile!
                </p>

              </div>
            </div>
          )}

          {/* About Me Section - Only show if user has taken quiz or viewing friend */}
          {(!isNewUser || isViewingFriend) && (
            <div className="popup-window">
              <div className="window-titlebar">
                <span>About Me</span>
                {!isViewingFriend && !isEditing && (
                  <button onClick={handleEdit} className="ml-auto">
                    <Edit className="w-4 h-4 text-white hover:text-gray-300" />
                  </button>
                )}
              </div>
              <div className="window-content">
                <div className="space-y-3">
                  {aboutMeData.map((item, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {isEditing && (
                          <button
                            onClick={() => togglePrivacy(`aboutMe_${item.label}`)}
                            className="w-4 h-4 transition-colors"
                          >
                            {privacySettings[`aboutMe_${item.label}`] ? (
                              <EyeOff className="w-4 h-4 text-red-500 hover:text-red-600" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-600 hover:text-gray-800" />
                            )}
                          </button>
                        )}
                        <span className="pixel-font text-sm font-bold min-w-[100px]">{item.label}:</span>
                      </div>
                      {isEditing ? (
                        <textarea
                          value={editedAboutMe[item.label] || item.value}
                          onChange={(e) => setEditedAboutMe({...editedAboutMe, [item.label]: e.target.value})}
                          className="pixel-font text-sm text-right max-w-[60%] bg-white border border-gray-600 p-1 resize-none"
                          rows={item.value.includes('\n') ? item.value.split('\n').length : 1}
                        />
                      ) : (
                        <span className="pixel-font text-sm text-right max-w-[60%]">
                          {item.value.split('\n').map((line, i) => (
                            <div key={i}>{line}</div>
                          ))}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* List of Favorites Section - Only show if user has taken quiz or viewing friend */}
          {(!isNewUser || isViewingFriend) && (
            <div className="popup-window">
              <div className="window-titlebar">
                <span>{isViewingFriend ? "Friend Info" : "List of Favorites"}</span>
                {!isViewingFriend && !isEditing && (
                  <button onClick={handleEdit} className="ml-auto">
                    <Edit className="w-4 h-4 text-white hover:text-gray-300" />
                  </button>
                )}
              </div>
              <div className="window-content">
                <div className="space-y-3">
                  {favoritesData.map((item, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {isEditing && (
                          <button
                            onClick={() => togglePrivacy(`favorites_${item.label}`)}
                            className="w-4 h-4 transition-colors"
                          >
                            {privacySettings[`favorites_${item.label}`] ? (
                              <EyeOff className="w-4 h-4 text-red-500 hover:text-red-600" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-600 hover:text-gray-800" />
                            )}
                          </button>
                        )}
                        <span className="pixel-font text-sm font-bold min-w-[100px]">{item.label}:</span>
                      </div>
                      {isEditing ? (
                        <input
                          value={editedFavorites[item.label] || item.value}
                          onChange={(e) => setEditedFavorites({...editedFavorites, [item.label]: e.target.value})}
                          className="pixel-font text-sm text-right bg-white border border-gray-600 p-1 max-w-[60%]"
                        />
                      ) : (
                        <span className="pixel-font text-sm text-right">{item.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Hobbies Section - Only show if user has taken quiz or viewing friend */}
          {(!isNewUser || isViewingFriend) && (
            <div className="popup-window">
              <div className="window-titlebar">
                <span>{isViewingFriend ? "Interests" : "Cute Lil Hobbies 🤗"}</span>
                {!isViewingFriend && !isEditing && (
                  <button onClick={handleEdit} className="ml-auto">
                    <Edit className="w-4 h-4 text-white hover:text-gray-300" />
                  </button>
                )}
              </div>
            <div className="window-content">
              {isViewingFriend ? (
                <div className="flex flex-wrap gap-2">
                  {hobbies.map((hobby, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 pixel-font text-sm bg-white border-2 border-gray-600"
                      style={{ border: '2px outset #e0e0e0' }}
                    >
                      {getHobbyEmoji(hobby)} {hobby}
                    </span>
                  ))}
                </div>
              ) : isEditing ? (
                <div className="space-y-4">
                  {Object.entries(allHobbies).map(([categoryName, category]) => (
                    <div key={categoryName} className="space-y-2">
                      <h4 className="pixel-font text-sm font-bold flex items-center gap-2">
                        <span>{category.emoji}</span>
                        <span>{categoryName}</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {category.hobbies.map((hobby, index) => (
                          <button
                            key={index}
                            onClick={() => toggleHobby(hobby)}
                            className={`px-3 py-1 pixel-font text-sm border-2 transition-colors ${
                              editedHobbies.includes(hobby)
                                ? 'bg-blue-400 border-blue-600 text-white'
                                : 'bg-white border-gray-600 text-black hover:bg-gray-100'
                            }`}
                            style={{ border: editedHobbies.includes(hobby) ? '2px inset #4f46e5' : '2px outset #e0e0e0' }}
                          >
                            {getHobbyEmoji(hobby)} {hobby}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {categorizedHobbies && Object.entries(categorizedHobbies).map(([categoryName, category]) => (
                    <div key={categoryName} className="space-y-2">
                      <h4 className="pixel-font text-sm font-bold flex items-center gap-2">
                        <span>{category.emoji}</span>
                        <span>{categoryName}</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {category.hobbies.map((hobby, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 pixel-font text-sm bg-white border-2 border-gray-600"
                            style={{ border: '2px outset #e0e0e0' }}
                          >
                            {hobby.emoji} {hobby.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          )}

        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="popup-window max-w-md">
            <div className="window-titlebar">
              <span>Unsaved Changes</span>
            </div>
            <div className="window-content">
              <p className="pixel-font text-sm mb-4">
                You have unsaved changes. What would you like to do?
              </p>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => {
                    handleDiscard();
                    setShowExitModal(false);
                  }}
                  className="friend-widget px-4 py-2 pixel-font text-center bg-red-500 hover:bg-red-600 text-white"
                >
                  Discard Changes
                </button>
                <button 
                  onClick={() => {
                    handleSave();
                    setShowExitModal(false);
                  }}
                  className="friend-widget px-4 py-2 pixel-font text-center bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button 
                  onClick={() => setShowExitModal(false)}
                  className="friend-widget px-4 py-2 pixel-font text-center"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discard Changes Modal */}
      {showDiscardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="popup-window max-w-md">
            <div className="window-titlebar">
              <span>Discard Changes?</span>
            </div>
            <div className="window-content">
              <p className="pixel-font text-sm mb-4">
                You have unsaved changes. Are you sure you want to discard them?
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={handleDiscard}
                  className="friend-widget flex-1 px-4 py-2 pixel-font text-center bg-red-500 hover:bg-red-600 text-white"
                >
                  Discard
                </button>
                <button 
                  onClick={() => setShowDiscardModal(false)}
                  className="friend-widget flex-1 px-4 py-2 pixel-font text-center"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;