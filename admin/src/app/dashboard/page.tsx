'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QuickActions } from "@/components/quick-actions"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  MapPin,
  Star,
  Eye,
  Zap,
  Globe,
  Clock,
  Activity,
  Wifi,
  Download,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Scan,
  Navigation,
  Camera,
  Filter,
  RefreshCw,
  Settings,
  Bell,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Building2,
  CreditCard,
  Brain,
  Tag,
  Plus,
  Server,
  MessageSquare
} from "lucide-react"

// Enhanced Dashboard Data Interfaces
interface DashboardMetrics {
  users: {
    total: number
    active: number
    new: number
    growth: number
    online: number
  }
  venues: {
    total: number
    active: number
    verified: number
    avgRating: number
  }
  revenue: {
    total: number
    growth: number
    arpu: number
    subscriptions: number
  }
  engagement: {
    sessions: number
    duration: number
    arUsage: number
    scanRate: number
  }
  technical: {
    appVersion: string
    uptime: number
    crashes: number
    performance: number
  }
}

interface ChartDataPoint {
  name: string
  value: number
  change?: number
  color?: string
}

interface ActivityItem {
  id: string
  type: 'user_action' | 'system' | 'venue' | 'alert'
  title: string
  description: string
  timestamp: Date
  severity?: 'low' | 'medium' | 'high'
  user?: string
  venue?: string
}

// Mock comprehensive dashboard data
const mockDashboardData: DashboardMetrics = {
  users: {
    total: 48756,
    active: 12834,
    new: 1247,
    growth: 23.5,
    online: 2341
  },
  venues: {
    total: 87,
    active: 84,
    verified: 78,
    avgRating: 4.7
  },
  revenue: {
    total: 2847650,
    growth: 18.2,
    arpu: 58.40,
    subscriptions: 3456
  },
  engagement: {
    sessions: 89432,
    duration: 12.8,
    arUsage: 76.3,
    scanRate: 68.9
  },
  technical: {
    appVersion: '3.2.1',
    uptime: 99.8,
    crashes: 0.02,
    performance: 94.6
  }
}

const recentActivity: ActivityItem[] = [
  {
    id: 'act_001',
    type: 'user_action',
    title: 'High engagement spike at Sandton City',
    description: '34% increase in AR navigation usage during lunch hours',
    timestamp: new Date('2025-07-29T12:45:00'),
    severity: 'medium',
    venue: 'Sandton City'
  },
  {
    id: 'act_002',
    type: 'system',
    title: 'New AR content deployed successfully',
    description: 'Promotional banners for summer sale campaign are now live',
    timestamp: new Date('2025-07-29T11:30:00'),
    severity: 'low'
  },
  {
    id: 'act_003',
    type: 'alert',
    title: 'Review moderation required',
    description: '3 reviews flagged for inappropriate content at V&A Waterfront',
    timestamp: new Date('2025-07-29T10:15:00'),
    severity: 'high',
    venue: 'V&A Waterfront'
  },
  {
    id: 'act_004',
    type: 'venue',
    title: 'Gateway Theatre performance metrics',
    description: 'Customer satisfaction increased by 15% this week',
    timestamp: new Date('2025-07-29T09:45:00'),
    severity: 'low',
    venue: 'Gateway Theatre'
  },
  {
    id: 'act_005',
    type: 'user_action',
    title: 'Peak usage detected',
    description: '2.3K concurrent users across all venues during weekend',
    timestamp: new Date('2025-07-29T08:20:00'),
    severity: 'medium'
  }
]

const weeklyData: ChartDataPoint[] = [
  { name: 'Mon', value: 8400, change: 5.2 },
  { name: 'Tue', value: 9200, change: 9.5 },
  { name: 'Wed', value: 10100, change: 9.8 },
  { name: 'Thu', value: 11200, change: 10.9 },
  { name: 'Fri', value: 12800, change: 14.3 },
  { name: 'Sat', value: 15600, change: 21.9 },
  { name: 'Sun', value: 13900, change: -10.9 }
]

const venuePerformance: ChartDataPoint[] = [
  { name: 'Sandton City', value: 4.8, color: '#8B5CF6' },
  { name: 'V&A Waterfront', value: 4.7, color: '#06B6D4' },
  { name: 'Canal Walk', value: 4.6, color: '#10B981' },
  { name: 'Gateway Theatre', value: 4.4, color: '#F59E0B' },
  { name: 'Menlyn Park', value: 4.2, color: '#EF4444' },
  { name: 'Rosebank Mall', value: 4.0, color: '#6B7280' }
]

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d')
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setRefreshing(false)
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUpRight className="w-4 h-4 text-emerald-600" />
    if (change < 0) return <ArrowDownRight className="w-4 h-4 text-red-600" />
    return <Minus className="w-4 h-4 text-gray-400" />
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-emerald-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-400'
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_action': return <Users className="w-4 h-4" />
      case 'system': return <Settings className="w-4 h-4" />
      case 'venue': return <MapPin className="w-4 h-4" />
      case 'alert': return <AlertTriangle className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200'
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'low': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <AdminLayout userRole="admin" title="Dashboard Overview">
      <div className="min-h-screen bg-gradient-to-br from-slate-50/50 via-purple-50/20 to-indigo-50/10">
        <div className="max-w-8xl mx-auto px-4 py-8">
          {/* Enhanced Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
          >
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                NaviLynx Command Center
              </h1>
              <p className="text-xl text-gray-600 font-medium">
                Real-time insights across {mockDashboardData.venues.total} South African venues
              </p>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 px-3 py-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                  System Healthy
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  v{mockDashboardData.technical.appVersion}
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  {mockDashboardData.users.online.toLocaleString()} online
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6 lg:mt-0">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTimeRange('24h')}
                  className={timeRange === '24h' ? 'bg-purple-100 text-purple-700' : ''}
                >
                  24h
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTimeRange('7d')}
                  className={timeRange === '7d' ? 'bg-purple-100 text-purple-700' : ''}
                >
                  7d
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTimeRange('30d')}
                  className={timeRange === '30d' ? 'bg-purple-100 text-purple-700' : ''}
                >
                  30d
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTimeRange('90d')}
                  className={timeRange === '90d' ? 'bg-purple-100 text-purple-700' : ''}
                >
                  90d
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </div>
          </motion.div>

          {/* Enhanced Key Metrics */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8"
          >
            {/* Total Users */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 ${getChangeColor(mockDashboardData.users.growth)}`}>
                    {getChangeIcon(mockDashboardData.users.growth)}
                    <span className="text-sm font-semibold">
                      {mockDashboardData.users.growth > 0 ? '+' : ''}{mockDashboardData.users.growth}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {mockDashboardData.users.total.toLocaleString()}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    {mockDashboardData.users.active.toLocaleString()} active
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Revenue */}
            <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-500 rounded-xl shadow-lg">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 ${getChangeColor(mockDashboardData.revenue.growth)}`}>
                    {getChangeIcon(mockDashboardData.revenue.growth)}
                    <span className="text-sm font-semibold">
                      {mockDashboardData.revenue.growth > 0 ? '+' : ''}{mockDashboardData.revenue.growth}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Revenue (ZAR)</p>
                  <p className="text-3xl font-bold text-gray-900">
                    R{(mockDashboardData.revenue.total / 1000).toFixed(0)}K
                  </p>
                  <p className="text-sm text-emerald-600 mt-1">
                    R{mockDashboardData.revenue.arpu} ARPU
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Venues */}
            <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-gray-600">
                      {mockDashboardData.venues.avgRating}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Venues</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {mockDashboardData.venues.active}
                  </p>
                  <p className="text-sm text-purple-600 mt-1">
                    {mockDashboardData.venues.verified} verified
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* AR Usage */}
            <Card className="bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-500 rounded-xl shadow-lg">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-orange-600`}>
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                      {mockDashboardData.engagement.arUsage}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">AR Engagement</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {mockDashboardData.engagement.arUsage}%
                  </p>
                  <p className="text-sm text-orange-600 mt-1">
                    {mockDashboardData.engagement.scanRate}% scan rate
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Session Duration */}
            <Card className="bg-gradient-to-br from-teal-50 to-cyan-100 border-teal-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-teal-500 rounded-xl shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-teal-600">
                    <Activity className="w-4 h-4" />
                    <span className="text-sm font-semibold">avg</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Session Duration</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {mockDashboardData.engagement.duration}m
                  </p>
                  <p className="text-sm text-teal-600 mt-1">
                    {mockDashboardData.engagement.sessions.toLocaleString()} sessions
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className="bg-gradient-to-br from-rose-50 to-pink-100 border-rose-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-rose-500 rounded-xl shadow-lg">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-semibold">healthy</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">System Uptime</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {mockDashboardData.technical.uptime}%
                  </p>
                  <p className="text-sm text-rose-600 mt-1">
                    {mockDashboardData.technical.performance}% performance
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <QuickActions />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enhanced Charts Section */}
            <div className="lg:col-span-2 space-y-8">
              {/* Weekly Activity Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                        Weekly User Activity
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Live Data</Badge>
                        <Button variant="ghost" size="sm">
                          <Filter className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <div className="flex items-end justify-between h-64 gap-4 mb-4">
                        {weeklyData.map((day, index) => (
                          <div key={day.name} className="flex flex-col items-center flex-1 group">
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${(day.value / Math.max(...weeklyData.map(d => d.value))) * 100}%` }}
                              transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
                              className="w-full bg-gradient-to-t from-purple-500 to-blue-500 rounded-t-lg group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300 hover:scale-105 shadow-lg relative"
                            >
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                  {day.value.toLocaleString()} users
                                </div>
                              </div>
                            </motion.div>
                            <div className="mt-2 text-center">
                              <p className="text-sm font-medium text-gray-700">{day.name}</p>
                              <div className={`flex items-center justify-center gap-1 text-xs ${getChangeColor(day.change || 0)}`}>
                                {getChangeIcon(day.change || 0)}
                                <span>{Math.abs(day.change || 0)}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Venue Performance Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-purple-600" />
                      Venue Performance Ratings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {venuePerformance.map((venue, index) => (
                        <motion.div 
                          key={venue.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between group hover:bg-gray-50 p-3 rounded-lg transition-all duration-300"
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full shadow-sm"
                              style={{ backgroundColor: venue.color }}
                            ></div>
                            <span className="font-medium text-gray-900">{venue.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < Math.round(venue.value) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="font-bold text-gray-900 w-8">{venue.value}</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(venue.value / 5) * 100}%` }}
                                transition={{ delay: index * 0.1, duration: 0.8 }}
                                className="h-2 rounded-full transition-all duration-500"
                                style={{ backgroundColor: venue.color }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Enhanced Sidebar */}
            <div className="space-y-6">
              {/* Real-time Activity Feed */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-600" />
                      Live Activity Feed
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                      {recentActivity.map((activity, index) => (
                        <motion.div 
                          key={activity.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-300 group"
                        >
                          <div className={`p-2 rounded-lg ${getSeverityColor(activity.severity)} group-hover:scale-110 transition-transform duration-300`}>
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm leading-tight">
                              {activity.title}
                            </p>
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                              {activity.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500">
                                {activity.timestamp.toLocaleTimeString()}
                              </span>
                              {activity.venue && (
                                <Badge variant="outline" className="text-xs">
                                  {activity.venue}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Button variant="outline" className="w-full text-sm">
                        View All Activity
                      </Button>
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
                <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-purple-600" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-purple-50 hover:border-purple-300 transition-all group">
                        <Users className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-medium">Manage Users</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all group">
                        <MapPin className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-medium">Add Venue</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-emerald-50 hover:border-emerald-300 transition-all group">
                        <Camera className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-medium">AR Content</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-orange-50 hover:border-orange-300 transition-all group">
                        <BarChart3 className="w-5 h-5 text-orange-600 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-medium">Analytics</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* System Status */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-600" />
                      System Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">API Response</span>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-sm text-emerald-600 font-medium">42ms</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Database</span>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-sm text-emerald-600 font-medium">Online</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">CDN</span>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-sm text-emerald-600 font-medium">99.9%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">AR Services</span>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          <span className="text-sm text-amber-600 font-medium">Updating</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
