"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Search,
  Filter,
  MapPin,
  Star,
  Clock,
  Bookmark,
  MessageCircle,
  Camera,
  SlidersHorizontal,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

// Mock search results
const mockResults = [
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
    postedTime: "2 hours ago",
    category: "jackets",
    tags: ["vintage", "denim", "classic"],
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
    postedTime: "5 hours ago",
    category: "dresses",
    tags: ["floral", "summer", "casual"],
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
    postedTime: "1 day ago",
    category: "accessories",
    tags: ["luxury", "silk", "designer"],
    tryOnAvailable: false,
  },
]

const categories = ["Dresses", "Tops", "Bottoms", "Jackets", "Shoes", "Accessories", "Bags"]

const conditions = ["Like New", "Excellent", "Very Good", "Good", "Fair"]

const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("relevance")

  const handleSaveItem = (itemId: number) => {
    console.log("Saving item:", itemId)
  }

  const handleBuyNow = (itemId: number) => {
    window.location.href = `/messages?item=${itemId}&action=buy`
  }

  const handleTryOn = (itemId: number) => {
    window.location.href = `/try-on?item=${itemId}`
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedConditions([])
    setSelectedSizes([])
    setPriceRange([0, 500])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="container py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Results</h1>

          {/* Search Bar */}
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for items, brands, or styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="h-12 px-6">
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filters
            </Button>
          </div>

          {/* Active Filters */}
          {(selectedCategories.length > 0 || selectedConditions.length > 0 || selectedSizes.length > 0) && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-600">Active filters:</span>
              {selectedCategories.map((category) => (
                <Badge key={category} variant="secondary" className="gap-1">
                  {category}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedCategories(selectedCategories.filter((c) => c !== category))}
                  />
                </Badge>
              ))}
              {selectedConditions.map((condition) => (
                <Badge key={condition} variant="secondary" className="gap-1">
                  {condition}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedConditions(selectedConditions.filter((c) => c !== condition))}
                  />
                </Badge>
              ))}
              {selectedSizes.map((size) => (
                <Badge key={size} variant="secondary" className="gap-1">
                  Size {size}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedSizes(selectedSizes.filter((s) => s !== size))}
                  />
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filters
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)} className="lg:hidden">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                    <Slider value={priceRange} onValueChange={setPriceRange} max={500} step={5} className="mb-2" />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={category}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCategories([...selectedCategories, category])
                              } else {
                                setSelectedCategories(selectedCategories.filter((c) => c !== category))
                              }
                            }}
                          />
                          <label htmlFor={category} className="text-sm text-gray-700 cursor-pointer">
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Condition */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Condition</h4>
                    <div className="space-y-2">
                      {conditions.map((condition) => (
                        <div key={condition} className="flex items-center space-x-2">
                          <Checkbox
                            id={condition}
                            checked={selectedConditions.includes(condition)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedConditions([...selectedConditions, condition])
                              } else {
                                setSelectedConditions(selectedConditions.filter((c) => c !== condition))
                              }
                            }}
                          />
                          <label htmlFor={condition} className="text-sm text-gray-700 cursor-pointer">
                            {condition}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Size */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Size</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {sizes.map((size) => (
                        <Button
                          key={size}
                          variant={selectedSizes.includes(size) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (selectedSizes.includes(size)) {
                              setSelectedSizes(selectedSizes.filter((s) => s !== size))
                            } else {
                              setSelectedSizes([...selectedSizes, size])
                            }
                          }}
                          className="h-8"
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{mockResults.length} results found</span>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white"
              >
                <option value="relevance">Most Relevant</option>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockResults.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image
                      src={item.images[0] || "/placeholder.svg"}
                      alt={item.title}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover"
                    />

                    <Badge className="absolute top-3 left-3 bg-white text-gray-900">{item.condition}</Badge>

                    {item.tryOnAvailable && (
                      <Badge className="absolute top-3 right-3 bg-purple-600 text-white">
                        <Camera className="h-3 w-3 mr-1" />
                        Try-On
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600">
                        {item.brand} • Size {item.size}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl font-bold text-green-600">${item.price}</span>
                      <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>
                      <Badge variant="secondary" className="text-xs">
                        {Math.round((1 - item.price / item.originalPrice) * 100)}% off
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{item.rating}</span>
                        <span className="text-sm text-gray-500">({item.reviews})</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        {item.location}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm text-gray-600">by {item.seller}</span>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        {item.postedTime}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleSaveItem(item.id)} className="flex-1">
                        <Bookmark className="h-4 w-4 mr-1" />
                        Save
                      </Button>

                      {item.tryOnAvailable && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTryOn(item.id)}
                          className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50"
                        >
                          <Camera className="h-4 w-4 mr-1" />
                          Try-On
                        </Button>
                      )}

                      <Button
                        size="sm"
                        onClick={() => handleBuyNow(item.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Buy Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg">
                Load More Results
              </Button>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
