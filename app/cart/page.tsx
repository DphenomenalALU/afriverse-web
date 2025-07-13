"use client"

import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Trash2, ShoppingBag, ArrowLeft, Camera, MessageCircle, Shield, Sparkles } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import ImageWithFallback from "@/components/ui/image-with-fallback"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"

export default function CartPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { cartItems, isLoading, removeFromCart } = useCart()

  const removeItem = async (itemId: string) => {
    try {
      const result = await removeFromCart(itemId)
      if (result.success) {
        toast({
          title: "Item removed",
          description: "The item has been removed from your saved items.",
        })
      } else {
        throw new Error("Failed to remove item")
      }
    } catch (error) {
      console.error('Error removing item:', error)
      toast({
        title: "Error removing item",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleBuyNow = (itemId: string) => {
    router.push(`/messages?item=${itemId}&action=buy`)
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0)
  const savings = cartItems.reduce((sum, item) => sum + ((item.original_price || 0) - item.price), 0)

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
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Saved Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row gap-6">
                        {/* Image container - make it shorter on mobile */}
                        <div className="relative w-full sm:w-48 h-36 sm:h-48 flex-shrink-0">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.title}
                            width={192}
                            height={192}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <Badge className="absolute top-2 left-2 bg-white/90 text-gray-900 text-xs">
                            {item.condition}
                          </Badge>
                        </div>
                        <div className="flex-1 min-w-0">
                          {/* Top section with remove button */}
                          <div className="flex justify-between items-start gap-4">
                            <div className="min-w-0">
                              <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {item.brand} • Size {item.size}
                              </p>
                              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                <span>{item.location}</span>
                              </div>
                              <div className="mt-1 text-sm text-gray-500">
                                by {item.seller_name} 
                              </div>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Mobile price section */}
                          <div className="block sm:hidden mt-4">
                            <div className="text-lg font-bold text-green-600">${item.price}</div>
                            {item.original_price && item.original_price > item.price && (
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-gray-500 line-through">
                                  ${item.original_price}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  {Math.round((1 - item.price / item.original_price) * 100)}% off
                                </Badge>
                              </div>
                            )}
                          </div>

                          {/* Actions and desktop price section */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-4 gap-4">
                            <div className="flex flex-col sm:flex-row gap-3">
                              {item.try_on_available && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => router.push(`/try-on?item=${item.id}`)}
                                  className="text-purple-600 border-purple-200 hover:bg-purple-50 w-full sm:w-auto justify-center"
                                >
                                  <Camera className="h-4 w-4 mr-2" />
                                  Try On
                                </Button>
                              )}
                              <Button
                                size="sm"
                                onClick={() => handleBuyNow(item.id)}
                                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto justify-center"
                              >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Buy Now
                              </Button>
                            </div>
                            {/* Desktop price section */}
                            <div className="hidden sm:block text-right flex-shrink-0">
                              <div className="text-lg font-bold text-green-600">${item.price}</div>
                              {item.original_price && item.original_price > item.price && (
                                <>
                                  <div className="text-sm text-gray-500 line-through">
                                    ${item.original_price}
                                  </div>
                                  <Badge variant="secondary" className="text-xs">
                                    {Math.round((1 - item.price / item.original_price) * 100)}% off
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Summary */}
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">${subtotal}</span>
                      </div>
                      {savings > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Total Savings</span>
                          <span className="font-medium">${savings}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${subtotal}</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-6" 
                      size="lg" 
                      onClick={() => router.push('/listings')}
                    >
                      Add More Items
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-medium">Secure Messaging</h4>
                        <p className="text-sm text-gray-600">Chat directly with sellers</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      <div>
                        <h4 className="font-medium">Try Before You Buy</h4>
                        <p className="text-sm text-gray-600">Virtual try-on available</p>
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
