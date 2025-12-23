export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          role: 'user' | 'model' | 'admin'
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'model' | 'admin'
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'model' | 'admin'
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      model_details: {
        Row: {
          id: string
          location_city: string | null
          location_country: string | null
          bio: string | null
          height: number | null
          age: number | null
          phone_number: string | null
          services: string[] | null
          price_per_hour: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          location_city?: string | null
          location_country?: string | null
          bio?: string | null
          height?: number | null
          age?: number | null
          phone_number?: string | null
          services?: string[] | null
          price_per_hour?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          location_city?: string | null
          location_country?: string | null
          bio?: string | null
          height?: number | null
          age?: number | null
          phone_number?: string | null
          services?: string[] | null
          price_per_hour?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      photos: {
        Row: {
          id: string
          model_id: string
          photo_url: string
          is_verified: boolean
          is_primary: boolean
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          model_id: string
          photo_url: string
          is_verified?: boolean
          is_primary?: boolean
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          model_id?: string
          photo_url?: string
          is_verified?: boolean
          is_primary?: boolean
          display_order?: number
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon_url?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

