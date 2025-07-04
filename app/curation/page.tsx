"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Package, Truck, CheckCircle, X, ArrowRight, Sparkles, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

// Mock curated items
const curatedItems = [
  {
    id: 1,
    title: "Vintage Denim Jacket",
    brand: "Levi's",
    originalPrice: 120,
    curatedPrice: 45,
    size: "M",
    condition: "Excellent",
    image: "/placeholder.svg?height=400&width=300",
    matchScore: 95,
    reasons: ["Matches your vintage style", "Perfect for layering", "Sustainable choice"],
    sustainability: {
      co2Saved: 12,
      waterSaved: 2500,
    },
    liked: false,
    decision: null as "keep" | "return" | null,
  },
  {
    id: 2,
    title: "Silk Camisole",
    brand: "Equipment",
    originalPrice: 85,
    curatedPrice: 35,
    size: "S",
    condition: "Like New",
    image: "/placeholder.svg?height=400&width=300",
    matchScore: 88,
    reasons: ["Great for layering", "Matches your color palette", "Versatile piece"],
    sustainability: {
      co2Saved: 8,
      waterSaved: 1800,
    },
    liked: true,
    decision: null as "keep" | "return" | null,
  },
  {
    id: 3,
    title: "High-Waist Mom Jeans",
    brand: "Citizens of Humanity",
    originalPrice: 200,
    curatedPrice: 75,
    size: "M",
    condition: "Very Good",
    image: "/placeholder.svg?height=400&width=300",
    matchScore: 92,
    reasons: ["Perfect fit for your size", "Trending style", "Quality denim"],
    sustainability: {
      co2Saved: 15,
      waterSaved: 3200,
    },
    liked: false,
    decision: null as "keep" | "return" | null,
  },
  {
    id: 4,
    title: "Cashmere Sweater",
    brand: "Everlane",
    originalPrice: 150,
    curatedPrice: 60,
    size: "M",
    condition: "Excellent",
    image: "/placeholder.svg?height=400&width=300",
    matchScore: 90,
    reasons: ["Luxury material", "Neutral color", "Perfect for fall"],
    sustainability: {
      co2Saved: 18,
      waterSaved: 4000,
    },
    liked: true,
    decision: null as "keep" | "return" | null,
  },
]

export default function CurationPage() {
  const [items, setItems] = useState(curatedItems)
  const [activeTab, setActiveTab] = useState("review")

  const toggleLike = (itemId: number) => {
    setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, liked: !item.liked } : item)))
  }

  const makeDecision = (itemId: number, decision: "keep" | "return") => {
    setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, decision } : item)))
  }

  const keptItems = items.filter((item) => item.decision === "keep")
  const returnedItems = items.filter((item) => item.decision === "return")
  const undecidedItems = items.filter((item) => item.decision === null)

  const totalKeptPrice = keptItems.reduce((sum, item) => sum + item.curatedPrice, 0)
  const totalSavings = keptItems.reduce((sum, item) => sum + (item.originalPrice - item.curatedPrice), 0)
  const totalImpact = {
    co2: keptItems.reduce((sum, item) => sum + item.sustainability.co2Saved, 0),
    water: keptItems.reduce((sum, item) => sum + item.sustainability.waterSaved, 0),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Package className="h-8 w-8" />
              <h1 className="text-4xl font-bold">Your Curated Box</h1>
            </div>
            <p className="text-xl text-green-100 mb-6">4 pieces handpicked by our AI based on your style profile</p>
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>Delivered from our warehouse</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                <span>7-day try-on period</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Only pay for what you keep</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="review">Review Items</TabsTrigger>
            <TabsTrigger value="decisions">My Decisions</TabsTrigger>
            <TabsTrigger value="checkout">Checkout</TabsTrigger>
          </TabsList>

          <TabsContent value="review" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Curated Items</h2>
              <p className="text-gray-600">Take your time to review each piece. You have 7 days to decide.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative">
                    <div className="aspect-[3/4] relative">
                      <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                      <button
                        onClick={() => toggleLike(item.id)}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <Heart
                          className={`h-5 w-5 transition-colors ${
                            item.liked ? "fill-red-500 text-red-500" : "text-gray-600"
                          }`}
                        />
                      </button>
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-purple-100 text-purple-800">{item.matchScore}% match</Badge>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.title}</h3>
                      <p className="text-gray-600">
                        {item.brand} • Size {item.size} • {item.condition}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl font-bold text-green-600">${item.curatedPrice}</span>
                      <span className="text-lg text-gray-500 line-through">${item.originalPrice}</span>
                      <Badge className="bg-green-100 text-green-800">
                        {Math.round(((item.originalPrice - item.curatedPrice) / item.originalPrice) * 100)}% OFF
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Why we picked this:</h4>
                      <ul className="space-y-1">
                        {item.reasons.map((reason, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <Sparkles className="h-3 w-3 text-purple-500" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg mb-4">
                      <h4 className="font-medium text-green-800 mb-1">Environmental Impact</h4>
                      <div className="text-sm text-green-700">
                        🌱 {item.sustainability.co2Saved}kg CO₂ saved • 💧 {item.sustainability.waterSaved}L water saved
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant={item.decision === "keep" ? "default" : "outline"}
                        className={`flex-1 ${item.decision === "keep" ? "bg-green-600 hover:bg-green-700" : "bg-transparent"}`}
                        onClick={() => makeDecision(item.id, "keep")}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Keep
                      </Button>
                      <Button
                        variant={item.decision === "return" ? "default" : "outline"}
                        className={`flex-1 ${item.decision === "return" ? "bg-red-600 hover:bg-red-700" : "bg-transparent"}`}
                        onClick={() => makeDecision(item.id, "return")}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Return
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="decisions" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Decisions</h2>
              <p className="text-gray-600">Review what you're keeping and returning</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Keeping */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    Keeping ({keptItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {keptItems.length > 0 ? (
                    <div className="space-y-4">
                      {keptItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            width={50}
                            height={50}
                            className="rounded object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.title}</h4>
                            <p className="text-sm text-gray-600">{item.brand}</p>
                          </div>
                          <span className="font-bold text-green-600">${item.curatedPrice}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No items selected to keep yet</p>
                  )}
                </CardContent>
              </Card>

              {/* Returning */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <X className="h-5 w-5" />
                    Returning ({returnedItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {returnedItems.length > 0 ? (
                    <div className="space-y-4">
                      {returnedItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            width={50}
                            height={50}
                            className="rounded object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.title}</h4>
                            <p className="text-sm text-gray-600">{item.brand}</p>
                          </div>
                          <span className="text-gray-500">Return</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No items selected to return yet</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {undecidedItems.length > 0 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="font-medium text-yellow-800 mb-2">
                      {undecidedItems.length} items still need your decision
                    </h3>
                    <p className="text-yellow-700 text-sm mb-4">
                      You have 5 days remaining to make your final decisions
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("review")}
                      className="bg-transparent border-yellow-300 text-yellow-800 hover:bg-yellow-100"
                    >
                      Review Items
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="checkout" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Checkout Summary</h2>
              <p className="text-gray-600">Review your final order and impact</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Summary */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {keptItems.length > 0 ? (
                      <div className="space-y-4">
                        {keptItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              width={80}
                              height={80}
                              className="rounded object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{item.title}</h4>
                              <p className="text-sm text-gray-600">
                                {item.brand} • Size {item.size}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="font-bold text-green-600">${item.curatedPrice}</span>
                                <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No items selected for purchase</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Payment Summary */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Items ({keptItems.length})</span>
                      <span>${totalKeptPrice}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>You saved</span>
                      <span>-${totalSavings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>FREE</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${totalKeptPrice}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-800">Your Impact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-green-700">CO₂ Saved</span>
                      <span className="font-bold text-green-800">{totalImpact.co2}kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Water Saved</span>
                      <span className="font-bold text-green-800">{totalImpact.water}L</span>
                    </div>
                    <div className="text-xs text-green-600 mt-2">
                      🌱 Equivalent to planting {Math.round(totalImpact.co2 / 5)} trees
                    </div>
                  </CardContent>
                </Card>

                <Button
                  className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg font-semibold"
                  disabled={keptItems.length === 0}
                >
                  Complete Purchase
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <SiteFooter />
    </div>
  )
}
