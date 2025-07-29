import { supabase } from '../integrations/supabase/client';

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  personality?: string;
  hobbies?: string[];
  bio?: string;
  location?: string;
}

export interface DemoConnection {
  id: string;
  requester_id: string;
  requester_name: string;
  target_id: string;
  target_name: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export const demoUsers: DemoUser[] = [
  {
    id: "fox_red_user_123",
    name: "Fox Red",
    email: "fox.red@bridger.com",
    firstName: "Fox",
    lastName: "Red",
    personality: "Adventurous and energetic",
    hobbies: ["Hiking", "Photography", "Cooking"],
    bio: "Always exploring new trails and capturing moments. Love cooking with fresh ingredients!",
    location: "Mountain View, CA"
  },
  {
    id: "fox_blue_user_456",
    name: "Fox Blue",
    email: "fox.blue@bridger.com",
    firstName: "Fox",
    lastName: "Blue",
    personality: "Creative and thoughtful",
    hobbies: ["Painting", "Reading", "Yoga"],
    bio: "Artist by day, dreamer by night. Finding beauty in everyday moments.",
    location: "Portland, OR"
  },
  {
    id: "fox_green_user_789",
    name: "Fox Green",
    email: "fox.green@bridger.com",
    firstName: "Fox",
    lastName: "Green",
    personality: "Analytical and organized",
    hobbies: ["Coding", "Chess", "Gardening"],
    bio: "Tech enthusiast who loves solving puzzles and growing plants.",
    location: "Austin, TX"
  },
  {
    id: "whale_deep_user_101",
    name: "Whale Deep",
    email: "whale.deep@bridger.com",
    firstName: "Whale",
    lastName: "Deep",
    personality: "Wise and contemplative",
    hobbies: ["Swimming", "Philosophy", "Music"],
    bio: "Deep thinker who finds peace in the ocean and classical music.",
    location: "Seattle, WA"
  },
  {
    id: "whale_surface_user_202",
    name: "Whale Surface",
    email: "whale.surface@bridger.com",
    firstName: "Whale",
    lastName: "Surface",
    personality: "Social and outgoing",
    hobbies: ["Dancing", "Travel", "Languages"],
    bio: "Love connecting with people from around the world through dance and conversation.",
    location: "Miami, FL"
  },
  {
    id: "whale_migrate_user_303",
    name: "Whale Migrate",
    email: "whale.migrate@bridger.com",
    firstName: "Whale",
    lastName: "Migrate",
    personality: "Free-spirited and adaptable",
    hobbies: ["Backpacking", "Photography", "Writing"],
    bio: "Always on the move, documenting life's journey one story at a time.",
    location: "Denver, CO"
  }
];

export const demoConnections: DemoConnection[] = [
  {
    id: "conn_1",
    requester_id: "fox_red_user_123",
    requester_name: "Fox Red",
    target_id: "fox_blue_user_456",
    target_name: "Fox Blue",
    status: "accepted",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T11:00:00Z"
  },
  {
    id: "conn_2",
    requester_id: "fox_red_user_123",
    requester_name: "Fox Red",
    target_id: "whale_deep_user_101",
    target_name: "Whale Deep",
    status: "pending",
    created_at: "2024-01-20T14:20:00Z",
    updated_at: "2024-01-20T14:20:00Z"
  },
  {
    id: "conn_3",
    requester_id: "fox_blue_user_456",
    requester_name: "Fox Blue",
    target_id: "fox_green_user_789",
    target_name: "Fox Green",
    status: "accepted",
    created_at: "2024-01-10T09:15:00Z",
    updated_at: "2024-01-10T09:45:00Z"
  },
  {
    id: "conn_4",
    requester_id: "whale_surface_user_202",
    requester_name: "Whale Surface",
    target_id: "fox_red_user_123",
    target_name: "Fox Red",
    status: "accepted",
    created_at: "2024-01-18T16:30:00Z",
    updated_at: "2024-01-18T17:00:00Z"
  },
  {
    id: "conn_5",
    requester_id: "whale_migrate_user_303",
    requester_name: "Whale Migrate",
    target_id: "fox_green_user_789",
    target_name: "Fox Green",
    status: "pending",
    created_at: "2024-01-22T12:00:00Z",
    updated_at: "2024-01-22T12:00:00Z"
  },
  // Add more connections to make suggestions more interesting
  {
    id: "conn_6",
    requester_id: "whale_surface_user_202",
    requester_name: "Whale Surface",
    target_id: "fox_green_user_789",
    target_name: "Fox Green",
    status: "accepted",
    created_at: "2024-01-19T10:00:00Z",
    updated_at: "2024-01-19T10:30:00Z"
  },
  {
    id: "conn_7",
    requester_id: "whale_deep_user_101",
    requester_name: "Whale Deep",
    target_id: "fox_green_user_789",
    target_name: "Fox Green",
    status: "accepted",
    created_at: "2024-01-21T15:00:00Z",
    updated_at: "2024-01-21T15:30:00Z"
  }
];

export const demoData = {
  // Get all demo users
  getUsers: (): DemoUser[] => {
    return demoUsers;
  },

  // Get user by ID
  getUserById: (id: string): DemoUser | undefined => {
    return demoUsers.find(user => user.id === id);
  },

  // Get user's friends (accepted connections)
  getUserFriends: (userId: string): DemoUser[] => {
    const userConnections = demoConnections.filter(
      conn => (conn.requester_id === userId || conn.target_id === userId) && conn.status === 'accepted'
    );
    
    return userConnections.map(conn => {
      const friendId = conn.requester_id === userId ? conn.target_id : conn.requester_id;
      return demoUsers.find(user => user.id === friendId)!;
    });
  },

  // Get pending friend requests for a user
  getPendingRequests: (userId: string): DemoConnection[] => {
    return demoConnections.filter(
      conn => conn.target_id === userId && conn.status === 'pending'
    );
  },

  // Get sent friend requests by a user
  getSentRequests: (userId: string): DemoConnection[] => {
    return demoConnections.filter(
      conn => conn.requester_id === userId && conn.status === 'pending'
    );
  },

  // Get suggested friends (users not connected)
  getSuggestedFriends: (userId: string): DemoUser[] => {
    console.log('DemoData: Getting suggested friends for user:', userId);
    const userConnections = demoConnections.filter(
      conn => conn.requester_id === userId || conn.target_id === userId
    );
    console.log('DemoData: User connections:', userConnections);
    const connectedUserIds = userConnections.map(conn => 
      conn.requester_id === userId ? conn.target_id : conn.requester_id
    );
    console.log('DemoData: Connected user IDs:', connectedUserIds);
    
    const suggestions = demoUsers.filter(user => 
      user.id !== userId && !connectedUserIds.includes(user.id)
    );
    console.log('DemoData: Suggested friends:', suggestions);
    return suggestions;
  },

  // Get user's connection history
  getUserConnections: (userId: string): DemoConnection[] => {
    return demoConnections.filter(
      conn => conn.requester_id === userId || conn.target_id === userId
    );
  },

  // Simulate adding a friend request
  addFriendRequest: (requesterId: string, targetId: string): DemoConnection => {
    const requester = demoUsers.find(u => u.id === requesterId);
    const target = demoUsers.find(u => u.id === targetId);
    
    if (!requester || !target) {
      throw new Error('User not found');
    }

    const newConnection: DemoConnection = {
      id: `conn_${Date.now()}`,
      requester_id: requesterId,
      requester_name: requester.name,
      target_id: targetId,
      target_name: target.name,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    demoConnections.push(newConnection);
    console.log('DemoData: Added new friend request:', newConnection);
    return newConnection;
  },

  // Simulate accepting a friend request
  acceptFriendRequest: (connectionId: string): DemoConnection | null => {
    const connection = demoConnections.find(conn => conn.id === connectionId);
    if (connection && connection.status === 'pending') {
      connection.status = 'accepted';
      connection.updated_at = new Date().toISOString();
      console.log('DemoData: Accepted friend request:', connectionId);
      return connection;
    }
    console.log('DemoData: Failed to accept request:', connectionId);
    return null;
  },

  // Simulate rejecting a friend request
  rejectFriendRequest: (connectionId: string): DemoConnection | null => {
    const connection = demoConnections.find(conn => conn.id === connectionId);
    if (connection && connection.status === 'pending') {
      connection.status = 'rejected';
      connection.updated_at = new Date().toISOString();
      console.log('DemoData: Rejected friend request:', connectionId);
      return connection;
    }
    console.log('DemoData: Failed to reject request:', connectionId);
    return null;
  },

  // Get user analytics
  getUserAnalytics: (userId: string) => {
    const userConnections = demoData.getUserConnections(userId);
    const friends = demoData.getUserFriends(userId);
    const pendingRequests = demoData.getPendingRequests(userId);
    const sentRequests = demoData.getSentRequests(userId);

    return {
      totalConnections: userConnections.length,
      acceptedConnections: friends.length,
      pendingRequests: pendingRequests.length,
      sentRequests: sentRequests.length,
      connectionSuccessRate: friends.length / Math.max(userConnections.length, 1) * 100
    };
  }
}; 