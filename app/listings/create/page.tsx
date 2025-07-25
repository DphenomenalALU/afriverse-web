"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Upload, X, DollarSign, Package, Camera, Tag, MapPin, CheckCircle, Loader2 } from "lucide-react"
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { generate3DModel } from "@/lib/actions"

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

const styles = ["Minimalist", "Vintage", "Bohemian", "Professional", "Streetwear", "Romantic"]

const brands = ["Zara", "Nike", "Adidas", "Levi's", "Gucci", "Prada", "Louis Vuitton", "Other"]

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
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
    style: "",
  })
  const [isGenerating3D, setIsGenerating3D] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isGenerating3D && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating3D, timeRemaining]);

  useEffect(() => {
    // Reset timer when generation starts
    if (isGenerating3D) {
      setTimeRemaining(300);
    }
  }, [isGenerating3D]);

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
    setIsSubmitting(true)

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

      // First create the listing without 3D model
      const { data: listing, error: listingError } = await supabase
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
          try_on_available: false,
          images: imageUrls, 
          status: 'active',
          views: 0,
          style: formData.style.toLowerCase(),
          model_3d: null,
          measurements: {},
          tags: []
        })
        .select()
        .single();

      if (listingError) {
        console.error('CreateListingPage: Database error:', listingError)
        toast({
          title: "Error saving listing",
          description: "Failed to save the listing to the database. Please try again.",
          variant: "destructive",
        })
        return
      }

      // If it's a bag/accessory, generate 3D model after listing creation
      if (formData.category === "Bags & Accessories" && imageUrls.length > 0) {
        setIsGenerating3D(true);
        try {
          console.log('Starting 3D model generation for:', imageUrls[0]);
          const result = await generate3DModel(imageUrls[0], user.id);
          console.log('3D model generation result:', result);
          
          if (result.success && result.url) {
            // Update the listing with the 3D model URL and try_on_available
            const { error: updateError } = await supabase
              .from('listings')
              .update({
                model_3d: result.url,
                try_on_available: true
              })
              .eq('id', listing.id);

            if (updateError) {
              console.error('Failed to update listing with 3D model:', updateError);
              toast({
                title: "Warning",
                description: "Listing created but 3D model could not be saved.",
                variant: "destructive",
              });
            }
          } else {
            console.error('3D model generation failed:', result.error);
            toast({
              title: "Warning",
              description: "Listing created but 3D model generation failed.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('3D model generation error:', error);
          toast({
            title: "Warning",
            description: "Listing created but 3D model generation failed.",
            variant: "destructive",
          });
        } finally {
          setIsGenerating3D(false);
        }
      }

      setIsSuccess(true);
    } catch (error) {
      console.error('CreateListingPage: Error in form submission:', error)
      toast({
        title: "Error creating listing",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      category: e.target.value
    }));
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md p-6 text-center shadow-lg">
            <CardContent className="pt-6">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
              <p className="text-gray-600 mb-6">Your product has been listed.</p>
              <Button
                onClick={() => router.push("/listings")}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Continue to Listings
              </Button>
            </CardContent>
          </Card>
        </main>
        <SiteFooter />
      </div>
    )
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

                <div>
                  <Label>Style *</Label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
                    {styles.map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setFormData({ ...formData, style })}
                        className={`p-3 text-sm border rounded-lg transition-colors ${
                          formData.style === style
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
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
                    <div className="relative mt-2">
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

                <div className="space-y-4"></div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4">
              <Button type="button" variant="outline" className="flex-1 bg-transparent">
                Save as Draft
              </Button>
              <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Listing Item...
                  </>
                ) : (
                  "List Item"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <SiteFooter />

      <Dialog open={isGenerating3D} onOpenChange={setIsGenerating3D}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center text-gray-900 dark:text-white">
              Generating 3D Model
            </DialogTitle>
            <DialogDescription className="text-center space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                We're creating a 3D version of your product for virtual try-on. This process may take up to 5 minutes.
              </p>
              <div className="flex flex-col items-center justify-center py-6">
                <div className="w-24 h-24 relative">
                  <div className="absolute inset-0 border-4 border-green-200 rounded-full"></div>
                  <div 
                    className="absolute inset-0 border-4 border-green-600 rounded-full animate-spin"
                    style={{ 
                      borderRightColor: 'transparent',
                      borderBottomColor: 'transparent'
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-semibold text-green-600">
                      {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
                <div className="mt-4 w-full max-w-xs bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((300 - timeRemaining) / 300) * 100}%` }}
                  ></div>
                </div>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Please keep this window open
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
