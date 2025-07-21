"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowRight, ArrowLeft, Sparkles, DollarSign, Package, Camera, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import SiteHeader from "@/components/site-header"

const onboardingSteps = ["Style Preferences", "Budget & Sizing"]

const styleCategories = [
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean lines, neutral colors, timeless pieces",
    image: "/placeholder.svg?height=200&width=200",
    tags: ["Clean", "Simple", "Timeless"],
  },
  {
    id: "vintage",
    name: "Vintage",
    description: "Retro pieces with character and history",
    image: "/placeholder.svg?height=200&width=200",
    tags: ["Retro", "Unique", "Character"],
  },
  {
    id: "bohemian",
    name: "Bohemian",
    description: "Free-spirited, flowing fabrics, earthy tones",
    image: "/placeholder.svg?height=200&width=200",
    tags: ["Flowy", "Earthy", "Free-spirited"],
  },
  {
    id: "professional",
    name: "Professional",
    description: "Polished looks for work and formal occasions",
    image: "/placeholder.svg?height=200&width=200",
    tags: ["Polished", "Formal", "Sharp"],
  },
  {
    id: "streetwear",
    name: "Streetwear",
    description: "Urban, casual, trendy everyday pieces",
    image: "/placeholder.svg?height=200&width=200",
    tags: ["Urban", "Casual", "Trendy"],
  },
  {
    id: "romantic",
    name: "Romantic",
    description: "Feminine, soft fabrics, delicate details",
    image: "/placeholder.svg?height=200&width=200",
    tags: ["Feminine", "Soft", "Delicate"],
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [budget, setBudget] = useState([100])
  const [sizes, setSizes] = useState<string[]>([])

  const handleStyleToggle = (styleId: string) => {
    setSelectedStyles((prev) => (prev.includes(styleId) ? prev.filter((id) => id !== styleId) : [...prev, styleId]))
  }

  const handleSizeToggle = (size: string) => {
    setSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]))
  }

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedStyles.length > 0
      case 1:
        return sizes.length > 0
      default:
        return true
    }
  }

  const handleComplete = () => {
    const queryParams = new URLSearchParams()
    if (selectedStyles.length > 0) {
      queryParams.set("styles", selectedStyles.join(","))
    }
    if (sizes.length > 0) {
      queryParams.set("sizes", sizes.join(","))
    }
    if (budget[0] > 0) {
      queryParams.set("maxPrice", budget[0].toString())
    }

    router.push(`/listings?${queryParams.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <SiteHeader />
      {/* Progress Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Welcome to Afriverse</h1>
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {onboardingSteps.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
            ></div>
          </div>

          {/* Step Labels */}
          <div className="flex justify-between mt-2">
            {onboardingSteps.map((step, index) => (
              <span
                key={step}
                className={`text-xs ${index <= currentStep ? "text-green-600 font-medium" : "text-gray-400"}`}
              >
                {step}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Style Preferences */}
          {currentStep === 0 && (
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Sparkles className="h-8 w-8 text-purple-600" />
                <h2 className="text-4xl font-bold text-gray-900">What's Your Style?</h2>
              </div>
              <p className="text-xl text-gray-600 mb-12">
                Select the styles that resonate with you, and we'll curate items that match your aesthetic.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {styleCategories.map((style) => (
                  <Card
                    key={style.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      selectedStyles.includes(style.id) ? "ring-2 ring-green-500 bg-green-50" : "hover:shadow-md"
                    }`}
                    onClick={() => handleStyleToggle(style.id)}
                  >
                    <CardContent className="p-6">
                      <div className="aspect-square mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={style.image || "/placeholder.svg"}
                          alt={style.name}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{style.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{style.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {style.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      {selectedStyles.includes(style.id) && (
                        <CheckCircle className="h-6 w-6 text-green-500 mt-3 mx-auto" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Budget & Sizing */}
          {currentStep === 1 && (
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-6">
                <DollarSign className="h-8 w-8 text-green-600" />
                <h2 className="text-4xl font-bold text-gray-900">Your Budget & Sizing</h2>
              </div>
              <p className="text-xl text-gray-600 mb-12">
                Set your one-time budget and select your clothing sizes.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Budget Slider */}
                <Card>
                  <CardHeader>
                    <CardTitle>Budget</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">${budget[0]}</div>
                      <p className="text-gray-600">up to this amount</p>
                    </div>
                    <Slider value={budget} onValueChange={setBudget} max={1000} min={0} step={50} className="w-full" />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>$0</span>
                      <span>$1000</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Clothing Sizes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Clothing Sizes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                        <Button
                          key={size}
                          variant={sizes.includes(size) ? "default" : "outline"}
                          onClick={() => handleSizeToggle(size)}
                          className="h-12"
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0} className="bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < onboardingSteps.length - 1 ? (
              <Button onClick={nextStep} disabled={!canProceed()} className="bg-green-600 hover:bg-green-700">
                Next Step
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8"
              >
                Start My Curation
                <Sparkles className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
