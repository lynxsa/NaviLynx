'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  TrendingUp,
  Users,
  MapPin,
  Smartphone,
  Eye,
  Navigation,
  ShoppingBag,
  Clock,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Activity,
  Target,
  Zap,
  Globe,
  Database,
  Server
} from "lucide-react"

// Mobile App Aligned Analytics Interface - From mobile app types
interface MobileAppAnalytics {
  id: string
  type: 'user_behavior' | 'venue_performance' | 'deal_effectiveness' | 'ar_usage' | 'system_health'
  period: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly'
  startDate: Date
  endDate: Date
  metrics: Record<string, number | string>
  dimensions: Record<string, string>
  generatedAt: Date
  generatedBy: string
}

interface BusinessMetrics {
  dailyActiveUsers: number
  monthlyActiveUsers: number
  averageSessionDuration: number
  venueEngagementRate: number
  arUsageRate: number
  dealConversionRate: number
  retentionRate: {
    day1: number
    day7: number
    day30: number
  }
}

interface VenueAnalytics {
  venueId: string
  venueName: string
  totalVisitors: number
  uniqueVisitors: number
  averageVisitDuration: number
  arEngagement: number
  popularTimes: Record<string, number>
  conversionRate: number
  satisfaction: number
}

interface UserBehaviorMetrics {
  totalUsers: number
  activeUsers: number
  newUsers: number
  screenViews: number
  sessionDuration: number
  bounceRate: number
  topScreens: { screen: string; views: number }[]
  userFlow: { from: string; to: string; count: number }[]
}

interface ARUsageMetrics {
  totalARSessions: number
  averageARDuration: number
  arSuccessRate: number
  markerDetectionRate: number
  navigationAccuracy: number
  arRetentionRate: number
  popularARFeatures: { feature: string; usage: number }[]
}

interface SystemHealthMetrics {
  apiResponseTime: number
  databaseQueryTime: number
  memoryUsage: number
  cpuUsage: number
  activeUsers: number
  requestsPerSecond: number
  errorRate: number
  uptime: number
}

// South African focused analytics data aligned with mobile app
const mockAnalyticsData = {
  businessMetrics: {
    dailyActiveUsers: 2847,
    monthlyActiveUsers: 15420,
    averageSessionDuration: 18.5,
    venueEngagementRate: 73.2,
    arUsageRate: 45.8,
    dealConversionRate: 12.4,
    retentionRate: {
      day1: 85.2,
      day7: 62.8,
      day30: 34.5
    }
  } as BusinessMetrics,
  
  venueAnalytics: [
    {
      venueId: 'sandton-city',
      venueName: 'Sandton City',
      totalVisitors: 5432,
      uniqueVisitors: 4123,
      averageVisitDuration: 25.8,
      arEngagement: 67.3,
      popularTimes: { '09:00': 45, '12:00': 89, '15:00': 76, '18:00': 92 },
      conversionRate: 15.2,
      satisfaction: 4.6
    },
    {
      venueId: 'v-a-waterfront',
      venueName: 'V&A Waterfront',
      totalVisitors: 4876,
      uniqueVisitors: 3654,
      averageVisitDuration: 32.1,
      arEngagement: 71.8,
      popularTimes: { '09:00': 38, '12:00': 82, '15:00': 95, '18:00': 78 },
      conversionRate: 18.7,
      satisfaction: 4.8
    },
    {
      venueId: 'gateway-theatre',
      venueName: 'Gateway Theatre of Shopping',
      totalVisitors: 3921,
      uniqueVisitors: 2987,
      averageVisitDuration: 28.3,
      arEngagement: 58.9,
      popularTimes: { '09:00': 42, '12:00': 76, '15:00': 88, '18:00': 85 },
      conversionRate: 13.8,
      satisfaction: 4.4
    },
    {
      venueId: 'menlyn-park',
      venueName: 'Menlyn Park Shopping Centre',
      totalVisitors: 3456,
      uniqueVisitors: 2678,
      averageVisitDuration: 22.7,
      arEngagement: 52.4,
      popularTimes: { '09:00': 35, '12:00': 68, '15:00': 72, '18:00': 69 },
      conversionRate: 11.9,
      satisfaction: 4.3
    }
  ] as VenueAnalytics[]
}

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly')
  const [selectedMetric, setSelectedMetric] = useState<'overview' | 'venues' | 'users' | 'ar' | 'system'>('overview')
  const [dateRange, setDateRange] = useState({ start: '2024-01-01', end: '2024-01-31' })

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatPercentage = (num: number) => `${num.toFixed(1)}%`
  const formatDuration = (minutes: number) => `${minutes.toFixed(1)}m`

  const getTrendIcon = (isPositive: boolean) =>
    isPositive ? (
      <ArrowUp className="w-4 h-4 text-emerald-600" />
    ) : (
      <ArrowDown className="w-4 h-4 text-red-600" />
    )

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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Mobile App Analytics</h1>
              <p className="text-lg text-gray-600">Real-time insights from South African venue navigation and AR usage</p>
            </div>
            <div className="flex items-center gap-3 mt-4 lg:mt-0">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh Data
              </Button>
              <Button className="bg-purple-600 text-white" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Metric Type</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value as 'overview' | 'venues' | 'users' | 'ar' | 'system')}
                >
                  <option value="overview">Overview</option>
                  <option value="venues">Venue Performance</option>
                  <option value="users">User Behavior</option>
                  <option value="ar">AR Usage</option>
                  <option value="system">System Health</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                />
              </div>
            </div>
          </motion.div>

          {/* Key Metrics Overview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(true)}
                    <span className="text-sm text-emerald-600 font-medium">+12.5%</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {formatNumber(mockAnalyticsData.businessMetrics.monthlyActiveUsers)}
                </h3>
                <p className="text-sm text-gray-600">Monthly Active Users</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(true)}
                    <span className="text-sm text-emerald-600 font-medium">+8.3%</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {formatPercentage(mockAnalyticsData.businessMetrics.venueEngagementRate)}
                </h3>
                <p className="text-sm text-gray-600">Venue Engagement Rate</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Navigation className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(true)}
                    <span className="text-sm text-emerald-600 font-medium">+15.7%</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {formatPercentage(mockAnalyticsData.businessMetrics.arUsageRate)}
                </h3>
                <p className="text-sm text-gray-600">AR Usage Rate</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <Target className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(true)}
                    <span className="text-sm text-emerald-600 font-medium">+5.2%</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {formatPercentage(mockAnalyticsData.businessMetrics.dealConversionRate)}
                </h3>
                <p className="text-sm text-gray-600">Deal Conversion Rate</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Venue Performance */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-gray-200 shadow-lg mb-8"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Top Performing Venues</h2>
              <p className="text-gray-600">South African shopping centers with highest engagement</p>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {mockAnalyticsData.venueAnalytics.map((venue, index) => (
                  <motion.div
                    key={venue.venueId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <MapPin className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{venue.venueName}</h3>
                        <p className="text-sm text-gray-600">
                          {formatNumber(venue.totalVisitors)} visitors • {formatDuration(venue.averageVisitDuration)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">AR Engagement</p>
                        <p className="font-semibold text-purple-600">{formatPercentage(venue.arEngagement)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Conversion</p>
                        <p className="font-semibold text-emerald-600">{formatPercentage(venue.conversionRate)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Satisfaction</p>
                        <p className="font-semibold text-amber-600">{venue.satisfaction}/5</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Session Duration Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-gray-200 shadow-lg"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Analytics</h2>
                  <p className="text-gray-600">Average session duration: {formatDuration(mockAnalyticsData.businessMetrics.averageSessionDuration)}</p>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter Data
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <Clock className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Day 1 Retention</h3>
                  <p className="text-2xl font-bold text-emerald-600">
                    {formatPercentage(mockAnalyticsData.businessMetrics.retentionRate.day1)}
                  </p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Day 7 Retention</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatPercentage(mockAnalyticsData.businessMetrics.retentionRate.day7)}
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Day 30 Retention</h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatPercentage(mockAnalyticsData.businessMetrics.retentionRate.day30)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  )
}
