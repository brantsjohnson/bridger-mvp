export interface User {
  id: string
  email?: string
  created_at?: string
  updated_at?: string
}

export interface UserProfile {
  id: string
  user_id: string
  email?: string
  first_name?: string
  last_name?: string
  created_at?: string
  updated_at?: string
}

export interface AuthState {
  user: User | null
  session: any | null
  loading: boolean
}

export interface QuizResult {
  user_id: string
  quiz_type: string
  results: any
  completed_at: string
} 