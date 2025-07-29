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
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}; 