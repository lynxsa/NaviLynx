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
      return { variant: "default" as const, color: "bg-purple-100 text-purple-800" };
    case "store":
      return { variant: "secondary" as const, color: "bg-violet-100 text-violet-800" };
    case "market":
      return { variant: "warning" as const, color: "bg-indigo-100 text-indigo-800" };
    case "restaurant":
      return { variant: "warning" as const, color: "bg-fuchsia-100 text-fuchsia-800" };
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
      <div className="p-6 max-w-7xl mx-auto space-y-6 min-h-screen">
        {/* Page Header */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Venue Management</h1>
                <p className="text-sm text-slate-600">
                  Manage shopping venues, stores, and location data across the NaviLynx platform
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="text-sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button className="text-sm bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Venue
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative group hover:shadow-lg transition-all duration-300 overflow-hidden border-purple-200">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50"></div>
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
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </CardContent>
          </Card>

          <Card className="relative group hover:shadow-lg transition-all duration-300 overflow-hidden border-indigo-200">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Stores</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {mockVenues.reduce((sum, venue) => sum + venue.totalStores, 0)}
                  </p>
                  <div className="flex items-center text-sm">
                    <Store className="h-4 w-4 text-indigo-500 mr-1" />
                    <span className="text-indigo-600 font-medium">461 shops</span>
                    <span className="text-gray-500 ml-1">operating</span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Store className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </CardContent>
          </Card>

          <Card className="relative group hover:shadow-lg transition-all duration-300 overflow-hidden border-fuchsia-200">
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-50 to-purple-50"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Deals</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {mockVenues.reduce((sum, venue) => sum + venue.totalDeals, 0)}
                  </p>
                  <div className="flex items-center text-sm">
                    <ShoppingBag className="h-4 w-4 text-fuchsia-500 mr-1" />
                    <span className="text-fuchsia-600 font-medium">Live offers</span>
                    <span className="text-gray-500 ml-1">available</span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-fuchsia-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <ShoppingBag className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-fuchsia-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </CardContent>
          </Card>

          <Card className="relative group hover:shadow-lg transition-all duration-300 overflow-hidden border-violet-200">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-purple-50"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">AR Waypoints</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {mockVenues.reduce((sum, venue) => sum + venue.arWaypoints, 0)}
                  </p>
                  <div className="flex items-center text-sm">
                    <Navigation className="h-4 w-4 text-violet-500 mr-1" />
                    <span className="text-violet-600 font-medium">Navigation</span>
                    <span className="text-gray-500 ml-1">enabled</span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Navigation className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Filters and Search */}
        <Card className="bg-white border border-purple-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-600" />
                  <Input
                    placeholder="Search venues by name, type, or location..."
                    className="w-80 pl-10 border-purple-300 focus:border-purple-600 focus:ring-purple-200"
                  />
                </div>
                <Button variant="outline" size="sm" className="border-purple-300 hover:bg-purple-50">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-600">Sort by:</span>
                <select className="text-sm border border-purple-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-600 bg-white">
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

        {/* Enhanced Venues Grid - 2 per row on all screen sizes for consistent layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockVenues.map((venue) => (
            <Card key={venue.id} className="relative group hover:shadow-xl transition-all duration-300 overflow-hidden border-purple-200 bg-white">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-purple-50/30"></div>
              
              {/* Venue Image/Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-purple-500/80 to-violet-600/80 flex items-center justify-center">
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
                    <MapPin className="h-4 w-4 mr-2 text-purple-600" />
                    <span className="truncate">{venue.address}</span>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{venue.totalStores}</div>
                      <div className="text-xs text-gray-500">Stores</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-fuchsia-600">{venue.totalDeals}</div>
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
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-purple-50">
                        <Eye className="h-4 w-4 text-purple-600" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-purple-50">
                        <Edit className="h-4 w-4 text-purple-600" />
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
        <Card className="bg-white border border-purple-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">1-{mockVenues.length}</span> of{" "}
                <span className="font-medium">{mockVenues.length}</span> venues
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled className="border-purple-300">
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-purple-600 text-white border-purple-600 hover:bg-purple-700">
                  1
                </Button>
                <Button variant="outline" size="sm" disabled className="border-purple-300">
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
