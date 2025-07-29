'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  UserPlus,
  UserCheck,
  Search,
  Filter,
  Download,
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  Phone,
  MapPin,
  Activity,
  Shield,
  Star,
  TrendingUp,
  Clock,
  Globe,
  Smartphone,
  Settings,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Ban
} from "lucide-react"

// Enhanced User interface aligned with NaviLynx mobile app
interface NaviLynxUser {
  id: string
  email: string
  firstName: string
  lastName: string
  displayName: string
  avatar?: string
  phoneNumber?: string
  dateOfBirth?: Date
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say'
  location: {
    country: string
    province: string
    city: string
    postalCode?: string
  }
  preferences: {
    language: string
    currency: string
    notifications: {
      push: boolean
      email: boolean
      sms: boolean
      deals: boolean
      navigation: boolean
      social: boolean
    }
    privacy: {
      profileVisibility: 'public' | 'friends' | 'private'
      locationSharing: boolean
      analyticsOptIn: boolean
    }
    accessibility: {
      textSize: 'small' | 'medium' | 'large'
      highContrast: boolean
      voiceNavigation: boolean
    }
  }
  status: 'active' | 'inactive' | 'suspended' | 'pending' | 'banned'
  accountType: 'free' | 'premium' | 'enterprise'
  verificationStatus: {
    email: boolean
    phone: boolean
    identity: boolean
  }
  createdAt: Date
  lastActiveAt: Date
  loginCount: number
  
  // NaviLynx-specific data
  appUsage: {
    totalSessions: number
    averageSessionDuration: number // minutes
    favoriteFeatures: string[]
    mostUsedVenues: string[]
    arNavigationUsage: number
    navigenieQueries: number
    storeCardsConnected: number
    dealsRedeemed: number
  }
  
  socialProfile: {
    friendsCount: number
    reviewsCount: number
    photosShared: number
    checkins: number
    badgesEarned: string[]
  }
  
  securityInfo: {
    lastPasswordChange: Date
    twoFactorEnabled: boolean
    trustedDevices: number
    securityScore: number // 0-100
    suspiciousActivityCount: number
  }
}

// Mock South African users data
const mockUsers: NaviLynxUser[] = [
  {
    id: 'user_001',
    email: 'thabo.mthembu@gmail.com',
    firstName: 'Thabo',
    lastName: 'Mthembu',
    displayName: 'Thabo M.',
    avatar: '/avatars/thabo.jpg',
    phoneNumber: '+27 82 123 4567',
    dateOfBirth: new Date('1985-06-15'),
    gender: 'male',
    location: {
      country: 'South Africa',
      province: 'Gauteng',
      city: 'Johannesburg',
      postalCode: '2196'
    },
    preferences: {
      language: 'en-ZA',
      currency: 'ZAR',
      notifications: {
        push: true,
        email: true,
        sms: false,
        deals: true,
        navigation: true,
        social: true
      },
      privacy: {
        profileVisibility: 'friends',
        locationSharing: true,
        analyticsOptIn: true
      },
      accessibility: {
        textSize: 'medium',
        highContrast: false,
        voiceNavigation: true
      }
    },
    status: 'active',
    accountType: 'premium',
    verificationStatus: {
      email: true,
      phone: true,
      identity: true
    },
    createdAt: new Date('2023-03-15'),
    lastActiveAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    loginCount: 234,
    appUsage: {
      totalSessions: 89,
      averageSessionDuration: 12.5,
      favoriteFeatures: ['AR Navigation', 'Store Cards', 'Deal Finder'],
      mostUsedVenues: ['Sandton City', 'V&A Waterfront', 'Gateway Theatre'],
      arNavigationUsage: 156,
      navigenieQueries: 45,
      storeCardsConnected: 8,
      dealsRedeemed: 23
    },
    socialProfile: {
      friendsCount: 42,
      reviewsCount: 18,
      photosShared: 67,
      checkins: 134,
      badgesEarned: ['Explorer', 'Deal Hunter', 'Social Butterfly', 'AR Pioneer']
    },
    securityInfo: {
      lastPasswordChange: new Date('2024-01-15'),
      twoFactorEnabled: true,
      trustedDevices: 3,
      securityScore: 92,
      suspiciousActivityCount: 0
    }
  },
  {
    id: 'user_002',
    email: 'sarah.johnson@outlook.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    displayName: 'Sarah J.',
    avatar: '/avatars/sarah.jpg',
    phoneNumber: '+27 83 987 6543',
    dateOfBirth: new Date('1992-09-23'),
    gender: 'female',
    location: {
      country: 'South Africa',
      province: 'Western Cape',
      city: 'Cape Town',
      postalCode: '8001'
    },
    preferences: {
      language: 'en-ZA',
      currency: 'ZAR',
      notifications: {
        push: true,
        email: false,
        sms: true,
        deals: true,
        navigation: true,
        social: false
      },
      privacy: {
        profileVisibility: 'public',
        locationSharing: true,
        analyticsOptIn: true
      },
      accessibility: {
        textSize: 'large',
        highContrast: false,
        voiceNavigation: false
      }
    },
    status: 'active',
    accountType: 'free',
    verificationStatus: {
      email: true,
      phone: false,
      identity: false
    },
    createdAt: new Date('2023-07-10'),
    lastActiveAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    loginCount: 156,
    appUsage: {
      totalSessions: 67,
      averageSessionDuration: 8.2,
      favoriteFeatures: ['Deal Finder', 'Venue Discovery', 'Social Features'],
      mostUsedVenues: ['V&A Waterfront', 'Canal Walk', 'Cavendish Square'],
      arNavigationUsage: 89,
      navigenieQueries: 28,
      storeCardsConnected: 5,
      dealsRedeemed: 15
    },
    socialProfile: {
      friendsCount: 78,
      reviewsCount: 32,
      photosShared: 124,
      checkins: 89,
      badgesEarned: ['Deal Hunter', 'Photo Master', 'Social Butterfly']
    },
    securityInfo: {
      lastPasswordChange: new Date('2023-11-20'),
      twoFactorEnabled: false,
      trustedDevices: 2,
      securityScore: 65,
      suspiciousActivityCount: 1
    }
  },
  {
    id: 'user_003',
    email: 'nomsa.dlamini@yahoo.com',
    firstName: 'Nomsa',
    lastName: 'Dlamini',
    displayName: 'Nomsa D.',
    phoneNumber: '+27 84 555 1234',
    dateOfBirth: new Date('1978-12-08'),
    gender: 'female',
    location: {
      country: 'South Africa',
      province: 'KwaZulu-Natal',
      city: 'Durban',
      postalCode: '4001'
    },
    preferences: {
      language: 'zu-ZA',
      currency: 'ZAR',
      notifications: {
        push: true,
        email: true,
        sms: true,
        deals: true,
        navigation: false,
        social: true
      },
      privacy: {
        profileVisibility: 'private',
        locationSharing: false,
        analyticsOptIn: false
      },
      accessibility: {
        textSize: 'medium',
        highContrast: true,
        voiceNavigation: true
      }
    },
    status: 'inactive',
    accountType: 'free',
    verificationStatus: {
      email: true,
      phone: true,
      identity: false
    },
    createdAt: new Date('2023-05-05'),
    lastActiveAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    loginCount: 45,
    appUsage: {
      totalSessions: 23,
      averageSessionDuration: 6.8,
      favoriteFeatures: ['Deal Finder', 'Store Locator'],
      mostUsedVenues: ['Gateway Theatre', 'Pavilion'],
      arNavigationUsage: 12,
      navigenieQueries: 8,
      storeCardsConnected: 3,
      dealsRedeemed: 7
    },
    socialProfile: {
      friendsCount: 15,
      reviewsCount: 5,
      photosShared: 12,
      checkins: 28,
      badgesEarned: ['Newcomer', 'Deal Hunter']
    },
    securityInfo: {
      lastPasswordChange: new Date('2023-05-05'),
      twoFactorEnabled: false,
      trustedDevices: 1,
      securityScore: 45,
      suspiciousActivityCount: 0
    }
  },
  {
    id: 'user_004',
    email: 'ahmed.hassan@gmail.com',
    firstName: 'Ahmed',
    lastName: 'Hassan',
    displayName: 'Ahmed H.',
    phoneNumber: '+27 81 777 8888',
    dateOfBirth: new Date('1990-04-30'),
    gender: 'male',
    location: {
      country: 'South Africa',
      province: 'Gauteng',
      city: 'Pretoria',
      postalCode: '0002'
    },
    preferences: {
      language: 'en-ZA',
      currency: 'ZAR',
      notifications: {
        push: true,
        email: true,
        sms: false,
        deals: true,
        navigation: true,
        social: false
      },
      privacy: {
        profileVisibility: 'friends',
        locationSharing: true,
        analyticsOptIn: true
      },
      accessibility: {
        textSize: 'small',
        highContrast: false,
        voiceNavigation: false
      }
    },
    status: 'suspended',
    accountType: 'free',
    verificationStatus: {
      email: true,
      phone: false,
      identity: false
    },
    createdAt: new Date('2023-09-12'),
    lastActiveAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    loginCount: 67,
    appUsage: {
      totalSessions: 34,
      averageSessionDuration: 15.2,
      favoriteFeatures: ['AR Navigation', 'NaviGenie', 'Deal Finder'],
      mostUsedVenues: ['Menlyn Park', 'Brooklyn Mall'],
      arNavigationUsage: 78,
      navigenieQueries: 156,
      storeCardsConnected: 4,
      dealsRedeemed: 12
    },
    socialProfile: {
      friendsCount: 23,
      reviewsCount: 8,
      photosShared: 34,
      checkins: 56,
      badgesEarned: ['AR Pioneer', 'Tech Savvy']
    },
    securityInfo: {
      lastPasswordChange: new Date('2023-09-12'),
      twoFactorEnabled: false,
      trustedDevices: 1,
      securityScore: 58,
      suspiciousActivityCount: 3
    }
  },
  {
    id: 'user_005',
    email: 'michelle.van.der.merwe@gmail.com',
    firstName: 'Michelle',
    lastName: 'van der Merwe',
    displayName: 'Michelle vdM.',
    phoneNumber: '+27 82 345 6789',
    dateOfBirth: new Date('1988-11-17'),
    gender: 'female',
    location: {
      country: 'South Africa',
      province: 'Western Cape',
      city: 'Stellenbosch',
      postalCode: '7600'
    },
    preferences: {
      language: 'af-ZA',
      currency: 'ZAR',
      notifications: {
        push: true,
        email: true,
        sms: false,
        deals: true,
        navigation: true,
        social: true
      },
      privacy: {
        profileVisibility: 'public',
        locationSharing: true,
        analyticsOptIn: true
      },
      accessibility: {
        textSize: 'medium',
        highContrast: false,
        voiceNavigation: false
      }
    },
    status: 'active',
    accountType: 'enterprise',
    verificationStatus: {
      email: true,
      phone: true,
      identity: true
    },
    createdAt: new Date('2023-02-28'),
    lastActiveAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    loginCount: 312,
    appUsage: {
      totalSessions: 156,
      averageSessionDuration: 18.7,
      favoriteFeatures: ['Store Cards', 'Deal Finder', 'AR Navigation', 'Social Features'],
      mostUsedVenues: ['V&A Waterfront', 'Eikestad Mall', 'Cavendish Square'],
      arNavigationUsage: 234,
      navigenieQueries: 89,
      storeCardsConnected: 12,
      dealsRedeemed: 67
    },
    socialProfile: {
      friendsCount: 156,
      reviewsCount: 89,
      photosShared: 234,
      checkins: 312,
      badgesEarned: ['Explorer', 'Deal Hunter', 'Social Butterfly', 'AR Pioneer', 'Photo Master', 'Super User']
    },
    securityInfo: {
      lastPasswordChange: new Date('2024-01-10'),
      twoFactorEnabled: true,
      trustedDevices: 4,
      securityScore: 98,
      suspiciousActivityCount: 0
    }
  }
]

export default function ProfileManagementPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'analytics' | 'security' | 'settings'>('users')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>('all')
  const [locationFilter, setLocationFilter] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<NaviLynxUser | null>(null)

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    const matchesAccountType = accountTypeFilter === 'all' || user.accountType === accountTypeFilter
    const matchesLocation = locationFilter === 'all' || user.location.province === locationFilter
    
    return matchesSearch && matchesStatus && matchesAccountType && matchesLocation
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200'
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'banned': return 'bg-red-200 text-red-900 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />
      case 'inactive': return <XCircle className="w-4 h-4" />
      case 'suspended': return <AlertTriangle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'banned': return <Ban className="w-4 h-4" />
      default: return <Users className="w-4 h-4" />
    }
  }

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'free': return <Users className="w-4 h-4 text-gray-600" />
      case 'premium': return <Star className="w-4 h-4 text-purple-600" />
      case 'enterprise': return <Shield className="w-4 h-4 text-blue-600" />
      default: return <Users className="w-4 h-4" />
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const userStats = {
    total: mockUsers.length,
    active: mockUsers.filter(u => u.status === 'active').length,
    premium: mockUsers.filter(u => u.accountType === 'premium').length,
    avgSessions: Math.round(mockUsers.reduce((acc, u) => acc + u.appUsage.totalSessions, 0) / mockUsers.length),
    totalRevenue: mockUsers.filter(u => u.accountType !== 'free').length * 29.99,
    avgSecurityScore: Math.round(mockUsers.reduce((acc, u) => acc + u.securityInfo.securityScore, 0) / mockUsers.length)
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile Management</h1>
              <p className="text-lg text-gray-600">Comprehensive user analytics and management for NaviLynx South Africa</p>
            </div>
            <div className="flex items-center gap-3 mt-4 lg:mt-0">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Sync Data
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Users
              </Button>
              <Button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
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
                    <p className="text-sm text-gray-600 mb-1">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{userStats.total}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Users</p>
                    <p className="text-3xl font-bold text-emerald-600">{userStats.active}</p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <UserCheck className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Premium Users</p>
                    <p className="text-3xl font-bold text-purple-600">{userStats.premium}</p>
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
                    <p className="text-sm text-gray-600 mb-1">Avg Sessions</p>
                    <p className="text-3xl font-bold text-gray-900">{userStats.avgSessions}</p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <Activity className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-emerald-600">R{userStats.totalRevenue}</p>
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
                    <p className="text-sm text-gray-600 mb-1">Security Score</p>
                    <p className="text-3xl font-bold text-blue-600">{userStats.avgSecurityScore}%</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Shield className="w-6 h-6 text-blue-600" />
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
                  { id: 'users', label: 'Users', icon: Users },
                  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                  { id: 'security', label: 'Security', icon: Shield },
                  { id: 'settings', label: 'Settings', icon: Settings }
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'users' | 'analytics' | 'security' | 'settings')}
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
              {activeTab === 'users' && (
                <div className="space-y-6">
                  {/* Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search users..."
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
                      <option value="pending">Pending</option>
                      <option value="banned">Banned</option>
                    </select>

                    <select
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={accountTypeFilter}
                      onChange={(e) => setAccountTypeFilter(e.target.value)}
                    >
                      <option value="all">All Account Types</option>
                      <option value="free">Free</option>
                      <option value="premium">Premium</option>
                      <option value="enterprise">Enterprise</option>
                    </select>

                    <select
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    >
                      <option value="all">All Provinces</option>
                      <option value="Gauteng">Gauteng</option>
                      <option value="Western Cape">Western Cape</option>
                      <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                    </select>

                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      More Filters
                    </Button>
                  </div>

                  {/* Users List */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">User</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Account Type</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Location</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Activity</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Security</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredUsers.map((user, index) => (
                          <motion.tr
                            key={user.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => setSelectedUser(user)}
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                  <span className="text-purple-600 font-semibold">
                                    {user.firstName[0]}{user.lastName[0]}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                                  <p className="text-sm text-gray-600">{user.email}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    {user.verificationStatus.email && (
                                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                                    )}
                                    {user.verificationStatus.phone && (
                                      <Phone className="w-3 h-3 text-blue-500" />
                                    )}
                                    {user.verificationStatus.identity && (
                                      <Shield className="w-3 h-3 text-purple-500" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                                {getStatusIcon(user.status)}
                                <span className="capitalize">{user.status}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                {getAccountTypeIcon(user.accountType)}
                                <span className="capitalize font-medium">{user.accountType}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-1 text-sm">
                                <MapPin className="w-3 h-3 text-gray-400" />
                                <span>{user.location.city}, {user.location.province}</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                <Globe className="w-3 h-3 inline mr-1" />
                                {user.preferences.language}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm">
                                <div className="font-medium">{user.appUsage.totalSessions} sessions</div>
                                <div className="text-gray-600">{formatTimeAgo(user.lastActiveAt)}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {user.appUsage.averageSessionDuration.toFixed(1)}m avg
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <div className={`w-8 h-2 rounded-full ${
                                  user.securityInfo.securityScore >= 80 ? 'bg-emerald-500' :
                                  user.securityInfo.securityScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                }`} />
                                <span className="text-sm font-medium">{user.securityInfo.securityScore}%</span>
                                {user.securityInfo.twoFactorEnabled && (
                                  <Shield className="w-3 h-3 text-emerald-500" />
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="p-2">
                                  <Eye className="w-3 h-3" />
                                </Button>
                                <Button variant="outline" size="sm" className="p-2">
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button variant="outline" size="sm" className="p-2 text-red-600 hover:text-red-700">
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">User Analytics Dashboard</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">User Distribution by Province</h4>
                          <MapPin className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="space-y-3">
                          {['Gauteng', 'Western Cape', 'KwaZulu-Natal'].map((province, index) => (
                            <div key={province} className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">{province}</span>
                              <span className="font-medium">{[40, 35, 25][index]}%</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">Most Used Features</h4>
                          <Activity className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="space-y-3">
                          {['AR Navigation', 'Deal Finder', 'Store Cards', 'NaviGenie'].map((feature, index) => (
                            <div key={feature} className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">{feature}</span>
                              <span className="font-medium">{[85, 72, 58, 43][index]}%</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">Language Preferences</h4>
                          <Globe className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="space-y-3">
                          {['English', 'Afrikaans', 'Zulu', 'Xhosa'].map((language, index) => (
                            <div key={language} className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">{language}</span>
                              <span className="font-medium">{[60, 20, 12, 8][index]}%</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Security Overview</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">2FA Enabled</p>
                            <p className="text-2xl font-bold text-emerald-600">
                              {mockUsers.filter(u => u.securityInfo.twoFactorEnabled).length}
                            </p>
                          </div>
                          <Shield className="w-8 h-8 text-emerald-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">High Security Score</p>
                            <p className="text-2xl font-bold text-blue-600">
                              {mockUsers.filter(u => u.securityInfo.securityScore >= 80).length}
                            </p>
                          </div>
                          <CheckCircle className="w-8 h-8 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Suspicious Activity</p>
                            <p className="text-2xl font-bold text-red-600">
                              {mockUsers.reduce((acc, u) => acc + u.securityInfo.suspiciousActivityCount, 0)}
                            </p>
                          </div>
                          <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Verified Users</p>
                            <p className="text-2xl font-bold text-purple-600">
                              {mockUsers.filter(u => u.verificationStatus.email && u.verificationStatus.phone).length}
                            </p>
                          </div>
                          <UserCheck className="w-8 h-8 text-purple-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-8">
                  <h3 className="text-lg font-semibold text-gray-900">User Management Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">Account Settings</h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">Auto-approve new registrations</label>
                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                              <span className="inline-block h-4 w-4 transform translate-x-1 rounded-full bg-white transition-transform" />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">Require email verification</label>
                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600">
                              <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white transition-transform" />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">Enable social login</label>
                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600">
                              <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">Privacy & Security</h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">Data retention period (days)</label>
                            <input 
                              type="number" 
                              className="w-20 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                              defaultValue="365"
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">Force 2FA for premium users</label>
                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600">
                              <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white transition-transform" />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">GDPR compliance mode</label>
                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600">
                              <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white transition-transform" />
                            </button>
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

          {/* User Details Modal */}
          {selectedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedUser(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-xl">
                          {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {selectedUser.firstName} {selectedUser.lastName}
                        </h2>
                        <p className="text-gray-600">{selectedUser.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedUser.status)}`}>
                            {getStatusIcon(selectedUser.status)}
                            <span className="capitalize">{selectedUser.status}</span>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
                            {getAccountTypeIcon(selectedUser.accountType)}
                            <span className="capitalize">{selectedUser.accountType}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedUser(null)}
                      className="p-2"
                    >
                      ✕
                    </Button>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Personal Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-600">Phone</label>
                        <p className="font-medium">{selectedUser.phoneNumber || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Location</label>
                        <p className="font-medium">
                          {selectedUser.location.city}, {selectedUser.location.province}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Language</label>
                        <p className="font-medium">{selectedUser.preferences.language}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Joined</label>
                        <p className="font-medium">{selectedUser.createdAt.toLocaleDateString()}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* App Usage */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5" />
                        App Usage
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-600">Total Sessions</label>
                        <p className="font-medium">{selectedUser.appUsage.totalSessions}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Avg Session</label>
                        <p className="font-medium">{selectedUser.appUsage.averageSessionDuration.toFixed(1)} min</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">AR Navigation</label>
                        <p className="font-medium">{selectedUser.appUsage.arNavigationUsage} uses</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">NaviGenie Queries</label>
                        <p className="font-medium">{selectedUser.appUsage.navigenieQueries}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Security */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Security
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-600">Security Score</label>
                        <div className="flex items-center gap-2">
                          <div className={`w-16 h-2 rounded-full ${
                            selectedUser.securityInfo.securityScore >= 80 ? 'bg-emerald-500' :
                            selectedUser.securityInfo.securityScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                          }`} />
                          <span className="font-medium">{selectedUser.securityInfo.securityScore}%</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Two-Factor Auth</label>
                        <p className="font-medium">
                          {selectedUser.securityInfo.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Trusted Devices</label>
                        <p className="font-medium">{selectedUser.securityInfo.trustedDevices}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Suspicious Activity</label>
                        <p className="font-medium">{selectedUser.securityInfo.suspiciousActivityCount}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
