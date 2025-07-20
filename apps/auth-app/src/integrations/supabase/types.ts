export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      fill_in_the_blank: {
        Row: {
          answer: string
          created_at: string | null
          id: string
          is_private: boolean
          question: string
          user_id: string
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: string
          is_private?: boolean
          question: string
          user_id: string
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: string
          is_private?: boolean
          question?: string
          user_id?: string
        }
        Relationships: []
      }
      part1_likert: {
        Row: {
          answer: number
          id: string
          part: number
          question: string
          submitted_at: string | null
          user_id: string | null
        }
        Insert: {
          answer: number
          id?: string
          part?: number
          question: string
          submitted_at?: string | null
          user_id?: string | null
        }
        Update: {
          answer?: number
          id?: string
          part?: number
          question?: string
          submitted_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      part2_multiple_choice: {
        Row: {
          answer: number
          id: string
          part: number
          question: string
          submitted_at: string | null
          user_id: string | null
        }
        Insert: {
          answer: number
          id?: string
          part?: number
          question: string
          submitted_at?: string | null
          user_id?: string | null
        }
        Update: {
          answer?: number
          id?: string
          part?: number
          question?: string
          submitted_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "part2_multiple_choice_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      part3_slider: {
        Row: {
          answer_bottom: number
          answer_top: number
          created_at: string | null
          id: string
          part: number
          question_bottom: string
          question_top: string
          submitted_at: string | null
          user_id: string
        }
        Insert: {
          answer_bottom: number
          answer_top: number
          created_at?: string | null
          id?: string
          part: number
          question_bottom: string
          question_top: string
          submitted_at?: string | null
          user_id: string
        }
        Update: {
          answer_bottom?: number
          answer_top?: number
          created_at?: string | null
          id?: string
          part?: number
          question_bottom?: string
          question_top?: string
          submitted_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      part4_ranking: {
        Row: {
          answer: string
          id: string
          part: number
          question: string
          rank: number
          submitted_at: string | null
          user_id: string | null
        }
        Insert: {
          answer: string
          id?: string
          part?: number
          question: string
          rank: number
          submitted_at?: string | null
          user_id?: string | null
        }
        Update: {
          answer?: string
          id?: string
          part?: number
          question?: string
          rank?: number
          submitted_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "part4_ranking_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      part5_likert: {
        Row: {
          answer: number
          id: string
          part: number
          question: string
          submitted_at: string | null
          user_id: string | null
        }
        Insert: {
          answer: number
          id?: string
          part?: number
          question: string
          submitted_at?: string | null
          user_id?: string | null
        }
        Update: {
          answer?: number
          id?: string
          part?: number
          question?: string
          submitted_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "part5_likert_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      part6_free_response: {
        Row: {
          answer: string
          id: string
          part: number
          question: string
          submitted_at: string | null
          user_id: string | null
        }
        Insert: {
          answer: string
          id?: string
          part?: number
          question: string
          submitted_at?: string | null
          user_id?: string | null
        }
        Update: {
          answer?: string
          id?: string
          part?: number
          question?: string
          submitted_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "part6_free_response_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_answers: {
        Row: {
          answer: string
          created_at: string | null
          id: string
          question_id: string
          user_id: string | null
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: string
          question_id: string
          user_id?: string | null
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: string
          question_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_hobbies: {
        Row: {
          created_at: string | null
          hobby: string
          id: string
          is_custom: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          hobby: string
          id?: string
          is_custom?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          hobby?: string
          id?: string
          is_custom?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          agreed_to_policy: boolean | null
          birthdate: string | null
          birthday: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          phone_number: string | null
          photo_url: string | null
          updated_at: string | null
        }
        Insert: {
          agreed_to_policy?: boolean | null
          birthdate?: string | null
          birthday?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          phone_number?: string | null
          photo_url?: string | null
          updated_at?: string | null
        }
        Update: {
          agreed_to_policy?: boolean | null
          birthdate?: string | null
          birthday?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          phone_number?: string | null
          photo_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      part1_personality_scores: {
        Row: {
          agreeableness_letter: string | null
          agreeableness_score: number | null
          conscientiousness_letter: string | null
          conscientiousness_score: number | null
          extraversion_letter: string | null
          extraversion_score: number | null
          neuroticism_score: number | null
          openness_letter: string | null
          openness_score: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
