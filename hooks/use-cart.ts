"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface CartItem {
  id: string
  title: string
  price: number
  size: string
  image: string
  try_on_available: boolean
  try_on_enabled: boolean
  condition: string
  location: string
  original_price: number
  brand: string
  seller_name: string
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
    try_on_available: boolean
    condition: string
    location: string
    original_price: number
    brand: string
    profiles: {
      name: string
    }
  }
}

const CART_STORAGE_KEY = 'afriverse_cart'

// Create a custom event for cart updates
const CART_UPDATE_EVENT = 'afriverse_cart_update'
const emitCartUpdate = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CART_UPDATE_EVENT, { detail: items }))
  }
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  // Load cart from localStorage on mount and listen for updates
  useEffect(() => {
    loadCart()
    
    // Listen for cart updates from other components
    const handleCartUpdate = (event: CustomEvent<CartItem[]>) => {
      setCartItems(event.detail)
    }
    
    window.addEventListener(CART_UPDATE_EVENT as any, handleCartUpdate as any)
    return () => {
      window.removeEventListener(CART_UPDATE_EVENT as any, handleCartUpdate as any)
    }
  }, [])

  const loadLocalCart = () => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const items = JSON.parse(savedCart)
        setCartItems(items)
        emitCartUpdate(items)
      }
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading local cart:', error)
      setIsLoading(false)
    }
  }

  const saveLocalCart = (items: CartItem[]) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
      setCartItems(items)
      emitCartUpdate(items)
    } catch (error) {
      console.error('Error saving to local cart:', error)
    }
  }

  // Sync localStorage cart with database
  const syncWithDatabase = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Get cart items from database
      const { data: dbItems } = await supabase
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

      if (!dbItems) return

      // Convert DB items to CartItem format
      const dbCartItems = dbItems.map(item => ({
        id: item.listings.id,
        title: item.listings.title,
        price: item.listings.price,
        size: item.listings.size,
        image: item.listings.image_urls[0],
        try_on_enabled: item.listings.try_on_enabled || false,
        try_on_available: item.listings.try_on_available || false,
        condition: item.listings.condition || 'New',
        location: item.listings.location || 'Unknown',
        original_price: item.listings.original_price || item.listings.price,
        brand: item.listings.brand || 'Unknown',
        seller_name: item.listings.profiles?.name || 'Anonymous'
      }))

      // Merge local and DB items
      const localItems = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]')
      const mergedItems = [...new Map([...localItems, ...dbCartItems].map(item => [item.id, item])).values()]
      
      // Update localStorage and state
      saveLocalCart(mergedItems)
      setCartItems(mergedItems)

      // Sync back to database
      const localItemIds = new Set(localItems.map((item: CartItem) => item.id))
      const dbItemIds = new Set(dbCartItems.map(item => item.id))

      // Add new local items to DB
      const itemsToAdd = localItems.filter((item: CartItem) => !dbItemIds.has(item.id))
      if (itemsToAdd.length > 0) {
        await supabase
          .from('cart_items')
          .insert(itemsToAdd.map((item: CartItem) => ({
            user_id: session.user.id,
            listing_id: item.id
          })))
      }

      // Remove items from DB that aren't in local
      const itemsToRemove = dbCartItems.filter(item => !localItemIds.has(item.id))
      if (itemsToRemove.length > 0) {
        await supabase
          .from('cart_items')
          .delete()
          .in('listing_id', itemsToRemove.map(item => item.id))
          .eq('user_id', session.user.id)
      }
    } catch (error) {
      console.error('Error syncing with database:', error)
    }
  }

  const loadCart = async () => {
    // First load from localStorage for instant response
    loadLocalCart()
    // Then sync with database in background
    await syncWithDatabase()
  }

  const isItemSaved = (listingId: string) => {
    return cartItems.some(item => item.id === listingId)
  }

  const addToCart = async (listing: any) => {
    try {
      const newItem = {
        id: listing.id,
        title: listing.title,
        price: listing.price,
        size: listing.size,
        image: listing.images?.[0] || listing.image_urls?.[0],
        try_on_enabled: listing.try_on_enabled || false,
        try_on_available: listing.try_on_available || false,
        condition: listing.condition || 'New',
        location: listing.location || 'Unknown',
        original_price: listing.original_price || listing.price,
        brand: listing.brand || 'Unknown',
        seller_name: listing.profiles?.name || 'Anonymous'
      }

      const updatedItems = [...cartItems, newItem]
      saveLocalCart(updatedItems)

      // Sync with database in background
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        await supabase
          .from('cart_items')
          .insert({
            user_id: session.user.id,
            listing_id: listing.id,
          })
          .throwOnError()
      }

      return { success: true }
    } catch (error) {
      console.error('Error adding to cart:', error)
      return { success: false, error }
    }
  }

  const removeFromCart = async (itemId: string) => {
    try {
      const updatedItems = cartItems.filter(item => item.id !== itemId)
      saveLocalCart(updatedItems)

      // Sync with database in background
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('listing_id', itemId)
          .eq('user_id', session.user.id)
          .throwOnError()
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