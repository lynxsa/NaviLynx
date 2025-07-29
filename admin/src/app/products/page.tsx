'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingBag,
  Filter,
  Search,
  Eye,
  TrendingUp,
  Package,
  Star,
  MapPin,
  DollarSign,
  Edit3,
  Trash2,
  Plus,
  Download,
  RefreshCw,
  Barcode,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Tag,
  Grid3X3,
  List
} from "lucide-react"

// Mobile App Aligned Product Interface
interface MobileAppProduct {
  id: string
  name: string
  description: string
  category: string
  subcategory?: string
  brand: string
  sku: string
  barcode?: string
  price: {
    current: number
    original?: number
    currency: 'ZAR'
  }
  images: string[]
  availability: {
    inStock: boolean
    quantity: number
    lowStockThreshold: number
  }
  storeId: string
  storeName: string
  venueId: string
  venueName: string
  rating: {
    average: number
    count: number
  }
  tags: string[]
  specifications: Record<string, string>
  status: 'active' | 'inactive' | 'discontinued' | 'out_of_stock'
  featured: boolean
  searchKeywords: string[]
  createdAt: Date
  updatedAt: Date
  analytics: {
    views: number
    searches: number
    scans: number
    addedToWishlist: number
    purchased: number
  }
}

// South African retail products data
const mobileProductData: MobileAppProduct[] = [
  {
    id: 'prod_001',
    name: 'Samsung Galaxy S24 Ultra 256GB',
    description: 'Latest flagship smartphone with advanced AI features, S Pen, and pro-grade camera system.',
    category: 'Electronics',
    subcategory: 'Smartphones',
    brand: 'Samsung',
    sku: 'SAM-S24U-256-TIT',
    barcode: '8806095142851',
    price: {
      current: 24999,
      original: 26999,
      currency: 'ZAR'
    },
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400'
    ],
    availability: {
      inStock: true,
      quantity: 45,
      lowStockThreshold: 10
    },
    storeId: 'store_001',
    storeName: 'Incredible Connection',
    venueId: 'sandton-city',
    venueName: 'Sandton City',
    rating: {
      average: 4.8,
      count: 324
    },
    tags: ['flagship', 'ai', 's-pen', '5g', 'pro-camera'],
    specifications: {
      'Display': '6.8" Dynamic AMOLED 2X',
      'Storage': '256GB',
      'RAM': '12GB',
      'Camera': '200MP + 50MP + 12MP + 10MP',
      'Battery': '5000mAh',
      'OS': 'Android 14'
    },
    status: 'active',
    featured: true,
    searchKeywords: ['samsung', 'galaxy', 's24', 'ultra', 'smartphone', 'android'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    analytics: {
      views: 15420,
      searches: 8945,
      scans: 234,
      addedToWishlist: 892,
      purchased: 67
    }
  },
  {
    id: 'prod_002',
    name: 'Apple MacBook Air 13" M3',
    description: 'Superlight laptop with M3 chip, all-day battery life, and stunning Liquid Retina display.',
    category: 'Electronics',
    subcategory: 'Laptops',
    brand: 'Apple',
    sku: 'APP-MBA13-M3-256-MID',
    barcode: '194253777892',
    price: {
      current: 21999,
      currency: 'ZAR'
    },
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'
    ],
    availability: {
      inStock: true,
      quantity: 23,
      lowStockThreshold: 5
    },
    storeId: 'store_002',
    storeName: 'iStore',
    venueId: 'v-a-waterfront',
    venueName: 'V&A Waterfront',
    rating: {
      average: 4.9,
      count: 187
    },
    tags: ['m3-chip', 'ultralight', 'retina', 'all-day-battery'],
    specifications: {
      'Processor': 'Apple M3 chip',
      'Memory': '8GB unified memory',
      'Storage': '256GB SSD',
      'Display': '13.6" Liquid Retina',
      'Weight': '1.24kg',
      'Battery': 'Up to 18 hours'
    },
    status: 'active',
    featured: true,
    searchKeywords: ['apple', 'macbook', 'air', 'm3', 'laptop', 'ultrabook'],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-18'),
    analytics: {
      views: 12340,
      searches: 6789,
      scans: 156,
      addedToWishlist: 567,
      purchased: 34
    }
  },
  {
    id: 'prod_003',
    name: 'Nike Air Max 270 Sneakers',
    description: 'Iconic lifestyle sneakers with Max Air heel unit for all-day comfort and street-ready style.',
    category: 'Fashion',
    subcategory: 'Footwear',
    brand: 'Nike',
    sku: 'NIKE-AM270-BLK-42',
    barcode: '195245368544',
    price: {
      current: 2499,
      original: 2999,
      currency: 'ZAR'
    },
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400'
    ],
    availability: {
      inStock: true,
      quantity: 78,
      lowStockThreshold: 20
    },
    storeId: 'store_003',
    storeName: 'Sportsmans Warehouse',
    venueId: 'gateway-theatre',
    venueName: 'Gateway Theatre of Shopping',
    rating: {
      average: 4.6,
      count: 456
    },
    tags: ['air-max', 'lifestyle', 'comfort', 'street-style'],
    specifications: {
      'Size Range': 'US 6-13',
      'Material': 'Mesh and synthetic',
      'Sole': 'Rubber with Max Air',
      'Colors': 'Black/White/Grey',
      'Weight': '380g (size 9)',
      'Style': 'AH8050-002'
    },
    status: 'active',
    featured: false,
    searchKeywords: ['nike', 'air max', '270', 'sneakers', 'shoes', 'lifestyle'],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-16'),
    analytics: {
      views: 8934,
      searches: 4567,
      scans: 189,
      addedToWishlist: 345,
      purchased: 89
    }
  },
  {
    id: 'prod_004',
    name: 'Levi\'s 501 Original Jeans',
    description: 'The original blue jean since 1873. Iconic straight fit with timeless style and durability.',
    category: 'Fashion',
    subcategory: 'Denim',
    brand: 'Levi\'s',
    sku: 'LEVI-501-IND-32X32',
    barcode: '501234567890',
    price: {
      current: 1299,
      original: 1599,
      currency: 'ZAR'
    },
    images: [
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=400',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400'
    ],
    availability: {
      inStock: true,
      quantity: 156,
      lowStockThreshold: 30
    },
    storeId: 'store_004',
    storeName: 'Edgars',
    venueId: 'menlyn-park',
    venueName: 'Menlyn Park Shopping Centre',
    rating: {
      average: 4.7,
      count: 289
    },
    tags: ['original', 'vintage', 'straight-fit', 'durable'],
    specifications: {
      'Fit': 'Original straight',
      'Rise': 'Mid rise',
      'Material': '100% Cotton denim',
      'Wash': 'Indigo rinse',
      'Sizes': '28-42 waist',
      'Length': '30", 32", 34"'
    },
    status: 'active',
    featured: false,
    searchKeywords: ['levis', '501', 'jeans', 'denim', 'original', 'straight'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-14'),
    analytics: {
      views: 6789,
      searches: 3456,
      scans: 123,
      addedToWishlist: 234,
      purchased: 78
    }
  },
  {
    id: 'prod_005',
    name: 'Woolworths Organic Coffee Beans 1kg',
    description: 'Premium organic Arabica coffee beans, ethically sourced and roasted to perfection.',
    category: 'Food & Beverages',
    subcategory: 'Coffee',
    brand: 'Woolworths',
    sku: 'WW-COFFEE-ORG-1KG',
    barcode: '6009175954321',
    price: {
      current: 189,
      original: 229,
      currency: 'ZAR'
    },
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
      'https://images.unsplash.com/photo-1611854779393-1b2da9d51943?w=400'
    ],
    availability: {
      inStock: true,
      quantity: 245,
      lowStockThreshold: 50
    },
    storeId: 'store_005',
    storeName: 'Woolworths Food',
    venueId: 'canal-walk',
    venueName: 'Canal Walk Shopping Centre',
    rating: {
      average: 4.5,
      count: 167
    },
    tags: ['organic', 'arabica', 'ethically-sourced', 'premium'],
    specifications: {
      'Bean Type': '100% Arabica',
      'Roast Level': 'Medium',
      'Origin': 'Colombia & Ethiopia',
      'Certification': 'Organic & Fair Trade',
      'Net Weight': '1kg',
      'Best Before': '12 months'
    },
    status: 'active',
    featured: true,
    searchKeywords: ['woolworths', 'coffee', 'organic', 'arabica', 'beans'],
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-12'),
    analytics: {
      views: 4567,
      searches: 2345,
      scans: 89,
      addedToWishlist: 156,
      purchased: 123
    }
  },
  {
    id: 'prod_006',
    name: 'Adidas Ultraboost 22 Running Shoes',
    description: 'High-performance running shoes with responsive BOOST midsole and Primeknit upper.',
    category: 'Sports',
    subcategory: 'Running Shoes',
    brand: 'Adidas',
    sku: 'ADI-UB22-BLK-9',
    barcode: '4066759467538',
    price: {
      current: 3299,
      original: 3799,
      currency: 'ZAR'
    },
    images: [
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400'
    ],
    availability: {
      inStock: false,
      quantity: 0,
      lowStockThreshold: 15
    },
    storeId: 'store_006',
    storeName: 'Adidas Originals',
    venueId: 'rosebank-mall',
    venueName: 'Rosebank Mall',
    rating: {
      average: 4.8,
      count: 234
    },
    tags: ['boost', 'primeknit', 'running', 'performance'],
    specifications: {
      'Technology': 'BOOST midsole',
      'Upper': 'Primeknit',
      'Drop': '10mm',
      'Weight': '320g (size 9)',
      'Surface': 'Road running',
      'Support': 'Neutral'
    },
    status: 'out_of_stock',
    featured: true,
    searchKeywords: ['adidas', 'ultraboost', '22', 'running', 'boost', 'primeknit'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-10'),
    analytics: {
      views: 9876,
      searches: 5432,
      scans: 167,
      addedToWishlist: 445,
      purchased: 56
    }
  }
]

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [brandFilter, setBrandFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredProducts = useMemo(() => {
    return mobileProductData.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter
      const matchesBrand = brandFilter === 'all' || product.brand === brandFilter
      
      return matchesSearch && matchesCategory && matchesStatus && matchesBrand
    })
  }, [searchTerm, categoryFilter, statusFilter, brandFilter])

  const productMetrics = useMemo(() => {
    return {
      totalProducts: mobileProductData.length,
      activeProducts: mobileProductData.filter(p => p.status === 'active').length,
      outOfStock: mobileProductData.filter(p => p.status === 'out_of_stock').length,
      lowStock: mobileProductData.filter(p => p.availability.quantity <= p.availability.lowStockThreshold && p.availability.quantity > 0).length,
      totalViews: mobileProductData.reduce((sum, p) => sum + p.analytics.views, 0),
      totalRevenue: mobileProductData.reduce((sum, p) => sum + (p.analytics.purchased * p.price.current), 0)
    }
  }, [])

  const formatZAR = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'discontinued': return 'bg-red-100 text-red-800 border-red-200'
      case 'out_of_stock': return 'bg-amber-100 text-amber-800 border-amber-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />
      case 'inactive': return <XCircle className="w-4 h-4" />
      case 'discontinued': return <XCircle className="w-4 h-4" />
      case 'out_of_stock': return <AlertTriangle className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  const getStockStatus = (product: MobileAppProduct) => {
    if (!product.availability.inStock) return 'Out of Stock'
    if (product.availability.quantity <= product.availability.lowStockThreshold) return 'Low Stock'
    return 'In Stock'
  }

  const getStockColor = (product: MobileAppProduct) => {
    if (!product.availability.inStock) return 'text-red-600'
    if (product.availability.quantity <= product.availability.lowStockThreshold) return 'text-amber-600'
    return 'text-emerald-600'
  }

  return (
    <AdminLayout userRole="admin">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Enhanced Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
          >
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                Product Management
              </h1>
              <p className="text-xl text-gray-600 font-medium">
                Manage products across {productMetrics.totalStores} South African stores
              </p>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 px-3 py-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                  {productMetrics.totalProducts} Products Active
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  {productMetrics.activeProducts} in stock
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 lg:mt-0">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Sync Inventory
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Products
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
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
                    <p className="text-sm text-gray-600 mb-1">Total Products</p>
                    <p className="text-3xl font-bold text-gray-900">{productMetrics.totalProducts}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active</p>
                    <p className="text-3xl font-bold text-emerald-600">{productMetrics.activeProducts}</p>
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
                    <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
                    <p className="text-3xl font-bold text-red-600">{productMetrics.outOfStock}</p>
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
                    <p className="text-sm text-gray-600 mb-1">Low Stock</p>
                    <p className="text-3xl font-bold text-amber-600">{productMetrics.lowStock}</p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <XCircle className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Views</p>
                    <p className="text-2xl font-bold text-purple-600">{productMetrics.totalViews.toLocaleString()}</p>
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
                    <p className="text-sm text-gray-600 mb-1">Revenue</p>
                    <p className="text-xl font-bold text-gray-900">{formatZAR(productMetrics.totalRevenue)}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Sports">Sports</option>
                <option value="Food & Beverages">Food & Beverages</option>
              </select>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="discontinued">Discontinued</option>
              </select>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
              >
                <option value="all">All Brands</option>
                <option value="Samsung">Samsung</option>
                <option value="Apple">Apple</option>
                <option value="Nike">Nike</option>
                <option value="Adidas">Adidas</option>
                <option value="Levi&apos;s">Levi&apos;s</option>
                <option value="Woolworths">Woolworths</option>
              </select>

              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                More Filters
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="px-3"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="px-3"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Products Grid/List */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {viewMode === 'grid' ? (
                  <Card className="h-full bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-gray-400" />
                            </div>
                            {product.featured && (
                              <Star className="absolute -top-2 -right-2 w-5 h-5 text-amber-500 fill-amber-500" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
                            <p className="text-sm text-gray-600">{product.brand}</p>
                          </div>
                        </div>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                          {getStatusIcon(product.status)}
                          <span className="capitalize">{product.status.replace('_', ' ')}</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Price</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-purple-600">{formatZAR(product.price.current)}</span>
                            {product.price.original && (
                              <span className="text-sm text-gray-400 line-through">{formatZAR(product.price.original)}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Stock</span>
                          <span className={`text-sm font-medium ${getStockColor(product)}`}>
                            {getStockStatus(product)} ({product.availability.quantity})
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Store</span>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            {product.storeName}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Rating</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span className="text-sm font-medium">{product.rating.average}</span>
                            <span className="text-xs text-gray-400">({product.rating.count})</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">SKU</span>
                          <span className="text-sm font-mono text-gray-700">{product.sku}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {product.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {product.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{product.tags.length - 3}
                          </Badge>
                        )}
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
                            <Barcode className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm" className="p-2 text-red-600 hover:text-red-700">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-white border-gray-200 shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">{product.name}</h3>
                              <p className="text-sm text-gray-600">{product.brand} • {product.category}</p>
                              <p className="text-xs text-gray-500 mt-1">{product.sku}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-purple-600">{formatZAR(product.price.current)}</span>
                                {product.price.original && (
                                  <span className="text-sm text-gray-400 line-through">{formatZAR(product.price.original)}</span>
                                )}
                              </div>
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                                {getStatusIcon(product.status)}
                                <span className="capitalize">{product.status.replace('_', ' ')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit3 className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            ))}
          </motion.div>

          {filteredProducts.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-gray-400 mb-4">
                <ShoppingBag className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters.</p>
              <Button className="bg-purple-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
