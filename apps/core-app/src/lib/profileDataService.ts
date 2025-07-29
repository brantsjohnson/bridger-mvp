import { supabase } from '../integrations/supabase/client';
import type { Tables } from '../integrations/supabase/types';

export interface ProfileData {
  fillInTheBlank: Tables<'fill_in_the_blank'>[];
  hobbies: Tables<'user_hobbies'>[];
  user: Tables<'users'> | null;
}

export const profileDataService = {
  // Get user's fill-in-the-blank answers
  async getFillInTheBlankData(userId: string): Promise<Tables<'fill_in_the_blank'>[]> {
    try {
      const { data, error } = await supabase
        .from('fill_in_the_blank')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching fill-in-the-blank data:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching fill-in-the-blank data:', error);
      return [];
    }
  },

  // Get user's hobbies
  async getUserHobbies(userId: string): Promise<Tables<'user_hobbies'>[]> {
    try {
      const { data, error } = await supabase
        .from('user_hobbies')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching user hobbies:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching user hobbies:', error);
      return [];
    }
  },

  // Get user data
  async getUserData(userId: string): Promise<Tables<'users'> | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  },

  // Get complete profile data for a user
  async getProfileData(userId: string): Promise<ProfileData> {
    try {
      const [fillInTheBlank, hobbies, user] = await Promise.all([
        this.getFillInTheBlankData(userId),
        this.getUserHobbies(userId),
        this.getUserData(userId)
      ]);

      return {
        fillInTheBlank,
        hobbies,
        user
      };
    } catch (error) {
      console.error('Error fetching profile data:', error);
      return {
        fillInTheBlank: [],
        hobbies: [],
        user: null
      };
    }
  },

  // Convert fill-in-the-blank data to profile format
  formatFillInTheBlankForProfile(fillInTheBlankData: Tables<'fill_in_the_blank'>[]) {
    return fillInTheBlankData.map(item => ({
      label: item.question,
      value: item.answer,
      isPrivate: item.is_private
    }));
  },

  // Convert hobbies data to array of hobby names
  formatHobbiesForProfile(hobbiesData: Tables<'user_hobbies'>[]) {
    return hobbiesData.map(item => item.hobby);
  },

  // Get personality scores if available
  async getPersonalityScores(userId: string) {
    try {
      const { data, error } = await supabase
        .from('part1_personality_scores')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching personality scores:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching personality scores:', error);
      return null;
    }
  }
}; 