import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image src="/images/hero-tea-field.jpg" alt="Sustainable fashion" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/80 to-emerald-600/80"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12">
          <div className="max-w-md text-center">
            <Leaf className="h-16 w-16 mx-auto mb-6 text-green-300" />
            <h2 className="text-4xl font-bold mb-4">Start Your Journey</h2>
            <p className="text-xl text-green-100">
              Join our community of conscious consumers making a positive impact through fashion.
            </p>
            <div className="mt-8 space-y-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                <span className="text-green-100">Buy and sell pre-loved fashion</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                <span className="text-green-100">Track your environmental impact</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                <span className="text-green-100">Support African communities</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Signup form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to home
            </Link>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-8">
              <Leaf className="h-8 w-8 text-green-600" />
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">AFRIVERSE</h2>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h1>
            <p className="text-gray-600 mb-8">Join the sustainable fashion revolution</p>
          </div>

          <div className="space-y-6">
            <Button className="w-full bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-6 text-base font-medium flex items-center justify-center gap-3">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-green-600 hover:text-green-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="text-center text-xs text-gray-500">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-green-600 hover:text-green-700">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-green-600 hover:text-green-700">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
