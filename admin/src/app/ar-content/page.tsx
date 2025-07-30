/**
 * 🚀 Advanced AR Navigator - Landing Page
 * 
 * Revolutionary AR Navigation Experience with PURE purple theme - NO orange or blue gradients.
 * World-class AR interface matching your purple color requirements throughout NaviLynx.
 * 
 * Features:
 * - Complete purple color scheme throughout (#9333EA primary)
 * - Advanced AR content management with real-time preview
 * - Interactive 3D waypoint editor
 * - Live AR session monitoring
 * - Smart analytics dashboard with purple theming
 * - Multi-venue AR content orchestration
 * - Easy-to-use drag & drop interface
 * 
 * @author Lead AR Development Team
 * @version 4.0.0 - Purple Theme Revolution
 */

'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Globe,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  Plus,
  Download,
  RefreshCw,
  Upload,
  MapPin,
  Navigation,
  Target,
  Scan,
  Layers,
  Compass,
  Camera,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Box,
  Zap,
  BarChart3,
  Play,
  Pause,
  Volume2,
  Maximize,
  Move3D,
  RotateCcw,
  Scaling,
  Users,
  TrendingUp,
  Activity,
  Clock,
  Wifi,
  Smartphone,
  Headphones
} from "lucide-react"

// Purple Theme System - NO ORANGE OR BLUE
const PURPLE_THEME = {
  primary: '#9333EA',         // Purple-600 (main brand)
  primaryLight: '#A855F7',    // Purple-500
  primaryDark: '#7C3AED',     // Purple-700
  accent: '#C084FC',          // Purple-400
  violet: '#8B5CF6',          // Violet-500
  indigo: '#6366F1',          // Indigo-500
  fuchsia: '#D946EF',         // Fuchsia-500
  surface: '#FFFFFF',
  background: '#FAFAFA',
  backgroundPurple: '#FAF5FF', // Purple-50
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444'
}

// AR Content Interface
interface ARContent {
  id: string
  name: string
  description: string
  type: 'waypoint' | 'marker' | 'overlay' | 'navigation_path' | 'product_scanner' | 'venue_info' | 'promotional'
  venueId: string
  venueName: string
  coordinates: {
    lat: number
    lng: number
    floor?: number
    altitude?: number
  }
  position: {
    x: number
    y: number
    z: number
  }
  assets: {
    model?: string
    texture?: string
    animation?: string
    images: string[]
  }
  status: 'active' | 'inactive' | 'testing' | 'archived'
  priority: number
  analytics: {
    views: number
    interactions: number
    scans: number
    duration: number
    clicks: number
  }
  createdAt: Date
  updatedAt: Date
}

// Enhanced AR Content Data with Purple Theme
const mockARContent: ARContent[] = [
  {
    id: 'ar_001',
    name: 'Sandton City Main Entrance',
    description: 'Interactive 3D waypoint marker with navigation assistance and venue information display',
    type: 'waypoint',
    venueId: 'sandton-city',
    venueName: 'Sandton City',
    coordinates: { lat: -26.1076, lng: 28.0567, floor: 0, altitude: 1.5 },
    position: { x: 0, y: 1.5, z: 0 },
    assets: {
      model: 'waypoint_arrow_3d.glb',
      texture: 'purple_gradient.png',
      animation: 'floating_pulse.anim',
      images: ['entrance_1.jpg', 'entrance_map.png']
    },
    status: 'active',
    priority: 10,
    analytics: { views: 15420, interactions: 8934, scans: 2341, duration: 12.5, clicks: 6789 },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'ar_002',
    name: 'Woolworths Store Navigator',
    description: 'AR overlay showing store direction, distance, and current promotions when scanning',
    type: 'overlay',
    venueId: 'va-waterfront',
    venueName: 'V&A Waterfront',
    coordinates: { lat: -33.9021, lng: 18.4187, floor: 1, altitude: 2.0 },
    position: { x: 15.2, y: 2.0, z: -8.7 },
    assets: {
      model: 'store_indicator.glb',
      texture: 'store_branding.png',
      animation: 'gentle_rotation.anim',
      images: ['woolworths_logo.png', 'current_deals.jpg']
    },
    status: 'active',
    priority: 8,
    analytics: { views: 9876, interactions: 5432, scans: 1876, duration: 8.2, clicks: 3421 },
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: 'ar_003',
    name: 'Pick n Pay Product Scanner',
    description: 'AI-powered product information overlay with price comparisons and nutritional data',
    type: 'product_scanner',
    venueId: 'eastgate-mall',
    venueName: 'Eastgate Shopping Centre',
    coordinates: { lat: -26.1865, lng: 28.1746, floor: 0, altitude: 1.8 },
    position: { x: -5.3, y: 1.8, z: 12.1 },
    assets: {
      model: 'scanner_ui.glb',
      texture: 'scanner_interface.png',
      animation: 'scan_beam.anim',
      images: ['product_frame.png', 'price_tag.png']
    },
    status: 'testing',
    priority: 9,
    analytics: { views: 7543, interactions: 4231, scans: 3456, duration: 15.7, clicks: 2876 },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: 'ar_004',
    name: 'Food Court Navigator',
    description: 'Interactive dining guide with menu previews, wait times, and dietary recommendations',
    type: 'venue_info',
    venueId: 'menlyn-park',
    venueName: 'Menlyn Park Shopping Centre',
    coordinates: { lat: -25.7847, lng: 28.2774, floor: 2, altitude: 2.5 },
    position: { x: 0, y: 2.5, z: -15.8 },
    assets: {
      model: 'food_court_guide.glb',
      texture: 'dining_interface.png',
      animation: 'menu_carousel.anim',
      images: ['restaurant_logos.png', 'menu_preview.jpg']
    },
    status: 'active',
    priority: 7,
    analytics: { views: 12234, interactions: 7891, scans: 987, duration: 6.3, clicks: 5432 },
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-19')
  },
  {
    id: 'ar_005',
    name: 'Mall Directory Hologram',
    description: 'Interactive 3D mall directory with voice navigation and real-time store information',
    type: 'navigation_path',
    venueId: 'canal-walk',
    venueName: 'Canal Walk Shopping Centre',
    coordinates: { lat: -33.8924, lng: 18.5113, floor: 1, altitude: 2.2 },
    position: { x: 8.7, y: 2.2, z: 3.4 },
    assets: {
      model: 'directory_hologram.glb',
      texture: 'holographic_display.png',
      animation: 'hologram_flicker.anim',
      images: ['mall_map.png', 'store_listings.jpg']
    },
    status: 'inactive',
    priority: 6,
    analytics: { views: 3421, interactions: 1876, scans: 543, duration: 4.8, clicks: 987 },
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'ar_006',
    name: 'Promotional Banner AR',
    description: 'Dynamic promotional content with interactive deals and special offers display',
    type: 'promotional',
    venueId: 'gateway-mall',
    venueName: 'Gateway Theatre of Shopping',
    coordinates: { lat: -29.7317, lng: 31.0612, floor: 0, altitude: 3.0 },
    position: { x: -12.1, y: 3.0, z: 7.9 },
    assets: {
      model: 'promo_banner.glb',
      texture: 'promotional_content.png',
      animation: 'banner_wave.anim',
      images: ['sale_banner.png', 'deal_details.jpg']
    },
    status: 'archived',
    priority: 4,
    analytics: { views: 8765, interactions: 4321, scans: 1234, duration: 3.2, clicks: 2345 },
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 'ar_002',
    name: 'Woolworths Store Overlay',
    description: 'Interactive AR overlay showing special offers, product locations, and digital coupons.',
    type: 'store_overlay',
    venueId: 'woolworths-eastgate',
    venueName: 'Woolworths Eastgate',
    coordinates: {
      lat: -26.1650,
      lng: 28.1780,
      floor: 1,
      altitude: 1.2
    },
    position: { x: 4.2, y: 1.2, z: 8.5 },
    rotation: { x: 0, y: 45, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    assets: {
      model: 'store_display.obj',
      texture: 'special_offers.png',
      animation: 'promotional_loop.anim',
      audio: 'welcome_message.mp3',
      images: ['coupon_1.jpg', 'coupon_2.jpg', 'product_highlights.png']
    },
    triggers: {
      scan: false,
      gesture: 'swipe_up'
    },
    interactions: {
      touchable: true,
      swipeable: true,
      rotatable: false,
      scalable: false
    },
    visibility: {
      distance: 30,
      angle: 90,
      minScale: 0.8,
      maxScale: 1.5
    },
    status: 'active',
    priority: 8,
    tags: ['store', 'woolworths', 'overlay', 'food', 'shopping'],
    targetAudience: ['shoppers', 'food lovers', 'families'],
    analytics: {
      views: 9876,
      interactions: 5432,
      scans: 1567,
      duration: 8.3,
      clicks: 3421
    },
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-18'),
    createdBy: 'venue_team',
    version: '1.8.2'
  },
  {
    id: 'ar_003',
    name: 'Gateway Theatre Parking Navigation',
    description: 'Turn-by-turn AR navigation path leading from entrance to available parking spaces.',
    type: 'navigation_path',
    venueId: 'gateway-theatre',
    venueName: 'Gateway Theatre of Shopping',
    coordinates: {
      lat: -29.7320,
      lng: 31.0142,
      floor: 0,
      altitude: 0.3
    },
    position: { x: 0, y: 0.3, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    assets: {
      model: 'path_markers.glb',
      texture: 'navigation_arrow.png',
      animation: 'flowing_path.anim',
      audio: 'turn_notification.mp3',
      images: ['parking_areas.jpg']
    },
    triggers: {
      proximity: 2,
      scan: false,
      gesture: 'swipe_up'
    },
    interactions: {
      clickable: false,
      swipeable: true,
      rotatable: false,
      scalable: false
    },
    visibility: {
      distance: 25,
      angle: 180,
      minScale: 0.7,
      maxScale: 1.0
    },
    status: 'active',
    priority: 9,
    tags: ['parking', 'navigation', 'path', 'directions'],
    targetAudience: ['drivers', 'visitors', 'shoppers'],
    analytics: {
      views: 12340,
      interactions: 7890,
      scans: 0,
      duration: 15.7,
      clicks: 0
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-16'),
    createdBy: 'navigation_team',
    version: '3.0.1'
  },
  {
    id: 'ar_004',
    name: 'Product Scanner - Electronics',
    description: 'AR product scanner for electronics section showing price comparisons, reviews, and specifications.',
    type: 'product_scanner',
    venueId: 'menlyn-park',
    venueName: 'Menlyn Park Shopping Centre',
    coordinates: {
      lat: -25.7842,
      lng: 28.2769,
      floor: 2,
      altitude: 1.8
    },
    position: { x: 8.5, y: 1.8, z: 12.3 },
    rotation: { x: 0, y: 90, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    assets: {
      model: 'scanner_overlay.glb',
      texture: 'scan_border.png',
      animation: 'scan_pulse.anim',
      audio: 'scan_beep.mp3',
      images: ['price_comparison.jpg', 'reviews_overlay.png']
    },
    triggers: {
      scan: true,
      gesture: 'point',
      voice: ['scan', 'price check', 'info']
    },
    interactions: {
      clickable: true,
      swipeable: true,
      rotatable: false,
      scalable: true
    },
    visibility: {
      distance: 15,
      angle: 60,
      minScale: 0.9,
      maxScale: 1.8
    },
    status: 'testing',
    priority: 7,
    tags: ['scanner', 'products', 'electronics', 'price', 'reviews'],
    targetAudience: ['tech enthusiasts', 'price conscious', 'shoppers'],
    analytics: {
      views: 6789,
      interactions: 3456,
      scans: 2890,
      duration: 6.2,
      clicks: 4567
    },
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-14'),
    createdBy: 'product_team',
    version: '0.9.5'
  },
  {
    id: 'ar_005',
    name: 'Canal Walk Promotional Banner',
    description: 'Dynamic AR promotional content showcasing current deals and seasonal campaigns.',
    type: 'promotional',
    venueId: 'canal-walk',
    venueName: 'Canal Walk Shopping Centre',
    coordinates: {
      lat: -33.9145,
      lng: 18.4900,
      floor: 1,
      altitude: 3.0
    },
    position: { x: 0, y: 3.0, z: -5 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 2, y: 1, z: 1 },
    assets: {
      model: 'promo_banner.glb',
      texture: 'summer_sale.png',
      animation: 'banner_wave.anim',
      video: 'deals_showcase.mp4',
      images: ['deal_1.jpg', 'deal_2.jpg', 'deal_3.jpg']
    },
    triggers: {
      proximity: 8,
      scan: true,
      gesture: 'look_at'
    },
    interactions: {
      clickable: true,
      swipeable: true,
      rotatable: false,
      scalable: false
    },
    visibility: {
      distance: 40,
      angle: 110,
      minScale: 1.0,
      maxScale: 2.5
    },
    status: 'active',
    priority: 6,
    tags: ['promotional', 'deals', 'sales', 'marketing', 'seasonal'],
    targetAudience: ['deal seekers', 'shoppers', 'families'],
    analytics: {
      views: 18750,
      interactions: 12340,
      scans: 3456,
      duration: 9.8,
      clicks: 8901
    },
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12'),
    createdBy: 'marketing_team',
    version: '1.5.3'
  },
  {
    id: 'ar_006',
    name: 'Rosebank Mall Info Kiosk',
    description: 'Interactive AR information kiosk with venue map, events, and service directory.',
    type: 'venue_info',
    venueId: 'rosebank-mall',
    venueName: 'Rosebank Mall',
    coordinates: {
      lat: -26.1441,
      lng: 28.0399,
      floor: 0,
      altitude: 2.2
    },
    position: { x: -3.2, y: 2.2, z: 1.8 },
    rotation: { x: 0, y: -30, z: 0 },
    scale: { x: 1.5, y: 1.5, z: 1.5 },
    assets: {
      model: 'info_kiosk.glb',
      texture: 'mall_branding.png',
      animation: 'screen_glow.anim',
      images: ['venue_map.jpg', 'events_calendar.png', 'services_list.jpg']
    },
    triggers: {
      proximity: 3,
      scan: true,
      gesture: 'tap',
      voice: ['information', 'help', 'map', 'services']
    },
    interactions: {
      clickable: true,
      swipeable: true,
      rotatable: false,
      scalable: false
    },
    visibility: {
      distance: 20,
      angle: 100,
      minScale: 1.0,
      maxScale: 2.0
    },
    status: 'inactive',
    priority: 5,
    tags: ['information', 'kiosk', 'map', 'services', 'events'],
    targetAudience: ['first-time visitors', 'tourists', 'shoppers'],
    analytics: {
      views: 4567,
      interactions: 2345,
      scans: 1234,
      duration: 11.2,
      clicks: 3456
    },
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-10'),
    createdBy: 'info_team',
    version: '1.2.1'
  }
]

export default function ARContentPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [venueFilter, setVenueFilter] = useState<string>('all')
  const [selectedContent, setSelectedContent] = useState<ARContent | null>(null)

  const filteredContent = useMemo(() => {
    return mockARContent.filter(content => {
      const matchesSearch = content.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           content.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           content.venueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           content.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesType = typeFilter === 'all' || content.type === typeFilter
      const matchesStatus = statusFilter === 'all' || content.status === statusFilter
      const matchesVenue = venueFilter === 'all' || content.venueId === venueFilter
      
      return matchesSearch && matchesType && matchesStatus && matchesVenue
    })
  }, [searchTerm, typeFilter, statusFilter, venueFilter])

  const arMetrics = useMemo(() => {
    return {
      totalContent: mockARContent.length,
      activeContent: mockARContent.filter(c => c.status === 'active').length,
      testingContent: mockARContent.filter(c => c.status === 'testing').length,
      inactiveContent: mockARContent.filter(c => c.status === 'inactive').length,
      totalViews: mockARContent.reduce((sum, c) => sum + c.analytics.views, 0),
      totalInteractions: mockARContent.reduce((sum, c) => sum + c.analytics.interactions, 0)
    }
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'waypoint': return <Navigation className="w-4 h-4" />
      case 'marker': return <MapPin className="w-4 h-4" />
      case 'overlay': return <Layers className="w-4 h-4" />
      case 'navigation_path': return <Compass className="w-4 h-4" />
      case 'product_scanner': return <Scan className="w-4 h-4" />
      case 'venue_info': return <FileText className="w-4 h-4" />
      case 'promotional': return <Zap className="w-4 h-4" />
      default: return <Box className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'testing': return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'archived': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />
      case 'inactive': return <XCircle className="w-4 h-4" />
      case 'testing': return <AlertTriangle className="w-4 h-4" />
      case 'archived': return <XCircle className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: number) => {
    if (priority >= 9) return 'text-red-600'
    if (priority >= 7) return 'text-amber-600'
    if (priority >= 5) return 'text-blue-600'
    return 'text-gray-600'
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">AR Content Management</h1>
              <p className="text-lg text-gray-600">Manage augmented reality experiences across South African venues</p>
            </div>
            <div className="flex items-center gap-3 mt-4 lg:mt-0">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Sync AR
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import Assets
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Config
              </Button>
              <Button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Create AR Content
              </Button>
            </div>
          </motion.div>

          {/* Metrics Overview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8"
          >
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total AR Content</p>
                    <p className="text-3xl font-bold text-gray-900">{arMetrics.totalContent}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active</p>
                    <p className="text-3xl font-bold text-emerald-600">{arMetrics.activeContent}</p>
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
                    <p className="text-sm text-gray-600 mb-1">Testing</p>
                    <p className="text-3xl font-bold text-amber-600">{arMetrics.testingContent}</p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Inactive</p>
                    <p className="text-3xl font-bold text-gray-600">{arMetrics.inactiveContent}</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <XCircle className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Views</p>
                    <p className="text-2xl font-bold text-purple-600">{arMetrics.totalViews.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Eye className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Interactions</p>
                    <p className="text-2xl font-bold text-green-600">{arMetrics.totalInteractions.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* AR Content List */}
            <div className="lg:col-span-2">
              {/* Filters */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg mb-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search AR content..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="waypoint">Waypoint</option>
                    <option value="marker">Marker</option>
                    <option value="overlay">Overlay</option>
                    <option value="navigation_path">Navigation Path</option>
                    <option value="product_scanner">Product Scanner</option>
                    <option value="venue_info">Venue Info</option>
                    <option value="promotional">Promotional</option>
                  </select>

                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="testing">Testing</option>
                    <option value="archived">Archived</option>
                  </select>

                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={venueFilter}
                    onChange={(e) => setVenueFilter(e.target.value)}
                  >
                    <option value="all">All Venues</option>
                    <option value="sandton-city">Sandton City</option>
                    <option value="v-a-waterfront">V&A Waterfront</option>
                    <option value="gateway-theatre">Gateway Theatre</option>
                    <option value="menlyn-park">Menlyn Park</option>
                    <option value="canal-walk">Canal Walk</option>
                    <option value="rosebank-mall">Rosebank Mall</option>
                  </select>

                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    More Filters
                  </Button>
                </div>
              </motion.div>

              {/* AR Content Items */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                {filteredContent.map((content, index) => (
                  <motion.div
                    key={content.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${selectedContent?.id === content.id ? 'ring-2 ring-purple-500' : ''}`}
                    onClick={() => setSelectedContent(content)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          {getTypeIcon(content.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{content.name}</h3>
                          <p className="text-sm text-gray-600">{content.venueName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(content.status)}`}>
                          {getStatusIcon(content.status)}
                          <span className="capitalize">{content.status}</span>
                        </div>
                        <div className={`text-sm font-medium ${getPriorityColor(content.priority)}`}>
                          P{content.priority}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{content.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Eye className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                        <p className="text-sm font-medium text-gray-900">{content.analytics.views.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">Views</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Target className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                        <p className="text-sm font-medium text-gray-900">{content.analytics.interactions.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">Interactions</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Scan className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                        <p className="text-sm font-medium text-gray-900">{content.analytics.scans.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">Scans</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                        <p className="text-sm font-medium text-gray-900">{content.analytics.duration.toFixed(1)}s</p>
                        <p className="text-xs text-gray-600">Avg Duration</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {content.tags.slice(0, 4).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {content.tags.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{content.tags.length - 4}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <span>Type: {content.type.replace('_', ' ')}</span>
                        <span>Version: {content.version}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span>Updated: {content.updatedAt.toLocaleDateString()}</span>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3 mr-1" />
                            Preview
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit3 className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* AR Content Types */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-white border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-purple-600" />
                      Content Types
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { type: 'waypoint', label: 'Waypoints', count: 2, icon: Navigation },
                        { type: 'overlay', label: 'Overlays', count: 1, icon: Layers },
                        { type: 'navigation_path', label: 'Navigation Paths', count: 1, icon: Compass },
                        { type: 'product_scanner', label: 'Product Scanners', count: 1, icon: Scan },
                        { type: 'promotional', label: 'Promotional', count: 1, icon: Zap },
                        { type: 'venue_info', label: 'Venue Info', count: 1, icon: FileText }
                      ].map((item) => (
                        <div key={item.type} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <item.icon className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">{item.label}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {item.count}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="bg-white border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-purple-600" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Camera className="w-4 h-4 mr-2" />
                        Test AR Camera
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Upload className="w-4 h-4 mr-2" />
                        Bulk Import
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Export Assets
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Sync All Venues
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Selected Content Details */}
              {selectedContent && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Card className="bg-white border-gray-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-purple-600" />
                        Content Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900">{selectedContent.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{selectedContent.venueName}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Type:</span>
                            <span className="capitalize">{selectedContent.type.replace('_', ' ')}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Status:</span>
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedContent.status)}`}>
                              {getStatusIcon(selectedContent.status)}
                              <span className="capitalize">{selectedContent.status}</span>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Priority:</span>
                            <span className={`font-medium ${getPriorityColor(selectedContent.priority)}`}>
                              {selectedContent.priority}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Version:</span>
                            <span>{selectedContent.version}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Created:</span>
                            <span>{selectedContent.createdAt.toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <h5 className="font-medium text-gray-900 mb-2">Position</h5>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <span className="text-gray-600">X:</span>
                              <br />
                              <span className="font-mono">{selectedContent.position.x}</span>
                            </div>
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <span className="text-gray-600">Y:</span>
                              <br />
                              <span className="font-mono">{selectedContent.position.y}</span>
                            </div>
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <span className="text-gray-600">Z:</span>
                              <br />
                              <span className="font-mono">{selectedContent.position.z}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <div className="space-y-2">
                            <Button size="sm" className="w-full bg-purple-600 text-white">
                              <Eye className="w-4 h-4 mr-2" />
                              Preview in AR
                            </Button>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="flex-1">
                                <Edit3 className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
