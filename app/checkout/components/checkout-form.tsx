'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { PhoneInput } from "react-international-phone"
import "react-international-phone/style.css"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckoutSuccessDialog } from "./checkout-success-dialog"
import { countries } from "@/lib/data/countries"
import { Database } from "@/lib/supabase/types"
import { sendConfirmationEmail } from '@/lib/actions';

interface CheckoutFormProps {
  listingId: string
  price: number
  originalPrice: number | null
  userId: string
}

export function CheckoutForm({
  listingId,
  price,
  originalPrice,
  userId,
}: CheckoutFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [phone, setPhone] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const supabase = createClient()

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!userId) {
      toast.error("Please log in to complete your purchase")
      router.push("/auth/login?redirect=/checkout?listing_id=" + listingId)
      return
    }

    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const cleanCardNumber = cardNumber.replace(/\s+/g, "")
      const last4 = cleanCardNumber.slice(-4)

      if (cleanCardNumber.length !== 16) {
        throw new Error("Invalid card number")
      }

      // Create purchase record
      const { data: purchase, error: purchaseError } = await supabase
        .from("purchases")
        .insert({
          user_id: userId,
          listing_id: listingId,
          shipping_address: {
            full_name: formData.get("fullName"),
            address_line1: formData.get("addressLine1"),
            address_line2: formData.get("addressLine2") || undefined,
            city: formData.get("city"),
            state: formData.get("state"),
            postal_code: formData.get("postalCode"),
            country: formData.get("country"),
            phone,
          },
          payment_method: {
            type: "card",
            last4,
            exp_month: parseInt(formData.get("expMonth") as string),
            exp_year: parseInt(formData.get("expYear") as string),
            brand: "visa", // Mocked for now
          },
          total_amount: price,
          amount_saved: originalPrice ? originalPrice - price : 0,
          status: "processing",
          payment_status: "paid",
        })
        .select()
        .single()

      if (purchaseError) {
        console.error("Purchase error:", purchaseError)
        throw new Error(purchaseError.message)
      }

      // Update listing status
      const { error: listingError } = await supabase
        .from("listings")
        .update({ status: "sold" })
        .eq("id", listingId)

      if (listingError) {
        console.error("Listing update error:", listingError)
        throw new Error(listingError.message)
      }

      // Update seller's total_earned
      const { error: sellerError } = await supabase.rpc(
        "increment_seller_earnings",
        {
          listing_id: listingId,
          amount: price,
        }
      )

      if (sellerError) {
        console.error("Seller earnings update error:", sellerError)
        throw new Error(sellerError.message)
      }

      // Update buyer's total_saved
      if (originalPrice) {
        const { error: buyerError } = await supabase.rpc(
          "increment_buyer_savings",
          {
            amount: originalPrice - price,
          }
        )

        if (buyerError) {
          console.error("Buyer savings update error:", buyerError)
          throw new Error(buyerError.message)
        }
      }

      setShowSuccess(true)

      // Send confirmation email
      const emailResult = await sendConfirmationEmail(purchase.id);

      if (!emailResult.success) {
        console.error('Failed to send email:', emailResult.error);
        // Optionally show a toast
        toast.error('Order placed successfully, but failed to send confirmation email.');
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-8">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Shipping Information</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" required />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <PhoneInput
                defaultCountry="us"
                value={phone}
                onChange={phone => setPhone(phone)}
                inputClassName="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div>
              <Label htmlFor="addressLine1">Address Line 1</Label>
              <Input id="addressLine1" name="addressLine1" required />
            </div>
            <div>
              <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
              <Input id="addressLine2" name="addressLine2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" required />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input id="postalCode" name="postalCode" required />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Select name="country" required defaultValue="US">
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Payment Information</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                value={cardNumber}
                onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="4242 4242 4242 4242"
                maxLength={19}
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="expMonth">Exp Month</Label>
                <Input
                  id="expMonth"
                  name="expMonth"
                  placeholder="MM"
                  maxLength={2}
                  pattern="^(0[1-9]|1[0-2])$"
                  required
                />
              </div>
              <div>
                <Label htmlFor="expYear">Exp Year</Label>
                <Input
                  id="expYear"
                  name="expYear"
                  placeholder="YY"
                  maxLength={2}
                  pattern="^[0-9]{2}$"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  name="cvc"
                  placeholder="123"
                  maxLength={3}
                  pattern="^[0-9]{3}$"
                  required
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">${price.toFixed(2)}</p>
            {originalPrice && (
              <p className="text-sm text-muted-foreground">
                You save: ${(originalPrice - price).toFixed(2)}
              </p>
            )}
          </div>
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? "Processing..." : "Complete Purchase"}
          </Button>
        </div>
      </form>

      <CheckoutSuccessDialog
        open={showSuccess}
        onOpenChange={setShowSuccess}
      />
    </>
  )
} 