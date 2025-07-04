"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const products = [
  {
    id: 1,
    name: "Amber Still",
    description:
      "Amber Still is the quiet luxury of golden hour - a fragrance steeped in warmth, earth, and elegance. The scent is a slow exhale. A grounding presence. A stillness that fills the room with silent strength and softness.",
    mood: "Deep, warm, sensual, and elegant",
    price: 159,
    image: "/images/product-amber-still.png",
  },
  {
    id: 2,
    name: "White Haze",
    description:
      "White Haze is a clean clarity with a sensual undercurrent. Perfect for morning rituals, airy interiors, and a clean design love.",
    mood: "Clean, calm, radiant",
    price: 149,
    image: "/images/product-white-haze.png",
  },
  {
    id: 3,
    name: "Late Bloom",
    description:
      "Late Bloom captures the delicate alchemy of a jasmine flower that opens only when the world grows quiet. It's the signature scent for evenings that refuse to hurry.",
    mood: "Romance, mysterious, elegant",
    price: 169,
    image: "/images/product-late-bloom.png",
  },
]

export default function ProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const isMobile = useMobile()
  const visibleProducts = isMobile ? 1 : 3
  const maxIndex = Math.max(0, products.length - visibleProducts)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0))
  }

  return (
    <div className="relative">
      <div className="flex justify-between absolute top-1/2 -translate-y-1/2 w-full z-10 px-4">
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "rounded-full bg-[#FFFDF7]/10 border-[#FFFDF7]/20 text-[#FFFDF7] hover:bg-[#FFFDF7]/20",
            currentIndex === 0 && "opacity-50 cursor-not-allowed",
          )}
          onClick={prevSlide}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Previous products</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "rounded-full bg-[#FFFDF7]/10 border-[#FFFDF7]/20 text-[#FFFDF7] hover:bg-[#FFFDF7]/20",
            currentIndex === maxIndex && "opacity-50 cursor-not-allowed",
          )}
          onClick={nextSlide}
          disabled={currentIndex === maxIndex}
        >
          <ChevronRight className="h-6 w-6" />
          <span className="sr-only">Next products</span>
        </Button>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / visibleProducts)}%)` }}
        >
          {products.map((product) => (
            <div key={product.id} className="w-full min-w-[100%] md:min-w-[33.333%] px-4">
              <div className="group overflow-hidden rounded-lg bg-[#0A0A0A] p-6 transition-all hover:bg-[#151515] h-full flex flex-col">
                <div className="relative mb-6 h-[300px] md:h-[350px] w-full overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-serif text-xl font-light tracking-wider">{product.name}</h3>
                <p className="mt-2 text-sm text-[#FFFDF7]/70 flex-grow">{product.description}</p>
                <div className="mt-4 border-t border-[#FFFDF7]/10 pt-4">
                  <p className="text-xs text-[#C9A959] mb-3">MOOD: {product.mood}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-light">${product.price}.00</span>
                    <Button className="bg-[#C9A959] text-black hover:bg-[#D4C9A8]">BUY NOW</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
