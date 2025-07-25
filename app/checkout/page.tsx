import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

import { CheckoutForm } from "./components/checkout-form"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { listing_id?: string }
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const redirectUrl = `/auth/login?redirect=/checkout${
      searchParams.listing_id ? `?listing_id=${searchParams.listing_id}` : ""
    }`
    redirect(redirectUrl)
  }

  if (!searchParams.listing_id) {
    redirect("/listings")
  }

  const { data: listing } = await supabase
    .from("listings")
    .select("*, profiles(*)")
    .eq("id", searchParams.listing_id)
    .single()

  if (!listing) {
    redirect("/listings")
  }

  if (listing.status !== "active") {
    redirect("/listings")
  }

  if (listing.user_id === user.id) {
    redirect(`/listings/${listing.id}`)
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="container max-w-2xl py-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Checkout</h1>
            <p className="text-muted-foreground">Complete your purchase</p>
          </div>
          <div className="mb-8 rounded-lg border bg-card p-4">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 overflow-hidden rounded-md">
                <img
                  src={listing.images?.[0] || "/placeholder.jpg"}
                  alt={listing.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h2 className="font-semibold">{listing.title}</h2>
                <p className="text-sm text-muted-foreground">
                  Sold by {listing.profiles?.name || "Anonymous"}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <p className="font-semibold">${listing.price.toFixed(2)}</p>
                  {listing.original_price && (
                    <p className="text-sm text-muted-foreground line-through">
                      ${listing.original_price.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <CheckoutForm
            listingId={searchParams.listing_id}
            price={listing.price}
            originalPrice={listing.original_price}
            userId={user.id}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  )
} 