// App routing constants
export const APP_ROUTES = {
  QUIZ: '/quiz',
  CORE: '/core',
  AUTH: '/auth',
  SIGN_IN: '/auth/signin',
  SIGN_UP: '/auth/signup',
  DASHBOARD: '/core/dashboard',
  PROFILE: '/core/profile'
} as const

// App names for identification
export const APP_NAMES = {
  QUIZ: 'quiz-app',
  CORE: 'core-app',
  AUTH: 'auth-app'
} as const

// Local storage keys
export const STORAGE_KEYS = {
  USER_SESSION: 'bridger_user_session',
  QUIZ_RESULTS: 'bridger_quiz_results',
  APP_PREFERENCES: 'bridger_app_preferences'
} as const

// API endpoints
export const API_ENDPOINTS = {
  QUIZ_RESULTS: '/api/quiz-results',
  USER_PROFILE: '/api/user-profile',
  AUTH: '/api/auth'
} as const 