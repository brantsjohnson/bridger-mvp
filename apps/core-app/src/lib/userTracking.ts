import { supabase } from '../integrations/supabase/client';

export interface UserConnection {
  id: string;
  requester_id: string;
  requester_name: string;
  target_id: string;
  target_name: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface UserTrackingData {
  userId: string;
  userName: string;
  personalizedPath: string;
  qrCode: string;
  connections: UserConnection[];
}

export const userTracking = {
  // Generate a unique connection code for a user
  generateConnectionCode: (userId: string, userName: string): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${userId}_${timestamp}_${random}`;
  },

  // Create a connection URL for sharing
  createConnectionUrl: (userId: string, userName: string, code: string): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/core/connect?user=${userId}&name=${encodeURIComponent(userName)}&code=${code}`;
  },

  // Track when a user accesses their personalized URL
  trackUserAccess: async (userId: string, userName: string, personalizedPath: string) => {
    try {
      const { error } = await supabase
        .from('user_access_logs')
        .insert({
          user_id: userId,
          user_name: userName,
          personalized_path: personalizedPath,
          accessed_at: new Date().toISOString(),
          user_agent: navigator.userAgent,
          ip_address: 'unknown' // Would need server-side tracking for real IP
        });

      if (error) {
        console.error('Error tracking user access:', error);
      } else {
        console.log('User access tracked successfully');
      }
    } catch (error) {
      console.error('Error tracking user access:', error);
    }
  },

  // Get user's connection history
  getUserConnections: async (userId: string): Promise<UserConnection[]> => {
    try {
      const { data, error } = await supabase
        .from('friend_connections')
        .select('*')
        .or(`requester_id.eq.${userId},target_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user connections:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching user connections:', error);
      return [];
    }
  },

  // Track when users scan each other's QR codes
  trackQRCodeScan: async (scannerUserId: string, scannerName: string, targetUserId: string, targetName: string) => {
    try {
      const { error } = await supabase
        .from('qr_code_scans')
        .insert({
          scanner_user_id: scannerUserId,
          scanner_name: scannerName,
          target_user_id: targetUserId,
          target_name: targetName,
          scanned_at: new Date().toISOString(),
          user_agent: navigator.userAgent
        });

      if (error) {
        console.error('Error tracking QR code scan:', error);
      } else {
        console.log('QR code scan tracked successfully');
      }
    } catch (error) {
      console.error('Error tracking QR code scan:', error);
    }
  },

  // Get analytics for user connections
  getUserAnalytics: async (userId: string) => {
    try {
      // Get connection stats
      const { data: connections, error: connectionsError } = await supabase
        .from('friend_connections')
        .select('*')
        .or(`requester_id.eq.${userId},target_id.eq.${userId}`);

      if (connectionsError) {
        console.error('Error fetching connections for analytics:', connectionsError);
        return null;
      }

      // Get QR code scan stats
      const { data: scans, error: scansError } = await supabase
        .from('qr_code_scans')
        .select('*')
        .or(`scanner_user_id.eq.${userId},target_user_id.eq.${userId}`);

      if (scansError) {
        console.error('Error fetching scans for analytics:', scansError);
        return null;
      }

      const stats = {
        totalConnections: connections?.length || 0,
        pendingConnections: connections?.filter(c => c.status === 'pending').length || 0,
        acceptedConnections: connections?.filter(c => c.status === 'accepted').length || 0,
        qrCodesScanned: scans?.filter(s => s.scanner_user_id === userId).length || 0,
        qrCodesScannedByOthers: scans?.filter(s => s.target_user_id === userId).length || 0
      };

      return stats;
    } catch (error) {
      console.error('Error getting user analytics:', error);
      return null;
    }
  },

  // Create a user tracking record
  createUserTrackingRecord: async (userData: any): Promise<UserTrackingData | null> => {
    try {
      const firstName = userData.name?.split(' ')[0] || userData.email?.split('@')[0] || 'user';
      const lastName = userData.name?.split(' ').slice(1).join('_') || 'unknown';
      const personalizedPath = `/core/${firstName}_${lastName}`;
      const connectionCode = userTracking.generateConnectionCode(userData.id, userData.name);
      const connectionUrl = userTracking.createConnectionUrl(userData.id, userData.name, connectionCode);

      // Store tracking data
      const { error } = await supabase
        .from('user_tracking')
        .insert({
          user_id: userData.id,
          user_name: userData.name,
          personalized_path: personalizedPath,
          connection_code: connectionCode,
          connection_url: connectionUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error creating user tracking record:', error);
        return null;
      }

      // Track initial access
      await userTracking.trackUserAccess(userData.id, userData.name, personalizedPath);

      return {
        userId: userData.id,
        userName: userData.name,
        personalizedPath,
        qrCode: connectionUrl,
        connections: []
      };
    } catch (error) {
      console.error('Error creating user tracking record:', error);
      return null;
    }
  }
}; 