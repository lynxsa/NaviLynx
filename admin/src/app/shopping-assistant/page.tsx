'use client'

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ShoppingBag,
  Search,
  Camera,
  Upload,
  Scan,
  CreditCard,
  Zap,
  Eye,
  Building2,
  Star,
  TrendingUp,
  Users,
  Package,
  Smartphone,
  Sparkles,
  ShoppingCart,
  MapPin,
  Clock,
  Award,
  Plus,
  Image as ImageIcon,
  QrCode,
  Download,
  Share2,
  Filter
} from "lucide-react"

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ElementType
  color: string
  action: () => void
  stats?: string
}

interface ScanResult {
  itemName: string
  category: string
  price: string
  stores: Array<{
    name: string
    price: string
    distance: string
    availability: string
  }>
}

export default function ShoppingAssistantPage() {
  const [scannedImage, setScannedImage] = useState<string | null>(null)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const quickActions: QuickAction[] = [
    {
      id: 'camera-scan',
      title: 'Camera Scan',
      description: 'Scan products instantly with your camera',
      icon: Camera,
      color: 'from-purple-500 to-purple-600',
      stats: '98% accuracy',
      action: () => handleCameraScan()
    },
    {
      id: 'image-upload',
      title: 'Upload Image',
      description: 'Upload product photos from gallery',
      icon: Upload,
      color: 'from-violet-500 to-violet-600',
      stats: 'Multiple formats',
      action: () => handleImageUpload()
    },
    {
      id: 'barcode-scan',
      title: 'Barcode Scanner',
      description: 'Scan product barcodes for instant info',
      icon: Scan,
      color: 'from-indigo-500 to-indigo-600',
      stats: 'Universal codes',
      action: () => handleBarcodeScan()
    },
    {
      id: 'store-cards',
      title: 'Store Cards',
      description: 'Manage loyalty cards and rewards',
      icon: CreditCard,
      color: 'from-fuchsia-500 to-fuchsia-600',
      stats: '12 stores',
      action: () => handleStoreCards()
    }
  ]

  const recentScans = [
    {
      id: '1',
      name: 'Samsung Galaxy Buds Pro',
      category: 'Electronics',
      price: 'R2,299 - R2,899',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop',
      scannedAt: '2 hours ago'
    },
    {
      id: '2',
      name: 'Nike Air Max 270',
      category: 'Footwear',
      price: 'R1,899 - R2,299',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
      scannedAt: '1 day ago'
    },
    {
      id: '3',
      name: 'iPhone 15 Pro Case',
      category: 'Accessories',
      price: 'R299 - R899',
      image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=100&h=100&fit=crop',
      scannedAt: '3 days ago'
    }
  ]

  const popularStores = [
    { name: 'Woolworths', logo: '🛒', cards: 8, deals: 23 },
    { name: 'Pick n Pay', logo: '🏪', cards: 12, deals: 18 },
    { name: 'Checkers', logo: '🛍️', cards: 6, deals: 15 },
    { name: 'Shoprite', logo: '🏬', cards: 4, deals: 12 }
  ]

  const handleCameraScan = () => {
    setIsScanning(true)
    // Simulate camera scanning
    setTimeout(() => {
      setIsScanning(false)
      setScanResult({
        itemName: 'Samsung Galaxy Buds Pro',
        category: 'Electronics',
        price: 'R2,299 - R2,899',
        stores: [
          { name: 'Sandton City - Samsung Store', price: 'R2,299', distance: '0.2km', availability: 'In Stock' },
          { name: 'Canal Walk - Incredible Connection', price: 'R2,499', distance: '12.5km', availability: 'In Stock' },
          { name: 'V&A Waterfront - iStore', price: 'R2,899', distance: '8.3km', availability: 'Limited Stock' }
        ]
      })
    }, 2000)
  }

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setScannedImage(e.target?.result as string)
        setIsScanning(true)
        
        // Simulate AI processing
        setTimeout(() => {
          setIsScanning(false)
          setScanResult({
            itemName: 'Nike Air Max 270',
            category: 'Footwear',
            price: 'R1,899 - R2,299',
            stores: [
              { name: 'Sandton City - Nike Store', price: 'R1,899', distance: '0.5km', availability: 'In Stock' },
              { name: 'Mall of Africa - Sportscene', price: 'R2,099', distance: '8.2km', availability: 'In Stock' },
              { name: 'Gateway - Totalsports', price: 'R2,299', distance: '15.1km', availability: 'Limited Stock' }
            ]
          })
        }, 2500)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBarcodeScan = () => {
    // Navigate to barcode scanner
    console.log('Opening barcode scanner...')
  }

  const handleStoreCards = () => {
    // Navigate to store cards management
    console.log('Opening store cards...')
  }

  return (
    <AdminLayout userRole="admin">
      <div className="p-6 max-w-7xl mx-auto space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-violet-50/20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Shopping Assistant</h1>
                <p className="text-sm text-slate-600">AI-powered shopping companion for modern retail</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="text-sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button className="text-sm bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700">
                <Plus className="h-4 w-4 mr-2" />
                New Scan
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Scans', value: '2,847', change: '+12%', icon: Eye, color: 'purple' },
            { label: 'Products Found', value: '1,923', change: '+8%', icon: Package, color: 'violet' },
            { label: 'Store Cards', value: '48', change: '+23%', icon: CreditCard, color: 'indigo' },
            { label: 'User Sessions', value: '934', change: '+18%', icon: Users, color: 'fuchsia' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                      <div className="flex items-center text-xs mt-2">
                        <TrendingUp className="h-3 w-3 text-purple-500 mr-1" />
                        <span className="text-purple-600 font-medium">{stat.change}</span>
                        <span className="text-slate-500 ml-1">this week</span>
                      </div>
                    </div>
                    <div className={`w-10 h-10 bg-${stat.color}-50 rounded-lg flex items-center justify-center`}>
                      <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-800">Quick Actions</CardTitle>
                  <p className="text-sm text-slate-600 mt-1">Start scanning or manage your store cards</p>
                </div>
                <Sparkles className="h-5 w-5 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="group"
                  >
                    <Button
                      variant="outline"
                      className="w-full h-auto p-4 flex flex-col items-center gap-3 text-center hover:shadow-lg transition-all duration-200 border-slate-200 hover:border-purple-300 hover:bg-purple-50/50"
                      onClick={action.action}
                    >
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} text-white shadow-sm group-hover:shadow-md transition-shadow`}>
                        <action.icon className="h-6 w-6" />
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="font-semibold text-sm text-slate-800 group-hover:text-purple-700 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {action.description}
                        </p>
                        {action.stats && (
                          <Badge variant="secondary" className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-700">
                            {action.stats}
                          </Badge>
                        )}
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search products, stores, or scan history..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-slate-200 focus:border-purple-300 focus:ring-purple-200"
                  />
                </div>
                <Button variant="outline" className="px-4">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Scan Results */}
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-center flex-col space-y-4">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-800">AI Processing...</h3>
                <p className="text-sm text-slate-600">Analyzing your image with advanced computer vision</p>
              </div>
            </div>
          </motion.div>
        )}

        {scanResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border border-purple-200 shadow-sm bg-purple-50/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Eye className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-800">{scanResult.itemName}</CardTitle>
                    <p className="text-sm text-slate-600">{scanResult.category} • {scanResult.price}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-medium text-slate-800">Available at these stores:</h4>
                  {scanResult.stores.map((store, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                      <div>
                        <p className="font-medium text-slate-800">{store.name}</p>
                        <p className="text-sm text-slate-600">{store.distance} away</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg text-slate-800">{store.price}</p>
                        <Badge 
                          variant={store.availability === 'In Stock' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {store.availability}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Scans */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-800">Recent Scans</CardTitle>
                  <Badge variant="secondary" className="text-xs">{recentScans.length} items</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentScans.map((scan) => (
                    <div key={scan.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                      <img 
                        src={scan.image} 
                        alt={scan.name} 
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-slate-800 text-sm">{scan.name}</p>
                        <p className="text-xs text-slate-500">{scan.category} • {scan.scannedAt}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm text-slate-800">{scan.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Popular Stores */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-800">Popular Stores</CardTitle>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {popularStores.map((store, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center text-lg">
                          {store.logo}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 text-sm">{store.name}</p>
                          <p className="text-xs text-slate-500">{store.cards} cards • {store.deals} deals</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Active</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </AdminLayout>
  )
}
