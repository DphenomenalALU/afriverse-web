import { useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'
import type { Listing } from '@/lib/types'

type ListingRow = Database['public']['Tables']['listings']['Row']
type ListingInsert = Database['public']['Tables']['listings']['Insert']

export const useListings = () => {
  const supabase = createClient()

  const createListing = useCallback(async (listing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'seller'>) => {
    const listingData: ListingInsert = {
      user_id: listing.sellerId,
      title: listing.title,
      description: listing.description,
      brand: listing.brand,
      category: listing.category,
      size: listing.size,
      condition: listing.condition,
      price: listing.price,
      original_price: listing.originalPrice,
      image_urls: listing.images,
      tags: listing.tags,
      status: listing.status,
      negotiable: false,
      try_on_available: false,
      views: 0,
      likes: 0,
      measurements: listing.measurements,
    }

    const { data, error } = await supabase
      .from('listings')
      .insert([listingData])
      .select()
      .single()

    if (error) throw error
    return data
  }, [])

  const fetchListings = useCallback(async () => {
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        seller:profiles(id, name, avatar_url)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }, [])

  const fetchListingById = useCallback(async (id: string) => {
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        seller:profiles(id, name, avatar_url)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }, [])

  const updateListing = useCallback(async (id: string, updates: Partial<Listing>) => {
    const { data, error } = await supabase
      .from('listings')
      .update({
        title: updates.title,
        description: updates.description,
        brand: updates.brand,
        category: updates.category,
        size: updates.size,
        condition: updates.condition,
        price: updates.price,
        original_price: updates.originalPrice,
        image_urls: updates.images,
        tags: updates.tags,
        status: updates.status,
        measurements: updates.measurements,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }, [])

  const deleteListing = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id)

    if (error) throw error
  }, [])

  return {
    createListing,
    fetchListings,
    fetchListingById,
    updateListing,
    deleteListing,
  }
} 