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
          total_earned: number
          total_saved: number
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
          total_earned?: number
          total_saved?: number
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
          total_earned?: number
          total_saved?: number
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
          created_at: string
          updated_at: string
          shipping_address: {
            full_name: string
            address_line1: string
            address_line2?: string
            city: string
            state: string
            postal_code: string
            country: string
            phone: string
          }
          payment_method: {
            type: "card"
            last4: string
            exp_month: number
            exp_year: number
            brand: string
          }
          total_amount: number
          amount_saved: number
          payment_status: "pending" | "paid" | "failed"
          status: "pending_payment" | "processing" | "shipped" | "delivered" | "cancelled"
        }
        Insert: {
          id?: string
          user_id?: string // Will be set by RLS
          listing_id: string
          created_at?: string
          updated_at?: string
          shipping_address: {
            full_name: string
            address_line1: string
            address_line2?: string
            city: string
            state: string
            postal_code: string
            country: string
            phone: string
          }
          payment_method: {
            type: "card"
            last4: string
            exp_month: number
            exp_year: number
            brand: string
          }
          total_amount: number
          amount_saved: number
          payment_status?: "pending" | "paid" | "failed"
          status?: "pending_payment" | "processing" | "shipped" | "delivered" | "cancelled"
        }
        Update: {
          id?: string
          user_id?: string
          listing_id?: string
          created_at?: string
          updated_at?: string
          shipping_address?: {
            full_name: string
            address_line1: string
            address_line2?: string
            city: string
            state: string
            postal_code: string
            country: string
            phone: string
          }
          payment_method?: {
            type: "card"
            last4: string
            exp_month: number
            exp_year: number
            brand: string
          }
          total_amount?: number
          amount_saved?: number
          payment_status?: "pending" | "paid" | "failed"
          status?: "pending_payment" | "processing" | "shipped" | "delivered" | "cancelled"
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