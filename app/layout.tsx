import type React from "react"
import "./globals.css"
import { Playfair_Display, Cormorant_Garamond } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import MobileMenu from "@/components/mobile-menu"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
})

export const metadata = {
  title: "2207 Scents | The Art of Scent Memory",
  description: "Luxury home fragrances designed for those who move through the world with intention.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${cormorant.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <MobileMenu />
        </ThemeProvider>
      </body>
    </html>
  )
}
