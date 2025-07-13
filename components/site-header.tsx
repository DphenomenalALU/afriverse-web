"use client"
import Link from "next/link"
import Image from "next/image"
import { Menu, ShoppingBag, User2, Search, X, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useCart } from "@/hooks/use-cart"

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cartItems, loadCart } = useCart()

  // Subscribe to cart changes
  useEffect(() => {
    loadCart()
  }, [loadCart])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <div className="container flex h-16 md:h-20 items-center justify-between px-4">
        <div className="flex items-center md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 text-black hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open menu</span>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/images/afriverse-logo.png"
            alt="Afriverse"
            width={140}
            height={32}
            className="h-8 md:h-10 w-auto"
          />
        </Link>

        <nav className="hidden md:flex gap-6 lg:gap-8">
          <Link
            href="/listings"
            className="text-sm lg:text-base font-medium text-gray-700 hover:text-green-600 transition-colors"
          >
            SHOP
          </Link>
          <Link
            href="/listings/create"
            className="text-sm lg:text-base font-medium text-gray-700 hover:text-green-600 transition-colors"
          >
            SELL
          </Link>
          <Link
            href="/impact"
            className="text-sm lg:text-base font-medium text-gray-700 hover:text-green-600 transition-colors"
          >
            IMPACT
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-3 lg:gap-5">
          <Link href="/search" className="text-gray-700 hover:text-green-600 transition-colors">
            <Search className="h-5 w-5 md:h-6 md:w-6" />
            <span className="sr-only">Search</span>
          </Link>
          <Link href="/profile" className="text-gray-700 hover:text-green-600 transition-colors">
            <User2 className="h-5 w-5 md:h-6 md:w-6" />
            <span className="sr-only">Profile</span>
          </Link>
          <Link href="/cart" className="text-gray-700 hover:text-green-600 transition-colors relative">
            <ShoppingBag className="h-5 w-5 md:h-6 md:w-6" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-green-600 text-[10px] md:text-[11px] text-white font-medium">
                {cartItems.length}
              </span>
            )}
            <span className="sr-only">Saved Items</span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="flex flex-col space-y-4 px-4 py-6">
            <Link
              href="/listings"
              className="text-base font-medium text-gray-700 hover:text-green-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              SHOP
            </Link>
            <Link
              href="/listings/create"
              className="text-base font-medium text-gray-700 hover:text-green-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              SELL
            </Link>
            <Link
              href="/impact"
              className="text-base font-medium text-gray-700 hover:text-green-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              IMPACT
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
