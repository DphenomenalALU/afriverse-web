"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    id: 1,
    quote:
      "The Velvet Oud diffuser has transformed my space into more than just a home—it's become part of my identity. Guests always ask about the scent that lingers in the air, even days after I've had company.",
    author: "Alexandra M.",
    location: "New York",
  },
  {
    id: 2,
    quote:
      "What draws me to 2207 Scents is the story behind each fragrance. These aren't just pleasant smells—they're emotional experiences, memories captured in scent. The Midnight Amber reminds me of evenings with my grandfather.",
    author: "Jonathan L.",
    location: "London",
  },
  {
    id: 3,
    quote:
      "As a designer, I understand the power of the invisible details. The Cashmere Cedar diffuser creates an atmosphere in my studio that words can't describe—it's become as essential to my creative process as light and space.",
    author: "Sophia R.",
    location: "Paris",
  },
]

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const maxIndex = testimonials.length - 1

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === maxIndex ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? maxIndex : prevIndex - 1))
  }

  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full min-w-full px-4">
              <div className="flex flex-col items-center text-center">
                <Quote className="h-10 w-10 md:h-12 md:w-12 text-[#C9A959] mb-6" />
                <blockquote className="mb-6 text-lg md:text-xl font-light italic text-[#FFFDF7]">
                  "{testimonial.quote}"
                </blockquote>
                <div className="text-[#C9A959]">
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              index === currentIndex ? "bg-[#C9A959] w-6" : "bg-[#FFFDF7]/30",
            )}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>

      <div className="flex justify-between absolute top-1/2 -translate-y-1/2 w-full z-10 px-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-black/20 border-[#FFFDF7]/20 text-[#FFFDF7] hover:bg-black/40"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          <span className="sr-only">Previous testimonial</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-black/20 border-[#FFFDF7]/20 text-[#FFFDF7] hover:bg-black/40"
          onClick={nextSlide}
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          <span className="sr-only">Next testimonial</span>
        </Button>
      </div>
    </div>
  )
}
