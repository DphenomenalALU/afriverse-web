"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star, MapPin, Bookmark, MessageCircle, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const featuredListings = [
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
    images: ["/placeholder.svg?height=400&width=400"],
    rating: 4.8,
    reviews: 23,
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
    images: ["/placeholder.svg?height=400&width=400"],
    rating: 4.9,
    reviews: 15,
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
    images: ["/placeholder.svg?height=400&width=400"],
    rating: 5.0,
    reviews: 8,
    tryOnAvailable: false,
  },
  {
    id: 4,
    title: "Leather Ankle Boots",
    brand: "Dr. Martens",
    price: 85,
    originalPrice: 160,
    condition: "Good",
    size: "8",
    seller: "Kemi O.",
    location: "Nairobi, Kenya",
    images: ["/placeholder.svg?height=400&width=400"],
    rating: 4.7,
    reviews: 31,
    tryOnAvailable: true,
  },
  {
    id: 5,
    title: "Cashmere Sweater",
    brand: "Uniqlo",
    price: 35,
    originalPrice: 80,
    condition: "Excellent",
    size: "L",
    seller: "Aisha B.",
    location: "Marrakech, Morocco",
    images: ["/placeholder.svg?height=400&width=400"],
    rating: 4.6,
    reviews: 12,
    tryOnAvailable: true,
  },
]

export default function ListingsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === featuredListings.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? featuredListings.length - 1 : prevIndex - 1))
  }

  const handleSaveItem = (itemId: number) => {
    console.log("Saving item:", itemId)
  }

  const handleBuyNow = (itemId: number) => {
    window.location.href = `/messages?item=${itemId}&action=buy`
  }

  const handleTryOn = (itemId: number) => {
    window.location.href = `/try-on?item=${itemId}`
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {featuredListings.map((item) => (
            <div key={item.id} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-2 md:px-3">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={item.images[0] || "/placeholder.svg"}
                    alt={item.title}
                    width={400}
                    height={300}
                    className="w-full h-48 md:h-64 object-cover"
                  />

                  <Badge className="absolute top-3 left-3 bg-white text-gray-900 text-xs">{item.condition}</Badge>

                  {item.tryOnAvailable && (
                    <Badge className="absolute top-3 right-3 bg-purple-600 text-white text-xs">
                      <Camera className="h-3 w-3 mr-1" />
                      Try-On
                    </Badge>
                  )}
                </div>

                <CardContent className="p-3 md:p-4">
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base line-clamp-1">{item.title}</h3>
                    <p className="text-xs md:text-sm text-gray-600">
                      {item.brand} • Size {item.size}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg md:text-xl font-bold text-green-600">${item.price}</span>
                    <span className="text-xs md:text-sm text-gray-500 line-through">${item.originalPrice}</span>
                    <Badge variant="secondary" className="text-xs">
                      {Math.round((1 - item.price / item.originalPrice) * 100)}% off
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs md:text-sm font-medium">{item.rating}</span>
                      <span className="text-xs md:text-sm text-gray-500">({item.reviews})</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-1 text-xs md:text-sm text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-1 md:gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleSaveItem(item.id)} className="text-xs p-2">
                      <Bookmark className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">Save</span>
                    </Button>

                    {item.tryOnAvailable && (
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
