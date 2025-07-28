import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Search,
  Filter,
  Plus,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  MapPin,
  Clock,
  Users,
  Star,
  Navigation,
  ImageIcon,
  TrendingUp,
  Activity,
  Store,
  ShoppingBag,
} from "lucide-react";

const mockVenues = [
  {
    id: "1",
    name: "Central Mall Seattle",
    description: "Premier shopping destination in downtown Seattle",
    type: "mall" as const,
    address: "123 Pine Street, Seattle, WA 98101",
    status: "active" as const,
    totalStores: 150,
    totalDeals: 12,
    arWaypoints: 45,
    dailyVisitors: 2500,
    rating: 4.7,
    images: ["mall1.jpg", "mall2.jpg"],
    createdAt: new Date("2024-01-15T09:00:00Z"),
    updatedAt: new Date("2025-01-28T14:30:00Z"),
  },
  {
    id: "2",
    name: "Best Buy Electronics",
    description: "Electronics and technology store",
    type: "store" as const,
    address: "456 Tech Avenue, Seattle, WA 98102",
    status: "active" as const,
    totalStores: 1,
    totalDeals: 8,
    arWaypoints: 12,
    dailyVisitors: 800,
    rating: 4.3,
    images: ["store1.jpg"],
    createdAt: new Date("2024-02-20T11:15:00Z"),
    updatedAt: new Date("2025-01-27T16:45:00Z"),
  },
  {
    id: "3",
    name: "Pike Place Market",
    description: "Historic public market and shopping district",
    type: "market" as const,
    address: "85 Pike Street, Seattle, WA 98101",
    status: "active" as const,
    totalStores: 85,
    totalDeals: 15,
    arWaypoints: 28,
    dailyVisitors: 1200,
    rating: 4.8,
    images: ["market1.jpg", "market2.jpg", "market3.jpg"],
    createdAt: new Date("2024-01-10T08:30:00Z"),
    updatedAt: new Date("2025-01-28T12:20:00Z"),
  },
  {
    id: "4",
    name: "Westfield Southcenter",
    description: "Large shopping mall with diverse retail options",
    type: "mall" as const,
    address: "2800 Southcenter Mall, Seattle, WA 98188",
    status: "maintenance" as const,
    totalStores: 200,
    totalDeals: 6,
    arWaypoints: 52,
    dailyVisitors: 1800,
    rating: 4.2,
    images: ["mall3.jpg"],
    createdAt: new Date("2024-03-05T14:00:00Z"),
    updatedAt: new Date("2025-01-25T09:10:00Z"),
  },
  {
    id: "5",
    name: "Capitol Hill Farmers Market",
    description: "Local farmers market with fresh produce and artisanal goods",
    type: "market" as const,
    address: "1535 11th Ave, Seattle, WA 98122",
    status: "inactive" as const,
    totalStores: 25,
    totalDeals: 3,
    arWaypoints: 8,
    dailyVisitors: 300,
    rating: 4.5,
    images: [],
    createdAt: new Date("2024-04-12T10:45:00Z"),
    updatedAt: new Date("2025-01-20T15:30:00Z"),
  },
];

function getVenueTypeInfo(type: string) {
  switch (type) {
    case "mall":
      return { variant: "default" as const, color: "bg-blue-100 text-blue-800" };
    case "store":
      return { variant: "secondary" as const, color: "bg-green-100 text-green-800" };
    case "market":
      return { variant: "warning" as const, color: "bg-orange-100 text-orange-800" };
    case "restaurant":
      return { variant: "warning" as const, color: "bg-orange-100 text-orange-800" };
    case "entertainment":
      return { variant: "info" as const, color: "bg-purple-100 text-purple-800" };
    case "service":
      return { variant: "outline" as const, color: "bg-gray-100 text-gray-800" };
    default:
      return { variant: "outline" as const, color: "bg-gray-100 text-gray-800" };
  }
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "active":
      return "success";
    case "inactive":
      return "secondary";
    case "maintenance":
      return "warning";
    default:
      return "outline";
  }
}

export default function VenuesPage() {
  return (
    <AdminLayout userRole="admin">
      <div className="space-y-8 animate-fade-in-up">
        {/* Enhanced Page Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-navilynx-primary/10 via-navilynx-secondary/10 to-navilynx-accent/10 rounded-2xl p-8 border border-navilynx-primary/20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-navilynx-purple-50/80 backdrop-blur-sm"></div>
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 gradient-purple rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gradient-purple mb-2">Venue Management</h1>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Manage shopping venues, stores, and location data across the NaviLynx platform with advanced analytics and AR integration.
                </p>
              </div>
            </div>
            <div className="mt-6 sm:mt-0 flex space-x-3">
              <Button variant="outline" size="sm" className="glass-effect hover:shadow-purple-soft transition-all duration-300">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" className="gradient-purple hover:shadow-purple-medium transition-all duration-300 transform hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
                Add Venue
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Overview with Animations */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="relative group card-hover overflow-hidden border-navilynx-primary/20">
            <div className="absolute inset-0 bg-gradient-to-br from-navilynx-primary/5 to-navilynx-secondary/5"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Venues</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{mockVenues.length}</p>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600 font-medium">+8%</span>
                    <span className="text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className="w-14 h-14 gradient-purple rounded-xl flex items-center justify-center shadow-lg card-glow">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 gradient-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </CardContent>
          </Card>

          <Card className="relative group card-hover overflow-hidden border-blue-200">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Stores</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {mockVenues.reduce((sum, venue) => sum + venue.totalStores, 0)}
                  </p>
                  <div className="flex items-center text-sm">
                    <Store className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-blue-600 font-medium">461 shops</span>
                    <span className="text-gray-500 ml-1">operating</span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg card-glow">
                  <Store className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </CardContent>
          </Card>

          <Card className="relative group card-hover overflow-hidden border-green-200">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Deals</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {mockVenues.reduce((sum, venue) => sum + venue.totalDeals, 0)}
                  </p>
                  <div className="flex items-center text-sm">
                    <ShoppingBag className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600 font-medium">Live offers</span>
                    <span className="text-gray-500 ml-1">available</span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg card-glow">
                  <ShoppingBag className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </CardContent>
          </Card>

          <Card className="relative group card-hover overflow-hidden border-purple-200">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">AR Waypoints</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {mockVenues.reduce((sum, venue) => sum + venue.arWaypoints, 0)}
                  </p>
                  <div className="flex items-center text-sm">
                    <Navigation className="h-4 w-4 text-purple-500 mr-1" />
                    <span className="text-purple-600 font-medium">Navigation</span>
                    <span className="text-gray-500 ml-1">enabled</span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg card-glow">
                  <Navigation className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Filters and Search */}
        <Card className="glass-effect border-navilynx-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navilynx-primary" />
                  <Input
                    placeholder="Search venues by name, type, or location..."
                    className="w-80 pl-10 border-navilynx-primary/30 focus:border-navilynx-primary focus:ring-navilynx-primary/20"
                  />
                </div>
                <Button variant="outline" size="sm" className="border-navilynx-primary/30 hover:bg-navilynx-primary/10">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-600">Sort by:</span>
                <select className="text-sm border border-navilynx-primary/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-navilynx-primary/20 focus:border-navilynx-primary bg-white">
                  <option>Name</option>
                  <option>Type</option>
                  <option>Status</option>
                  <option>Daily Visitors</option>
                  <option>Rating</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockVenues.map((venue) => (
            <Card key={venue.id} className="relative group card-hover overflow-hidden border-navilynx-primary/20 shadow-purple-soft">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-navilynx-purple-50/20"></div>
              
              {/* Venue Image/Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-navilynx-primary/20 to-navilynx-secondary/20 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
                <ImageIcon className="h-16 w-16 text-white/80" />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Badge variant={getStatusBadgeVariant(venue.status)} className="font-medium shadow-sm">
                    {venue.status.charAt(0).toUpperCase() + venue.status.slice(1)}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <span className="text-sm font-medium">{venue.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      <Users className="h-4 w-4" />
                      <span>{venue.dailyVisitors}/day</span>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="relative p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{venue.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{venue.description}</p>
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge className={getVenueTypeInfo(venue.type).color}>
                        {venue.type.charAt(0).toUpperCase() + venue.type.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-navilynx-primary" />
                    <span className="truncate">{venue.address}</span>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{venue.totalStores}</div>
                      <div className="text-xs text-gray-500">Stores</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{venue.totalDeals}</div>
                      <div className="text-xs text-gray-500">Deals</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{venue.arWaypoints}</div>
                      <div className="text-xs text-gray-500">AR Points</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      Updated {venue.updatedAt.toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-navilynx-primary/10">
                        <Eye className="h-4 w-4 text-navilynx-primary" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-navilynx-primary/10">
                        <Edit className="h-4 w-4 text-navilynx-primary" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                        <MoreHorizontal className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Pagination */}
        <Card className="glass-effect border-navilynx-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">1-{mockVenues.length}</span> of{" "}
                <span className="font-medium">{mockVenues.length}</span> venues
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled className="border-navilynx-primary/30">
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-navilynx-primary text-white border-navilynx-primary hover:bg-navilynx-secondary">
                  1
                </Button>
                <Button variant="outline" size="sm" disabled className="border-navilynx-primary/30">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
