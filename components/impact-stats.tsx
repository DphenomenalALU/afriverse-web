"use client"

import { useEffect, useState } from "react"
import { Recycle, Droplets, TreePine, Users } from "lucide-react"

const stats = [
  {
    icon: Recycle,
    value: 50000,
    suffix: "+",
    label: "Items Given New Life",
    description: "Pieces saved from landfills",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
  },
  {
    icon: Droplets,
    value: 2500000,
    suffix: "L",
    label: "Water Saved",
    description: "Equivalent to 1,000 bathtubs",
    color: "text-green-400",
    bgColor: "bg-green-500/20",
  },
  {
    icon: TreePine,
    value: 25,
    suffix: "T",
    label: "CO₂ Reduced",
    description: "Carbon emissions prevented",
    color: "text-teal-400",
    bgColor: "bg-teal-500/20",
  },
  {
    icon: Users,
    value: 150,
    suffix: "+",
    label: "Communities Supported",
    description: "Across 20 African countries",
    color: "text-lime-400",
    bgColor: "bg-lime-500/20",
  },
]

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + "K"
    }
    return num.toString()
  }

  return (
    <span className="text-4xl md:text-5xl font-bold">
      {formatNumber(count)}
      {suffix}
    </span>
  )
}

export default function ImpactStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
            <stat.icon className={`h-8 w-8 ${stat.color}`} />
          </div>
          <div className={`${stat.color} mb-2`}>
            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">{stat.label}</h3>
          <p className="text-sm text-white/70">{stat.description}</p>
        </div>
      ))}
    </div>
  )
}
