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
          total_earnings: number | null
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
          total_earnings?: number | null
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
          total_earnings?: number | null
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
          images: string[] | null
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
          images?: string[] | null
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
          images?: string[] | null
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
      purchases: {
        Row: {
          id: string
          user_id: string
          listing_id: string
          status: string
          created_at: string
          updated_at: string
          shipping_address: Json | null
          tracking_number: string | null
          payment_status: string
          payment_method: string | null
          total_amount: number
        }
        Insert: {
          id?: string
          user_id: string
          listing_id: string
          status?: string
          created_at?: string
          updated_at?: string
          shipping_address?: Json | null
          tracking_number?: string | null
          payment_status?: string
          payment_method?: string | null
          total_amount: number
        }
        Update: {
          id?: string
          user_id?: string
          listing_id?: string
          status?: string
          created_at?: string
          updated_at?: string
          shipping_address?: Json | null
          tracking_number?: string | null
          payment_status?: string
          payment_method?: string | null
          total_amount?: number
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