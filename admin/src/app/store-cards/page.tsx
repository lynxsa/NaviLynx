'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  CreditCard,
  Wallet,
  Plus,
  Edit,
  Trash2,
  Star,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Settings,
  Download,
  RefreshCw,
  Search,
  Filter,
  Eye,
  CheckCircle,
  AlertTriangle,
  Gift,
  Percent,
  MapPin,
  Clock,
  BarChart3
} from "lucide-react"

// Store Card interfaces aligned with NaviLynx mobile app
interface StoreCard {
  id: string
  cardName: string
  storeName: string
  storeId: string
  venueId: string
  venueName: string
  cardType: 'loyalty' | 'gift' | 'membership' | 'credit' | 'debit'
  status: 'active' | 'inactive' | 'suspended' | 'expired'
  balance?: number
  points?: number
  tier?: string
  benefits: string[]
  discountRate?: number
  validUntil?: Date
  createdAt: Date
  lastUsed?: Date
  totalSpent: number
  totalSavings: number
  transactionCount: number
  cardNumber: string
  qrCode: string
  digitalWalletEnabled: boolean
  notifications: boolean
  autoReload?: {
    enabled: boolean
    threshold: number
    amount: number
  }
}

interface StoreCardTransaction {
  id: string
  cardId: string
  type: 'purchase' | 'reload' | 'reward' | 'refund' | 'transfer'
  amount: number
  pointsEarned?: number
  pointsRedeemed?: number
  description: string
  merchantName: string
  venueId: string
  timestamp: Date
  status: 'completed' | 'pending' | 'failed'
  receiptNumber?: string
}

// South African store cards aligned with mobile app
const mockStoreCards: StoreCard[] = [
  {
    id: 'card_001',
    cardName: 'Woolworths Rewards Card',
    storeName: 'Woolworths',
    storeId: 'store_woolworths',
    venueId: 'sandton-city',
    venueName: 'Sandton City',
    cardType: 'loyalty',
    status: 'active',
    points: 1250,
    tier: 'Gold',
    benefits: ['5% cashback on groceries', 'Early access to sales', 'Free delivery over R450'],
    discountRate: 5,
    validUntil: new Date('2025-12-31'),
    createdAt: new Date('2023-03-15'),
    lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    totalSpent: 12500,
    totalSavings: 625,
    transactionCount: 47,
    cardNumber: '****-****-****-1234',
    qrCode: 'QR_WOOLWORTHS_1234',
    digitalWalletEnabled: true,
    notifications: true,
    autoReload: {
      enabled: false,
      threshold: 0,
      amount: 0
    }
  },
  {
    id: 'card_002',
    cardName: 'Pick n Pay Smart Shopper',
    storeName: 'Pick n Pay',
    storeId: 'store_picknpay',
    venueId: 'menlyn-park',
    venueName: 'Menlyn Park Shopping Centre',
    cardType: 'loyalty',
    status: 'active',
    points: 890,
    tier: 'Silver',
    benefits: ['Smart Shopper prices', 'Fuel rewards', 'Birthday specials'],
    discountRate: 3,
    validUntil: new Date('2025-12-31'),
    createdAt: new Date('2023-05-20'),
    lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    totalSpent: 8900,
    totalSavings: 267,
    transactionCount: 32,
    cardNumber: '****-****-****-5678',
    qrCode: 'QR_PICKNPAY_5678',
    digitalWalletEnabled: true,
    notifications: true
  },
  {
    id: 'card_003',
    cardName: 'Cotton On Gift Card',
    storeName: 'Cotton On',
    storeId: 'store_cottonon',
    venueId: 'v-a-waterfront',
    venueName: 'V&A Waterfront',
    cardType: 'gift',
    status: 'active',
    balance: 350,
    benefits: ['No expiry date', 'Use online and in-store', 'Transferable'],
    validUntil: new Date('2026-01-01'),
    createdAt: new Date('2023-12-25'),
    lastUsed: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    totalSpent: 650,
    totalSavings: 0,
    transactionCount: 8,
    cardNumber: '****-****-****-9012',
    qrCode: 'QR_COTTONON_9012',
    digitalWalletEnabled: true,
    notifications: false
  },
  {
    id: 'card_004',
    cardName: 'Incredible Connection Rewards',
    storeName: 'Incredible Connection',
    storeId: 'store_incredible',
    venueId: 'gateway-theatre',
    venueName: 'Gateway Theatre of Shopping',
    cardType: 'loyalty',
    status: 'active',
    points: 2150,
    tier: 'Platinum',
    benefits: ['10% off accessories', 'Extended warranty', 'Priority support'],
    discountRate: 8,
    validUntil: new Date('2025-12-31'),
    createdAt: new Date('2023-01-10'),
    lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    totalSpent: 25000,
    totalSavings: 2000,
    transactionCount: 15,
    cardNumber: '****-****-****-3456',
    qrCode: 'QR_INCREDIBLE_3456',
    digitalWalletEnabled: true,
    notifications: true,
    autoReload: {
      enabled: true,
      threshold: 500,
      amount: 1000
    }
  },
  {
    id: 'card_005',
    cardName: 'Nando\'s Rewards',
    storeName: 'Nando\'s',
    storeId: 'store_nandos',
    venueId: 'canal-walk',
    venueName: 'Canal Walk Shopping Centre',
    cardType: 'loyalty',
    status: 'active',
    points: 450,
    tier: 'Bronze',
    benefits: ['Free quarter chicken every 10 visits', 'Birthday meal', 'Member specials'],
    discountRate: 0,
    validUntil: new Date('2025-12-31'),
    createdAt: new Date('2023-08-05'),
    lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    totalSpent: 1200,
    totalSavings: 180,
    transactionCount: 22,
    cardNumber: '****-****-****-7890',
    qrCode: 'QR_NANDOS_7890',
    digitalWalletEnabled: true,
    notifications: true
  },
  {
    id: 'card_006',
    cardName: 'Foschini Account Card',
    storeName: 'Foschini',
    storeId: 'store_foschini',
    venueId: 'rosebank-mall',
    venueName: 'Rosebank Mall',
    cardType: 'credit',
    status: 'suspended',
    balance: -850,
    benefits: ['6 months interest-free', '20% off on account opening', 'Exclusive member events'],
    discountRate: 10,
    validUntil: new Date('2025-12-31'),
    createdAt: new Date('2023-06-12'),
    lastUsed: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    totalSpent: 5600,
    totalSavings: 560,
    transactionCount: 18,
    cardNumber: '****-****-****-2468',
    qrCode: 'QR_FOSCHINI_2468',
    digitalWalletEnabled: false,
    notifications: false
  }
]

const mockTransactions: StoreCardTransaction[] = [
  {
    id: 'txn_001',
    cardId: 'card_001',
    type: 'purchase',
    amount: 245.50,
    pointsEarned: 25,
    description: 'Grocery shopping - fresh produce and essentials',
    merchantName: 'Woolworths Food',
    venueId: 'sandton-city',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'completed',
    receiptNumber: 'WW240125001'
  },
  {
    id: 'txn_002',
    cardId: 'card_004',
    type: 'purchase',
    amount: 1899.00,
    pointsEarned: 190,
    description: 'MacBook Air M2 Accessories Bundle',
    merchantName: 'Incredible Connection',
    venueId: 'gateway-theatre',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: 'completed',
    receiptNumber: 'IC240126001'
  },
  {
    id: 'txn_003',
    cardId: 'card_003',
    type: 'purchase',
    amount: 125.00,
    description: 'Summer T-shirts and accessories',
    merchantName: 'Cotton On',
    venueId: 'v-a-waterfront',
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    status: 'completed',
    receiptNumber: 'CO240116001'
  },
  {
    id: 'txn_004',
    cardId: 'card_005',
    type: 'reward',
    amount: 0,
    pointsRedeemed: 200,
    description: 'Free Quarter Chicken Reward',
    merchantName: 'Nando\'s',
    venueId: 'canal-walk',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'completed',
    receiptNumber: 'ND240119001'
  },
  {
    id: 'txn_005',
    cardId: 'card_002',
    type: 'purchase',
    amount: 186.75,
    pointsEarned: 19,
    description: 'Weekly grocery shop with Smart Shopper prices',
    merchantName: 'Pick n Pay',
    venueId: 'menlyn-park',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: 'completed',
    receiptNumber: 'PNP240121001'
  }
]

export default function StoreCardManagementPage() {
  const [activeTab, setActiveTab] = useState<'cards' | 'transactions' | 'analytics' | 'settings'>('cards')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [venueFilter, setVenueFilter] = useState<string>('all')

  const filteredCards = mockStoreCards.filter(card => {
    const matchesSearch = card.cardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.venueName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || card.status === statusFilter
    const matchesType = typeFilter === 'all' || card.cardType === typeFilter
    const matchesVenue = venueFilter === 'all' || card.venueId === venueFilter
    
    return matchesSearch && matchesStatus && matchesType && matchesVenue
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200'
      case 'expired': return 'bg-amber-100 text-amber-800 border-amber-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />
      case 'inactive': return <Activity className="w-4 h-4" />
      case 'suspended': return <AlertTriangle className="w-4 h-4" />
      case 'expired': return <Clock className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'loyalty': return <Star className="w-4 h-4 text-purple-600" />
      case 'gift': return <Gift className="w-4 h-4 text-emerald-600" />
      case 'membership': return <Users className="w-4 h-4 text-blue-600" />
      case 'credit': return <CreditCard className="w-4 h-4 text-amber-600" />
      case 'debit': return <Wallet className="w-4 h-4 text-gray-600" />
      default: return <CreditCard className="w-4 h-4" />
    }
  }

  const getTierColor = (tier?: string) => {
    switch (tier?.toLowerCase()) {
      case 'platinum': return 'bg-gray-200 text-gray-800'
      case 'gold': return 'bg-yellow-200 text-yellow-800'
      case 'silver': return 'bg-gray-300 text-gray-800'
      case 'bronze': return 'bg-orange-200 text-orange-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
  }

  const cardStats = {
    total: mockStoreCards.length,
    active: mockStoreCards.filter(c => c.status === 'active').length,
    totalSpent: mockStoreCards.reduce((acc, card) => acc + card.totalSpent, 0),
    totalSavings: mockStoreCards.reduce((acc, card) => acc + card.totalSavings, 0),
    totalPoints: mockStoreCards.reduce((acc, card) => acc + (card.points || 0), 0),
    totalTransactions: mockStoreCards.reduce((acc, card) => acc + card.transactionCount, 0)
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Store Card Management</h1>
              <p className="text-lg text-gray-600">Manage digital wallets and loyalty cards for South African stores</p>
            </div>
            <div className="flex items-center gap-3 mt-4 lg:mt-0">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Sync Cards
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Report
              </Button>
              <Button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Add Store Card
              </Button>
            </div>
          </motion.div>

          {/* Key Metrics */}
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
                    <p className="text-sm text-gray-600 mb-1">Total Cards</p>
                    <p className="text-3xl font-bold text-gray-900">{cardStats.total}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Cards</p>
                    <p className="text-3xl font-bold text-emerald-600">{cardStats.active}</p>
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
                    <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(cardStats.totalSpent)}</p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Savings</p>
                    <p className="text-2xl font-bold text-emerald-600">{formatCurrency(cardStats.totalSavings)}</p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <Percent className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Points</p>
                    <p className="text-2xl font-bold text-purple-600">{cardStats.totalPoints.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Transactions</p>
                    <p className="text-2xl font-bold text-gray-900">{cardStats.totalTransactions}</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <Activity className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-gray-200 shadow-lg mb-8"
          >
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'cards', label: 'Store Cards', icon: CreditCard },
                  { id: 'transactions', label: 'Transactions', icon: Activity },
                  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                  { id: 'settings', label: 'Settings', icon: Settings }
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'cards' | 'transactions' | 'analytics' | 'settings')}
                      className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </div>
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'cards' && (
                <div className="space-y-6">
                  {/* Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search cards..."
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
                      <option value="suspended">Suspended</option>
                      <option value="expired">Expired</option>
                    </select>

                    <select
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                    >
                      <option value="all">All Types</option>
                      <option value="loyalty">Loyalty</option>
                      <option value="gift">Gift Card</option>
                      <option value="membership">Membership</option>
                      <option value="credit">Credit</option>
                      <option value="debit">Debit</option>
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
                    </select>

                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      More Filters
                    </Button>
                  </div>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCards.map((card, index) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="h-full bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                  {getTypeIcon(card.cardType)}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">{card.cardName}</h3>
                                  <p className="text-sm text-gray-600">{card.storeName}</p>
                                </div>
                              </div>
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(card.status)}`}>
                                {getStatusIcon(card.status)}
                                <span className="capitalize">{card.status}</span>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Card Number</span>
                              <span className="font-mono text-sm">{card.cardNumber}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Venue</span>
                              <div className="flex items-center gap-1 text-sm">
                                <MapPin className="w-3 h-3 text-gray-400" />
                                {card.venueName}
                              </div>
                            </div>

                            {card.balance !== undefined && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Balance</span>
                                <span className="font-semibold text-gray-900">{formatCurrency(card.balance)}</span>
                              </div>
                            )}

                            {card.points !== undefined && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Points</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-purple-600">{card.points.toLocaleString()}</span>
                                  {card.tier && (
                                    <span className={`px-2 py-1 text-xs rounded-full ${getTierColor(card.tier)}`}>
                                      {card.tier}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Total Spent</span>
                              <span className="font-semibold text-gray-900">{formatCurrency(card.totalSpent)}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Total Savings</span>
                              <span className="font-semibold text-emerald-600">{formatCurrency(card.totalSavings)}</span>
                            </div>

                            {card.lastUsed && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Last Used</span>
                                <span className="text-sm text-gray-900">{formatTimeAgo(card.lastUsed)}</span>
                              </div>
                            )}

                            <div className="pt-4 border-t border-gray-200">
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Eye className="w-3 h-3 mr-1" />
                                  View
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Edit className="w-3 h-3 mr-1" />
                                  Edit
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
                  </div>
                </div>
              )}

              {activeTab === 'transactions' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-1" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Transaction</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Card</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Points</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {mockTransactions.map((transaction, index) => {
                          const card = mockStoreCards.find(c => c.id === transaction.cardId)
                          return (
                            <motion.tr
                              key={transaction.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="hover:bg-gray-50"
                            >
                              <td className="py-4 px-4">
                                <div>
                                  <p className="font-medium text-gray-900">{transaction.description}</p>
                                  <p className="text-sm text-gray-600">{transaction.merchantName}</p>
                                  {transaction.receiptNumber && (
                                    <p className="text-xs text-gray-500">Receipt: {transaction.receiptNumber}</p>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div>
                                  <p className="font-medium text-gray-900">{card?.cardName}</p>
                                  <p className="text-sm text-gray-600">{card?.storeName}</p>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="font-semibold text-gray-900">
                                  {transaction.type === 'reward' ? 'FREE' : formatCurrency(transaction.amount)}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div>
                                  {transaction.pointsEarned && (
                                    <div className="text-sm text-emerald-600">+{transaction.pointsEarned} pts</div>
                                  )}
                                  {transaction.pointsRedeemed && (
                                    <div className="text-sm text-red-600">-{transaction.pointsRedeemed} pts</div>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="text-sm text-gray-900">
                                  {transaction.timestamp.toLocaleDateString('en-ZA')}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {transaction.timestamp.toLocaleTimeString('en-ZA')}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  transaction.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                                  transaction.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {transaction.status}
                                </span>
                              </td>
                            </motion.tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Store Card Analytics</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">Card Type Distribution</h4>
                          <BarChart3 className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="space-y-3">
                          {['Loyalty', 'Gift Card', 'Credit', 'Membership'].map((type, index) => (
                            <div key={type} className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">{type}</span>
                              <span className="font-medium">{[60, 25, 10, 5][index]}%</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">Top Spending Stores</h4>
                          <TrendingUp className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="space-y-3">
                          {['Incredible Connection', 'Woolworths', 'Pick n Pay', 'Foschini'].map((store, index) => (
                            <div key={store} className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">{store}</span>
                              <span className="font-medium">{formatCurrency([25000, 12500, 8900, 5600][index])}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">Monthly Trends</h4>
                          <Activity className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Spending Growth</span>
                            <span className="font-medium text-emerald-600">↑ 18%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Card Usage</span>
                            <span className="font-medium text-emerald-600">↑ 12%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Points Earned</span>
                            <span className="font-medium text-emerald-600">↑ 25%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Card Settings</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-4">Digital Wallet Configuration</h4>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium text-gray-700">Auto-sync with mobile app</label>
                              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600">
                                <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white transition-transform" />
                              </button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium text-gray-700">Push notifications</label>
                              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600">
                                <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white transition-transform" />
                              </button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium text-gray-700">Biometric authentication</label>
                              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                                <span className="inline-block h-4 w-4 transform translate-x-1 rounded-full bg-white transition-transform" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-4">Security & Privacy</h4>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium text-gray-700">Data encryption</label>
                              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600">
                                <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white transition-transform" />
                              </button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium text-gray-700">Transaction logging</label>
                              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600">
                                <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white transition-transform" />
                              </button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium text-gray-700">Anonymous analytics</label>
                              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                                <span className="inline-block h-4 w-4 transform translate-x-1 rounded-full bg-white transition-transform" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
                    <Button className="bg-purple-600 text-white">
                      Save Settings
                    </Button>
                    <Button variant="outline">
                      Reset to Default
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  )
}
