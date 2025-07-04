"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, ShoppingBag, ArrowLeft, Star, MapPin, MessageCircle, Camera, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

// Mock saved items
const mockSavedItems = [
  {
    id: 1,
    title: "Vintage Levi's Denim Jacket",
    brand: "Levi's",
    price: 45,
    originalPrice: 120,
    condition: "Excellent",
    size: "M",
    seller: "Sarah M.",
    location: "Lagos, Nigeria",
    images: ["/placeholder.svg?height=300&width=300"],
    rating: 4.8,
    reviews: 23,
    savedDate: "2 days ago",
    tryOnAvailable: true,
  },
  {
    id: 2,
    title: "Floral Summer Dress",
    brand: "Zara",
    price: 25,
    originalPrice: 65,
    condition: "Very Good",
    size: "S",
    seller: "Amara K.",
    location: "Accra, Ghana",
    images: ["/placeholder.svg?height=300&width=300"],
    rating: 4.9,
    reviews: 15,
    savedDate: "1 week ago",
    tryOnAvailable: true,
  },
  {
    id: 3,
    title: "Designer Silk Scarf",
    brand: "Hermès",
    price: 180,
    originalPrice: 350,
    condition: "Like New",
    size: "One Size",
    seller: "Fatima A.",
    location: "Cairo, Egypt",
    images: ["/placeholder.svg?height=300&width=300"],
    rating: 5.0,
    reviews: 8,
    savedDate: "3 days ago",
    tryOnAvailable: false,
  },
]

export default function CartPage() {
  const [savedItems, setSavedItems] = useState(mockSavedItems)

  const handleRemoveItem = (itemId: number) => {
    setSavedItems(savedItems.filter((item) => item.id !== itemId))
  }

  const handleBuyNow = (itemId: number) => {
    window.location.href = `/messages?item=${itemId}&action=buy`
  }

  const handleTryOn = (itemId: number) => {
    window.location.href = `/try-on?item=${itemId}`
  }

  const totalValue = savedItems.reduce((sum, item) => sum + item.price, 0)
  const totalSavings = savedItems.reduce((sum, item) => sum + (item.originalPrice - item.price), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="container py-4 md:py-8 px-4">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/listings">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Saved Items</h1>
          <p className="text-gray-600">Items you've saved for later comparison and purchase</p>
        </div>

        {savedItems.length === 0 ? (
          /* Empty State */
          <Card className="text-center py-8 md:py-12">
            <CardContent>
              <ShoppingBag className="h-12 w-12 md:h-16 md:w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">No saved items yet</h3>
              <p className="text-gray-600 mb-4 md:mb-6">
                Start browsing and save items you're interested in for easy comparison
              </p>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/listings">Browse Items</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Saved Items List */}
            <div className="lg:col-span-2 space-y-4">
              {savedItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative mx-auto sm:mx-0 flex-shrink-0">
                        <Image
                          src={item.images[0] || "/placeholder.svg"}
                          alt={item.title}
                          width={120}
                          height={120}
                          className="rounded-lg object-cover w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32"
                        />

                        {item.tryOnAvailable && (
                          <Badge className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs">
                            <Camera className="h-3 w-3 mr-1" />
                            Try-On
                          </Badge>
                        )}
                      </div>

                      <div className="flex-1 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">{item.title}</h3>
                            <p className="text-xs md:text-sm text-gray-600">
                              {item.brand} • Size {item.size}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-gray-400 hover:text-red-500 mt-2 sm:mt-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                          <span className="text-lg md:text-2xl font-bold text-green-600">${item.price}</span>
                          <span className="text-xs md:text-sm text-gray-500 line-through">${item.originalPrice}</span>
                          <Badge variant="secondary" className="text-xs">
                            {Math.round((1 - item.price / item.originalPrice) * 100)}% off
                          </Badge>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs md:text-sm font-medium">{item.rating}</span>
                            <span className="text-xs md:text-sm text-gray-500">({item.reviews})</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs md:text-sm text-gray-600">
                            <MapPin className="h-3 w-3" />
                            {item.location}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                          <div className="text-xs md:text-sm text-gray-500 text-center sm:text-left">
                            Saved {item.savedDate} • by {item.seller}
                          </div>

                          <div className="flex gap-2 w-full sm:w-auto">
                            {item.tryOnAvailable && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleTryOn(item.id)}
                                className="border-purple-200 text-purple-600 hover:bg-purple-50 flex-1 sm:flex-none"
                              >
                                <Camera className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                                <span className="text-xs md:text-sm">Try-On</span>
                              </Button>
                            )}

                            <Button
                              size="sm"
                              onClick={() => handleBuyNow(item.id)}
                              className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                            >
                              <MessageCircle className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                              <span className="text-xs md:text-sm">Buy Now</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="lg:sticky lg:top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <Heart className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
                    Saved Items Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Items:</span>
                      <span className="font-medium">{savedItems.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Value:</span>
                      <span className="font-medium text-green-600">${totalValue}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Savings:</span>
                      <span className="font-medium text-red-600">${totalSavings}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Quick Actions</h4>
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        // Start bulk negotiation with all sellers
                        const itemIds = savedItems.map((item) => item.id).join(",")
                        window.location.href = `/messages?items=${itemIds}&action=bulk_buy`
                      }}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact All Sellers
                    </Button>

                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <Link href="/listings">
                        <Plus className="h-4 w-4 mr-2" />
                        Add More Items
                      </Link>
                    </Button>
                  </div>

                  <Separator />

                  <div className="text-xs text-gray-500 space-y-1">
                    <p>
                      💡 <strong>Tip:</strong> Items in your saved list may sell quickly!
                    </p>
                    <p>🔒 All purchases are protected by Afriverse escrow</p>
                    <p>📱 Try-on available items with AR technology</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  )
}
