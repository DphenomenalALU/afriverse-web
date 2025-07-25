import Link from "next/link"
import Image from "next/image"
import { Instagram, Mail } from "lucide-react"

export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container py-12 md:py-16 px-4">
        <div className="grid gap-8 md:gap-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <Image
                src="/images/afriverse-logo.png"
                alt="Afriverse"
                width={140}
                height={32}
                className="h-8 md:h-9 w-auto"
              />
            </div>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6 md:mb-8">
              Sustainable fashion marketplace connecting eco-conscious consumers with quality pre-loved pieces.
            </p>
            <div className="flex space-x-4 md:space-x-6">
              <Link href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                <Instagram className="h-5 w-5 md:h-6 md:w-6" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                <Mail className="h-5 w-5 md:h-6 md:w-6" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="mb-4 md:mb-6 text-lg md:text-xl font-semibold text-black">Shop</h3>
            <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-gray-600">
              <li>
                <Link href="/listings" className="hover:text-green-600 transition-colors">
                  All Items
                </Link>
              </li>
              <li>
                <Link href="/search?category=women" className="hover:text-green-600 transition-colors">
                  Women
                </Link>
              </li>
              <li>
                <Link href="/search?category=men" className="hover:text-green-600 transition-colors">
                  Men
                </Link>
              </li>
              <li>
                <Link href="/search?category=accessories" className="hover:text-green-600 transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 md:mb-6 text-lg md:text-xl font-semibold text-black">Sell</h3>
            <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-gray-600">
              <li>
                <Link href="/listings/create" className="hover:text-green-600 transition-colors">
                  List an Item
                </Link>
              </li>
              <li>
                <Link href="/seller-guide" className="hover:text-green-600 transition-colors">
                  Seller Guide
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-green-600 transition-colors">
                  Pricing Tips
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 md:mb-6 text-lg md:text-xl font-semibold text-black">Support</h3>
            <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-gray-600">
              <li>
                <Link href="/help" className="hover:text-green-600 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-green-600 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/impact" className="hover:text-green-600 transition-colors">
                  Our Impact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 md:mt-16 border-t border-gray-200 pt-6 md:pt-8 text-center">
          <p className="text-xs md:text-sm text-gray-500">
            © {new Date().getFullYear()} Afriverse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
