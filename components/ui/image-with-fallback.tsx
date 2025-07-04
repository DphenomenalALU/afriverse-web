"use client"

import { useState } from "react"
import Image from "next/image"
import { ImageIcon } from "lucide-react"

interface ImageWithFallbackProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  fallbackClassName?: string
}

export default function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className = "",
  fallbackClassName = "",
}: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  if (imageError || !src || src.includes("placeholder.svg")) {
    return (
      <div className={`placeholder-image ${fallbackClassName}`} style={{ width, height }}>
        <ImageIcon className="h-8 w-8 text-gray-400" />
      </div>
    )
  }

  return (
    <div className="relative" style={{ width, height }}>
      {imageLoading && <div className="absolute inset-0 image-loading rounded-lg" style={{ width, height }} />}
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${imageLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageError(true)
          setImageLoading(false)
        }}
      />
    </div>
  )
}
