"use client"

import { useState } from "react"
import { Medal, Award, Crown, Star, Recycle, Users, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

// Mock leaderboard data
const topSellers = [
  {
    id: 1,
    name: "Amara K.",
    location: "Lagos, Nigeria",
    avatar: "/placeholder.svg?height=40&width=40",
    itemsSold: 247,
    co2Saved: 1250,
    earnings: 8420,
    badge: "Eco Champion",
    rank: 1,
  },
  {
    id: 2,
    name: "Kemi A.",
    location: "Accra, Ghana",
    avatar: "/placeholder.svg?height=40&width=40",
    itemsSold: 198,
    co2Saved: 980,
    earnings: 6750,
    badge: "Green Warrior",
    rank: 2,
  },
  {
    id: 3,
    name: "Fatima M.",
    location: "Nairobi, Kenya",
    avatar: "/placeholder.svg?height=40&width=40",
    itemsSold: 176,
    co2Saved: 890,
    earnings: 5920,
    badge: "Sustainability Star",
    rank: 3,
  },
  {
    id: 4,
    name: "Zara T.",
    location: "Cape Town, SA",
    avatar: "/placeholder.svg?height=40&width=40",
    itemsSold: 154,
    co2Saved: 770,
    earnings: 5100,
    badge: "Circular Hero",
    rank: 4,
  },
  {
    id: 5,
    name: "Aisha B.",
    location: "Casablanca, Morocco",
    avatar: "/placeholder.svg?height=40&width=40",
    itemsSold: 142,
    co2Saved: 710,
    earnings: 4680,
    badge: "Impact Maker",
    rank: 5,
  },
]

const topBuyers = [
  {
    id: 1,
    name: "Sarah L.",
    location: "London, UK",
    avatar: "/placeholder.svg?height=40&width=40",
    itemsBought: 89,
    co2Saved: 445,
    saved: 3200,
    badge: "Eco-conscious Consumer",
    rank: 1,
  },
  {
    id: 2,
    name: "Maya P.",
    location: "New York, USA",
    avatar: "/placeholder.svg?height=40&width=40",
    itemsBought: 76,
    co2Saved: 380,
    saved: 2850,
    badge: "Sustainable Shopper",
    rank: 2,
  },
  {
    id: 3,
    name: "Emma R.",
    location: "Toronto, Canada",
    avatar: "/placeholder.svg?height=40&width=40",
    itemsBought: 68,
    co2Saved: 340,
    saved: 2400,
    badge: "Eco Enthusiast",
    rank: 3,
  },
  {
    id: 4,
    name: "Lisa K.",
    location: "Sydney, Australia",
    avatar: "/placeholder.svg?height=40&width=40",
    itemsBought: 61,
    co2Saved: 305,
    saved: 2100,
    badge: "Green Guardian",
    rank: 4,
  },
  {
    id: 5,
    name: "Anna S.",
    location: "Berlin, Germany",
    avatar: "/placeholder.svg?height=40&width=40",
    itemsBought: 55,
    co2Saved: 275,
    saved: 1950,
    badge: "Planet Protector",
    rank: 5,
  },
]

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-6 w-6 text-yellow-500" />
    case 2:
      return <Medal className="h-6 w-6 text-gray-400" />
    case 3:
      return <Award className="h-6 w-6 text-amber-600" />
    default:
      return <Star className="h-6 w-6 text-gray-300" />
  }
}

const getRankBg = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200"
    case 2:
      return "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200"
    case 3:
      return "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200"
    default:
      return "bg-white border-gray-200"
  }
}

export default function ImpactPage() {
  const [activeTab, setActiveTab] = useState("sellers")

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="container py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Leaderboards</h2>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="sellers">Top Sellers</TabsTrigger>
            <TabsTrigger value="buyers">Top Buyers</TabsTrigger>
          </TabsList>

          <TabsContent value="sellers" className="space-y-6">
            <div className="text-center mb-8">
              <p className="text-gray-600">Leading the circular economy by giving clothes new life</p>
            </div>

            <div className="space-y-4">
              {topSellers.map((seller) => (
                <Card key={seller.id} className={`${getRankBg(seller.rank)} transition-all hover:shadow-lg`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm">
                          {getRankIcon(seller.rank)}
                        </div>
                        <div className="text-2xl font-bold text-gray-900">#{seller.rank}</div>
                      </div>

                      <Avatar className="h-16 w-16">
                        <AvatarImage src={seller.avatar || "/placeholder.svg"} alt={seller.name} />
                        <AvatarFallback>
                          {seller.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-bold text-gray-900">{seller.name}</h4>
                          <Badge className="bg-green-100 text-green-800">{seller.badge}</Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{seller.location}</p>

                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <div className="text-2xl font-bold text-green-600">{seller.itemsSold}</div>
                            <div className="text-sm text-gray-500">Items Sold</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">{seller.co2Saved}kg</div>
                            <div className="text-sm text-gray-500">CO₂ Saved</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-purple-600">${seller.earnings}</div>
                            <div className="text-sm text-gray-500">Earned</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="buyers" className="space-y-6">
            <div className="text-center mb-8">
              <p className="text-gray-600">Champions of conscious consumption and sustainable shopping</p>
            </div>

            <div className="space-y-4">
              {topBuyers.map((buyer) => (
                <Card key={buyer.id} className={`${getRankBg(buyer.rank)} transition-all hover:shadow-lg`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm">
                          {getRankIcon(buyer.rank)}
                        </div>
                        <div className="text-2xl font-bold text-gray-900">#{buyer.rank}</div>
                      </div>

                      <Avatar className="h-16 w-16">
                        <AvatarImage src={buyer.avatar || "/placeholder.svg"} alt={buyer.name} />
                        <AvatarFallback>
                          {buyer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-bold text-gray-900">{buyer.name}</h4>
                          <Badge className="bg-blue-100 text-blue-800">{buyer.badge}</Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{buyer.location}</p>

                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <div className="text-2xl font-bold text-green-600">{buyer.itemsBought}</div>
                            <div className="text-sm text-gray-500">Items Bought</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">{buyer.co2Saved}kg</div>
                            <div className="text-sm text-gray-500">CO₂ Saved</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-purple-600">${buyer.saved}</div>
                            <div className="text-sm text-gray-500">Money Saved</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Achievement Badges */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Achievement Badges</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Unlock special badges as you contribute to the sustainable fashion movement
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Recycle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Eco Champion</h3>
              <p className="text-sm text-gray-600">Sell 200+ items</p>
            </Card>

            <Card className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Community Builder</h3>
              <p className="text-sm text-gray-600">Refer 50+ friends</p>
            </Card>

            <Card className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Impact Maker</h3>
              <p className="text-sm text-gray-600">Save 1000kg CO₂</p>
            </Card>

            <Card className="text-center p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Sustainability Star</h3>
              <p className="text-sm text-gray-600">Top 1% performer</p>
            </Card>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
