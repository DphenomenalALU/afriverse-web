"use client"

import { useState } from "react"
import Image from "next/image"
import { Sparkles, Heart, ShoppingBag, Zap, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock AI recommendations
const recommendations = [
  {
    id: 1,
    title: "Perfect Match for Your Style",
    items: [
      {
        id: 1,
        title: "Vintage Leather Jacket",
        brand: "AllSaints",
        price: 120,
        originalPrice: 300,
        image: "/placeholder.svg?height=200&width=200",
        matchScore: 95,
        reason: "Matches your edgy vintage style",
      },
      {
        id: 2,
        title: "High-Waist Mom Jeans",
        brand: "Levi's",
        price: 65,
        originalPrice: 150,
        image: "/placeholder.svg?height=200&width=200",
        matchScore: 92,
        reason: "Perfect with your jacket collection",
      },
    ],
  },
  {
    id: 2,
    title: "Complete the Look",
    items: [
      {
        id: 3,
        title: "Silk Camisole",
        brand: "Equipment",
        price: 45,
        originalPrice: 120,
        image: "/placeholder.svg?height=200&width=200",
        matchScore: 88,
        reason: "Great layering piece for your wardrobe",
      },
      {
        id: 4,
        title: "Statement Earrings",
        brand: "Mejuri",
        price: 35,
        originalPrice: 85,
        image: "/placeholder.svg?height=200&width=200",
        matchScore: 85,
        reason: "Adds elegance to casual outfits",
      },
    ],
  },
  {
    id: 3,
    title: "Trending in Your Size",
    items: [
      {
        id: 5,
        title: "Oversized Blazer",
        brand: "Zara",
        price: 55,
        originalPrice: 120,
        image: "/placeholder.svg?height=200&width=200",
        matchScore: 90,
        reason: "Hot trend, perfect for work & casual",
      },
      {
        id: 6,
        title: "Midi Slip Dress",
        brand: "Reformation",
        price: 85,
        originalPrice: 200,
        image: "/placeholder.svg?height=200&width=200",
        matchScore: 87,
        reason: "Versatile piece for any occasion",
      },
    ],
  },
]

interface AIRecommendationsProps {
  className?: string
}

export default function AIRecommendations({ className = "" }: AIRecommendationsProps) {
  const [likedItems, setLikedItems] = useState<number[]>([])

  const toggleLike = (itemId: number) => {
    setLikedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const getMatchColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100"
    if (score >= 80) return "text-yellow-600 bg-yellow-100"
    return "text-gray-600 bg-gray-100"
  }

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">AI Style Recommendations</h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Our AI analyzes your style preferences, purchase history, and trending items to suggest perfect matches for
          your wardrobe.
        </p>
      </div>

      {recommendations.map((section) => (
        <Card key={section.id} className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className={`${getMatchColor(item.matchScore)} border-0`}>{item.matchScore}% match</Badge>
                    </div>
                    <button
                      onClick={() => toggleLike(item.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <Heart
                        className={`h-4 w-4 transition-colors ${
                          likedItems.includes(item.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.brand}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-gray-900">${item.price}</span>
                      <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                        {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                      </Badge>
                    </div>
                    <div className="flex items-start gap-2 mb-4">
                      <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600">{item.reason}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        Try On
                      </Button>
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                        <ShoppingBag className="h-3 w-3 mr-1" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Style Insights */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Your Style Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">Vintage</div>
              <div className="text-sm text-gray-600">Your top style</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">M</div>
              <div className="text-sm text-gray-600">Most purchased size</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">$45-85</div>
              <div className="text-sm text-gray-600">Your price range</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
