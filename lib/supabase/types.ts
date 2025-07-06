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
          name: string | null
          email: string | null
          impact_score: number
          avatar_url: string | null
          bio: string | null
          location: string | null
          created_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          impact_score?: number
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          impact_score?: number
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          created_at?: string
        }
      }
      listings: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          price: number
          original_price: number | null
          size: string | null
          image_urls: string[] | null
          status: string
          created_at: string
          updated_at: string
          brand: string | null
          category: string | null
          condition: string | null
          location: string | null
          negotiable: boolean
          try_on_available: boolean
          views: number
          likes: number
          tags: string[] | null
          measurements: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          price: number
          original_price?: number | null
          size?: string | null
          image_urls?: string[] | null
          status?: string
          created_at?: string
          updated_at?: string
          brand?: string | null
          category?: string | null
          condition?: string | null
          location?: string | null
          negotiable?: boolean
          try_on_available?: boolean
          views?: number
          likes?: number
          tags?: string[] | null
          measurements?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          price?: number
          original_price?: number | null
          size?: string | null
          image_urls?: string[] | null
          status?: string
          created_at?: string
          updated_at?: string
          brand?: string | null
          category?: string | null
          condition?: string | null
          location?: string | null
          negotiable?: boolean
          try_on_available?: boolean
          views?: number
          likes?: number
          tags?: string[] | null
          measurements?: Json | null
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string | null
          sender_id: string
          receiver_id: string
          content: string
          sent_at: string
        }
        Insert: {
          id?: string
          conversation_id?: string | null
          sender_id: string
          receiver_id: string
          content: string
          sent_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string | null
          sender_id?: string
          receiver_id?: string
          content?: string
          sent_at?: string
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