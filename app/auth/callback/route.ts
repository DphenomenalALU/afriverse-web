import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    const {
      data: { session },
    } = await supabase.auth.exchangeCodeForSession(code)

    if (session) {
      // Check if the user has a profile
      const { data: profile } = await supabase.from("profiles").select("id").eq("id", session.user.id).single()

      if (!profile) {
        // This is a new user, redirect to onboarding
        return NextResponse.redirect(new URL("/onboarding", request.url))
      }
    }
  }

  return NextResponse.redirect(new URL("/listings", request.url))
} 