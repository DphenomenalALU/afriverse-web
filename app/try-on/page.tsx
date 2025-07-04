"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Camera, RotateCcw, Download, Share2, ArrowLeft, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

// Mock clothing items for try-on
const tryOnItems = [
  {
    id: 1,
    title: "Vintage Denim Jacket",
    brand: "Levi's",
    price: 45,
    image: "/placeholder.svg?height=300&width=300",
    category: "jackets",
  },
  {
    id: 2,
    title: "Cotton Summer Dress",
    brand: "Reformation",
    price: 65,
    image: "/placeholder.svg?height=300&width=300",
    category: "dresses",
  },
  {
    id: 3,
    title: "Silk Blouse",
    brand: "Equipment",
    price: 85,
    image: "/placeholder.svg?height=300&width=300",
    category: "tops",
  },
  {
    id: 4,
    title: "High-Waist Jeans",
    brand: "Citizens of Humanity",
    price: 95,
    image: "/placeholder.svg?height=300&width=300",
    category: "bottoms",
  },
]

export default function TryOnPage() {
  const [selectedItem, setSelectedItem] = useState(tryOnItems[0])
  const [isARActive, setIsARActive] = useState(false)
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const startAR = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsARActive(true)
        setCameraPermission(true)
      }
    } catch (error) {
      console.error("Camera access denied:", error)
      setCameraPermission(false)
    }
  }

  const stopAR = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsARActive(false)
  }

  const handleSaveItem = (itemId: number) => {
    console.log("Saving item:", itemId)
  }

  const handleBuyNow = (itemId: number) => {
    window.location.href = `/messages?item=${itemId}&action=buy`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/listings">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Listings
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Virtual Try-On</h1>
              <p className="text-gray-600">See how clothes look on you before buying</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AR Camera View */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    AR Try-On Experience
                  </CardTitle>
                  <Badge className="bg-purple-100 text-purple-800">
                    <Zap className="h-3 w-3 mr-1" />
                    AI Powered
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] bg-gray-900 flex items-center justify-center">
                  {isARActive ? (
                    <>
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                      {/* AR Overlay */}
                      <div className="absolute inset-0 pointer-events-none">
                        {/* Virtual clothing overlay would go here */}
                        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                          Trying on: {selectedItem.title}
                        </div>
                        <div className="absolute bottom-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                          AR Active
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-white">
                      <Camera className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-xl font-semibold mb-2">Start Your Virtual Try-On</h3>
                      <p className="text-gray-400 mb-6">Allow camera access to see how clothes look on you</p>
                      {cameraPermission === false && (
                        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-4">
                          <p className="text-red-200 text-sm">
                            Camera access is required for virtual try-on. Please enable camera permissions.
                          </p>
                        </div>
                      )}
                      <Button onClick={startAR} className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Camera className="h-4 w-4 mr-2" />
                        Start AR Try-On
                      </Button>
                    </div>
                  )}
                </div>

                {/* AR Controls */}
                {isARActive && (
                  <div className="p-4 bg-gray-50 border-t">
                    <div className="flex items-center justify-center gap-4">
                      <Button variant="outline" size="sm">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Save Photo
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button
                        onClick={stopAR}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                      >
                        Stop AR
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Selected Item Details */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Image
                    src={selectedItem.image || "/placeholder.svg"}
                    alt={selectedItem.title}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{selectedItem.title}</h3>
                    <p className="text-gray-600 mb-2">{selectedItem.brand}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">${selectedItem.price}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleSaveItem(selectedItem.id)}>
                          Save
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleBuyNow(selectedItem.id)}
                        >
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Item Selection */}
          <div className="space-y-6">
            {/* Available Items */}
            <Card>
              <CardHeader>
                <CardTitle>Try These Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tryOnItems.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedItem.id === item.id
                          ? "bg-purple-50 border-2 border-purple-200"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        width={50}
                        height={50}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                        <p className="text-xs text-gray-600">{item.brand}</p>
                        <p className="text-sm font-semibold text-green-600">${item.price}</p>
                      </div>
                      {selectedItem.id === item.id && <div className="w-2 h-2 bg-purple-600 rounded-full"></div>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* How it Works */}
            <Card>
              <CardHeader>
                <CardTitle>How AR Try-On Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 font-bold text-xs">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Allow Camera Access</h4>
                      <p className="text-gray-600">Enable your camera to start the AR experience</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 font-bold text-xs">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Select Items</h4>
                      <p className="text-gray-600">Choose from available items to try them on virtually</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 font-bold text-xs">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">See the Fit</h4>
                      <p className="text-gray-600">View how clothes look and fit on your body</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 font-bold text-xs">4</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Make Your Decision</h4>
                      <p className="text-gray-600">Save photos and purchase with confidence</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
