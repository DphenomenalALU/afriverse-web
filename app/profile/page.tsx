import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Calendar, Package, ShoppingBag } from "lucide-react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import type { Database } from "@/lib/supabase/types"
import { cookies } from 'next/headers'

type Profile = Database['public']['Tables']['profiles']['Row']
type Listing = Database['public']['Tables']['listings']['Row']
type Purchase = Database['public']['Tables']['purchases']['Row'] & {
  listings: Listing | null
}

export default async function ProfilePage() {
  const cookieStore = cookies()
  const supabase = createClient()
  
  // Check if user is authenticated
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError) {
    console.error('Session error:', {
      code: sessionError.code,
      message: sessionError.message,
      name: sessionError.name
    })
    return <div className="container py-8 px-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h2 className="text-red-800 font-semibold mb-2">Authentication Error</h2>
        <p className="text-red-600">There was an error checking your authentication status.</p>
        <p className="text-sm text-red-500 mt-2">Error: {sessionError.message}</p>
        <p className="text-sm text-red-500 mt-1">Please try logging out and back in.</p>
      </div>
    </div>
  }
  
  if (!session) {
    console.log('No session found, redirecting to login')
    redirect('/auth/login')
  }

  console.log('Session found:', {
    userId: session.user.id,
    email: session.user.email,
    metadata: session.user.user_metadata,
    aud: session.user.aud,
    role: session.user.role
  })

  // First check if profile exists
  let { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (profileError) {
    console.error('Profile error:', {
      code: profileError.code,
      message: profileError.message,
      details: profileError.details,
      hint: profileError.hint
    })
    
    // If profile doesn't exist, create one
    if (profileError.code === 'PGRST116') {
      console.log('Profile not found, creating new profile for user:', session.user.id)
      
      const newProfile = {
        id: session.user.id,
        name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || null,
        email: session.user.email,
        impact_score: 0,
        created_at: new Date().toISOString(),
        total_earnings: 0
      }

      console.log('Attempting to create profile with data:', newProfile)

      const { data: createdProfile, error: createError } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single()

      if (createError) {
        console.error('Error creating profile:', {
          code: createError.code,
          message: createError.message,
          details: createError.details,
          hint: createError.hint
        })
        return <div className="container py-8 px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-red-800 font-semibold mb-2">Profile Creation Error</h2>
            <p className="text-red-600">There was an error creating your profile.</p>
            <p className="text-sm text-red-500 mt-2">Error: {createError.message}</p>
            <p className="text-sm text-red-500 mt-1">Please try:</p>
            <ul className="list-disc list-inside text-sm text-red-500 mt-1">
              <li>Clearing your browser cookies</li>
              <li>Logging out and back in</li>
              <li>If the error persists, contact support</li>
            </ul>
          </div>
        </div>
      }

      console.log('Profile created successfully:', createdProfile)
      profile = createdProfile
    } else {
      return <div className="container py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold mb-2">Profile Error</h2>
          <p className="text-red-600">There was an error loading your profile.</p>
          <p className="text-sm text-red-500 mt-2">Error: {profileError.message}</p>
          <p className="text-sm text-red-500 mt-1">Please try:</p>
          <ul className="list-disc list-inside text-sm text-red-500 mt-1">
            <li>Clearing your browser cookies</li>
            <li>Logging out and back in</li>
            <li>If the error persists, contact support</li>
          </ul>
        </div>
      </div>
    }
  }

  // Log the profile data
  console.log('Profile loaded:', profile)

  // Fetch user stats
  const { count: soldCount, error: soldError } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', session.user.id)
    .eq('status', 'sold')

  if (soldError) {
    console.error('Error fetching sold items:', soldError)
  }

  const { count: boughtCount, error: boughtError } = await supabase
    .from('purchases')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', session.user.id)

  if (boughtError) {
    console.error('Error fetching bought items:', boughtError)
  }

  // Fetch active listings
  const { data: activeListings, error: listingsError } = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (listingsError) {
    console.error('Error fetching active listings:', listingsError)
  }

  // Fetch purchase history with related listings
  const { data: purchases, error: purchasesError } = await supabase
    .from('purchases')
    .select('*, listings(*)')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .returns<Purchase[]>()

  if (purchasesError) {
    console.error('Error fetching purchases:', purchasesError)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="container py-4 md:py-8 px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-8 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
            <Avatar className="h-20 w-20 md:h-24 md:w-24 mx-auto md:mx-0">
              <AvatarImage src={profile.avatar_url || "/placeholder-user.jpg"} alt={profile.name || ''} />
              <AvatarFallback className="text-xl md:text-2xl">
                {profile.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{profile.name || 'Anonymous'}</h1>
                <Badge className="bg-green-100 text-green-800">Verified</Badge>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 md:gap-4 text-gray-600 mb-4">
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm md:text-base">{profile.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm md:text-base">
                    Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <Card>
            <CardContent className="p-3 md:p-4 text-center">
              <div className="text-xl md:text-2xl font-bold text-green-600 mb-1">{soldCount || 0}</div>
              <div className="text-xs md:text-sm text-gray-600">Items Sold</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4 text-center">
              <div className="text-xl md:text-2xl font-bold text-blue-600 mb-1">{boughtCount || 0}</div>
              <div className="text-xs md:text-sm text-gray-600">Items Bought</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4 text-center">
              <div className="text-xl md:text-2xl font-bold text-purple-600 mb-1">{profile.impact_score || 0}</div>
              <div className="text-xs md:text-sm text-gray-600">Impact Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4 text-center">
              <div className="text-xl md:text-2xl font-bold text-orange-600 mb-1">
                ${profile.total_earnings?.toFixed(2) || '0.00'}
              </div>
              <div className="text-xs md:text-sm text-gray-600">Total Earned</div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Tabs */}
        <Tabs defaultValue="listings" className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="purchases">Purchase History</TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Package className="h-4 w-4 md:h-5 md:w-5" />
                  Active Listings ({activeListings?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {activeListings?.map((listing) => (
                    <div key={listing.id} className="border rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-3">
                        {listing.images?.[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img 
                            src={listing.images[0]} 
                            alt={listing.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        )}
                      </div>
                      <h4 className="font-medium mb-1 text-sm md:text-base">{listing.title}</h4>
                      <p className="text-xs md:text-sm text-gray-500 mb-2">
                        Size {listing.size} • {listing.condition}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-green-600 text-sm md:text-base">
                          ${listing.price.toFixed(2)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          Active
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="purchases" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" />
                  Purchase History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 md:space-y-4">
                  {purchases?.map((purchase) => (
                    <div key={purchase.id} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 border rounded-lg">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-lg flex-shrink-0">
                        {purchase.listings?.images?.[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img 
                            src={purchase.listings.images[0]} 
                            alt={purchase.listings.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm md:text-base">{purchase.listings?.title}</h4>
                        <p className="text-xs md:text-sm text-gray-500">
                          Purchased {new Date(purchase.created_at).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-2 md:gap-4 mt-2">
                          <span className="font-bold text-green-600 text-sm md:text-base">
                            ${purchase.total_amount.toFixed(2)}
                          </span>
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            {purchase.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <SiteFooter />
    </div>
  )
}
