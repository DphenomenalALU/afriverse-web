export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  bio?: string
  location?: string
  joinedAt: Date
  rating?: number
  ratingCount?: number
  stats: {
    itemsSold: number
    itemsBought: number
    co2Saved: number
    waterSaved: number
  }
}

export interface Listing {
  id: string
  title: string
  description: string
  brand: string
  category: string
  subcategory?: string
  size: string
  condition: "Like New" | "Excellent" | "Very Good" | "Good" | "Fair"
  price: number
  originalPrice?: number
  images: string[]
  tags: string[]
  sellerId: string
  seller: Pick<User, "id" | "name" | "avatar" | "rating" | "ratingCount">
  createdAt: Date
  updatedAt: Date
  status: "active" | "sold" | "reserved" | "draft"
  views: number
  measurements?: {
    chest?: number
    waist?: number
    length?: number
    shoulders?: number
  }
}

export interface CartItem {
  listingId: string
  listing: Listing
  quantity: number
  addedAt: Date
}

export interface Order {
  id: string
  buyerId: string
  sellerId: string
  items: CartItem[]
  total: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  createdAt: Date
  shippingAddress: Address
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface SearchFilters {
  category?: string
  brand?: string
  size?: string[]
  condition?: string[]
  priceMin?: number
  priceMax?: number
  tags?: string[]
  sortBy?: "newest" | "price-low" | "price-high" | "popular"
}
