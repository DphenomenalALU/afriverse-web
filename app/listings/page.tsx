"use client"

import { useState } from "react"
import { Search, Filter, Grid3X3, List, Bookmark, MessageCircle, Camera, MapPin, Clock, Star, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import ImageWithFallback from "@/components/ui/image-with-fallback"

// Mock data for listings
const mockListings = [
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
    images: ["/placeholder.svg?height=400&width=400"],
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
    images: ["/placeholder.svg?height=400&width=400"],
    rating: 5.0,
    reviews: 8,
    postedTime: "1 day ago",
    category: "accessories",
    tags: ["luxury", "silk", "designer"],
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
    postedTime: "3 days ago",
    category: "shoes",
    tags: ["leather", "boots", "classic"],
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
    postedTime: "1 week ago",
    category: "sweaters",
    tags: ["cashmere", "warm", "luxury"],
    tryOnAvailable: true,
  },
  {
    id: 6,
    title: "High-Waist Jeans",
    brand: "Citizens of Humanity",
    price: 55,
    originalPrice: 140,
    condition: "Very Good",
    size: "29",
    seller: "Zara M.",
    location: "Cape Town, South Africa",
    images: ["/placeholder.svg?height=400&width=400"],
    rating: 4.8,
    reviews: 19,
    postedTime: "2 weeks ago",
    category: "jeans",
    tags: ["high-waist", "denim", "sustainable"],
    tryOnAvailable: true,
  },
]

const categories = ["All Categories", "Dresses", "Tops", "Bottoms", "Jackets", "Shoes", "Accessories", "Bags"]

const conditions = ["Like New", "Excellent", "Very Good", "Good", "Fair"]

const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

export default function ListingsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")

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
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="container py-4 md:py-8 px-4">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Shop Sustainable Fashion</h1>
          <p className="text-gray-600">Discover pre-loved pieces from conscious sellers worldwide</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Filters Sidebar - Mobile Overlay */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)}></div>
              <div className="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-white overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filters
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Mobile Filter Content */}
                  <div className="space-y-6">
                    {/* Search */}
                    <div>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search items..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                      <Slider value={priceRange} onValueChange={setPriceRange} max={500} step={5} className="mb-2" />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>

                    {/* Categories */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                      <div className="space-y-2">
                        {categories.slice(1).map((category) => (
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

                    {/* Size */}
                    <div>
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
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </h3>

                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
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
                    {categories.slice(1).map((category) => (
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

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{mockListings.length} items found</span>
                <Button variant="outline" size="sm" onClick={() => setShowFilters(true)} className="lg:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              <div className="flex items-center gap-2 md:gap-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs md:text-sm border border-gray-300 rounded-md px-2 md:px-3 py-1.5 bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>

                {/* View Toggle */}
                <div className="hidden md:flex border border-gray-300 rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Listings Grid */}
            <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {mockListings.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <ImageWithFallback
                      src={item.images[0] || "/placeholder.svg"}
                      alt={item.title}
                      width={400}
                      height={400}
                      className="w-full h-48 md:h-64 object-cover"
                      fallbackClassName="w-full h-48 md:h-64 rounded-t-lg"
                    />

                    {/* Condition Badge */}
                    <Badge className="absolute top-3 left-3 bg-white text-gray-900 text-xs">{item.condition}</Badge>

                    {/* Try-On Badge */}
                    {item.tryOnAvailable && (
                      <Badge className="absolute top-3 right-3 bg-purple-600 text-white text-xs">
                        <Camera className="h-3 w-3 mr-1" />
                        Try-On
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-3 md:p-4">
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600">
                        {item.brand} • Size {item.size}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg md:text-2xl font-bold text-green-600">${item.price}</span>
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

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs md:text-sm text-gray-600">by {item.seller}</span>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center gap-1 text-xs md:text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        {item.postedTime}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-1 md:gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSaveItem(item.id)}
                        className="text-xs p-2"
                      >
                        <Bookmark className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">Save</span>
                      </Button>

                      {item.tryOnAvailable ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTryOn(item.id)}
                          className="text-xs border-purple-200 text-purple-600 hover:bg-purple-50 p-2"
                        >
                          <Camera className="h-3 w-3 mr-1" />
                          <span className="hidden sm:inline">Try</span>
                        </Button>
                      ) : (
                        <div></div>
                      )}

                      <Button
                        size="sm"
                        onClick={() => handleBuyNow(item.id)}
                        className="text-xs bg-green-600 hover:bg-green-700 text-white p-2"
                      >
                        <MessageCircle className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">Buy</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-8 md:mt-12 text-center">
              <Button variant="outline" size="lg">
                Load More Items
              </Button>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
