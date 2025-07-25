"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import ListingsPage from "../listings/page"

interface PageProps {
  searchParams?: { [key: string]: string | string[] | undefined }
  params?: { [key: string]: string | string[] | boolean | undefined }
}

export default function SearchPage({ searchParams, params }: PageProps) {
  const router = useRouter()
  const searchParamsObj = useSearchParams()

  useEffect(() => {
    // Focus the search input when the page loads
    const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
    if (searchInput) {
      searchInput.focus()
    }

    // If there's a search query in the URL, let the listings page handle it
    const query = searchParamsObj.get('q')
    if (query) {
      router.push(`/listings?q=${encodeURIComponent(query)}`)
    }
  }, [])

  return <ListingsPage searchParams={searchParams} params={{ ...params, isSearchPage: true }} />
}
