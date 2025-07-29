import React, { createContext, useContext, useEffect, useState } from 'react';
import { userTracking, UserTrackingData } from './userTracking';
import { demoData } from './demoData';

interface UserData {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
}

interface UserContextType {
  userData: UserData | null;
  setUserData: (user: UserData | null) => void;
  loading: boolean;
  personalizedPath: string | null;
  trackingData: UserTrackingData | null;
  createTrackingRecord: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [personalizedPath, setPersonalizedPath] = useState<string | null>(null);
  const [trackingData, setTrackingData] = useState<UserTrackingData | null>(null);

  const createTrackingRecord = async () => {
    if (!userData) return;
    
    try {
      const trackingRecord = await userTracking.createUserTrackingRecord(userData);
      if (trackingRecord) {
        setTrackingData(trackingRecord);
        console.log('User tracking record created:', trackingRecord);
      }
    } catch (error) {
      console.error('Error creating tracking record:', error);
    }
  };

  // Get demo user as fallback
  const getDemoUser = (): UserData => {
    const demoUser = demoData.getUserById('fox_red_user_123');
    if (demoUser) {
      return {
        id: demoUser.id,
        email: demoUser.email,
        name: demoUser.name,
        firstName: demoUser.firstName,
        lastName: demoUser.lastName,
        photoUrl: demoUser.photoUrl
      };
    }
    // Fallback if demo user not found
    return {
      id: 'fox_red_user_123',
      email: 'fox.red@bridger.com',
      name: 'Fox Red',
      firstName: 'Fox',
      lastName: 'Red'
    };
  };

  useEffect(() => {
    // Get user data from localStorage
    const getStoredUserData = () => {
      const stored = localStorage.getItem('bridger_user_data');
      if (stored) {
        try {
          const user = JSON.parse(stored);
          console.log('UserProvider: Loaded user data:', user);
          
          // Parse name into firstName and lastName
          const nameParts = user.name?.split(' ') || [];
          const firstName = nameParts[0] || user.email?.split('@')[0] || 'user';
          const lastName = nameParts.slice(1).join(' ') || 'unknown';
          
          const userDataWithNames = {
            ...user,
            firstName,
            lastName
          };
          
          setUserData(userDataWithNames);
          
          // Create personalized path
          const path = `/core/${firstName}_${lastName}`;
          setPersonalizedPath(path);
          
          return userDataWithNames;
        } catch (e) {
          console.error('UserProvider: Error parsing user data:', e);
        }
      }
      return null;
    };

    // Initialize user data
    const user = getStoredUserData();
    
    // If no user data found, use demo user
    if (!user) {
      const demoUser = getDemoUser();
      setUserData(demoUser);
      setPersonalizedPath(`/core/${demoUser.firstName}_${demoUser.lastName}`);
      console.log('UserProvider: Using demo user:', demoUser);
    }
    
    setLoading(false);

    // Listen for user data updates from parent window
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'USER_DATA_UPDATE') {
        console.log('UserProvider: Received user data update:', event.data.userData);
        const user = event.data.userData;
        
        // Parse name into firstName and lastName
        const nameParts = user.name?.split(' ') || [];
        const firstName = nameParts[0] || user.email?.split('@')[0] || 'user';
        const lastName = nameParts.slice(1).join(' ') || 'unknown';
        
        const userDataWithNames = {
          ...user,
          firstName,
          lastName
        };
        
        setUserData(userDataWithNames);
        localStorage.setItem('bridger_user_data', JSON.stringify(userDataWithNames));
        
        // Create personalized path
        const path = `/core/${firstName}_${lastName}`;
        setPersonalizedPath(path);
        
        // Create tracking record for new user
        createTrackingRecord();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Create tracking record when user data is available
  useEffect(() => {
    if (userData && !trackingData) {
      createTrackingRecord();
    }
  }, [userData]);

  const value = {
    userData,
    setUserData,
    loading,
    personalizedPath,
    trackingData,
    createTrackingRecord
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 