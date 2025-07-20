// User data utilities for managing user-specific data

export const saveUserFriends = (userId: string, friends: any[]) => {
  localStorage.setItem(`bridger_friends_${userId}`, JSON.stringify(friends));
};

export const saveUserRequests = (userId: string, requests: any[]) => {
  localStorage.setItem(`bridger_requests_${userId}`, JSON.stringify(requests));
};

export const saveUserProfile = (userId: string, profile: any) => {
  localStorage.setItem(`bridger_profile_${userId}`, JSON.stringify(profile));
};

export const getUserFriends = (userId: string) => {
  const friends = localStorage.getItem(`bridger_friends_${userId}`);
  return friends ? JSON.parse(friends) : [];
};

export const getUserRequests = (userId: string) => {
  const requests = localStorage.getItem(`bridger_requests_${userId}`);
  return requests ? JSON.parse(requests) : [];
};

export const getUserProfile = (userId: string) => {
  const profile = localStorage.getItem(`bridger_profile_${userId}`);
  return profile ? JSON.parse(profile) : null;
};

export const isNewUser = (userId: string) => {
  const friends = getUserFriends(userId);
  const profile = getUserProfile(userId);
  return friends.length === 0 && !profile;
}; 