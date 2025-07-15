import { useRouter } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface CheckoutSuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CheckoutSuccessDialog({
  open,
  onOpenChange,
}: CheckoutSuccessDialogProps) {
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center justify-center space-y-4 py-6">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">Order Placed Successfully!</h3>
            <p className="text-sm text-muted-foreground">
              Thank you for your purchase. We&apos;ll send you an email with the order details
              and tracking information once your item ships.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false)
                router.push("/listings")
              }}
            >
              Continue Shopping
            </Button>
            <Button
              onClick={() => {
                onOpenChange(false)
                router.push("/profile")
              }}
            >
              View Orders
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 