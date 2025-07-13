"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Upload, X, DollarSign, Package, Camera, Tag, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

const categories = [
  "Dresses",
  "Tops & Blouses",
  "Pants & Jeans",
  "Skirts",
  "Jackets & Coats",
  "Shoes",
  "Bags & Accessories",
  "Jewelry",
]

const brands = ["Zara", "H&M", "Nike", "Adidas", "Levi's", "Gucci", "Prada", "Louis Vuitton", "Other"]

const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

const conditions = [
  { value: "new", label: "New with tags", description: "Brand new, never worn" },
  { value: "like-new", label: "Like new", description: "Worn once or twice, excellent condition" },
  { value: "excellent", label: "Excellent", description: "Gently used, no visible wear" },
  { value: "good", label: "Good", description: "Some signs of wear, still in great shape" },
  { value: "fair", label: "Fair", description: "Noticeable wear but still wearable" },
]

export default function CreateListingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  
  // Add initialization log
  console.log('CreateListingPage: Initializing with Supabase client', { 
    client: !!supabase,
    auth: !!supabase.auth 
  })

  const [images, setImages] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    brand: "",
    size: "",
    condition: "",
    originalPrice: "",
    sellingPrice: "",
    location: "",
    negotiable: false,
    tryOnAvailable: false,
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages((prev) => [...prev, e.target!.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('CreateListingPage: Starting form submission')
    
    try {
      console.log('CreateListingPage: Checking authentication')
      // Get current session first to compare
      const { data: sessionData } = await supabase.auth.getSession()
      console.log('CreateListingPage: Session check result:', {
        hasSession: !!sessionData.session,
        sessionUser: sessionData.session?.user?.id
      })
      
      // Get the current user using getUser()
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      console.log('CreateListingPage: User check result:', {
        hasUser: !!user,
        userId: user?.id,
        error: userError ? {
          message: userError.message,
          name: userError.name
        } : null
      })
      
      if (userError || !user) {
        console.log('CreateListingPage: Authentication failed, redirecting to login')
        toast({
          title: "Authentication required",
          description: "Please sign in to create a listing",
          variant: "destructive",
        })
        router.push('/auth/login')
        return
      }

      // Upload images to Supabase storage
      const imageUrls = []
      for (const imageDataUrl of images) {
        try {
          const { data: imageData, error: imageError } = await supabase.storage
            .from('listing-images')
            .upload(`${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}`, 
              await (await fetch(imageDataUrl)).blob(),
              { contentType: 'image/jpeg' }
            )

          if (imageError) {
            if (imageError.message.includes('Bucket not found')) {
              toast({
                title: "Storage not configured",
                description: "The storage system needs to be set up. Please contact support.",
                variant: "destructive",
              })
              return
            }
            throw imageError
          }
          
          // Get the public URL for the uploaded image
          const { data: { publicUrl } } = supabase.storage
            .from('listing-images')
            .getPublicUrl(imageData.path)
            
          imageUrls.push(publicUrl)
        } catch (uploadError) {
          console.error('CreateListingPage: Image upload error:', uploadError)
          toast({
            title: "Image upload failed",
            description: "Failed to upload one or more images. Please try again.",
            variant: "destructive",
          })
          return
        }
      }

      // Create the listing in the database
      const { error: listingError } = await supabase
        .from('listings')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          brand: formData.brand,
          size: formData.size,
          condition: formData.condition,
          price: parseFloat(formData.sellingPrice),
          original_price: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
          location: formData.location,
          negotiable: formData.negotiable,
          try_on_available: formData.tryOnAvailable,
          images: imageUrls, 
          status: 'active',
          views: 0,
          likes: 0,
        })

      if (listingError) {
        console.error('CreateListingPage: Database error:', listingError)
        toast({
          title: "Error saving listing",
          description: "Failed to save the listing to the database. Please try again.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Listing created successfully",
        description: "Your item has been listed for sale.",
      })

      router.push('/listings')
    } catch (error) {
      console.error('CreateListingPage: Error in form submission:', error)
      toast({
        title: "Error creating listing",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">List Your Item</h1>
            <p className="text-gray-600">
              Share your pre-loved fashion with our community and earn while promoting sustainability.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Photos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Upload ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {images.length < 8 && (
                    <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Add Photo</span>
                      <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
                <p className="text-sm text-gray-500">Add up to 8 photos. First photo will be your main image.</p>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Vintage Levi's Denim Jacket"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the item's condition, fit, styling tips, etc."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Category *</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => setFormData({ ...formData, category })}
                          className={`p-3 text-sm border rounded-lg transition-colors ${
                            formData.category === category
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Brand</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {brands.map((brand) => (
                        <button
                          key={brand}
                          type="button"
                          onClick={() => setFormData({ ...formData, brand })}
                          className={`p-3 text-sm border rounded-lg transition-colors ${
                            formData.brand === brand
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Size *</Label>
                    <div className="flex gap-2 mt-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setFormData({ ...formData, size })}
                          className={`px-4 py-2 text-sm border rounded-lg transition-colors ${
                            formData.size === size
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        placeholder="City, Country"
                        className="pl-10"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Condition */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Condition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.condition}
                  onValueChange={(value) => setFormData({ ...formData, condition: value })}
                >
                  {conditions.map((condition) => (
                    <div key={condition.value} className="flex items-start space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value={condition.value} id={condition.value} className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor={condition.value} className="font-medium">
                          {condition.label}
                        </Label>
                        <p className="text-sm text-gray-500 mt-1">{condition.description}</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="originalPrice">Original Price</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="originalPrice"
                        type="number"
                        placeholder="0"
                        className="pl-10"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="sellingPrice">Your Price *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="sellingPrice"
                        type="number"
                        placeholder="0"
                        className="pl-10"
                        value={formData.sellingPrice}
                        onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="negotiable"
                      checked={formData.negotiable}
                      onCheckedChange={(checked) => setFormData({ ...formData, negotiable: checked as boolean })}
                    />
                    <Label htmlFor="negotiable">Price is negotiable</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tryOnAvailable"
                      checked={formData.tryOnAvailable}
                      onCheckedChange={(checked) => setFormData({ ...formData, tryOnAvailable: checked as boolean })}
                    />
                    <Label htmlFor="tryOnAvailable">
                      Available for AR try-on
                      <Badge className="ml-2 bg-purple-100 text-purple-800">Premium</Badge>
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4">
              <Button type="button" variant="outline" className="flex-1 bg-transparent">
                Save as Draft
              </Button>
              <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                List Item
              </Button>
            </div>
          </form>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
