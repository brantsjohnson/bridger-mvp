import { supabase } from './supabaseClient'
import type { User, LoginCredentials, SignupCredentials, AuthResponse } from '../types/auth'

export const authUtils = {
  // Sign in with email and password
  async signIn({ email, password }: LoginCredentials): Promise<AuthResponse> {
    console.log('AuthUtils: Attempting sign in with email:', email);
    console.log('AuthUtils: Password length:', password.length);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      console.error('AuthUtils: Sign in error:', error);
      
      // Check if it's an email confirmation issue
      if (error.message.includes('Email not confirmed')) {
        throw new Error('Please check your email and click the confirmation link before logging in.');
      }
      
      throw error;
    }
    
    console.log('AuthUtils: Sign in successful, user:', data.user);
    console.log('AuthUtils: User ID:', data.user?.id);
    console.log('AuthUtils: User email confirmed:', data.user?.email_confirmed_at);
    
    return {
      user: data.user as User,
      session: data.session
    }
  },

  // Sign up with email and password
  async signUp({ email, password, name, photoUrl }: SignupCredentials & { photoUrl?: string }): Promise<AuthResponse> {
    console.log('AuthUtils: Attempting sign up with email:', email, 'name:', name);
    console.log('AuthUtils: Password length:', password.length);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
        // For development: skip email confirmation
        emailRedirectTo: 'http://localhost:3000/auth'
      }
    })
    
    if (error) {
      console.error('AuthUtils: Sign up error:', error);
      throw error;
    }
    
    console.log('AuthUtils: Sign up successful, user:', data.user);
    console.log('AuthUtils: User ID:', data.user?.id);
    console.log('AuthUtils: User email confirmed:', data.user?.email_confirmed_at);

    // Save additional user data to custom users table
    if (data.user) {
      const [firstName, ...lastNameParts] = name.split(' ')
      const lastName = lastNameParts.join(' ')
      
      console.log('AuthUtils: Saving user profile to custom table...');
      
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email,
          first_name: firstName,
          last_name: lastName,
          full_name: name,
          photo_url: photoUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      
      if (profileError) {
        console.error('Error saving user profile:', profileError)
        // Don't throw error here as auth was successful
      } else {
        console.log('AuthUtils: User profile saved successfully');
      }
    }
    
    return {
      user: data.user as User,
      session: data.session
    }
  },

  // Update user profile with photo
  async updateUserPhoto(userId: string, photoUrl: string) {
    const { error } = await supabase
      .from('users')
      .update({ 
        photo_url: photoUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
    
    if (error) throw error
  },

  // Sign out
  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser()
    return user as User | null
  },

  // Get user profile from custom table
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user as User | null)
    })
  }
} 