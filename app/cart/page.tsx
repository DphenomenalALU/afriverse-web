"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/hooks/use-toast"
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import type { Database } from "@/lib/supabase/types"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import ImageWithFallback from "@/components/ui/image-with-fallback"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

interface CartItem {
  id: string
  title: string
  price: number
  size: string
  image: string
  quantity: number
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

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        // Update quantity in database
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: newQuantity })
          .eq('id', itemId)

        if (error) throw error
      }

      // Update quantity in state and local storage
      const updatedItems = cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
      localStorage.setItem('guest_cart', JSON.stringify(updatedItems))
      setCartItems(updatedItems)
    } catch (error) {
      console.error('Error updating quantity:', error)
      toast({
        title: "Error updating quantity",
        description: "Please try again later.",
        variant: "destructive",
      })
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
        description: "The item has been removed from your cart.",
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

  const handleCheckout = async () => {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      // Save cart to local storage
      localStorage.setItem('guest_cart', JSON.stringify(cartItems))
      
      toast({
        title: "Sign in required",
        description: "Please sign in to complete your purchase.",
      })
      
      router.push('/auth/login')
      return
    }

    // TODO: Implement checkout process
    router.push('/checkout')
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 10 // Fixed shipping cost
  const total = subtotal + shipping

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <div className="container py-8">
          <div className="max-w-4xl mx-auto">
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
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <ShoppingBag className="h-6 w-6 text-gray-600" />
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <span className="text-gray-500">({cartItems.length} items)</span>
          </div>

          {cartItems.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                  <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
                  <Button onClick={() => router.push('/listings')}>
                    Browse Listings
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="divide-y">
                    {cartItems.map((item) => (
                      <div key={item.id} className="py-6 first:pt-4 last:pb-4">
                        <div className="flex gap-4">
                          <div className="relative w-24 h-24">
                            <ImageWithFallback
                              src={item.image}
                              alt={item.title}
                              width={96}
                              height={96}
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{item.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">Size: {item.size}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <select
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                  className="rounded-md border-gray-300 text-sm"
                                >
                                  {[1, 2, 3, 4, 5].map((num) => (
                                    <option key={num} value={num}>
                                      {num}
                                    </option>
                                  ))}
                                </select>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeItem(item.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <span className="font-medium text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium text-gray-900">${shipping.toFixed(2)}</span>
                      </div>
                      <Separator className="my-4" />
                      <div className="flex justify-between text-base font-semibold">
                        <span className="text-gray-900">Total</span>
                        <span className="text-green-600">${total.toFixed(2)}</span>
                      </div>
                    </div>
                    <Button
                      onClick={handleCheckout}
                      className="w-full mt-6 bg-green-600 hover:bg-green-700"
                    >
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
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
