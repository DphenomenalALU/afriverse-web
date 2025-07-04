"use client"

import { useEffect, useState } from "react"

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const menuButton = document.getElementById("mobile-menu-button")
    const mobileMenu = document.getElementById("mobile-menu")?.firstChild as HTMLElement

    if (menuButton && mobileMenu) {
      menuButton.addEventListener("click", () => {
        setIsOpen(!isOpen)
        mobileMenu.classList.toggle("hidden")
      })
    }

    return () => {
      if (menuButton) {
        menuButton.removeEventListener("click", () => {
          setIsOpen(!isOpen)
          mobileMenu?.classList.toggle("hidden")
        })
      }
    }
  }, [isOpen])

  return null
}
