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
          rating: number
          rating_count: number
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
          rating?: number
          rating_count?: number
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
          rating?: number
          rating_count?: number
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
          status: "active" | "pending" | "sold" | "archived"
          created_at: string
          updated_at: string
          brand: string | null
          category: string | null
          condition: string | null
          location: string | null
          try_on_available: boolean
          views: number
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
          status?: "active" | "pending" | "sold" | "archived"
          created_at?: string
          updated_at?: string
          brand?: string | null
          category?: string | null
          condition?: string | null
          location?: string | null
          try_on_available?: boolean
          views?: number
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
          status?: "active" | "pending" | "sold" | "archived"
          created_at?: string
          updated_at?: string
          brand?: string | null
          category?: string | null
          condition?: string | null
          location?: string | null
          try_on_available?: boolean
          views?: number
          tags?: string[] | null
          measurements?: Json | null
        }
      }
      purchases: {
        Row: {
          id: string
          user_id: string
          listing_id: string
          status: "pending" | "accepted" | "payment_pending" | "payment_confirmed" | "completed"
          created_at: string
          updated_at: string
          shipping_address: Json | null
          tracking_number: string | null
          payment_status: "pending" | "paid" | "confirmed"
          payment_method: string | null
          total_amount: number
          rating: number | null
          rating_submitted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          listing_id: string
          status?: "pending" | "accepted" | "payment_pending" | "payment_confirmed" | "completed"
          created_at?: string
          updated_at?: string
          shipping_address?: Json | null
          tracking_number?: string | null
          payment_status?: "pending" | "paid" | "confirmed"
          payment_method?: string | null
          total_amount: number
          rating?: number | null
          rating_submitted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          listing_id?: string
          status?: "pending" | "accepted" | "payment_pending" | "payment_confirmed" | "completed"
          created_at?: string
          updated_at?: string
          shipping_address?: Json | null
          tracking_number?: string | null
          payment_status?: "pending" | "paid" | "confirmed"
          payment_method?: string | null
          total_amount?: number
          rating?: number | null
          rating_submitted_at?: string | null
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
          type: "text" | "system" | "price" | "rating"
          metadata: Json | null
        }
        Insert: {
          id?: string
          conversation_id?: string | null
          sender_id: string
          receiver_id: string
          content: string
          sent_at?: string
          type?: "text" | "system" | "price" | "rating"
          metadata?: Json | null
        }
        Update: {
          id?: string
          conversation_id?: string | null
          sender_id?: string
          receiver_id?: string
          content?: string
          sent_at?: string
          type?: "text" | "system" | "price" | "rating"
          metadata?: Json | null
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