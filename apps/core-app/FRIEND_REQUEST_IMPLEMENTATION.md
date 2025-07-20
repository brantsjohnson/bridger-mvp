# Friend Request System Implementation Guide

## Overview
This document outlines the complete implementation of the friend request system with real-time notifications, pending states, and approval workflows.

## Database Schema (Supabase)

### 1. Friend Requests Table
```sql
CREATE TABLE friend_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(sender_id, receiver_id)
);
```

### 2. User Profiles Table (if not exists)
```sql
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  interests TEXT[],
  movie_characters JSONB,
  hobbies TEXT[],
  question TEXT,
  dive_deeper TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Friendships Table
```sql
CREATE TABLE friendships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id),
  CHECK (user1_id < user2_id) -- Ensure consistent ordering
);
```

### 4. Row Level Security (RLS) Policies
```sql
-- Friend Requests Policies
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sent/received requests" ON friend_requests
  FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can create friend requests" ON friend_requests
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update received requests" ON friend_requests
  FOR UPDATE USING (receiver_id = auth.uid());

-- Friendships Policies
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their friendships" ON friendships
  FOR SELECT USING (user1_id = auth.uid() OR user2_id = auth.uid());

CREATE POLICY "System can create friendships" ON friendships
  FOR INSERT WITH CHECK (true); -- Handled by function
```

## Backend Functions (Supabase Edge Functions)

### 1. Send Friend Request Function
```sql
CREATE OR REPLACE FUNCTION send_friend_request(receiver_username TEXT)
RETURNS JSON AS $$
DECLARE
  receiver_user_id UUID;
  existing_request RECORD;
  result JSON;
BEGIN
  -- Get receiver user ID
  SELECT id INTO receiver_user_id 
  FROM user_profiles 
  WHERE username = receiver_username;
  
  IF receiver_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'User not found');
  END IF;
  
  -- Check for existing request
  SELECT * INTO existing_request 
  FROM friend_requests 
  WHERE (sender_id = auth.uid() AND receiver_id = receiver_user_id)
     OR (sender_id = receiver_user_id AND receiver_id = auth.uid());
  
  IF existing_request.id IS NOT NULL THEN
    RETURN json_build_object('success', false, 'error', 'Request already exists');
  END IF;
  
  -- Insert friend request
  INSERT INTO friend_requests (sender_id, receiver_id)
  VALUES (auth.uid(), receiver_user_id);
  
  RETURN json_build_object('success', true, 'message', 'Friend request sent');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2. Approve Friend Request Function
```sql
CREATE OR REPLACE FUNCTION approve_friend_request(request_id UUID)
RETURNS JSON AS $$
DECLARE
  friend_request RECORD;
BEGIN
  -- Get and validate request
  SELECT * INTO friend_request 
  FROM friend_requests 
  WHERE id = request_id AND receiver_id = auth.uid() AND status = 'pending';
  
  IF friend_request.id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Request not found');
  END IF;
  
  -- Update request status
  UPDATE friend_requests 
  SET status = 'approved', approved_at = NOW()
  WHERE id = request_id;
  
  -- Create friendship (ensure consistent ordering)
  INSERT INTO friendships (user1_id, user2_id)
  VALUES (
    LEAST(friend_request.sender_id, friend_request.receiver_id),
    GREATEST(friend_request.sender_id, friend_request.receiver_id)
  );
  
  RETURN json_build_object('success', true, 'message', 'Friend request approved');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Frontend Implementation

### 1. State Management Updates

#### Context/Store for Friend Requests
```typescript
// contexts/FriendRequestContext.tsx
interface FriendRequestState {
  pendingRequests: FriendRequest[];
  incomingRequests: FriendRequest[];
  newFriends: Friend[];
  unreadCount: number;
}

const FriendRequestContext = createContext<{
  state: FriendRequestState;
  sendFriendRequest: (username: string) => Promise<void>;
  approveFriendRequest: (requestId: string) => Promise<void>;
  markFriendsAsViewed: () => void;
}>({} as any);
```

### 2. Real-time Subscriptions

#### Setup Realtime Listeners
```typescript
// hooks/useFriendRequestSubscriptions.ts
export const useFriendRequestSubscriptions = () => {
  const { user } = useAuth();
  const { updateFriendRequests, addNewFriend } = useFriendRequestContext();
  
  useEffect(() => {
    if (!user) return;
    
    // Listen for incoming friend requests
    const requestSubscription = supabase
      .channel('friend_requests')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'friend_requests',
        filter: `receiver_id=eq.${user.id}`
      }, (payload) => {
        updateFriendRequests(payload.new as FriendRequest);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'friend_requests',
        filter: `sender_id=eq.${user.id}`
      }, (payload) => {
        if (payload.new.status === 'approved') {
          addNewFriend(payload.new);
        }
      })
      .subscribe();
    
    return () => {
      requestSubscription.unsubscribe();
    };
  }, [user]);
};
```

### 3. Component Updates

#### Friend Request Alert Component
```typescript
// components/FriendRequestAlert.tsx
export const FriendRequestAlert = () => {
  const { incomingRequests } = useFriendRequestContext();
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="relative"
      >
        <Bell className="w-6 h-6" />
        {incomingRequests.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center animate-pulse">
            {incomingRequests.length}
          </span>
        )}
      </button>
      
      {isOpen && (
        <FriendRequestCarousel 
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          requests={incomingRequests}
        />
      )}
    </>
  );
};
```

#### Updated Friends Page with New Friends Section
```typescript
// pages/Friends.tsx - Add to top of friends list
const NewFriendsSection = () => {
  const { newFriends, markFriendsAsViewed } = useFriendRequestContext();
  
  if (newFriends.length === 0) return null;
  
  return (
    <div className="mb-6">
      <h3 className="pixel-font text-lg mb-4">New Friends!</h3>
      <div className="grid grid-cols-3 gap-4">
        {newFriends.map((friend) => (
          <div 
            key={friend.id}
            className="text-center cursor-pointer animate-pulse"
            onClick={() => {
              // Open friend approval flow
              openFriendApprovalFlow(friend);
              markFriendsAsViewed();
            }}
          >
            <div className="w-16 h-16 bg-yellow-400 border-2 border-black mx-auto mb-2 relative">
              <div className="absolute inset-0 bg-yellow-300 animate-pulse rounded"></div>
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className="text-xl">👤</div>
              </div>
            </div>
            <div className="pixel-font text-sm">{friend.display_name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

#### Pending Requests Section
```typescript
// components/PendingRequestsSection.tsx
export const PendingRequestsSection = () => {
  const { pendingRequests } = useFriendRequestContext();
  
  if (pendingRequests.length === 0) return null;
  
  return (
    <div className="popup-window mb-6">
      <div className="window-titlebar">
        <span>Pending Friend Requests</span>
      </div>
      <div className="window-content">
        <div className="space-y-2">
          {pendingRequests.map((request) => (
            <div key={request.id} className="flex items-center justify-between p-2 bg-gray-100">
              <span className="pixel-font text-sm">Sent to {request.receiver_username}</span>
              <span className="pixel-font text-xs text-gray-500">
                {new Date(request.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

### 4. Friend Approval Flow Component
```typescript
// components/FriendApprovalFlow.tsx
export const FriendApprovalFlow = ({ friend, isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ['results', 'boxes', 'connections'];
  
  // Same structure as FriendRequestCarousel but for approved friends
  // Shows movie characters, learn more boxes, and mutual connections
  // Navigate with tap areas like Stories UI
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      {/* Implementation similar to FriendRequestCarousel results screens */}
    </div>
  );
};
```

## Animation & Visual Updates

### 1. Glowing Homie Icon
```css
/* Add to index.css */
@keyframes glow {
  0%, 100% { box-shadow: 0 0 5px hsl(var(--primary)); }
  50% { box-shadow: 0 0 20px hsl(var(--primary)), 0 0 30px hsl(var(--primary)); }
}

.homie-glow {
  animation: glow 2s ease-in-out infinite;
}
```

### 2. Pulsing New Friends
```css
@keyframes gentle-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
}

.new-friend-pulse {
  animation: gentle-pulse 2s ease-in-out infinite;
}
```

## API Integration Points

### 1. Friend Request Hooks
```typescript
// hooks/useFriendRequests.ts
export const useFriendRequests = () => {
  const sendRequest = async (username: string) => {
    const { data, error } = await supabase.rpc('send_friend_request', {
      receiver_username: username
    });
    // Handle response
  };
  
  const approveRequest = async (requestId: string) => {
    const { data, error } = await supabase.rpc('approve_friend_request', {
      request_id: requestId
    });
    // Handle response and trigger animations
  };
  
  return { sendRequest, approveRequest };
};
```

## Implementation Checklist

- [ ] Create database tables and RLS policies
- [ ] Implement backend functions
- [ ] Set up real-time subscriptions
- [ ] Update FriendRequestAlert with counter
- [ ] Add pending requests section to suggestions
- [ ] Implement glowing homie icon animation
- [ ] Create new friends section with pulsing animation
- [ ] Build friend approval flow component
- [ ] Add tap navigation to approval flow
- [ ] Test end-to-end workflow
- [ ] Add error handling and loading states

## Notes for Cursor Implementation

1. **Authentication**: Ensure Supabase auth is properly set up in Cursor
2. **Real-time**: Configure Supabase realtime for the database
3. **TypeScript Types**: Generate types from Supabase schema
4. **Testing**: Test with multiple user accounts
5. **Performance**: Consider pagination for large friend lists
6. **Offline Handling**: Add proper loading/error states

This documentation provides the complete roadmap for implementing the friend request system in your Cursor project with Supabase backend.