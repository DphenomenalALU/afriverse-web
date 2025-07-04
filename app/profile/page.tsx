import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Calendar, Package, ShoppingBag, Settings, Edit } from "lucide-react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="container py-4 md:py-8 px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-8 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
            <Avatar className="h-20 w-20 md:h-24 md:w-24 mx-auto md:mx-0">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
              <AvatarFallback className="text-xl md:text-2xl">AK</AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Amara Kone</h1>
                <Badge className="bg-green-100 text-green-800">Verified</Badge>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 md:gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm md:text-base">Lagos, Nigeria</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm md:text-base">Joined March 2023</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-center md:justify-start">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <Card>
            <CardContent className="p-3 md:p-4 text-center">
              <div className="text-xl md:text-2xl font-bold text-green-600 mb-1">24</div>
              <div className="text-xs md:text-sm text-gray-600">Items Sold</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4 text-center">
              <div className="text-xl md:text-2xl font-bold text-blue-600 mb-1">8</div>
              <div className="text-xs md:text-sm text-gray-600">Items Bought</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4 text-center">
              <div className="text-xl md:text-2xl font-bold text-purple-600 mb-1">4.8</div>
              <div className="text-xs md:text-sm text-gray-600">Rating</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4 text-center">
              <div className="text-xl md:text-2xl font-bold text-orange-600 mb-1">$1,240</div>
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
                  Active Listings (5)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="border rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-3"></div>
                      <h4 className="font-medium mb-1 text-sm md:text-base">Vintage Leather Jacket</h4>
                      <p className="text-xs md:text-sm text-gray-500 mb-2">Size M • Excellent condition</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-green-600 text-sm md:text-base">$85</span>
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
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 border rounded-lg">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm md:text-base">Silk Designer Scarf</h4>
                        <p className="text-xs md:text-sm text-gray-500">Purchased Dec 15, 2024</p>
                        <div className="flex items-center gap-2 md:gap-4 mt-2">
                          <span className="font-bold text-green-600 text-sm md:text-base">$45</span>
                          <Badge className="bg-green-100 text-green-800 text-xs">Delivered</Badge>
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
