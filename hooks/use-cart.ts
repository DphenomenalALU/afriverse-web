"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface CartItem {
  id: string
  title: string
  price: number
  size: string
  image: string
  try_on_enabled: boolean
  condition: string
  location: string
  original_price: number
}

interface ListingWithQuantity {
  id: string
  listings: {
    id: string
    title: string
    price: number
    size: string
    image_urls: string[]
    try_on_enabled: boolean
    condition: string
    location: string
    original_price: number
  }
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadCart()

    // Subscribe to cart changes
    const channel = supabase
      .channel('cart_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart_items',
        },
        () => {
          loadCart()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const loadCart = async () => {
    try {
      setIsLoading(true)
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        // Load cart from database
        const { data, error } = await supabase
          .from('cart_items')
          .select(`
            id,
            listings!inner (
              id,
              title,
              price,
              size,
              image_urls,
              try_on_enabled,
              condition,
              location,
              original_price
            )
          `)
          .eq('user_id', session.user.id)
          .returns<ListingWithQuantity[]>()

        if (error) throw error

        setCartItems(data.map(item => ({
          id: item.id,
          title: item.listings.title,
          price: item.listings.price,
          size: item.listings.size,
          image: item.listings.image_urls[0],
          try_on_enabled: item.listings.try_on_enabled || false,
          condition: item.listings.condition || 'New',
          location: item.listings.location || 'Unknown',
          original_price: item.listings.original_price || item.listings.price,
        })))
      } else {
        // Load cart from local storage for guest users
        const savedCart = localStorage.getItem('guest_cart')
        if (savedCart) {
          setCartItems(JSON.parse(savedCart))
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isItemSaved = async (listingId: string) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return cartItems.some(item => item.id === listingId)

    const { data } = await supabase
      .from('cart_items')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('listing_id', listingId)
      .single()

    return !!data
  }

  const addToCart = async (listing: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        // Optimistically update UI
        const newItem = {
          id: listing.id,
          title: listing.title,
          price: listing.price,
          size: listing.size,
          image: listing.images?.[0] || listing.image_urls?.[0],
          try_on_enabled: listing.try_on_enabled || false,
          condition: listing.condition || 'New',
          location: listing.location || 'Unknown',
          original_price: listing.original_price || listing.price,
        }
        setCartItems(prev => [...prev, newItem])

        // Add to database in background
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: session.user.id,
            listing_id: listing.id,
          })

        if (error) {
          // Revert UI if operation fails
          setCartItems(prev => prev.filter(item => item.id !== listing.id))
          throw error
        }
      } else {
        // Add to local storage
        const newItem = {
          id: listing.id,
          title: listing.title,
          price: listing.price,
          size: listing.size,
          image: listing.images?.[0] || listing.image_urls?.[0],
          try_on_enabled: listing.try_on_enabled || false,
          condition: listing.condition || 'New',
          location: listing.location || 'Unknown',
          original_price: listing.original_price || listing.price,
        }
        const updatedItems = [...cartItems, newItem]
        localStorage.setItem('guest_cart', JSON.stringify(updatedItems))
        setCartItems(updatedItems)
      }

      return { success: true }
    } catch (error) {
      console.error('Error adding to cart:', error)
      return { success: false, error }
    }
  }

  const removeFromCart = async (itemId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        // Optimistically update UI
        setCartItems(prev => prev.filter(item => item.id !== itemId))

        // Remove from database in background
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('listing_id', itemId)
          .eq('user_id', session.user.id)

        if (error) {
          // Revert UI if operation fails
          const { data } = await supabase
            .from('cart_items')
            .select('*')
            .eq('listing_id', itemId)
            .single()
          if (data) setCartItems(prev => [...prev, data])
          throw error
        }
      } else {
        // Remove from local storage
        const updatedItems = cartItems.filter(item => item.id !== itemId)
        localStorage.setItem('guest_cart', JSON.stringify(updatedItems))
        setCartItems(updatedItems)
      }

      return { success: true }
    } catch (error) {
      console.error('Error removing from cart:', error)
      return { success: false, error }
    }
  }

  return {
    cartItems,
    isLoading,
    addToCart,
    removeFromCart,
    loadCart,
    isItemSaved,
  }
} 