"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowRight, ArrowLeft, Sparkles, Heart, DollarSign, Package, Camera, CheckCircle } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const onboardingSteps = [
  "Style Preferences",
  "Budget & Frequency",
  "Size & Fit",
  "Sustainability Goals",
]

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

const sustainabilityGoals = [
  {
    id: "reduce_waste",
    title: "Reduce Fashion Waste",
    description: "Help keep clothes out of landfills",
    icon: "♻️",
  },
  {
    id: "save_water",
    title: "Save Water",
    description: "Reduce water consumption from new production",
    icon: "💧",
  },
  {
    id: "lower_carbon",
    title: "Lower Carbon Footprint",
    description: "Minimize CO₂ emissions from manufacturing",
    icon: "🌱",
  },
  {
    id: "support_communities",
    title: "Support Communities",
    description: "Help African communities through our impact programs",
    icon: "🤝",
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [budget, setBudget] = useState([100])
  const [frequency, setFrequency] = useState("monthly")
  const [sizes, setSizes] = useState<string[]>([])
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [preferences, setPreferences] = useState({
    colors: [] as string[],
    brands: [] as string[],
    categories: [] as string[],
  })

  const handleStyleToggle = (styleId: string) => {
    setSelectedStyles((prev) => (prev.includes(styleId) ? prev.filter((id) => id !== styleId) : [...prev, styleId]))
  }

  const handleSizeToggle = (size: string) => {
    setSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]))
  }

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals((prev) => (prev.includes(goalId) ? prev.filter((id) => id !== goalId) : [...prev, goalId]))
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
        return budget[0] > 0 && frequency
      case 2:
        return sizes.length > 0
      case 3:
        return selectedGoals.length > 0
      default:
        return true
    }
  }

  const handleComplete = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        // Save preferences to local storage for after sign up
        localStorage.setItem('onboarding_preferences', JSON.stringify({
          styles: selectedStyles,
          budget: budget[0],
          frequency,
          sizes,
          sustainabilityGoals: selectedGoals,
          preferences,
        }))

        toast({
          title: "Create an account",
          description: "Please create an account to save your preferences and start exploring curated items.",
        })

        router.push('/auth/signup')
        return
      }

      // Save preferences to database
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: session.user.id,
          styles: selectedStyles,
          budget: budget[0],
          frequency,
          sizes,
          sustainability_goals: selectedGoals,
          color_preferences: preferences.colors,
          brand_preferences: preferences.brands,
          category_preferences: preferences.categories,
        })

      if (error) throw error

      toast({
        title: "Preferences saved!",
        description: "We'll start curating items based on your style.",
      })

      router.push('/listings')
    } catch (error) {
      console.error('Error saving preferences:', error)
      toast({
        title: "Error saving preferences",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
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
                Select the styles that resonate with you. Our AI will curate pieces that match your aesthetic.
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

          {/* Step 2: Budget & Frequency */}
          {currentStep === 1 && (
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-6">
                <DollarSign className="h-8 w-8 text-green-600" />
                <h2 className="text-4xl font-bold text-gray-900">Your Budget</h2>
              </div>
              <p className="text-xl text-gray-600 mb-12">
                Set your monthly budget and how often you'd like to receive curated pieces.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Budget Slider */}
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Budget</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">${budget[0]}</div>
                      <p className="text-gray-600">per month</p>
                    </div>
                    <Slider value={budget} onValueChange={setBudget} max={500} min={25} step={25} className="w-full" />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>$25</span>
                      <span>$500+</span>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-800">
                        💡 Higher budgets unlock premium pieces and more frequent deliveries
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Frequency Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Frequency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={frequency} onValueChange={setFrequency}>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="weekly" id="weekly" />
                          <Label htmlFor="weekly" className="flex-1 cursor-pointer">
                            <div className="font-medium">Weekly</div>
                            <div className="text-sm text-gray-600">1-2 pieces every week</div>
                          </Label>
                          <Badge variant="secondary">Most Popular</Badge>
                        </div>
                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="biweekly" id="biweekly" />
                          <Label htmlFor="biweekly" className="flex-1 cursor-pointer">
                            <div className="font-medium">Bi-weekly</div>
                            <div className="text-sm text-gray-600">2-3 pieces every 2 weeks</div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="monthly" id="monthly" />
                          <Label htmlFor="monthly" className="flex-1 cursor-pointer">
                            <div className="font-medium">Monthly</div>
                            <div className="text-sm text-gray-600">3-5 pieces every month</div>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Step 3: Size & Fit */}
          {currentStep === 2 && (
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Size & Fit Preferences</h2>
              <p className="text-xl text-gray-600 mb-12">
                Select your sizes across different categories for the perfect fit.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

                <Card>
                  <CardHeader>
                    <CardTitle>Fit Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {["Fitted", "Regular", "Loose", "Oversized"].map((fit) => (
                        <div key={fit} className="flex items-center space-x-2">
                          <Checkbox id={fit} />
                          <Label htmlFor={fit}>{fit}</Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Step 4: Sustainability Goals */}
          {currentStep === 3 && (
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Your Impact Goals</h2>
              <p className="text-xl text-gray-600 mb-12">Choose the sustainability goals that matter most to you.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sustainabilityGoals.map((goal) => (
                  <Card
                    key={goal.id}
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedGoals.includes(goal.id) ? "ring-2 ring-green-500 bg-green-50" : "hover:shadow-md"
                    }`}
                    onClick={() => handleGoalToggle(goal.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4">{goal.icon}</div>
                      <h3 className="font-semibold text-gray-900 mb-2">{goal.title}</h3>
                      <p className="text-gray-600">{goal.description}</p>
                      {selectedGoals.includes(goal.id) && (
                        <CheckCircle className="h-6 w-6 text-green-500 mt-3 mx-auto" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: AI Curation Setup */}
          {currentStep === 4 && (
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <h2 className="text-4xl font-bold text-gray-900">All Set!</h2>
              </div>
              <p className="text-xl text-gray-600 mb-12">
                Your preferences are saved. Start exploring sustainable fashion that matches your style.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Personalized Experience</h3>
                    <p className="text-gray-600 text-sm">
                      Discover items that match your style and preferences
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Sustainable Fashion</h3>
                    <p className="text-gray-600 text-sm">Shop pre-loved pieces that make a difference</p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Smart Savings</h3>
                    <p className="text-gray-600 text-sm">Get great deals while supporting sustainability</p>
                  </CardContent>
                </Card>
              </div>

              <Button
                className="w-full max-w-md mx-auto bg-green-600 hover:bg-green-700 py-6 text-lg font-semibold"
                onClick={handleComplete}
              >
                Start Shopping
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
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
