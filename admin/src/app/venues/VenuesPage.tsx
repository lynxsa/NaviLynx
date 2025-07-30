'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Building2,
  Navigation,
  Wifi,
  Users,
  Star,
  Clock,
  Phone,
  Globe,
  Accessibility,
  Car,
  Camera,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Settings,
  Store,
  ShoppingBag,
  TrendingUp
} from "lucide-react"

interface BLEBeacon {
  id: string
  name: string
  uuid: string
  major: number
  minor: number
  position: { x: number; y: number; floor: number }
  transmissionPower: number
  battery: number
  lastSeen: string
  status: 'active' | 'inactive' | 'low_battery'
}

interface POI {
  id: string
  name: string
  type: 'store' | 'restaurant' | 'service' | 'entrance' | 'exit' | 'restroom' | 'atm' | 'info'
  position: { x: number; y: number; floor: number }
  description?: string
  icon?: string
  hours?: string
  contact?: string
  category?: string
  tags?: string[]
}

interface NavigationGraph {
  nodes: { id: string; x: number; y: number; floor: number; type: string }[]
  edges: { from: string; to: string; distance: number; accessible: boolean }[]
}

interface Venue {
  id: string
  name: string
  type: 'shopping_mall' | 'airport' | 'hospital' | 'university' | 'office' | 'hotel'
  address: string
  city: string
  province: string
  coordinates: { latitude: number; longitude: number }
  capacity: number
  floors: number
  operatingHours: string
  contact: {
    phone: string
    email: string
    website?: string
    social?: {
      facebook?: string
      twitter?: string
      instagram?: string
    }
  }
  amenities: string[]
  accessibility: {
    wheelchairAccessible: boolean
    elevators: number
    escalators: number
    disabledParking: number
    brailleSignage: boolean
    audioAssistance: boolean
  }
  parking: {
    totalSpaces: number
    disabledSpaces: number
    hourlyRate: number
    dailyRate: number
    evCharging: boolean
  }
  bleBeacons: BLEBeacon[]
  pois: POI[]
  navigationGraph: NavigationGraph
  rating: number
  reviewCount: number
  images: string[]
  description: string
  tags: string[]
  lastUpdated: string
  isActive: boolean
}

// Mock comprehensive venue data
const mockVenues: Venue[] = [
  {
    id: 'sandton-city',
    name: 'Sandton City',
    type: 'shopping_mall',
    address: '83 Rivonia Road, Sandhurst',
    city: 'Sandton',
    province: 'Gauteng',
    coordinates: { latitude: -26.107658, longitude: 28.056725 },
    capacity: 50000,
    floors: 5,
    operatingHours: '09:00 - 21:00',
    contact: {
      phone: '+27 11 217 6000',
      email: 'info@sandtoncity.com',
      website: 'https://sandtoncity.com',
      social: {
        facebook: 'SandtonCityOfficial',
        twitter: '@SandtonCity',
        instagram: '@sandtoncity'
      }
    },
    amenities: ['WiFi', 'Parking', 'Food Court', 'Cinema', 'ATMs', 'Baby Change', 'Wheelchair Access'],
    accessibility: {
      wheelchairAccessible: true,
      elevators: 8,
      escalators: 12,
      disabledParking: 50,
      brailleSignage: true,
      audioAssistance: true
    },
    parking: {
      totalSpaces: 7000,
      disabledSpaces: 50,
      hourlyRate: 15,
      dailyRate: 80,
      evCharging: true
    },
    bleBeacons: [
      { id: 'sc-001', name: 'Main Entrance', uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', major: 1001, minor: 1, position: { x: 0, y: 0, floor: 0 }, transmissionPower: -59, battery: 95, lastSeen: '2024-01-20T10:30:00Z', status: 'active' },
      { id: 'sc-002', name: 'Food Court', uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', major: 1001, minor: 2, position: { x: 100, y: 50, floor: 1 }, transmissionPower: -59, battery: 88, lastSeen: '2024-01-20T10:28:00Z', status: 'active' },
      { id: 'sc-003', name: 'Cinema Level', uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', major: 1001, minor: 3, position: { x: 150, y: 100, floor: 2 }, transmissionPower: -59, battery: 92, lastSeen: '2024-01-20T10:25:00Z', status: 'active' },
      { id: 'sc-004', name: 'Parking Level A', uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', major: 1001, minor: 4, position: { x: 50, y: 25, floor: -1 }, transmissionPower: -59, battery: 76, lastSeen: '2024-01-20T10:20:00Z', status: 'active' },
      { id: 'sc-005', name: 'Department Store', uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', major: 1001, minor: 5, position: { x: 200, y: 75, floor: 1 }, transmissionPower: -59, battery: 65, lastSeen: '2024-01-20T10:15:00Z', status: 'low_battery' }
    ],
    pois: [
      { id: 'sc-poi-001', name: 'Pick n Pay', type: 'store', position: { x: 50, y: 30, floor: 0 }, description: 'Supermarket', category: 'grocery', hours: '08:00-20:00' },
      { id: 'sc-poi-002', name: 'Woolworths', type: 'store', position: { x: 75, y: 45, floor: 0 }, description: 'Department store', category: 'retail', hours: '09:00-21:00' },
      { id: 'sc-poi-003', name: 'Mugg & Bean', type: 'restaurant', position: { x: 100, y: 55, floor: 1 }, description: 'Coffee shop and restaurant', category: 'dining', hours: '06:30-22:00' },
      { id: 'sc-poi-004', name: 'Nu Metro Cinema', type: 'service', position: { x: 150, y: 95, floor: 2 }, description: 'Movie theater complex', category: 'entertainment', hours: '10:00-24:00' }
    ],
    navigationGraph: {
      nodes: [
        { id: 'entrance-main', x: 0, y: 0, floor: 0, type: 'entrance' },
        { id: 'food-court', x: 100, y: 50, floor: 1, type: 'landmark' },
        { id: 'cinema', x: 150, y: 100, floor: 2, type: 'landmark' },
        { id: 'parking-a', x: 50, y: 25, floor: -1, type: 'parking' }
      ],
      edges: [
        { from: 'entrance-main', to: 'food-court', distance: 111.8, accessible: true },
        { from: 'food-court', to: 'cinema', distance: 70.7, accessible: true },
        { from: 'entrance-main', to: 'parking-a', distance: 55.9, accessible: true }
      ]
    },
    rating: 4.3,
    reviewCount: 12847,
    images: ['/images/venues/sandton-city-1.jpg', '/images/venues/sandton-city-2.jpg'],
    description: 'Premier shopping destination in Sandton with over 300 stores, restaurants, and entertainment facilities.',
    tags: ['shopping', 'dining', 'entertainment', 'parking', 'accessibility'],
    lastUpdated: '2024-01-20T10:30:00Z',
    isActive: true
  },
  {
    id: 'va-waterfront',
    name: 'V&A Waterfront',
    type: 'shopping_mall',
    address: 'Dock Road, Victoria & Alfred Waterfront',
    city: 'Cape Town',
    province: 'Western Cape',
    coordinates: { latitude: -33.902248, longitude: 18.419390 },
    capacity: 35000,
    floors: 3,
    operatingHours: '09:00 - 21:00',
    contact: {
      phone: '+27 21 408 7600',
      email: 'info@waterfront.co.za',
      website: 'https://waterfront.co.za',
      social: {
        facebook: 'VAWaterfront',
        twitter: '@VAWaterfront',
        instagram: '@vawaterfront'
      }
    },
    amenities: ['WiFi', 'Parking', 'Restaurants', 'Aquarium', 'Hotels', 'Marina', 'Entertainment'],
    accessibility: {
      wheelchairAccessible: true,
      elevators: 6,
      escalators: 8,
      disabledParking: 35,
      brailleSignage: true,
      audioAssistance: true
    },
    parking: {
      totalSpaces: 4500,
      disabledSpaces: 35,
      hourlyRate: 12,
      dailyRate: 70,
      evCharging: true
    },
    bleBeacons: [
      { id: 'va-001', name: 'Waterfront Entrance', uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', major: 2001, minor: 1, position: { x: 0, y: 0, floor: 0 }, transmissionPower: -59, battery: 91, lastSeen: '2024-01-20T10:32:00Z', status: 'active' },
      { id: 'va-002', name: 'Aquarium', uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', major: 2001, minor: 2, position: { x: 120, y: 80, floor: 0 }, transmissionPower: -59, battery: 87, lastSeen: '2024-01-20T10:30:00Z', status: 'active' },
      { id: 'va-003', name: 'Food Market', uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', major: 2001, minor: 3, position: { x: 80, y: 60, floor: 1 }, transmissionPower: -59, battery: 94, lastSeen: '2024-01-20T10:28:00Z', status: 'active' }
    ],
    pois: [
      { id: 'va-poi-001', name: 'Two Oceans Aquarium', type: 'service', position: { x: 120, y: 80, floor: 0 }, description: 'World-class aquarium', category: 'entertainment', hours: '09:30-18:00' },
      { id: 'va-poi-002', name: 'Zeitz Museum', type: 'service', position: { x: 90, y: 70, floor: 0 }, description: 'Contemporary African art museum', category: 'culture', hours: '10:00-18:00' },
      { id: 'va-poi-003', name: 'Food Market', type: 'restaurant', position: { x: 80, y: 60, floor: 1 }, description: 'Local and international cuisine', category: 'dining', hours: '10:00-22:00' }
    ],
    navigationGraph: {
      nodes: [
        { id: 'waterfront-entrance', x: 0, y: 0, floor: 0, type: 'entrance' },
        { id: 'aquarium-entrance', x: 120, y: 80, floor: 0, type: 'landmark' },
        { id: 'food-market-entrance', x: 80, y: 60, floor: 1, type: 'landmark' }
      ],
      edges: [
        { from: 'waterfront-entrance', to: 'aquarium-entrance', distance: 144.2, accessible: true },
        { from: 'waterfront-entrance', to: 'food-market-entrance', distance: 100.0, accessible: true },
        { from: 'aquarium-entrance', to: 'food-market-entrance', distance: 44.7, accessible: true }
      ]
    },
    rating: 4.5,
    reviewCount: 18932,
    images: ['/images/venues/va-waterfront-1.jpg', '/images/venues/va-waterfront-2.jpg'],
    description: 'Historic waterfront destination combining shopping, dining, entertainment, and cultural attractions.',
    tags: ['waterfront', 'shopping', 'aquarium', 'dining', 'culture', 'tourism'],
    lastUpdated: '2024-01-20T10:32:00Z',
    isActive: true
  }
]

interface VenueFilters {
  search: string
  type: string
  province: string
  status: string
  sortBy: string
}

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>(mockVenues)
  const [filters, setFilters] = useState<VenueFilters>({
    search: '',
    type: 'all',
    province: 'all',
    status: 'all',
    sortBy: 'name'
  })
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  const filteredVenues = useMemo(() => {
    let filtered = venues

    if (filters.search) {
      filtered = filtered.filter(venue => 
        venue.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        venue.address.toLowerCase().includes(filters.search.toLowerCase()) ||
        venue.city.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(venue => venue.type === filters.type)
    }

    if (filters.province !== 'all') {
      filtered = filtered.filter(venue => venue.province === filters.province)
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(venue => 
        filters.status === 'active' ? venue.isActive : !venue.isActive
      )
    }

    // Sort venues
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'rating':
          return b.rating - a.rating
        case 'capacity':
          return b.capacity - a.capacity
        case 'updated':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [venues, filters])

  const venueStats = useMemo(() => {
    const totalVenues = venues.length
    const activeVenues = venues.filter(v => v.isActive).length
    const totalCapacity = venues.reduce((sum, v) => sum + v.capacity, 0)
    const totalBeacons = venues.reduce((sum, v) => sum + v.bleBeacons.length, 0)
    const totalPOIs = venues.reduce((sum, v) => sum + v.pois.length, 0)
    const avgRating = venues.reduce((sum, v) => sum + v.rating, 0) / totalVenues

    return {
      totalVenues,
      activeVenues,
      totalCapacity,
      totalBeacons,
      totalPOIs,
      avgRating: avgRating.toFixed(1)
    }
  }, [venues])

  const getStatusBadge = (status: 'active' | 'inactive' | 'low_battery') => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-red-100 text-red-800 border-red-200',
      low_battery: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
    return styles[status] || styles.inactive
  }

  const VenueCard = ({ venue }: { venue: Venue }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative group hover:shadow-lg transition-all duration-300 overflow-hidden border-purple-200 hover:border-purple-300">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardContent className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{venue.name}</h3>
                <p className="text-sm text-gray-600">{venue.city}, {venue.province}</p>
              </div>
            </div>
            <Badge className={`${venue.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {venue.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>{venue.capacity.toLocaleString()} capacity</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="h-4 w-4" />
              <span>{venue.floors} floors</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Wifi className="h-4 w-4" />
              <span>{venue.bleBeacons.length} beacons</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{venue.pois.length} POIs</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{venue.rating}</span>
              <span className="text-sm text-gray-500">({venue.reviewCount.toLocaleString()})</span>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedVenue(venue)}
              >
                <Eye className="h-4 w-4 mr-1" />
                <span>View</span>
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                <span>Edit</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const BLEBeaconStatus = ({ beacon }: { beacon: BLEBeacon }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${
          beacon.status === 'active' ? 'bg-green-500' : 
          beacon.status === 'low_battery' ? 'bg-yellow-500' : 'bg-red-500'
        }`}></div>
        <div>
          <p className="font-medium text-sm">{beacon.name}</p>
          <p className="text-xs text-gray-600">Floor {beacon.position.floor} • {beacon.major}.{beacon.minor}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium">{beacon.battery}%</p>
        <p className="text-xs text-gray-600">{beacon.transmissionPower}dBm</p>
      </div>
    </div>
  )

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
                <span>Export</span>
              </Button>
              <Button className="text-sm bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                <span>Add Venue</span>
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
                  <p className="text-2xl font-bold text-gray-900">{venueStats.totalVenues}</p>
                  <div className="flex items-center text-xs mt-1">
                    <span className="text-green-600 font-medium">+8%</span>
                    <span className="text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative group hover:shadow-lg transition-all duration-300 overflow-hidden border-indigo-200">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-50"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Venues</p>
                  <p className="text-2xl font-bold text-gray-900">{venueStats.activeVenues}</p>
                  <div className="flex items-center text-xs mt-1">
                    <span className="text-indigo-600 font-medium">{venueStats.totalCapacity.toLocaleString()} total capacity</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative group hover:shadow-lg transition-all duration-300 overflow-hidden border-blue-200">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">BLE Beacons</p>
                  <p className="text-2xl font-bold text-gray-900">{venueStats.totalBeacons}</p>
                  <div className="flex items-center text-xs mt-1">
                    <span className="text-blue-600 font-medium">Navigation enabled</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Navigation className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative group hover:shadow-lg transition-all duration-300 overflow-hidden border-emerald-200">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Points of Interest</p>
                  <p className="text-2xl font-bold text-gray-900">{venueStats.totalPOIs}</p>
                  <div className="flex items-center text-xs mt-1">
                    <span className="text-emerald-600 font-medium">Avg {venueStats.avgRating}★ rating</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search venues, addresses, or cities..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="shopping_mall">Shopping Mall</SelectItem>
                    <SelectItem value="airport">Airport</SelectItem>
                    <SelectItem value="hospital">Hospital</SelectItem>
                    <SelectItem value="university">University</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="hotel">Hotel</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.province} onValueChange={(value) => setFilters({ ...filters, province: value })}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Province" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Provinces</SelectItem>
                    <SelectItem value="Gauteng">Gauteng</SelectItem>
                    <SelectItem value="Western Cape">Western Cape</SelectItem>
                    <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                    <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.sortBy} onValueChange={(value) => setFilters({ ...filters, sortBy: value })}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="capacity">Capacity</SelectItem>
                    <SelectItem value="updated">Last Updated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>

        {/* Venue Detail Modal */}
        {selectedVenue && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{selectedVenue.name}</h2>
                  <Button variant="outline" onClick={() => setSelectedVenue(null)}>
                    <span>Close</span>
                  </Button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="beacons">BLE Beacons</TabsTrigger>
                    <TabsTrigger value="pois">Points of Interest</TabsTrigger>
                    <TabsTrigger value="navigation">Navigation</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold mb-2">Location</h3>
                        <p className="text-sm text-gray-600">{selectedVenue.address}</p>
                        <p className="text-sm text-gray-600">{selectedVenue.city}, {selectedVenue.province}</p>
                        <p className="text-sm text-gray-600">
                          {selectedVenue.coordinates.latitude}, {selectedVenue.coordinates.longitude}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Details</h3>
                        <p className="text-sm text-gray-600">Capacity: {selectedVenue.capacity.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Floors: {selectedVenue.floors}</p>
                        <p className="text-sm text-gray-600">Hours: {selectedVenue.operatingHours}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Amenities</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedVenue.amenities.map((amenity) => (
                          <Badge key={amenity} variant="secondary">{amenity}</Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="beacons" className="space-y-4">
                    <div className="grid gap-3">
                      {selectedVenue.bleBeacons.map((beacon) => (
                        <BLEBeaconStatus key={beacon.id} beacon={beacon} />
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="pois" className="space-y-4">
                    <div className="grid gap-3">
                      {selectedVenue.pois.map((poi) => (
                        <div key={poi.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{poi.name}</p>
                            <p className="text-xs text-gray-600">{poi.type} • Floor {poi.position.floor}</p>
                            {poi.description && (
                              <p className="text-xs text-gray-500 mt-1">{poi.description}</p>
                            )}
                          </div>
                          <Badge variant="outline">{poi.category}</Badge>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="navigation" className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Navigation Nodes</h3>
                      <div className="grid gap-2">
                        {selectedVenue.navigationGraph.nodes.map((node) => (
                          <div key={node.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm font-medium">{node.id}</span>
                            <span className="text-xs text-gray-600">
                              Floor {node.floor} • ({node.x}, {node.y})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Navigation Edges</h3>
                      <div className="grid gap-2">
                        {selectedVenue.navigationGraph.edges.map((edge, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm font-medium">{edge.from} → {edge.to}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-600">{edge.distance.toFixed(1)}m</span>
                              {edge.accessible && (
                                <Badge variant="outline" className="text-xs">
                                  <Accessibility className="h-3 w-3 mr-1" />
                                  <span>Accessible</span>
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
