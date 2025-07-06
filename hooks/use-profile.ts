import { useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export const useProfile = () => {
  const supabase = createClient()

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  }, [])

  const updateProfile = useCallback(async (userId: string, updates: Partial<Profile>) => {
    const updateData: ProfileUpdate = {
      name: updates.name,
      email: updates.email,
      avatar_url: updates.avatar_url,
      bio: updates.bio,
      location: updates.location,
      impact_score: updates.impact_score,
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }, [])

  const createProfile = useCallback(async (profile: Profile) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert([profile])
      .select()
      .single()

    if (error) throw error
    return data
  }, [])

  const fetchUserStats = useCallback(async (userId: string) => {
    // Fetch items sold
    const { count: itemsSold } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'sold')

    // Calculate impact metrics (example calculation)
    const co2Saved = (itemsSold || 0) * 2.5 // 2.5kg CO2 saved per item (example)
    const waterSaved = (itemsSold || 0) * 2000 // 2000L water saved per item (example)

    return {
      itemsSold: itemsSold || 0,
      co2Saved,
      waterSaved,
    }
  }, [])

  return {
    fetchProfile,
    updateProfile,
    createProfile,
    fetchUserStats,
  }
} 