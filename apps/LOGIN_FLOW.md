# Login Flow Implementation

## Overview
When a user logs in through the auth app, they are automatically redirected to their personalized core app homepage with their user data.

## Flow Steps

### 1. User Login
- User enters email/password in auth app
- Supabase authentication verifies credentials
- On successful login, user data is captured

### 2. Navigation to Core App
- Auth app sends `NAVIGATE_TO_CORE_WITH_USER` message to parent
- User data is stored in localStorage
- Wrapper app switches to core app iframe

### 3. Personalized Core App
- Core app loads user data from localStorage
- Displays personalized welcome message
- Shows user's friends and data (when implemented)

## Technical Implementation

### Auth App (LoginScreen.tsx)
```javascript
// After successful login
window.parent.postMessage({ 
  type: 'NAVIGATE_TO_CORE_WITH_USER',
  userData: {
    id: user?.id,
    email: user?.email,
    name: user?.user_metadata?.full_name || user?.email
  }
}, '*');
```

### Wrapper App (App.tsx)
```javascript
// Handles navigation message
if (event.data.type === 'NAVIGATE_TO_CORE_WITH_USER') {
  setActiveApp('core');
  localStorage.setItem('bridger_user_data', JSON.stringify(event.data.userData));
}
```

### Core App (Index.tsx)
```javascript
// Loads user data on mount
useEffect(() => {
  const storedUserData = localStorage.getItem('bridger_user_data');
  if (storedUserData) {
    const user = JSON.parse(storedUserData);
    setUserData(user);
  }
}, []);
```

## User Experience

### New Users (Signup)
1. Complete signup process
2. See terminal screen with Bridger mission
3. Click "LET'S_FIX_SOCIETY" → Core App

### Existing Users (Login)
1. Enter credentials
2. Authentication verified
3. **Direct navigation** → Personalized Core App
4. See welcome message with their name

## Demo Mode
- If no user data is found, shows demo mode
- All existing functionality works as before
- Friend requests, desktop icons, etc. remain functional

## Next Steps
- Implement user-specific friend data loading
- Add user preferences and settings
- Connect to Supabase for real user data persistence 