// Shared utility for checking quiz completion status
// This can be used by both the quiz app and core app

export const checkQuizCompletionStatus = (): boolean => {
  try {
    // Check if there's a quiz user ID in localStorage
    const quizUserId = localStorage.getItem('quiz_user_id');
    if (quizUserId) {
      // If there's a quiz user ID, check if the quiz was completed
      // For now, we'll assume if there's a user ID, the quiz is in progress
      // The actual completion check should be done by the quiz app
      return false;
    }

    // Check if user has profile data (indicates quiz completion)
    const userData = localStorage.getItem('bridger_user_data');
    if (userData) {
      const user = JSON.parse(userData);
      const userProfile = localStorage.getItem(`bridger_profile_${user.id}`);
      if (userProfile) {
        const profileData = JSON.parse(userProfile);
        return !!profileData.quizCompletedAt;
      }
    }

    return false;
  } catch (error) {
    console.error('Error checking quiz completion status:', error);
    return false;
  }
};

export const clearQuizUserData = (): void => {
  try {
    localStorage.removeItem('quiz_user_id');
  } catch (error) {
    console.error('Error clearing quiz user data:', error);
  }
}; 