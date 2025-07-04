// Run this script to create placeholder images
// node scripts/create-placeholder-images.js

const fs = require("fs")
const path = require("path")

// Create public/images directory if it doesn't exist
const imagesDir = path.join(process.cwd(), "public", "images")
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true })
}

// Create a simple SVG placeholder
const createPlaceholderSVG = (width, height, text) => `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f3f4f6"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">${text}</text>
</svg>
`

// Create placeholder images
const placeholders = [
  { name: "product-1.svg", width: 400, height: 400, text: "Vintage Jacket" },
  { name: "product-2.svg", width: 400, height: 400, text: "Summer Dress" },
  { name: "product-3.svg", width: 400, height: 400, text: "Silk Scarf" },
  { name: "product-4.svg", width: 400, height: 400, text: "Leather Boots" },
  { name: "product-5.svg", width: 400, height: 400, text: "Cashmere Sweater" },
  { name: "product-6.svg", width: 400, height: 400, text: "High-Waist Jeans" },
]

placeholders.forEach((placeholder) => {
  const svg = createPlaceholderSVG(placeholder.width, placeholder.height, placeholder.text)
  fs.writeFileSync(path.join(imagesDir, placeholder.name), svg)
})

console.log("Placeholder images created successfully!")
