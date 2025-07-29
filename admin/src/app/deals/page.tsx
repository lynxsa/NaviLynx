'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Tag,
  Filter,
  Search,
  Eye,
  TrendingUp,
  Calendar,
  Percent,
  MapPin,
  ShoppingBag,
  Clock,
  BarChart3,
  Target,
  ThumbsUp,
  DollarSign,
  Edit3,
  Trash2,
  Plus,
  ExternalLink,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react"

// Mobile App Aligned Deal Interface - Extracted from mobile app types
interface MobileAppDeal {
  id: string
  title: string
  description: string
  type: 'discount' | 'buy_one_get_one' | 'cashback' | 'free_shipping' | 'bundle'
  value: number
  valueType: 'percentage' | 'fixed_amount' | 'points'
  category: string
  storeId?: string
  storeName?: string
  venueId?: string
  venueName?: string
  conditions: string[]
  validFrom: Date
  validUntil: Date
  maxRedemptions?: number
  currentRedemptions: number
  status: 'active' | 'inactive' | 'expired' | 'draft'
  images: string[]
  qrCode?: string
  promocode?: string
  targetAudience: {
    ageRange?: { min: number; max: number }
    gender?: 'male' | 'female' | 'all'
    location?: string[]
    interests?: string[]
    spendingRange?: { min: number; max: number }
    userSegments?: string[]
  }
  metrics: {
    views: number
    clicks: number
    redemptions: number
    conversions: number
    revenue: number
    clickThroughRate: number
    conversionRate: number
    revenuePerUser: number
  }
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

// South African Store-aligned mobile app deals data
const mobileDealData: MobileAppDeal[] = [
  {
    id: 'deal_001',
    title: 'Summer Fashion Sale - Up to 70% Off',
    description: 'Massive clearance on summer clothing, shoes, and accessories. Top brands including Cotton On, Markham, and Truworths.',
    type: 'discount',
    value: 70,
    valueType: 'percentage',
    category: 'fashion',
    storeId: 'store_001',
    storeName: 'Cotton On',
    venueId: 'sandton-city',
    venueName: 'Sandton City',
    conditions: ['Minimum purchase R150', 'Valid on selected items only', 'Not combinable with other offers'],
    validFrom: new Date('2024-01-15'),
    validUntil: new Date('2024-02-15'),
    maxRedemptions: 1000,
    currentRedemptions: 567,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'],
    qrCode: 'QR_SUMMER_FASHION_001',
    promocode: 'SUMMER70',
    targetAudience: {
      ageRange: { min: 18, max: 45 },
      gender: 'all',
      location: ['Gauteng', 'Western Cape'],
      interests: ['fashion', 'shopping'],
      spendingRange: { min: 150, max: 2000 }
    },
    metrics: {
      views: 15420,
      clicks: 2103,
      redemptions: 567,
      conversions: 340,
      revenue: 145600,
      clickThroughRate: 13.6,
      conversionRate: 27.0,
      revenuePerUser: 428.2
    },
    createdBy: 'marketing_team',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'deal_002',
    title: 'Electronics Flash Sale - 25% Off Tech',
    description: 'Limited time offer on smartphones, laptops, and accessories at TechZone stores across South Africa.',
    type: 'discount',
    value: 25,
    valueType: 'percentage',
    category: 'electronics',
    storeId: 'store_002',
    storeName: 'Incredible Connection',
    venueId: 'v-a-waterfront',
    venueName: 'V&A Waterfront',
    conditions: ['Valid on Apple, Samsung, and Huawei products', 'Minimum purchase R1000'],
    validFrom: new Date('2024-01-22'),
    validUntil: new Date('2024-01-29'),
    maxRedemptions: 500,
    currentRedemptions: 234,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400'],
    qrCode: 'QR_TECH_FLASH_002',
    promocode: 'TECH25',
    targetAudience: {
      ageRange: { min: 20, max: 50 },
      gender: 'all',
      location: ['Western Cape', 'Gauteng', 'KwaZulu-Natal'],
      interests: ['technology', 'gadgets'],
      spendingRange: { min: 1000, max: 15000 }
    },
    metrics: {
      views: 8945,
      clicks: 1256,
      redemptions: 234,
      conversions: 189,
      revenue: 234500,
      clickThroughRate: 14.0,
      conversionRate: 18.6,
      revenuePerUser: 1241.3
    },
    createdBy: 'tech_partnerships',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: 'deal_003',
    title: 'Woolworths Food - Buy 2 Get 1 Free',
    description: 'Select premium food items at Woolworths. Perfect for families and food lovers.',
    type: 'buy_one_get_one',
    value: 1,
    valueType: 'fixed_amount',
    category: 'food',
    storeId: 'store_003',
    storeName: 'Woolworths Food',
    venueId: 'gateway-theatre',
    venueName: 'Gateway Theatre of Shopping',
    conditions: ['Valid on selected premium items', 'Cheapest item is free', 'Maximum 3 free items per transaction'],
    validFrom: new Date('2024-01-20'),
    validUntil: new Date('2024-02-10'),
    maxRedemptions: 750,
    currentRedemptions: 423,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400'],
    qrCode: 'QR_WOOLIES_B2G1_003',
    promocode: 'WOOLIES3FOR2',
    targetAudience: {
      ageRange: { min: 25, max: 60 },
      gender: 'all',
      location: ['KwaZulu-Natal', 'Gauteng'],
      interests: ['food', 'family', 'premium quality'],
      spendingRange: { min: 200, max: 1500 }
    },
    metrics: {
      views: 12350,
      clicks: 1876,
      redemptions: 423,
      conversions: 356,
      revenue: 89400,
      clickThroughRate: 15.2,
      conversionRate: 22.5,
      revenuePerUser: 251.1
    },
    createdBy: 'food_merchandising',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-21')
  },
  {
    id: 'deal_004',
    title: 'Pick n Pay Smart Shopper - 15% Cashback',
    description: 'Earn cashback on your grocery shopping with Smart Shopper loyalty program.',
    type: 'cashback',
    value: 15,
    valueType: 'percentage',
    category: 'groceries',
    storeId: 'store_004',
    storeName: 'Pick n Pay',
    venueId: 'menlyn-park',
    venueName: 'Menlyn Park Shopping Centre',
    conditions: ['Smart Shopper card required', 'Minimum spend R300', 'Cashback credited within 7 days'],
    validFrom: new Date('2024-01-15'),
    validUntil: new Date('2024-03-15'),
    maxRedemptions: 2000,
    currentRedemptions: 1245,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'],
    qrCode: 'QR_PNP_CASHBACK_004',
    promocode: 'SMARTSAVER15',
    targetAudience: {
      ageRange: { min: 22, max: 65 },
      gender: 'all',
      location: ['Gauteng', 'Western Cape', 'KwaZulu-Natal'],
      interests: ['groceries', 'family shopping', 'savings'],
      spendingRange: { min: 300, max: 2000 }
    },
    metrics: {
      views: 18750,
      clicks: 2834,
      redemptions: 1245,
      conversions: 1089,
      revenue: 456700,
      clickThroughRate: 15.1,
      conversionRate: 43.9,
      revenuePerUser: 419.2
    },
    createdBy: 'grocery_partnerships',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-19')
  },
  {
    id: 'deal_005',
    title: 'Nandos Family Bundle - R99 Special',
    description: '2 Quarter Chickens + 2 sides + 2 drinks. Perfect for families visiting South African malls.',
    type: 'bundle',
    value: 99,
    valueType: 'fixed_amount',
    category: 'restaurant',
    storeId: 'store_005',
    storeName: 'Nandos',
    venueId: 'canal-walk',
    venueName: 'Canal Walk Shopping Centre',
    conditions: ['Dine-in only', 'Available all day', 'Cannot be split across multiple tables'],
    validFrom: new Date('2024-01-18'),
    validUntil: new Date('2024-02-28'),
    maxRedemptions: 300,
    currentRedemptions: 127,
    status: 'active',
    images: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400'],
    qrCode: 'QR_NANDOS_BUNDLE_005',
    promocode: 'FAMILY99',
    targetAudience: {
      ageRange: { min: 25, max: 50 },
      gender: 'all',
      location: ['Western Cape', 'Gauteng'],
      interests: ['dining', 'family time', 'south african food'],
      spendingRange: { min: 99, max: 350 }
    },
    metrics: {
      views: 6780,
      clicks: 892,
      redemptions: 127,
      conversions: 98,
      revenue: 31500,
      clickThroughRate: 13.2,
      conversionRate: 14.2,
      revenuePerUser: 321.4
    },
    createdBy: 'restaurant_partnerships',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'deal_006',
    title: 'Foschini Winter Collection - 40% Off',
    description: 'Trendy winter fashion at unbeatable prices. Latest styles from leading South African fashion retailer.',
    type: 'discount',
    value: 40,
    valueType: 'percentage',
    category: 'fashion',
    storeId: 'store_006',
    storeName: 'Foschini',
    venueId: 'rosebank-mall',
    venueName: 'Rosebank Mall',
    conditions: ['Valid on winter collection only', 'Excludes sale items', 'Store credit eligible'],
    validFrom: new Date('2024-01-25'),
    validUntil: new Date('2024-03-31'),
    currentRedemptions: 89,
    status: 'draft',
    images: ['https://images.unsplash.com/photo-1445205170230-053b83016050?w=400'],
    qrCode: 'QR_FOSCHINI_WINTER_006',
    promocode: 'WINTER40',
    targetAudience: {
      ageRange: { min: 18, max: 40 },
      gender: 'all',
      location: ['Gauteng'],
      interests: ['fashion', 'winter clothing', 'trendy styles'],
      spendingRange: { min: 200, max: 1200 }
    },
    metrics: {
      views: 3420,
      clicks: 456,
      redemptions: 89,
      conversions: 67,
      revenue: 18900,
      clickThroughRate: 13.3,
      conversionRate: 19.5,
      revenuePerUser: 282.1
    },
    createdBy: 'fashion_merchandising',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-24')
  }
]

export default function DealsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const filteredDeals = useMemo(() => {
    return mobileDealData.filter(deal => {
      const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deal.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deal.venueName?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || deal.status === statusFilter
      const matchesCategory = categoryFilter === 'all' || deal.category === categoryFilter
      const matchesType = typeFilter === 'all' || deal.type === typeFilter
      
      return matchesSearch && matchesStatus && matchesCategory && matchesType
    })
  }, [searchTerm, statusFilter, categoryFilter, typeFilter])

  const totalMetrics = useMemo(() => {
    return filteredDeals.reduce((acc, deal) => ({
      totalViews: acc.totalViews + deal.metrics.views,
      totalClicks: acc.totalClicks + deal.metrics.clicks,
      totalRedemptions: acc.totalRedemptions + deal.metrics.redemptions,
      totalRevenue: acc.totalRevenue + deal.metrics.revenue
    }), { totalViews: 0, totalClicks: 0, totalRedemptions: 0, totalRevenue: 0 })
  }, [filteredDeals])

  const formatZAR = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'expired': return 'bg-red-100 text-red-800 border-red-200'
      case 'draft': return 'bg-amber-100 text-amber-800 border-amber-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'discount': return <Percent className="w-4 h-4" />
      case 'buy_one_get_one': return <ShoppingBag className="w-4 h-4" />
      case 'cashback': return <DollarSign className="w-4 h-4" />
      case 'free_shipping': return <MapPin className="w-4 h-4" />
      case 'bundle': return <Tag className="w-4 h-4" />
      default: return <Tag className="w-4 h-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />
      case 'inactive': return <XCircle className="w-4 h-4" />
      case 'expired': return <Clock className="w-4 h-4" />
      case 'draft': return <AlertTriangle className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  const getDaysRemaining = (validUntil: Date) => {
    const today = new Date()
    const diffTime = validUntil.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Deals Management</h1>
              <p className="text-lg text-gray-600">Manage mobile app deals across South African venues and stores</p>
            </div>
            <div className="flex items-center gap-3 mt-4 lg:mt-0">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Sync Deals
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </Button>
              <Button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Create New Deal
              </Button>
            </div>
          </motion.div>

          {/* Metrics Overview */}
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
                    <p className="text-sm text-gray-600 mb-1">Total Views</p>
                    <p className="text-3xl font-bold text-gray-900">{totalMetrics.totalViews.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Clicks</p>
                    <p className="text-3xl font-bold text-emerald-600">{totalMetrics.totalClicks.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Redemptions</p>
                    <p className="text-3xl font-bold text-purple-600">{totalMetrics.totalRedemptions.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatZAR(totalMetrics.totalRevenue)}</p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-amber-600" />
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
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search deals..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
                <option value="draft">Draft</option>
              </select>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="fashion">Fashion</option>
                <option value="electronics">Electronics</option>
                <option value="food">Food</option>
                <option value="groceries">Groceries</option>
                <option value="restaurant">Restaurant</option>
              </select>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="discount">Discount</option>
                <option value="buy_one_get_one">BOGO</option>
                <option value="cashback">Cashback</option>
                <option value="free_shipping">Free Shipping</option>
                <option value="bundle">Bundle</option>
              </select>

              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                More Filters
              </Button>
            </div>
          </motion.div>

          {/* Deals Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredDeals.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          {getTypeIcon(deal.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 line-clamp-1">{deal.title}</h3>
                          <p className="text-sm text-gray-600">{deal.storeName}</p>
                        </div>
                      </div>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(deal.status)}`}>
                        {getStatusIcon(deal.status)}
                        <span className="capitalize">{deal.status}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{deal.description}</p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Value</span>
                        <span className="font-semibold text-purple-600">
                          {deal.valueType === 'percentage' ? `${deal.value}%` : formatZAR(deal.value)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Venue</span>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {deal.venueName}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Category</span>
                        <span className="text-sm font-medium capitalize">{deal.category}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Redemptions</span>
                        <span className="text-sm font-medium">
                          {deal.currentRedemptions.toLocaleString()} / {deal.maxRedemptions?.toLocaleString() || '∞'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Valid Until</span>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          {deal.validUntil.toLocaleDateString('en-ZA')}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">CTR</span>
                        <span className="text-sm font-medium text-emerald-600">
                          {formatPercentage(deal.metrics.clickThroughRate)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Revenue</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatZAR(deal.metrics.revenue)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit3 className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="p-2">
                          <BarChart3 className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="p-2 text-red-600 hover:text-red-700">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredDeals.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No deals found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters.</p>
              <Button className="bg-purple-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create New Deal
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
