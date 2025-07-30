'use client'

import React from 'react'
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Building2,
  MapPin,
  Navigation,
  Users,
  Plus,
  Download,
  Activity,
  TrendingUp
} from "lucide-react"

export default function VenuesPage() {
  const mockVenueStats = {
    totalVenues: 4,
    activeVenues: 4,
    totalCapacity: 135000,
    totalBeacons: 8,
    totalPOIs: 7,
    avgRating: 4.4
  }

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
                <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
                  Venue Management
                </h1>
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
                  <p className="text-2xl font-bold text-gray-900">{mockVenueStats.totalVenues}</p>
                  <div className="flex items-center text-xs mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
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
                  <p className="text-2xl font-bold text-gray-900">{mockVenueStats.activeVenues}</p>
                  <div className="flex items-center text-xs mt-1">
                    <span className="text-indigo-600 font-medium">
                      {mockVenueStats.totalCapacity.toLocaleString()} total capacity
                    </span>
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
                  <p className="text-2xl font-bold text-gray-900">{mockVenueStats.totalBeacons}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{mockVenueStats.totalPOIs}</p>
                  <div className="flex items-center text-xs mt-1">
                    <span className="text-emerald-600 font-medium">Avg {mockVenueStats.avgRating}★ rating</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Venues List */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-600" />
              Comprehensive Venue Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                Real South African Venues with BLE Navigation
              </h3>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-white">Sandton City</Badge>
                  <span>Gauteng • 50,000 capacity • 5 BLE beacons • 4 POIs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-white">V&A Waterfront</Badge>
                  <span>Western Cape • 35,000 capacity • 3 BLE beacons • 3 POIs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-white">Menlyn Park</Badge>
                  <span>Gauteng • 30,000 capacity • Enhanced navigation system</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-white">OR Tambo Airport</Badge>
                  <span>Gauteng • 40,000 capacity • Terminal navigation</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-sm text-blue-700">
                  ✅ Comprehensive venue data structure created with real GPS coordinates<br/>
                  ✅ BLE beacon arrays with UUID/major/minor identifiers<br/>
                  ✅ POI mapping with indoor coordinates and categories<br/>
                  ✅ Navigation graphs with accessibility routing<br/>
                  🔄 Admin management interface ready for integration
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
