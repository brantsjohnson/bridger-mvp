# Personalized User System

## Overview
Each user now has their own unique Core App experience with personalized data and null states for new users.

## User-Specific Data Storage

### Data Structure
- **User Data**: `bridger_user_data` - Basic user info (id, email, name)
- **Friends**: `bridger_friends_{userId}` - User's friend list
- **Friend Requests**: `bridger_requests_{userId}` - Pending friend requests
- **Profile**: `bridger_profile_{userId}` - User's profile data

### New User Detection
- Users are considered "new" if they have no friends and no profile data
- New users see null states instead of demo data

## Null States for New Users

### Homepage (Index)
- **No Friend Requests**: No alert windows
- **No Suggestions**: Shows "Take Personality Quiz" button
- **Empty Friends List**: Prompts to take quiz and add friends

### Profile Page
- **Empty Profile**: Shows "Complete Your Profile" with quiz button
- **No Personal Data**: Prompts to take personality quiz

### Friends Page (Homies)
- **No Friends**: Shows "Take Quiz" and "Add Friends" buttons
- **No Requests**: No friend request notifications

## User Experience Flow

### New User Journey
1. **Login** → Personalized Core App
2. **See Null States** → "Take Quiz" prompts everywhere
3. **Take Quiz** → Builds profile and personality data
4. **Add Friends** → Creates personalized friend list
5. **Full Experience** → Now has friends, suggestions, etc.

### Existing User Journey
1. **Login** → Sees their existing friends and data
2. **Personalized Experience** → All data is user-specific
3. **Add More Friends** → Data persists for their account

## Technical Implementation

### Data Loading
```javascript
// Load user-specific data
const userFriends = localStorage.getItem(`bridger_friends_${user.id}`);
const userRequests = localStorage.getItem(`bridger_requests_${user.id}`);
const userProfile = localStorage.getItem(`bridger_profile_${user.id}`);
```

### New User Detection
```javascript
const isNewUser = !userFriends && !userProfile;
```

### Null State Display
```javascript
{isNewUser ? (
  <NullStateComponent />
) : (
  <UserDataComponent />
)}
```

## Demo Mode
- Users without login data see demo mode with mock data
- Demo data is not personalized
- Perfect for testing and demonstration

## Next Steps
- Connect to Supabase for persistent data storage
- Add quiz results to user profile
- Implement friend matching based on quiz results
- Add user preferences and settings 