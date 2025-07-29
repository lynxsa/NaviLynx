'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  Tag,
  Activity,
  Plus,
  Building2,
  Clock,
  ArrowUp,
  Globe,
  Navigation,
  CreditCard,
  Brain,
  Eye,
  Wifi,
  Server,
  Star,
  TrendingUp,
  Filter,
  Download,
  RefreshCw,
  Bell,
  Map
} from "lucide-react"

// NaviLynx comprehensive data interfaces aligned with mobile app
interface NaviLynxMetrics {
  totalVenues: number
  activeUsers: number
  navigationSessions: number
  storeCardTransactions: number
  navigenieQueries: number
  arSessions: number
  beaconStatus: number
  dealRedemptions: number
  systemHealth: number
  userSatisfaction: number
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  action: () => void
  category: 'venue' | 'user' | 'system' | 'content'
}

interface SystemAlert {
  id: string
  type: 'warning' | 'error' | 'info' | 'success'
  title: string
  message: string
  timestamp: Date
  venue?: string
  resolved: boolean
}

interface ActivityFeed {
  id: string
  type: 'user_signup' | 'venue_visit' | 'deal_redemption' | 'ar_session' | 'navigenie_query' | 'store_card_transaction'
  title: string
  description: string
  timestamp: Date
  user?: string
  venue?: string
  icon: React.ReactNode
}

// Mock data aligned with South African venues and NaviLynx features
const mockMetrics: NaviLynxMetrics = {
  totalVenues: 18,
  activeUsers: 15420,
  navigationSessions: 8947,
  storeCardTransactions: 5634,
  navigenieQueries: 3210,
  arSessions: 6789,
  beaconStatus: 96.7,
  dealRedemptions: 2847,
  systemHealth: 99.2,
  userSatisfaction: 4.6
}

const quickActions: QuickAction[] = [
  {
    id: 'add_venue',
    title: 'Add New Venue',
    description: 'Register a new shopping mall, hospital, or facility',
    icon: <Building2 className="w-6 h-6" />,
    color: 'from-purple-500 to-indigo-600',
    action: () => console.log('Add venue'),
    category: 'venue'
  },
  {
    id: 'update_map',
    title: 'Update Indoor Map',
    description: 'Upload new floor plans and AR waypoints',
    icon: <Map className="w-6 h-6" />,
    color: 'from-emerald-500 to-teal-600',
    action: () => console.log('Update map'),
    category: 'venue'
  },
  {
    id: 'assign_beacons',
    title: 'Assign Beacons/RFID',
    description: 'Configure indoor positioning devices',
    icon: <Wifi className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-600',
    action: () => console.log('Assign beacons'),
    category: 'system'
  },
  {
    id: 'create_deal',
    title: 'Create Store Deal',
    description: 'Add new promotions for venue stores',
    icon: <Tag className="w-6 h-6" />,
    color: 'from-amber-500 to-orange-600',
    action: () => console.log('Create deal'),
    category: 'content'
  },
  {
    id: 'manage_store_cards',
    title: 'Manage Store Cards',
    description: 'Configure digital wallet and loyalty cards',
    icon: <CreditCard className="w-6 h-6" />,
    color: 'from-pink-500 to-rose-600',
    action: () => console.log('Manage store cards'),
    category: 'content'
  },
  {
    id: 'configure_navigenie',
    title: 'Configure NaviGenie AI',
    description: 'Update AI assistant responses and training',
    icon: <Brain className="w-6 h-6" />,
    color: 'from-violet-500 to-purple-600',
    action: () => console.log('Configure NaviGenie'),
    category: 'system'
  },
  {
    id: 'send_notification',
    title: 'Send User Notification',
    description: 'Broadcast updates to mobile app users',
    icon: <Bell className="w-6 h-6" />,
    color: 'from-indigo-500 to-blue-600',
    action: () => console.log('Send notification'),
    category: 'user'
  },
  {
    id: 'ar_content',
    title: 'Manage AR Content',
    description: 'Update 3D waypoints and AR overlays',
    icon: <Eye className="w-6 h-6" />,
    color: 'from-cyan-500 to-blue-600',
    action: () => console.log('Manage AR content'),
    category: 'content'
  }
]

const systemAlerts: SystemAlert[] = [
  {
    id: 'alert_001',
    type: 'warning',
    title: 'Beacon Connectivity Low',
    message: 'V&A Waterfront Level 2 - 3 beacons offline',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    venue: 'V&A Waterfront',
    resolved: false
  },
  {
    id: 'alert_002',
    type: 'success',
    title: 'New Venue Onboarding Complete',
    message: 'Rosebank Mall successfully added with full AR mapping',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    venue: 'Rosebank Mall',
    resolved: true
  },
  {
    id: 'alert_003',
    type: 'info',
    title: 'NaviGenie AI Update Available',
    message: 'New language model with improved South African context',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    resolved: false
  }
]

const activityFeed: ActivityFeed[] = [
  {
    id: 'activity_001',
    type: 'user_signup',
    title: 'New User Registration',
    description: 'Sarah M. joined from Cape Town',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    user: 'Sarah M.',
    icon: <Users className="w-4 h-4" />
  },
  {
    id: 'activity_002',
    type: 'ar_session',
    title: 'AR Navigation Session',
    description: 'User navigated to Woolworths in Sandton City',
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    venue: 'Sandton City',
    icon: <Navigation className="w-4 h-4" />
  },
  {
    id: 'activity_003',
    type: 'store_card_transaction',
    title: 'Store Card Payment',
    description: 'R245.50 spent at Cotton On using digital wallet',
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    icon: <CreditCard className="w-4 h-4" />
  },
  {
    id: 'activity_004',
    type: 'navigenie_query',
    title: 'NaviGenie AI Query',
    description: 'User asked about wheelchair accessible routes',
    timestamp: new Date(Date.now() - 18 * 60 * 1000),
    icon: <Brain className="w-4 h-4" />
  },
  {
    id: 'activity_005',
    type: 'deal_redemption',
    title: 'Deal Redeemed',
    description: '40% discount used at Foschini',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    icon: <Tag className="w-4 h-4" />
  }
]

export default function NaviLynxDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-ZA', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'Africa/Johannesburg'
    })
  }

  const formatMetric = (value: number, type: 'number' | 'percentage' | 'currency' = 'number') => {
    if (type === 'percentage') return `${value.toFixed(1)}%`
    if (type === 'currency') return `R${value.toLocaleString()}`
    return value.toLocaleString()
  }

  const getAlertColor = (type: SystemAlert['type']) => {
    switch (type) {
      case 'error': return 'border-red-200 bg-red-50 text-red-800'
      case 'warning': return 'border-amber-200 bg-amber-50 text-amber-800'
      case 'success': return 'border-emerald-200 bg-emerald-50 text-emerald-800'
      case 'info': return 'border-blue-200 bg-blue-50 text-blue-800'
      default: return 'border-gray-200 bg-gray-50 text-gray-800'
    }
  }

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <AdminLayout userRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-violet-500/10 to-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-6 py-8 space-y-8 relative z-10">
          {/* Enhanced Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0"
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-violet-600 shadow-2xl shadow-purple-600/30 border-2 border-white/20">
                  <Navigation className="h-9 w-9 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    NaviLynx Dashboard
                  </h1>
                  <p className="text-lg text-gray-600 font-semibold mt-2">
                    Welcome back! Here&apos;s what&apos;s happening with your indoor navigation platform today.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Last updated: {formatTime(currentTime)} SAST</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      <span>18 Active Venues Across South Africa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-gray-300 hover:border-purple-400 hover:text-purple-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-gray-300 hover:border-purple-400 hover:text-purple-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Report
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2 rounded-xl shadow-lg transition-all duration-200">
                <Plus className="w-4 h-4 mr-2" />
                Quick Setup
              </Button>
            </div>
          </motion.div>

          {/* NaviLynx Key Metrics Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
          >
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 mb-1">Active Venues</p>
                    <p className="text-3xl font-bold text-gray-900">{mockMetrics.totalVenues}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      +2 this month
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Building2 className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-600 mb-1">Active Users</p>
                    <p className="text-3xl font-bold text-gray-900">{formatMetric(mockMetrics.activeUsers)}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <ArrowUp className="w-3 h-3 text-emerald-500" />
                      +12.5% vs last week
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    <Users className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 mb-1">AR Navigation</p>
                    <p className="text-3xl font-bold text-gray-900">{formatMetric(mockMetrics.arSessions)}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <ArrowUp className="w-3 h-3 text-blue-500" />
                      Sessions today
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Navigation className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-600 mb-1">Store Card</p>
                    <p className="text-3xl font-bold text-gray-900">{formatMetric(mockMetrics.storeCardTransactions)}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <CreditCard className="w-3 h-3" />
                      Transactions
                    </p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-xl">
                    <CreditCard className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-violet-600 mb-1">NaviGenie AI</p>
                    <p className="text-3xl font-bold text-gray-900">{formatMetric(mockMetrics.navigenieQueries)}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Brain className="w-3 h-3" />
                      Queries today
                    </p>
                  </div>
                  <div className="p-3 bg-violet-100 rounded-xl">
                    <Brain className="w-6 h-6 text-violet-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter by Category
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={action.action}
                  className="cursor-pointer"
                >
                  <Card className="h-full bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow`}>
                          {action.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full capitalize">
                            {action.category}
                          </span>
                          <ArrowUp className="w-4 h-4 text-gray-400 transform -rotate-45 group-hover:text-gray-600 transition-colors" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Analytics and System Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* System Health & Performance */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-full bg-white border-gray-200 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-600" />
                    System Health & Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">System Uptime</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-emerald-600">
                          {formatMetric(mockMetrics.systemHealth, 'percentage')}
                        </div>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${mockMetrics.systemHealth}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Beacon Status</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-blue-600">
                          {formatMetric(mockMetrics.beaconStatus, 'percentage')}
                        </div>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${mockMetrics.beaconStatus}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">User Satisfaction</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-amber-600">
                          {mockMetrics.userSatisfaction}/5.0
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-3 h-3 ${star <= Math.floor(mockMetrics.userSatisfaction) ? 'text-amber-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* System Alerts */}
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Alerts</h4>
                    <div className="space-y-2">
                      {systemAlerts.slice(0, 3).map((alert) => (
                        <div 
                          key={alert.id} 
                          className={`p-3 rounded-lg border ${getAlertColor(alert.type)} ${alert.resolved ? 'opacity-60' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">{alert.title}</p>
                              <p className="text-xs opacity-80">{alert.message}</p>
                            </div>
                            <span className="text-xs">{getTimeAgo(alert.timestamp)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity Feed */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="h-full bg-white border-gray-200 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-600" />
                    Latest Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activityFeed.map((activity, index) => (
                      <motion.div 
                        key={activity.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                          {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-xs text-gray-600">{activity.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {activity.venue && (
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                {activity.venue}
                              </span>
                            )}
                            <span className="text-xs text-gray-500">{getTimeAgo(activity.timestamp)}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" className="w-full">
                      View All Activity
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Additional Performance Metrics */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200/50 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-indigo-900">Navigation Sessions</h3>
                  <Navigation className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Today</span>
                    <span className="font-bold text-gray-900">{formatMetric(mockMetrics.navigationSessions)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Success Rate</span>
                    <span className="font-bold text-emerald-600">94.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Duration</span>
                    <span className="font-bold text-gray-900">12.8 min</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200/50 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-emerald-900">Deal Performance</h3>
                  <Tag className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Redemptions</span>
                    <span className="font-bold text-gray-900">{formatMetric(mockMetrics.dealRedemptions)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Conversion Rate</span>
                    <span className="font-bold text-emerald-600">18.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Revenue Impact</span>
                    <span className="font-bold text-gray-900">R456K</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200/50 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-purple-900">AI Assistant</h3>
                  <Brain className="w-5 h-5 text-purple-600" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">NaviGenie Queries</span>
                    <span className="font-bold text-gray-900">{formatMetric(mockMetrics.navigenieQueries)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Response Accuracy</span>
                    <span className="font-bold text-purple-600">96.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Response Time</span>
                    <span className="font-bold text-gray-900">1.2s</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  )
}
