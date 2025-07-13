"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Grid3X3, List, Bookmark, MessageCircle, Camera, MapPin, Clock, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useListings } from "@/hooks/use-listings"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import ImageWithFallback from "@/components/ui/image-with-fallback"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

const categories = [
  "Dresses",
  "Tops",
  "Bottoms",
  "Outerwear",
  "Accessories",
  "Shoes",
  "Traditional",
]

const conditions = [
  "New with Tags",
  "Like New",
  "Very Good",
  "Good",
  "Fair",
]

const sizes = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "One Size",
]

// Add formatTimeAgo function
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (years > 0) return `${years} ${years === 1 ? 'year' : 'years'} ago`
  if (months > 0) return `${months} ${months === 1 ? 'month' : 'months'} ago`
  if (weeks > 0) return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
  if (days > 0) return `${days} ${days === 1 ? 'day' : 'days'} ago`
  if (hours > 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  if (minutes > 0) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
  return 'just now'
}

export default function ListingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const { listings, isLoading, error } = useListings({
    searchQuery,
    priceRange,
    categories: selectedCategories,
    conditions: selectedConditions,
    sizes: selectedSizes,
  })

  const handleAddToCart = async (listingId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        // Add to cart in database
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: session.user.id,
            listing_id: listingId,
            quantity: 1,
          })

        if (error) throw error

        toast({
          title: "Added to cart",
          description: "The item has been added to your cart.",
        })
      } else {
        // Add to cart in local storage
        const savedCart = localStorage.getItem('guest_cart') || '[]'
        const cartItems = JSON.parse(savedCart)
        const listing = listings.find(l => l.id === listingId)

        if (!listing) return

        // Update the cart item creation
        const newItem = {
          id: listingId,
          title: listing.title,
          price: listing.price,
          size: listing.size,
          image: listing.images?.[0],  // Change from image_urls to images
          quantity: 1,
        }

        cartItems.push(newItem)
        localStorage.setItem('guest_cart', JSON.stringify(cartItems))

        toast({
          title: "Added to cart",
          description: "The item has been added to your cart.",
        })
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast({
        title: "Error adding to cart",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleMessage = async (listingId: string) => {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to message sellers.",
      })
      router.push('/auth/login')
      return
    }

    router.push(`/messages?listing=${listingId}`)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <div className="container py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error loading listings</h2>
            <p className="text-gray-600 mb-6">Please try again later.</p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
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
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="bg-white">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Filter Listings</SheetTitle>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  {/* Price Range */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Price Range</h3>
                    <Slider
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      min={0}
                      max={1000}
                      step={10}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Categories */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center">
                          <Checkbox
                            id={`category-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={(checked) => {
                              setSelectedCategories(
                                checked
                                  ? [...selectedCategories, category]
                                  : selectedCategories.filter((c) => c !== category)
                              )
                            }}
                          />
                          <label
                            htmlFor={`category-${category}`}
                            className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Conditions */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Condition</h3>
                    <div className="space-y-2">
                      {conditions.map((condition) => (
                        <div key={condition} className="flex items-center">
                          <Checkbox
                            id={`condition-${condition}`}
                            checked={selectedConditions.includes(condition)}
                            onCheckedChange={(checked) => {
                              setSelectedConditions(
                                checked
                                  ? [...selectedConditions, condition]
                                  : selectedConditions.filter((c) => c !== condition)
                              )
                            }}
                          />
                          <label
                            htmlFor={`condition-${condition}`}
                            className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {condition}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Sizes */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Size</h3>
                    <div className="space-y-2">
                      {sizes.map((size) => (
                        <div key={size} className="flex items-center">
                          <Checkbox
                            id={`size-${size}`}
                            checked={selectedSizes.includes(size)}
                            onCheckedChange={(checked) => {
                              setSelectedSizes(
                                checked
                                  ? [...selectedSizes, size]
                                  : selectedSizes.filter((s) => s !== size)
                              )
                            }}
                          />
                          <label
                            htmlFor={`size-${size}`}
                            className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {size}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Button
              variant="outline"
              className="bg-white"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            >
              {viewMode === "grid" ? (
                <List className="h-4 w-4" />
              ) : (
                <Grid3X3 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedCategories.length > 0 ||
          selectedConditions.length > 0 ||
          selectedSizes.length > 0 ||
          priceRange[0] > 0 ||
          priceRange[1] < 1000) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedCategories.map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => setSelectedCategories(selectedCategories.filter((c) => c !== category))}
              >
                {category} ×
              </Badge>
            ))}
            {selectedConditions.map((condition) => (
              <Badge
                key={condition}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => setSelectedConditions(selectedConditions.filter((c) => c !== condition))}
              >
                {condition} ×
              </Badge>
            ))}
            {selectedSizes.map((size) => (
              <Badge
                key={size}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => setSelectedSizes(selectedSizes.filter((s) => s !== size))}
              >
                {size} ×
              </Badge>
            ))}
            {(priceRange[0] > 0 || priceRange[1] < 1000) && (
              <Badge
                variant="secondary"
                className="cursor-pointer"
                onClick={() => setPriceRange([0, 1000])}
              >
                ${priceRange[0]} - ${priceRange[1]} ×
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCategories([])
                setSelectedConditions([])
                setSelectedSizes([])
                setPriceRange([0, 1000])
              }}
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Listings Grid/List */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {isLoading && listings.length === 0 ? (
            // Only show skeleton if we don't have any listings yet
            Array.from({ length: 8 }).map((_, i) => (
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
            ))
          ) : listings.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No listings found</h2>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategories([])
                  setSelectedConditions([])
                  setSelectedSizes([])
                  setPriceRange([0, 1000])
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            listings.map((listing) => (
              <Card key={listing.id} className={viewMode === "list" ? "overflow-hidden" : ""}>
                <CardContent className={viewMode === "list" ? "p-4 flex gap-4" : "p-0"}>
                  <div
                    className={
                      viewMode === "list"
                        ? "relative w-40 h-40 flex-shrink-0"
                        : "relative aspect-square overflow-hidden"
                    }
                  >
                    <div className="absolute top-2 left-2 z-10">
                      <Badge variant="secondary" className="bg-white/90 text-gray-900">
                        {listing.condition}
                      </Badge>
                    </div>
                    {listing.try_on_available && (
                      <div className="absolute top-2 right-2 z-10">
                        <Badge className="bg-purple-600 text-white">
                          <Camera className="h-3 w-3 mr-1" />
                          Try-On
                        </Badge>
                      </div>
                    )}
                    <ImageWithFallback
                      src={listing.images?.[0] || '/placeholder.jpg'}
                      alt={listing.title}
                      width={viewMode === "list" ? 160 : 400}
                      height={viewMode === "list" ? 160 : 400}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className={viewMode === "list" ? "flex-1" : "p-4"}>
                    <h3 className="font-medium text-gray-900 text-lg mb-1">{listing.title}</h3>
                    <p className="text-gray-600">
                      {listing.brand} • Size {listing.size}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xl font-bold text-green-600">${listing.price}</span>
                      {listing.original_price && (
                        <>
                          <span className="text-gray-500 line-through">${listing.original_price}</span>
                          <Badge variant="secondary">
                            {Math.round((1 - listing.price / listing.original_price) * 100)}% off
                          </Badge>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                        <span>{listing.likes || 0}</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {listing.location || 'Location not specified'}
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-gray-500">
                      by {(listing as any).profiles?.name || 'Anonymous'} • {listing.created_at && formatTimeAgo(new Date(listing.created_at))}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddToCart(listing.id)}
                        className="w-full"
                      >
                        <Bookmark className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      {listing.try_on_available && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/try-on?item=${listing.id}`)}
                          className="w-full text-purple-600 border-purple-200 hover:bg-purple-50"
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Try
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => handleMessage(listing.id)}
                        className={`w-full bg-green-600 hover:bg-green-700 ${listing.try_on_available ? 'col-span-2' : 'col-span-1'}`}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Buy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

      </div>

      <SiteFooter />
    </div>
  )
}
