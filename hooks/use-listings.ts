import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/supabase/types'

export type Listing = Database['public']['Tables']['listings']['Row']

interface UseListingsOptions {
  priceRange?: [number, number]
  categories?: string[]
  conditions?: string[]
  sizes?: string[]
  searchQuery?: string
}

interface UseListingsReturn {
  listings: Listing[]
  isLoading: boolean
  error: Error | null
  createListing: (listing: Omit<Listing, 'id' | 'created_at' | 'updated_at' | 'seller_id'>) => Promise<Listing>
  fetchListings: () => Promise<void>
  fetchListingById: (id: string) => Promise<Listing | null>
  updateListing: (id: string, updates: Partial<Listing>) => Promise<Listing>
  deleteListing: (id: string) => Promise<void>
}

export function useListings(options: UseListingsOptions = {}): UseListingsReturn {
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    fetchListings()
  }, [options])

  const fetchListings = async () => {
    try {
      setIsLoading(true)
      setError(null)

      let query = supabase
        .from('listings')
        .select('*')

      // Apply filters
      if (options.priceRange) {
        query = query
          .gte('price', options.priceRange[0])
          .lte('price', options.priceRange[1])
      }

      if (options.categories?.length) {
        query = query.in('category', options.categories)
      }

      if (options.conditions?.length) {
        query = query.in('condition', options.conditions)
      }

      if (options.sizes?.length) {
        query = query.in('size', options.sizes)
      }

      if (options.searchQuery) {
        query = query.textSearch('title', options.searchQuery)
      }

      const { data, error } = await query

      if (error) throw error

      setListings(data || [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch listings'))
    } finally {
      setIsLoading(false)
    }
  }

  const createListing = async (listing: Omit<Listing, 'id' | 'created_at' | 'updated_at' | 'seller_id'>) => {
    const { data, error } = await supabase
      .from('listings')
      .insert(listing)
      .select()
      .single()

    if (error) throw error
    return data
  }

  const fetchListingById = async (id: string) => {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  const updateListing = async (id: string, updates: Partial<Listing>) => {
    const { data, error } = await supabase
      .from('listings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  const deleteListing = async (id: string) => {
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  return {
    listings,
    isLoading,
    error,
    createListing,
    fetchListings,
    fetchListingById,
    updateListing,
    deleteListing,
  }
} 