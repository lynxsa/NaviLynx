'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Radio,
  Wifi,
  Settings,
  RefreshCw,
  Download,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Battery,
  Signal,
  MapPin,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target
} from "lucide-react"

// Beacon/Device Management interfaces aligned with NaviLynx mobile app
interface BeaconDevice {
  id: string
  name: string
  type: 'ble_beacon' | 'rfid_tag' | 'wifi_access_point' | 'qr_code'
  status: 'online' | 'offline' | 'low_battery' | 'maintenance'
  venueId: string
  venueName: string
  floor: string
  zone: string
  coordinates: { x: number; y: number; z?: number }
  batteryLevel?: number
  signalStrength: number
  lastSeen: Date
  configuration: {
    transmissionPower: number
    broadcastInterval: number
    range: number
    uuid?: string
    major?: number
    minor?: number
  }
  assignedFeatures: string[]
  maintenanceSchedule?: Date
  installationDate: Date
  notes?: string
}

// South African venue beacon data aligned with NaviLynx system
const mockBeaconData: BeaconDevice[] = [
  {
    id: 'beacon_001',
    name: 'Entrance Main - BLE001',
    type: 'ble_beacon',
    status: 'online',
    venueId: 'sandton-city',
    venueName: 'Sandton City',
    floor: 'Ground Floor',
    zone: 'Main Entrance',
    coordinates: { x: 125, y: 200, z: 0 },
    batteryLevel: 87,
    signalStrength: -45,
    lastSeen: new Date(Date.now() - 2 * 60 * 1000),
    configuration: {
      transmissionPower: 4,
      broadcastInterval: 100,
      range: 50,
      uuid: 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0',
      major: 1,
      minor: 1
    },
    assignedFeatures: ['Indoor Navigation', 'Store Locator', 'Emergency Exit'],
    installationDate: new Date('2024-01-15'),
    notes: 'Primary entrance beacon - high traffic area'
  },
  {
    id: 'beacon_002',
    name: 'Food Court - BLE002',
    type: 'ble_beacon',
    status: 'online',
    venueId: 'sandton-city',
    venueName: 'Sandton City',
    floor: 'Level 2',
    zone: 'Food Court',
    coordinates: { x: 300, y: 450, z: 20 },
    batteryLevel: 92,
    signalStrength: -38,
    lastSeen: new Date(Date.now() - 1 * 60 * 1000),
    configuration: {
      transmissionPower: 3,
      broadcastInterval: 150,
      range: 40,
      uuid: 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0',
      major: 1,
      minor: 2
    },
    assignedFeatures: ['Restaurant Finder', 'Queue Management', 'Menu Display'],
    installationDate: new Date('2024-01-15'),
    notes: 'Central food court location'
  },
  {
    id: 'beacon_003',
    name: 'Woolworths Entry - BLE003',
    type: 'ble_beacon',
    status: 'low_battery',
    venueId: 'v-a-waterfront',
    venueName: 'V&A Waterfront',
    floor: 'Level 1',
    zone: 'Woolworths Store',
    coordinates: { x: 180, y: 320, z: 10 },
    batteryLevel: 15,
    signalStrength: -62,
    lastSeen: new Date(Date.now() - 8 * 60 * 1000),
    configuration: {
      transmissionPower: 2,
      broadcastInterval: 200,
      range: 30,
      uuid: 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0',
      major: 2,
      minor: 1
    },
    assignedFeatures: ['Store Navigation', 'Product Locator', 'Deal Notifications'],
    maintenanceSchedule: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    installationDate: new Date('2024-01-20'),
    notes: 'Battery replacement scheduled'
  },
  {
    id: 'rfid_001',
    name: 'Cotton On - RFID001',
    type: 'rfid_tag',
    status: 'online',
    venueId: 'gateway-theatre',
    venueName: 'Gateway Theatre of Shopping',
    floor: 'Ground Floor',
    zone: 'Cotton On Store',
    coordinates: { x: 240, y: 150, z: 0 },
    signalStrength: -35,
    lastSeen: new Date(Date.now() - 5 * 60 * 1000),
    configuration: {
      transmissionPower: 5,
      broadcastInterval: 50,
      range: 20
    },
    assignedFeatures: ['Product Tracking', 'Inventory Management', 'Anti-theft'],
    installationDate: new Date('2024-01-18'),
    notes: 'Fashion retail RFID system'
  },
  {
    id: 'wifi_001',
    name: 'Main WiFi AP - WAP001',
    type: 'wifi_access_point',
    status: 'online',
    venueId: 'menlyn-park',
    venueName: 'Menlyn Park Shopping Centre',
    floor: 'All Floors',
    zone: 'Central Coverage',
    coordinates: { x: 200, y: 200, z: 15 },
    signalStrength: -25,
    lastSeen: new Date(Date.now() - 30 * 1000),
    configuration: {
      transmissionPower: 8,
      broadcastInterval: 10,
      range: 100
    },
    assignedFeatures: ['WiFi Positioning', 'Guest Internet', 'Device Tracking'],
    installationDate: new Date('2024-01-10'),
    notes: 'Main wireless access point for positioning'
  },
  {
    id: 'beacon_004',
    name: 'Pick n Pay - BLE004',
    type: 'ble_beacon',
    status: 'offline',
    venueId: 'menlyn-park',
    venueName: 'Menlyn Park Shopping Centre',
    floor: 'Ground Floor',
    zone: 'Pick n Pay Store',
    coordinates: { x: 360, y: 280, z: 0 },
    batteryLevel: 0,
    signalStrength: 0,
    lastSeen: new Date(Date.now() - 45 * 60 * 1000),
    configuration: {
      transmissionPower: 4,
      broadcastInterval: 100,
      range: 45,
      uuid: 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0',
      major: 3,
      minor: 1
    },
    assignedFeatures: ['Grocery Navigation', 'Smart Shopper Integration', 'Cashback Alerts'],
    maintenanceSchedule: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    installationDate: new Date('2024-01-12'),
    notes: 'Device offline - immediate attention required'
  }
]

export default function BeaconManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [venueFilter, setVenueFilter] = useState<string>('all')

  const filteredBeacons = mockBeaconData.filter(beacon => {
    const matchesSearch = beacon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         beacon.venueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         beacon.zone.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || beacon.status === statusFilter
    const matchesType = typeFilter === 'all' || beacon.type === typeFilter
    const matchesVenue = venueFilter === 'all' || beacon.venueId === venueFilter
    
    return matchesSearch && matchesStatus && matchesType && matchesVenue
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'offline': return 'bg-red-100 text-red-800 border-red-200'
      case 'low_battery': return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'maintenance': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4" />
      case 'offline': return <AlertTriangle className="w-4 h-4" />
      case 'low_battery': return <Battery className="w-4 h-4" />
      case 'maintenance': return <Settings className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ble_beacon': return <Radio className="w-4 h-4 text-blue-600" />
      case 'rfid_tag': return <Target className="w-4 h-4 text-purple-600" />
      case 'wifi_access_point': return <Wifi className="w-4 h-4 text-emerald-600" />
      case 'qr_code': return <MapPin className="w-4 h-4 text-amber-600" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const getBatteryColor = (level?: number) => {
    if (!level) return 'bg-gray-400'
    if (level > 50) return 'bg-emerald-500'
    if (level > 20) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const getSignalStrengthBars = (strength: number) => {
    const normalizedStrength = Math.max(0, Math.min(100, ((strength + 100) / 100) * 100))
    const bars = Math.ceil(normalizedStrength / 25)
    return Array.from({ length: 4 }, (_, i) => (
      <div
        key={i}
        className={`w-1 ${i < bars ? 'bg-emerald-500' : 'bg-gray-300'}`}
        style={{ height: `${(i + 1) * 4}px` }}
      />
    ))
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const statusStats = {
    online: mockBeaconData.filter(b => b.status === 'online').length,
    offline: mockBeaconData.filter(b => b.status === 'offline').length,
    lowBattery: mockBeaconData.filter(b => b.status === 'low_battery').length,
    maintenance: mockBeaconData.filter(b => b.status === 'maintenance').length
  }

  return (
    <AdminLayout userRole="admin">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
          >
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Beacon & Device Management</h1>
              <p className="text-lg text-gray-600">Monitor and manage indoor positioning devices across South African venues</p>
            </div>
            <div className="flex items-center gap-3 mt-4 lg:mt-0">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Status
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Report
              </Button>
              <Button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Add Device
              </Button>
            </div>
          </motion.div>

          {/* Status Overview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Online Devices</p>
                    <p className="text-3xl font-bold text-emerald-600">{statusStats.online}</p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Offline Devices</p>
                    <p className="text-3xl font-bold text-red-600">{statusStats.offline}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Low Battery</p>
                    <p className="text-3xl font-bold text-amber-600">{statusStats.lowBattery}</p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <Battery className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">System Health</p>
                    <p className="text-3xl font-bold text-blue-600">96.7%</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl border border-gray-200 mb-8 shadow-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search devices..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="low_battery">Low Battery</option>
                <option value="maintenance">Maintenance</option>
              </select>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="ble_beacon">BLE Beacon</option>
                <option value="rfid_tag">RFID Tag</option>
                <option value="wifi_access_point">WiFi AP</option>
                <option value="qr_code">QR Code</option>
              </select>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={venueFilter}
                onChange={(e) => setVenueFilter(e.target.value)}
              >
                <option value="all">All Venues</option>
                <option value="sandton-city">Sandton City</option>
                <option value="v-a-waterfront">V&A Waterfront</option>
                <option value="gateway-theatre">Gateway Theatre</option>
                <option value="menlyn-park">Menlyn Park</option>
              </select>

              <Button
                variant="outline"
                className="flex items-center justify-center gap-2"
              >
                <Filter className="w-4 h-4" />
                More Filters
              </Button>
            </div>
          </motion.div>

          {/* Devices Table */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Device Info</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Location</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Signal & Battery</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Last Seen</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBeacons.map((device, index) => (
                    <motion.tr 
                      key={device.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {getTypeIcon(device.type)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{device.name}</h3>
                            <p className="text-sm text-gray-600 capitalize">{device.type.replace('_', ' ')}</p>
                            <p className="text-xs text-gray-500">{device.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-gray-900">{device.venueName}</p>
                          <p className="text-sm text-gray-600">{device.floor} • {device.zone}</p>
                          <p className="text-xs text-gray-500">
                            Coords: ({device.coordinates.x}, {device.coordinates.y})
                          </p>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(device.status)}`}>
                          {getStatusIcon(device.status)}
                          <span className="capitalize">{device.status.replace('_', ' ')}</span>
                        </div>
                        {device.maintenanceSchedule && (
                          <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Maintenance scheduled
                          </p>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <div className="space-y-2">
                          {/* Signal Strength */}
                          <div className="flex items-center gap-2">
                            <Signal className="w-3 h-3 text-gray-500" />
                            <div className="flex items-end gap-0.5">
                              {getSignalStrengthBars(device.signalStrength)}
                            </div>
                            <span className="text-xs text-gray-600">{device.signalStrength}dBm</span>
                          </div>
                          
                          {/* Battery Level */}
                          {device.batteryLevel !== undefined && (
                            <div className="flex items-center gap-2">
                              <Battery className="w-3 h-3 text-gray-500" />
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${getBatteryColor(device.batteryLevel)}`}
                                  style={{ width: `${device.batteryLevel}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-600">{device.batteryLevel}%</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">
                          {formatTimeAgo(device.lastSeen)}
                        </div>
                        <p className="text-xs text-gray-500">
                          {device.lastSeen.toLocaleString('en-ZA')}
                        </p>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="p-2"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="p-2"
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="p-2 text-red-600 hover:text-red-700 hover:border-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  )
}
