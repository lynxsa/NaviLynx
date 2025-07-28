import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Download,
  Calendar,
  Clock,
  MapPin,
  Scan,
  Tag,
  Building2,
} from "lucide-react";

const analyticsData = {
  overview: {
    totalUsers: 24567,
    activeUsers: 18450,
    totalSessions: 156789,
    avgSessionDuration: "8m 32s",
    totalScans: 89234,
    totalDeals: 1456,
    userGrowth: 12.5,
    sessionGrowth: 8.7,
    scanGrowth: 23.4,
    dealEngagement: 15.8,
  },
  topVenues: [
    { name: "Central Mall Seattle", visits: 12450, growth: 15.2 },
    { name: "Best Buy Electronics", visits: 8920, growth: 8.1 },
    { name: "Food Paradise", visits: 6780, growth: -2.3 },
    { name: "Entertainment Complex", visits: 4560, growth: 22.7 },
    { name: "Fashion District", visits: 3890, growth: 6.9 },
  ],
  topDeals: [
    { title: "Summer Electronics Sale", views: 5670, claims: 890, rate: 15.7 },
    { title: "Food Court Special", views: 4320, claims: 567, rate: 13.1 },
    { title: "Movie Night Deal", views: 3450, claims: 234, rate: 6.8 },
    { title: "Weekend Coffee Special", views: 2890, claims: 445, rate: 15.4 },
    { title: "Back to School Shopping", views: 2340, claims: 178, rate: 7.6 },
  ],
  recentActivity: [
    { action: "User scanned QR code", location: "Best Buy Electronics", time: "2 minutes ago" },
    { action: "Deal claimed", location: "Food Paradise", time: "5 minutes ago" },
    { action: "New user registration", location: "Central Mall Seattle", time: "8 minutes ago" },
    { action: "AR navigation used", location: "Entertainment Complex", time: "12 minutes ago" },
    { action: "Deal viewed", location: "Fashion District", time: "15 minutes ago" },
  ],
};

export default function AnalyticsPage() {
  return (
    <AdminLayout userRole="admin">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Monitor platform performance, user behavior, and business metrics.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analyticsData.overview.totalUsers.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-navilynx-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="metric-badge positive">+{analyticsData.overview.userGrowth}%</span>
                <span className="text-sm text-gray-600 ml-2">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analyticsData.overview.totalSessions.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-navilynx-success" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="metric-badge positive">+{analyticsData.overview.sessionGrowth}%</span>
                <span className="text-sm text-gray-600 ml-2">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Product Scans</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analyticsData.overview.totalScans.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Scan className="h-6 w-6 text-navilynx-secondary" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="metric-badge positive">+{analyticsData.overview.scanGrowth}%</span>
                <span className="text-sm text-gray-600 ml-2">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Deal Engagement</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analyticsData.overview.dealEngagement}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <Tag className="h-6 w-6 text-navilynx-accent" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="metric-badge positive">+{analyticsData.overview.dealEngagement}%</span>
                <span className="text-sm text-gray-600 ml-2">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performing Venues */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-navilynx-primary" />
                Top Performing Venues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topVenues.map((venue, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-navilynx-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{venue.name}</p>
                        <p className="text-sm text-gray-600">{venue.visits.toLocaleString()} visits</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {venue.growth > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        venue.growth > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {venue.growth > 0 ? '+' : ''}{venue.growth}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Deals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="h-5 w-5 mr-2 text-navilynx-primary" />
                Top Performing Deals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topDeals.map((deal, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{deal.title}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-600 mt-1">
                          <span>{deal.views.toLocaleString()} views</span>
                          <span>{deal.claims} claims</span>
                        </div>
                      </div>
                      <Badge variant={deal.rate > 10 ? "success" : deal.rate > 5 ? "warning" : "secondary"}>
                        {deal.rate}%
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-navilynx-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(deal.rate, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Behavior */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-navilynx-primary" />
                User Behavior
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Users</span>
                  <span className="font-medium">{analyticsData.overview.activeUsers.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Session Duration</span>
                  <span className="font-medium">{analyticsData.overview.avgSessionDuration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Return Rate</span>
                  <span className="font-medium">68.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">New Users</span>
                  <span className="font-medium">31.8%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-navilynx-primary" />
                Platform Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">iOS Users</span>
                  <span className="font-medium">65.4%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Android Users</span>
                  <span className="font-medium">34.6%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">AR Feature Usage</span>
                  <span className="font-medium">78.9%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Card Scanning</span>
                  <span className="font-medium">45.3%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-navilynx-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.recentActivity.map((activity, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <div className="flex items-center space-x-2 text-gray-600 text-xs mt-1">
                      <MapPin className="h-3 w-3" />
                      <span>{activity.location}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-navilynx-primary" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-navilynx-light to-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Interactive Charts Coming Soon</p>
                <p className="text-gray-500 text-sm">Real-time analytics and performance metrics</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
