import Image from "next/image"
import Link from "next/link"
import {
  Recycle,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Heart,
  Zap,
  Shield,
  Camera,
  ArrowDown,
  AlertTriangle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import ListingsCarousel from "@/components/listings/listings-carousel"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import ARTryOnButton from "@/components/ar-try-on-button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section with Background Image */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/hero-women-walking.png"
              alt="Sustainable fashion background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[0.9]">
              Look Good,
              <span className="block text-green-400">Waste Less.</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed text-white/90">
              Buy and sell quality pre-loved fashion. Save money, reduce waste, and support communities across Africa
              with every purchase.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-full"
              >
                <Link href="/listings">
                  Start Shopping
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-full bg-transparent backdrop-blur-sm"
              >
                <Link href="/onboarding">
                  Find Your Style
                  <Sparkles className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container px-4">
            <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto text-center">
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-600 mb-2">50K+</div>
                <div className="text-sm md:text-base text-gray-600">Items Saved</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-600 mb-2">25T</div>
                <div className="text-sm md:text-base text-gray-600">CO₂ Reduced</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-600 mb-2">150+</div>
                <div className="text-sm md:text-base text-gray-600">Communities</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container px-4">
            <div className="mb-12 md:mb-16 text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black mb-4">
                Why Choose Afriverse
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Join the circular fashion revolution with purpose-driven shopping
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="p-6 md:p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                  <Recycle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-black mb-3">Circular Fashion</h3>
                <p className="text-gray-600 leading-relaxed">
                  Give clothes a second life and reduce fashion waste through our circular marketplace ecosystem.
                </p>
              </div>
              <div className="p-6 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <Heart className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-black mb-3">Community Impact</h3>
                <p className="text-gray-600 leading-relaxed">
                  Every purchase supports education and development programs in African communities worldwide.
                </p>
              </div>
              <div className="p-6 md:p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-black mb-3">Smart Discovery</h3>
                <p className="text-gray-600 leading-relaxed">
                  AI-powered recommendations help you find the perfect pieces that match your unique style.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Listings */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container px-4">
            <div className="mb-12 md:mb-16 text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black mb-4">
                Trending Now
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Discover the latest drops from our community of eco-conscious sellers around the world.
              </p>
            </div>
            <ListingsCarousel />
            <div className="mt-8 md:mt-12 text-center">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-black text-black hover:bg-black hover:text-white px-6 md:px-8 py-3 md:py-4 rounded-full bg-transparent"
              >
                <Link href="/listings">View All Listings</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Try Before You Buy - Vertical Steps */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
                <Zap className="h-4 w-4" />
                Virtual Try-On Beta
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                Try Before You Buy
              </h2>

              <p className="text-lg md:text-xl text-gray-600 mb-12 md:mb-16 max-w-2xl mx-auto">
                Experience the future of sustainable shopping with AR virtual try-on technology. See how hats and accessories fit
                before making a purchase.
              </p>

              {/* Vertical Step Process */}
              <div className="max-w-md mx-auto space-y-6 md:space-y-8">
                <div className="text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <Camera className="h-8 w-8 md:h-10 md:w-10 text-purple-600" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">1. Allow Camera Access</h3>
                  <p className="text-gray-600 mb-4 md:mb-6">Enable camera access and ensure you are in a well lit area to start the virtual try-on experience</p>
                  <ArrowDown className="h-6 w-6 text-purple-400 mx-auto" />
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-purple-600" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">2. Select & Try</h3>
                  <p className="text-gray-600 mb-4 md:mb-6">Choose any accessory or hat and see it on yourself instantly</p>
                  <ArrowDown className="h-6 w-6 text-purple-400 mx-auto" />
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 md:h-10 md:w-10 text-purple-600" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">3. Perfect Fit</h3>
                  <p className="text-gray-600 mb-6 md:mb-8">Make confident purchases with accurate visualization</p>
                </div>
              </div>

              <ARTryOnButton />
            </div>
          </div>
        </section>

        {/* Fast Fashion Problem Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
                <AlertTriangle className="h-4 w-4" />
                The Problem We're Solving
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-8">
                Fast Fashion is <span className="text-red-600">Destroying</span> Our Planet
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
                <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-2xl border border-red-100">
                  <div className="text-2xl md:text-3xl font-bold text-red-600 mb-2">1.7B tons</div>
                  <div className="text-sm text-gray-600">CO₂ emissions yearly from fashion</div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-2xl border border-orange-100">
                  <div className="text-2xl md:text-3xl font-bold text-orange-600 mb-2">+50%</div>
                  <div className="text-sm text-gray-600">Expected increase by 2030</div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-2xl border border-blue-100">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">92M tons</div>
                  <div className="text-sm text-gray-600">Textile waste annually</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <div className="container px-4 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Together, We Can Change This
            </h2>
            <p className="text-lg md:text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              Every pre-loved item you buy or sell helps break the cycle of fast fashion. Join thousands of eco-conscious
              consumers building a more sustainable fashion future, one piece at a time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100 px-6 md:px-8 py-4 md:py-6 text-base md:text-lg rounded-full min-w-[200px]"
              >
                <Link href="/listings">Start Shopping</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-6 md:px-8 py-4 md:py-6 text-base md:text-lg rounded-full min-w-[200px] bg-transparent"
              >
                <Link href="/listings/create">Sell Your Items</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
