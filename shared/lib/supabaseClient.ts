import { createClient } from '@supabase/supabase-js'

// Use the same Supabase credentials as the auth app
const supabaseUrl = "https://wvdxlabtpidmltlvjzog.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2ZHhsYWJ0cGlkbWx0bHZqem9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3OTc2OTgsImV4cCI6MjA2NjM3MzY5OH0.YN6dDiu8jkWASuFwunSeOpnsgoE7IChb6D79rdhkt5w"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    // For development: disable email confirmation requirement
    detectSessionInUrl: true,
  }
})

// Shared user session management
export const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
} 