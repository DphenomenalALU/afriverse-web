"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star, MapPin, Bookmark, MessageCircle, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { useListings } from "@/hooks/use-listings"
import ImageWithFallback from "@/components/ui/image-with-fallback"

export default function ListingsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [savedStates, setSavedStates] = useState<Record<string, boolean>>({})
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({})
  const { cartItems, addToCart, removeFromCart, isItemSaved } = useCart()
  const { toast } = useToast()
  const { listings, isLoading } = useListings()

  // Load initial saved states and like counts
  useEffect(() => {
    if (listings) {
      listings.forEach(async (item) => {
        const saved = await isItemSaved(item.id)
        setSavedStates(prev => ({ ...prev, [item.id]: saved }))
        setLikeCounts(prev => ({ ...prev, [item.id]: Math.max(0, item.likes || 0) }))
      })
    }
  }, [listings])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === listings.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? listings.length - 1 : prevIndex - 1))
  }

  const handleSaveItem = async (item: any) => {
    try {
      const saved = await isItemSaved(item.id)
      if (saved) {
        // Optimistically update UI
        setSavedStates(prev => ({ ...prev, [item.id]: false }))
        
        const result = await removeFromCart(item.id)
        if (!result.success) {
          // Revert UI if operation fails
          setSavedStates(prev => ({ ...prev, [item.id]: true }))
          toast({
            title: "Error removing item",
            description: "Please try again",
            variant: "destructive",
          })
        }
      } else {
        // Optimistically update UI
        setSavedStates(prev => ({ ...prev, [item.id]: true }))
        
        const result = await addToCart(item)
        if (!result.success) {
          // Revert UI if operation fails
          setSavedStates(prev => ({ ...prev, [item.id]: false }))
          toast({
            title: "Error saving item",
            description: "Please try again",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error toggling cart item:", error)
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    }
  }

  const handleBuyNow = (itemId: string) => {
    window.location.href = `/messages?item=${itemId}&action=buy`
  }

  const handleTryOn = (itemId: string) => {
    window.location.href = `/try-on?item=${itemId}`
  }

  if (isLoading || listings.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="animate-pulse">
                <div className="h-64 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {listings.map((item) => (
            <div key={item.id} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-2 md:px-3">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow max-w-md mx-auto">
                <div className="relative w-full aspect-[4/3]">
                  <ImageWithFallback
                    src={item.images?.[0] || "/placeholder.jpg"}
                    alt={item.title}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                  />

                  <Badge className="absolute top-3 left-3 bg-white/90 text-gray-900 text-xs">{item.condition}</Badge>

                  {item.try_on_available && (
                    <Badge className="absolute top-3 right-3 bg-purple-600 text-white text-xs">
                      <Camera className="h-3 w-3 mr-1" />
                      Try-On
                    </Badge>
                  )}
                </div>

                <CardContent className="pt-1.6 px-2 pb-2">
                  <div className="space-y-0.5">
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-1">{item.title}</h3>
                    <p className="text-xs md:text-sm text-gray-600">
                      {item.brand} • Size {item.size}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg md:text-xl font-bold text-green-600">${item.price}</span>
                    {item.original_price && (
                      <>
                        <span className="text-xs md:text-sm text-gray-500 line-through">${item.original_price}</span>
                        <Badge variant="secondary" className="text-xs">
                          {Math.round((1 - item.price / item.original_price) * 100)}% off
                        </Badge>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs md:text-sm font-medium">{likeCounts[item.id] || 0}</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-1 text-xs md:text-sm text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{item.location || 'Location not specified'}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-1 md:gap-2">
                    <Button 
                      size="sm" 
                      variant={savedStates[item.id] ? "default" : "outline"} 
                      onClick={() => handleSaveItem(item)} 
                      className={`text-xs p-2 ${
                        savedStates[item.id] 
                          ? 'bg-black hover:bg-black/90 text-white' 
                          : ''
                      }`}
                    >
                      <Bookmark className={`h-3 w-3 mr-1 ${savedStates[item.id] ? 'fill-current' : ''}`} />
                      <span className="hidden sm:inline">{savedStates[item.id] ? 'Saved' : 'Save'}</span>
                    </Button>

                    {item.try_on_available && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTryOn(item.id)}
                        className="text-xs border-purple-200 text-purple-600 hover:bg-purple-50 p-2"
                      >
                        <Camera className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">Try</span>
                      </Button>
                    )}

                    <Button
                      size="sm"
                      onClick={() => handleBuyNow(item.id)}
                      className="text-xs bg-green-600 hover:bg-green-700 col-span-1 p-2"
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">Buy</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 md:left-0 top-1/2 transform -translate-y-1/2 md:-translate-x-4 bg-white shadow-lg h-8 w-8 md:h-10 md:w-10"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 md:right-0 top-1/2 transform -translate-y-1/2 md:translate-x-4 bg-white shadow-lg h-8 w-8 md:h-10 md:w-10"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
