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
    loadLocalCart()
    
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

  const isItemSaved = (itemId: string): boolean => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (!savedCart) return false
    const items = JSON.parse(savedCart)
    return items.some((item: CartItem) => item.id === itemId)
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

      // Update local storage first for immediate feedback
      const updatedItems = [...cartItems, newItem]
      saveLocalCart(updatedItems)

      // Sync with database in background if user is logged in
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: session.user.id,
            listing_id: listing.id,
          })
        
        if (error) {
          console.error('Background sync error:', error)
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Error adding to cart:', error)
      return { success: false, error }
    }
  }

  const removeFromCart = async (itemId: string) => {
    try {
      // Update local storage first for immediate feedback
      const updatedItems = cartItems.filter(item => item.id !== itemId)
      saveLocalCart(updatedItems)

      // Sync with database in background if user is logged in
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('listing_id', itemId)
          .eq('user_id', session.user.id)
        
        if (error) {
          console.error('Background sync error:', error)
        }
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
    isItemSaved,
  }
} 