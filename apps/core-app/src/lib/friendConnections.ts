import { supabase } from '../integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface FriendConnection {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  updated_at: string;
}

export interface ConnectionRequest {
  requester_id: string;
  recipient_id: string;
  requester_name?: string;
  recipient_name?: string;
}

/**
 * Generate a unique connection code for a user
 */
export const generateConnectionCode = (userId: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${userId}_${timestamp}_${random}`;
};

/**
 * Create a shareable link for adding friends
 */
export const createShareableLink = (userId: string, userName?: string): string => {
  const baseUrl = window.location.origin;
  const connectionCode = generateConnectionCode(userId);
  const params = new URLSearchParams({
    code: connectionCode,
    user: userId,
    ...(userName && { name: userName })
  });
  return `${baseUrl}/connect?${params.toString()}`;
};

/**
 * Generate QR code data for friend connection
 */
export const generateQRCodeData = (userId: string, userName?: string): string => {
  return createShareableLink(userId, userName);
};

/**
 * Send a friend request
 */
export const sendFriendRequest = async (requesterId: string, recipientId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Check if connection already exists
    const { data: existingConnection, error: checkError } = await supabase
      .from('friend_connections')
      .select('*')
      .or(`and(requester_id.eq.${requesterId},recipient_id.eq.${recipientId}),and(requester_id.eq.${recipientId},recipient_id.eq.${requesterId})`)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      return { success: false, error: checkError.message };
    }

    if (existingConnection) {
      return { success: false, error: 'Connection already exists' };
    }

    // Create new connection
    const { error: insertError } = await supabase
      .from('friend_connections')
      .insert({
        requester_id: requesterId,
        recipient_id: recipientId,
        status: 'pending'
      });

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to send friend request' };
  }
};

/**
 * Accept a friend request
 */
export const acceptFriendRequest = async (connectionId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('friend_connections')
      .update({ status: 'accepted', updated_at: new Date().toISOString() })
      .eq('id', connectionId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to accept friend request' };
  }
};

/**
 * Decline a friend request
 */
export const declineFriendRequest = async (connectionId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('friend_connections')
      .update({ status: 'declined', updated_at: new Date().toISOString() })
      .eq('id', connectionId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to decline friend request' };
  }
};

/**
 * Get pending friend requests for a user
 */
export const getPendingFriendRequests = async (userId: string): Promise<FriendConnection[]> => {
  try {
    const { data, error } = await supabase
      .from('friend_connections')
      .select(`
        *,
        requester:users!friend_connections_requester_id_fkey(id, first_name, last_name, full_name)
      `)
      .eq('recipient_id', userId)
      .eq('status', 'pending');

    if (error) {
      console.error('Error fetching pending requests:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    return [];
  }
};

/**
 * Get accepted friends for a user
 */
export const getAcceptedFriends = async (userId: string): Promise<FriendConnection[]> => {
  try {
    const { data, error } = await supabase
      .from('friend_connections')
      .select(`
        *,
        requester:users!friend_connections_requester_id_fkey(id, first_name, last_name, full_name),
        recipient:users!friend_connections_recipient_id_fkey(id, first_name, last_name, full_name)
      `)
      .eq('status', 'accepted')
      .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`);

    if (error) {
      console.error('Error fetching accepted friends:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching accepted friends:', error);
    return [];
  }
};

/**
 * Parse connection code from URL parameters
 */
export const parseConnectionCode = (url: string): { userId?: string; connectionCode?: string; userName?: string } => {
  try {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    const code = urlParams.get('code');
    const user = urlParams.get('user');
    const name = urlParams.get('name');

    return {
      userId: user || undefined,
      connectionCode: code || undefined,
      userName: name || undefined
    };
  } catch (error) {
    console.error('Error parsing connection code:', error);
    return {};
  }
};

/**
 * Copy text to clipboard with iframe-safe fallback
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      console.log('✅ Modern clipboard API successful');
      return true;
    }
  } catch (error) {
    console.log('Modern clipboard API failed, trying fallback:', error);
    
    // Check if it's a permissions error
    if (error instanceof Error && error.message.includes('permissions policy')) {
      console.log('⚠️ Clipboard blocked by permissions policy - using fallback');
    }
  }

  try {
    // Fallback for iframes or older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.opacity = '0';
    textArea.style.pointerEvents = 'none';
    textArea.style.zIndex = '-9999';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (successful) {
      console.log('✅ Fallback clipboard method successful');
      return true;
    }
  } catch (error) {
    console.log('Fallback clipboard method failed:', error);
  }

  // Final fallback - show the link in a more user-friendly way
  try {
    // Create a temporary input field that the user can copy from
    const tempInput = document.createElement('input');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.top = '50%';
    tempInput.style.left = '50%';
    tempInput.style.transform = 'translate(-50%, -50%)';
    tempInput.style.zIndex = '9999';
    tempInput.style.padding = '10px';
    tempInput.style.border = '2px solid #333';
    tempInput.style.borderRadius = '5px';
    tempInput.style.fontSize = '14px';
    tempInput.style.backgroundColor = 'white';
    tempInput.style.color = 'black';
    tempInput.readOnly = true;
    tempInput.style.width = '300px';
    
    // Add a close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '-10px';
    closeButton.style.right = '-10px';
    closeButton.style.width = '20px';
    closeButton.style.height = '20px';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '50%';
    closeButton.style.backgroundColor = '#ff4444';
    closeButton.style.color = 'white';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '12px';
    closeButton.style.fontWeight = 'bold';
    
    // Add instructions
    const instructions = document.createElement('div');
    instructions.innerHTML = '<p style="margin: 0 0 10px 0; color: #333; font-size: 12px;">Click the link below and press Ctrl+C (or Cmd+C) to copy:</p>';
    instructions.style.position = 'absolute';
    instructions.style.top = '-30px';
    instructions.style.left = '0';
    instructions.style.whiteSpace = 'nowrap';
    
    // Create container
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.zIndex = '9999';
    container.style.backgroundColor = 'white';
    container.style.padding = '20px';
    container.style.borderRadius = '10px';
    container.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    container.style.border = '1px solid #ccc';
    container.style.minWidth = '320px';
    
    container.appendChild(instructions);
    container.appendChild(tempInput);
    container.appendChild(closeButton);
    document.body.appendChild(container);
    
    // Focus and select the text
    tempInput.focus();
    tempInput.select();
    
    // Handle close button
    const removeElements = () => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };
    
    closeButton.onclick = removeElements;
    
    // Auto-remove after 15 seconds
    setTimeout(removeElements, 15000);
    
    console.log('✅ Showed manual copy interface');
    return true;
  } catch (error) {
    console.error('All clipboard methods failed:', error);
    // Last resort - just show in alert
    alert(`Here's your shareable link:\n\n${text}\n\nPlease copy it manually.`);
    return false;
  }
};

/**
 * Add a new friend connection
 */
export const addFriendConnection = (userId: string, newFriend: any) => {
  try {
    // Get existing friends
    const existingFriends = getUserFriends(userId);
    
    // Add new friend
    const updatedFriends = [...existingFriends, newFriend];
    
    // Save updated friends list
    saveUserFriends(userId, updatedFriends);
    
    console.log('✅ Added new friend:', newFriend.name);
    return true;
  } catch (error) {
    console.error('Error adding friend connection:', error);
    return false;
  }
};

/**
 * Load friend's profile data from Supabase
 */
export const loadFriendProfile = async (friendId: string) => {
  try {
    // This would connect to Supabase to get the friend's profile
    // For now, we'll simulate this with localStorage
    const friendProfile = localStorage.getItem(`bridger_profile_${friendId}`);
    
    if (friendProfile) {
      const profileData = JSON.parse(friendProfile);
      
      // Filter out private fields (is_private = true)
      const publicAboutMe = profileData.aboutMe?.filter((item: any) => !item.is_private) || [];
      const publicFavorites = profileData.favorites?.filter((item: any) => !item.is_private) || [];
      const publicHobbies = profileData.hobbies || [];
      
      return {
        aboutMe: publicAboutMe,
        favorites: publicFavorites,
        hobbies: publicHobbies,
        name: profileData.name || 'Friend'
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error loading friend profile:', error);
    return null;
  }
};

/**
 * Handle QR code scan or link click
 */
export const handleFriendConnection = async (userId: string, connectionData: any) => {
  try {
    // Parse connection data from QR code or link
    const { friendId, friendName, connectionCode } = connectionData;
    
    // Verify connection code (would validate with Supabase)
    const isValidConnection = true; // This would check with Supabase
    
    if (isValidConnection) {
      // Load friend's public profile data
      const friendProfile = await loadFriendProfile(friendId);
      
      if (friendProfile) {
        // Add friend to user's friends list
        const newFriend = {
          id: friendId,
          firstName: friendName.split(' ')[0] || friendName,
          lastName: friendName.split(' ').slice(1).join(' ') || '',
          name: friendName,
          categories: friendProfile.hobbies || [],
          profileData: friendProfile
        };
        
        const success = addFriendConnection(userId, newFriend);
        
        if (success) {
          console.log('✅ Friend connection established:', friendName);
          return { success: true, friend: newFriend };
        }
      }
    }
    
    return { success: false, error: 'Invalid connection' };
  } catch (error) {
    console.error('Error handling friend connection:', error);
    return { success: false, error: 'Connection failed' };
  }
}; 