/**
 * Zaman Pusulası — Supabase Database Types
 *
 * These types mirror the database schema. They will be auto-generated
 * from Supabase CLI once the project is connected. For now, they are
 * manually defined to match the data model from the spec.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          education_level: string | null;
          preferred_study_time: string | null;
          default_study_duration: number;
          default_break_duration: number;
          default_prep_duration: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          education_level?: string | null;
          preferred_study_time?: string | null;
          default_study_duration?: number;
          default_break_duration?: number;
          default_prep_duration?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          education_level?: string | null;
          preferred_study_time?: string | null;
          default_study_duration?: number;
          default_break_duration?: number;
          default_prep_duration?: number;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          theme: string;
          accent_color: string;
          font_size: string;
          high_contrast: boolean;
          reduced_motion: boolean;
          simple_mode: boolean;
          navbar_items: Json;
        };
        Insert: {
          id?: string;
          user_id: string;
          theme?: string;
          accent_color?: string;
          font_size?: string;
          high_contrast?: boolean;
          reduced_motion?: boolean;
          simple_mode?: boolean;
          navbar_items?: Json;
        };
        Update: {
          theme?: string;
          accent_color?: string;
          font_size?: string;
          high_contrast?: boolean;
          reduced_motion?: boolean;
          simple_mode?: boolean;
          navbar_items?: Json;
        };
      };
      courses: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          instructor: string | null;
          color: string;
          weekly_schedule: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          instructor?: string | null;
          color?: string;
          weekly_schedule?: Json | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          instructor?: string | null;
          color?: string;
          weekly_schedule?: Json | null;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          course_id: string | null;
          title: string;
          description: string | null;
          type: string;
          priority: string;
          status: string;
          start_time: string | null;
          end_time: string | null;
          deadline: string | null;
          estimated_duration: number | null;
          prep_duration: number | null;
          travel_duration: number | null;
          location_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id?: string | null;
          title: string;
          description?: string | null;
          type: string;
          priority?: string;
          status?: string;
          start_time?: string | null;
          end_time?: string | null;
          deadline?: string | null;
          estimated_duration?: number | null;
          prep_duration?: number | null;
          travel_duration?: number | null;
          location_id?: string | null;
          created_at?: string;
        };
        Update: {
          course_id?: string | null;
          title?: string;
          description?: string | null;
          type?: string;
          priority?: string;
          status?: string;
          start_time?: string | null;
          end_time?: string | null;
          deadline?: string | null;
          estimated_duration?: number | null;
          prep_duration?: number | null;
          travel_duration?: number | null;
          location_id?: string | null;
        };
      };
      study_topics: {
        Row: {
          id: string;
          course_id: string;
          user_id: string;
          title: string;
          difficulty: string;
          estimated_minutes: number;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          user_id: string;
          title: string;
          difficulty?: string;
          estimated_minutes?: number;
          completed?: boolean;
          created_at?: string;
        };
        Update: {
          title?: string;
          difficulty?: string;
          estimated_minutes?: number;
          completed?: boolean;
        };
      };
      locations: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          average_travel_minutes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          average_travel_minutes?: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          average_travel_minutes?: number;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          content: string;
          suggested_action: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: string;
          content: string;
          suggested_action?: Json | null;
          created_at?: string;
        };
        Update: {
          content?: string;
          suggested_action?: Json | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
