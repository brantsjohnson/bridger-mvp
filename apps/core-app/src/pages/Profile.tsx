import { User, Camera, Edit, Save, X, Eye, EyeOff } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCategorizedHobbies, getHobbyEmoji, getAllHobbies } from "@/lib/hobbyMappings";
import { useState } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const friendId = searchParams.get('friend');
  
  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [editedAboutMe, setEditedAboutMe] = useState({});
  const [editedFavorites, setEditedFavorites] = useState({});
  const [editedHobbies, setEditedHobbies] = useState<string[]>([]);
  
  // Privacy state - tracks which fields are private (true = private/hidden)
  const [privacySettings, setPrivacySettings] = useState<{ [key: string]: boolean }>({});
  const [showExitModal, setShowExitModal] = useState(false);

  // Friend data
  const friendsData = {
    1: { name: "Alex", categories: ["Social", "Tech", "Gaming"] },
    2: { name: "Jordan", categories: ["Music", "Art", "Vibes"] },
    3: { name: "Casey", categories: ["Fitness", "Nature", "Chill"] },
    4: { name: "Riley", categories: ["Books", "Coffee", "Deep"] },
    5: { name: "Sam", categories: ["Travel", "Food", "Adventure"] },
    6: { name: "Taylor", categories: ["Movies", "Gaming", "Fun"] },
  };

  const currentProfile = friendId ? friendsData[parseInt(friendId)] : null;
  const isViewingFriend = !!friendId && currentProfile;

  const aboutMeData = isViewingFriend ? [
    { label: "Interests", value: currentProfile.categories.join(", ") },
    { label: "Status", value: "Friend" },
    { label: "Connection", value: "Mutual friend" },
  ] : [
    { label: "Places Lived", value: "Washington D.C." },
    { label: "Birthday", value: "October 12, 1998" },
    { label: "Sexuality", value: "Straight" },
    { label: "Pronouns", value: "He/Him" },
    { label: "Political Party", value: "Not political" },
    { label: "Nickname", value: "Brantaclaus, Branty" },
    { label: "Family", value: "Mom - Tara Goodrich\nStepdad - Greg Goodrich\nSisters - Jade & Jessica" },
    { label: "High school", value: "Uintah" },
    { label: "College", value: "UVU" },
    { label: "Degree", value: "Strategy" },
    { label: "Zodiac Sign", value: "Libra" },
    { label: "Job Title", value: "Manager at Taco Bell" },
  ];

  const favoritesData = isViewingFriend ? [
    { label: "Favorite Activity", value: currentProfile.categories[0] },
    { label: "Connection Since", value: "2024" },
    { label: "Mutual Friends", value: "5" },
  ] : [
    { label: "Snack", value: "Albanese gummy bears" },
    { label: "Candy Bar", value: "Reeses" },
    { label: "Movie", value: "Tick Tick Boom" },
    { label: "Color", value: "Charcoal" },
    { label: "Book", value: "Becoming Better Grownups" },
    { label: "Music Artist", value: "Taylor Swift" },
    { label: "Band", value: "Valley" },
    { label: "Food", value: "Thai" },
    { label: "TV Show", value: "Parks and Rec" },
    { label: "Sports Team", value: "Chiefs" },
    { label: "Animal", value: "Red Panda" },
    { label: "Restaurant", value: "Cafe Rio" },
    { label: "Video Game", value: "Libra" },
    { label: "Smell", value: "Lavender" },
    { label: "Season", value: "Winter" },
    { label: "Sport", value: "Badminton" },
    { label: "Holiday", value: "New Years Eve" },
    { label: "Number", value: "11" },
    { label: "Drink", value: "Dr. Pepper" },
    { label: "Podcast", value: "NPR Politics" },
    { label: "Album", value: "Reputation" },
    { label: "Dessert", value: "Brownies" },
    { label: "Board Game", value: "Secret Hitler" },
    { label: "Vacation", value: "London" },
  ];

  const hobbies = isViewingFriend ? currentProfile.categories : ["Photography", "Cooking", "Reading", "Hiking", "Gaming"];
  
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
    } else {
      navigate('/');
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
          {isViewingFriend ? currentProfile.name : "Brant Johnson"}
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
            {/* Camera icon for editing - only show for own profile */}
            {!isViewingFriend && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gray-300 border border-gray-600 rounded-full flex items-center justify-center hover:bg-gray-400 cursor-pointer">
                <Camera className="w-4 h-4 text-black" />
              </div>
            )}
          </div>

          {/* About Me Section */}
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

          {/* List of Favorites Section */}
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

          {/* Hobbies Section */}
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