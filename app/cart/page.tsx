"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/hooks/use-toast"
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Heart, MessageCircle, Plus, AlertCircle, Shield, Sparkles } from "lucide-react"
import type { Database } from "@/lib/supabase/types"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import ImageWithFallback from "@/components/ui/image-with-fallback"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"

interface CartItem {
  id: string
  title: string
  price: number
  size: string
  image: string
  quantity: number
  try_on_enabled: boolean
  condition: string
  location: string
  original_price: number
}

interface CartItemWithListing {
  id: string
  quantity: number
  listings: {
    id: string
    title: string
    price: number
    size: string
    image_urls: string[]
  }
}

export default function CartPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient<Database>()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCart()
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
            quantity,
            listings!inner (
              id,
              title,
              price,
              size,
              image_urls
            )
          `)
          .eq('user_id', session.user.id)
          .returns<CartItemWithListing[]>()

        if (error) throw error

        setCartItems(data.map(item => ({
          id: item.id,
          title: item.listings.title,
          price: item.listings.price,
          size: item.listings.size,
          image: item.listings.image_urls[0],
          quantity: item.quantity,
          try_on_enabled: false, // Placeholder, needs actual data
          condition: "New", // Placeholder
          location: "Nairobi", // Placeholder
          original_price: item.listings.price, // Placeholder
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
      toast({
        title: "Error loading cart",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        // Remove item from database
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', itemId)

        if (error) throw error
      }

      // Remove item from state and local storage
      const updatedItems = cartItems.filter(item => item.id !== itemId)
      localStorage.setItem('guest_cart', JSON.stringify(updatedItems))
      setCartItems(updatedItems)

      toast({
        title: "Item removed",
        description: "The item has been removed from your saved items.",
      })
    } catch (error) {
      console.error('Error removing item:', error)
      toast({
        title: "Error removing item",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0)
  const savings = cartItems.reduce((sum, item) => sum + (item.original_price - item.price), 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <div className="container py-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </button>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Saved Items</h1>
          <p className="text-gray-600 mb-8">Items you've saved for later comparison and purchase</p>

          {cartItems.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">No saved items yet</h2>
                  <p className="text-gray-600 mb-6">Start exploring to find items you love</p>
                  <Button onClick={() => router.push('/listings')}>
                    Browse Listings
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Saved Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="relative w-32 h-32">
                          {item.try_on_enabled && (
                            <Badge 
                              className="absolute top-2 left-2 bg-purple-500 text-white"
                              variant="secondary"
                            >
                              Try-On
                            </Badge>
                          )}
                          <ImageWithFallback
                            src={item.image}
                            alt={item.title}
                            width={128}
                            height={128}
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-900">{item.title}</h3>
                              <p className="text-sm text-gray-600">Size: {item.size}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline">{item.condition}</Badge>
                                <Badge variant="outline">{item.location}</Badge>
                              </div>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-4">
                              {item.try_on_enabled && (
                                <Button variant="outline" size="sm" onClick={() => router.push(`/try-on?item=${item.id}`)}>
                                  Try-On
                                </Button>
                              )}
                              <Button size="sm" onClick={() => router.push(`/listings/${item.id}`)}>
                                Buy Now
                              </Button>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold text-green-600">${item.price}</div>
                              {item.original_price > item.price && (
                                <div className="text-sm text-gray-500 line-through">
                                  ${item.original_price}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Summary Card */}
              <div>
                <Card>
                  <CardContent className="p-6">
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                      <Heart className="h-5 w-5 text-gray-600" />
                      Saved Items Summary
                    </h2>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Items:</span>
                        <span className="font-medium text-gray-900">{cartItems.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Value:</span>
                        <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Savings:</span>
                        <span className="font-medium text-green-600">${savings.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="mt-6 space-y-3">
                      <Button 
                        onClick={() => {}} 
                        className="w-full flex items-center justify-center gap-2"
                        variant="outline"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Contact All Sellers
                      </Button>
                      <Button 
                        onClick={() => router.push('/listings')} 
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add More Items
                      </Button>
                    </div>
                    <div className="mt-6 space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                        Items in your saved list may sell quickly!
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-500" />
                        All purchases are protected by Afriverse escrow
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-500" />
                        Try-on available items with AR technology
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
