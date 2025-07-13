"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import ListingsPage from "../listings/page"

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Focus the search input when the page loads
    const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
    if (searchInput) {
      searchInput.focus()
    }

    // If there's a search query in the URL, let the listings page handle it
    const query = searchParams.get('q')
    if (query) {
      router.push(`/listings?q=${encodeURIComponent(query)}`)
    }
  }, [])

  return <ListingsPage isSearchPage />
}
