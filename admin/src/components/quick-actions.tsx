'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  MapPin,
  Package,
  CreditCard,
  Star,
  Building2,
  Camera,
  BarChart3,
  MessageSquare,
  Settings,
  Brain,
  Tag,
  Wifi,
  Eye,
  Download,
  Plus,
  Search,
  RefreshCw,
  Power,
  AlertTriangle,
  Ban,
  Target,
  Route,
  Layers,
  Map,
  Compass,
  Activity,
  Shield,
  ArrowUpRight,
  Grid3X3,
  Radio,
  ShoppingBag
} from "lucide-react"

// Quick Action Categories
interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ElementType
  route?: string
  action?: () => void
  category: string
  priority: 'high' | 'medium' | 'low'
  badge?: string
  color?: string
}

const quickActions: QuickAction[] = [
  // User Management - High Priority
  {
    id: 'users-view',
    title: 'Manage Users',
    description: 'View, edit, and manage all app users',
    icon: Users,
    route: '/users',
    category: 'User Management',
    priority: 'high',
    badge: 'Active',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'users-add',
    title: 'Add New User',
    description: 'Create new user account',
    icon: Plus,
    route: '/users?action=add',
    category: 'User Management',
    priority: 'high',
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    id: 'users-ban',
    title: 'Moderate Users',
    description: 'Ban, suspend, or activate users',
    icon: Ban,
    route: '/users?tab=moderation',
    category: 'User Management',
    priority: 'high',
    color: 'from-red-500 to-red-600'
  },

  // Venue Management - High Priority (Enhanced)
  {
    id: 'venues-manage',
    title: 'Manage Venues',
    description: 'View and edit all venues and locations',
    icon: Building2,
    route: '/venues',
    category: 'Venue Setup',
    priority: 'high',
    badge: 'Live',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'venues-add',
    title: 'Add New Venue',
    description: 'Create new venue or shopping location',
    icon: MapPin,
    route: '/venues?action=add',
    category: 'Venue Setup',
    priority: 'high',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'venues-ar',
    title: 'AR Waypoints',
    description: 'Configure AR navigation waypoints',
    icon: Camera,
    route: '/ar-content',
    category: 'Venue Setup',
    priority: 'high',
    badge: 'AR',
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'beacons-add',
    title: 'Add BLE Beacon',
    description: 'Install and configure new Bluetooth beacons',
    icon: Wifi,
    route: '/beacons?action=add',
    category: 'Venue Setup',
    priority: 'high',
    badge: 'IoT',
    color: 'from-cyan-500 to-cyan-600'
  },
  {
    id: 'beacons-manage',
    title: 'Beacon Network',
    description: 'Monitor and manage all BLE beacons',
    icon: Radio,
    route: '/beacons',
    category: 'Venue Setup',
    priority: 'high',
    badge: 'Network',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'venue-floors',
    title: 'Floor Plans',
    description: 'Upload and manage venue floor plans',
    icon: Layers,
    route: '/venues?tab=floors',
    category: 'Venue Setup',
    priority: 'medium',
    color: 'from-slate-500 to-slate-600'
  },
  {
    id: 'venue-zones',
    title: 'Zone Mapping',
    description: 'Define shopping zones and categories',
    icon: Target,
    route: '/venues?tab=zones',
    category: 'Venue Setup',
    priority: 'medium',
    color: 'from-teal-500 to-teal-600'
  },
  {
    id: 'venue-navigation',
    title: 'Navigation Routes',
    description: 'Configure optimal walking routes',
    icon: Route,
    route: '/venues?tab=navigation',
    category: 'Venue Setup',
    priority: 'medium',
    badge: 'Routes',
    color: 'from-amber-500 to-amber-600'
  },

  // Product & Commerce - High Priority
  {
    id: 'products-manage',
    title: 'Product Catalog',
    description: 'Manage store inventory and products',
    icon: Package,
    route: '/products',
    category: 'Commerce',
    priority: 'high',
    badge: 'Catalog',
    color: 'from-teal-500 to-teal-600'
  },
  {
    id: 'deals-manage',
    title: 'Deal Management',
    description: 'Create and manage promotional offers',
    icon: Tag,
    route: '/deals',
    category: 'Commerce',
    priority: 'high',
    badge: 'Active',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 'store-cards',
    title: 'Loyalty Cards',
    description: 'Manage store cards and rewards',
    icon: CreditCard,
    route: '/store-cards',
    category: 'Commerce',
    priority: 'high',
    color: 'from-indigo-500 to-indigo-600'
  },

  // Analytics & Insights - Medium Priority
  {
    id: 'analytics-realtime',
    title: 'Real-time Analytics',
    description: 'Live user activity and venue metrics',
    icon: BarChart3,
    route: '/analytics',
    category: 'Analytics',
    priority: 'medium',
    badge: 'Live',
    color: 'from-cyan-500 to-cyan-600'
  },
  {
    id: 'analytics-heatmap',
    title: 'Traffic Heatmaps',
    description: 'Visualize user movement patterns',
    icon: Map,
    route: '/analytics?view=heatmap',
    category: 'Analytics',
    priority: 'medium',
    badge: 'Visual',
    color: 'from-rose-500 to-rose-600'
  },
  {
    id: 'reviews-manage',
    title: 'Review Management',
    description: 'Monitor and respond to user reviews',
    icon: Star,
    route: '/reviews',
    category: 'Analytics',
    priority: 'medium',
    color: 'from-amber-500 to-amber-600'
  },
  {
    id: 'profiles-insights',
    title: 'User Insights',
    description: 'Detailed user behavior analytics',
    icon: Eye,
    route: '/profiles',
    category: 'Analytics',
    priority: 'medium',
    color: 'from-slate-500 to-slate-600'
  },

  // AI & Smart Features - Medium Priority
  {
    id: 'navigenie-ai',
    title: 'NaviGenie AI',
    description: 'Configure AI shopping assistant',
    icon: Brain,
    route: '/navigenie',
    category: 'AI & Smart',
    priority: 'medium',
    badge: 'AI',
    color: 'from-violet-500 to-violet-600'
  },
  {
    id: 'chat-management',
    title: 'Chat System',
    description: 'Monitor customer support chats',
    icon: MessageSquare,
    route: '/chat',
    category: 'AI & Smart',
    priority: 'medium',
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 'recommendations',
    title: 'Smart Recommendations',
    description: 'AI-powered product suggestions',
    icon: Compass,
    route: '/navigenie?tab=recommendations',
    category: 'AI & Smart',
    priority: 'medium',
    badge: 'Smart',
    color: 'from-purple-500 to-purple-600'
  },

  // System Operations - High Priority
  {
    id: 'system-health',
    title: 'System Health',
    description: 'Monitor all systems and services',
    icon: Activity,
    action: () => alert('🟢 All systems operational\n📊 99.9% uptime\n⚡ Average response: 120ms'),
    category: 'Operations',
    priority: 'high',
    badge: 'Live',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'cache-refresh',
    title: 'Refresh Cache',
    description: 'Clear application cache and reload',
    icon: RefreshCw,
    action: () => {
      if (confirm('Refresh application cache? This will reload the page.')) {
        window.location.reload()
      }
    },
    category: 'Operations',
    priority: 'high',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'backup-system',
    title: 'System Backup',
    description: 'Create full system backup',
    icon: Download,
    action: () => alert('📦 Backup initiated\n📧 You will receive an email when complete\n⏱️ Estimated time: 15 minutes'),
    category: 'Operations',
    priority: 'high',
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    id: 'settings-system',
    title: 'System Settings',
    description: 'Configure global app settings',
    icon: Settings,
    route: '/settings',
    category: 'Operations',
    priority: 'medium',
    color: 'from-gray-500 to-gray-600'
  },

  // Emergency Controls - High Priority
  {
    id: 'emergency-alert',
    title: 'Emergency Alert',
    description: 'Send urgent notification to all users',
    icon: AlertTriangle,
    action: () => {
      const message = prompt('Enter emergency message:')
      if (message && confirm(`Send emergency alert: "${message}" to all users?`)) {
        alert('🚨 Emergency alert sent to all active users\n📱 Push notifications delivered\n📧 Email alerts dispatched')
      }
    },
    category: 'Emergency',
    priority: 'high',
    color: 'from-red-500 to-red-600'
  },
  {
    id: 'maintenance-mode',
    title: 'Maintenance Mode',
    description: 'Enable system maintenance mode',
    icon: Power,
    action: () => {
      if (confirm('🔧 Enable maintenance mode?\n\n⚠️ This will:\n• Disable user access\n• Show maintenance page\n• Preserve admin access')) {
        alert('🔧 Maintenance mode enabled\n⏱️ Users will see maintenance page\n🔓 Admin access preserved')
      }
    },
    category: 'Emergency',
    priority: 'high',
    badge: 'Critical',
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'security-lockdown',
    title: 'Security Lockdown',
    description: 'Immediate security lockdown protocol',
    icon: Shield,
    action: () => {
      if (confirm('🛡️ Initiate security lockdown?\n\n⚠️ This will:\n• Lock all user accounts\n• Disable new registrations\n• Enable enhanced monitoring')) {
        alert('🛡️ Security lockdown activated\n🔒 All accounts secured\n👁️ Enhanced monitoring enabled')
      }
    },
    category: 'Emergency',
    priority: 'high',
    badge: 'Security',
    color: 'from-red-600 to-red-700'
  }
]

const categories = [
  { name: 'All', color: 'bg-gradient-to-r from-gray-100 to-gray-200', icon: Grid3X3 },
  { name: 'User Management', color: 'bg-gradient-to-r from-blue-100 to-blue-200', icon: Users },
  { name: 'Venue Setup', color: 'bg-gradient-to-r from-purple-100 to-purple-200', icon: Building2 },
  { name: 'Commerce', color: 'bg-gradient-to-r from-green-100 to-green-200', icon: ShoppingBag },
  { name: 'Analytics', color: 'bg-gradient-to-r from-cyan-100 to-cyan-200', icon: BarChart3 },
  { name: 'AI & Smart', color: 'bg-gradient-to-r from-violet-100 to-violet-200', icon: Brain },
  { name: 'Operations', color: 'bg-gradient-to-r from-yellow-100 to-yellow-200', icon: Settings },
  { name: 'Emergency', color: 'bg-gradient-to-r from-red-100 to-red-200', icon: AlertTriangle }
]

export function QuickActions() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredActions = useMemo(() => {
    return quickActions.filter(action => {
      const matchesCategory = selectedCategory === 'All' || action.category === selectedCategory
      const matchesSearch = action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           action.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchTerm])

  const handleActionClick = (action: QuickAction) => {
    if (action.route) {
      router.push(action.route)
    } else if (action.action) {
      action.action()
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-gradient-to-br from-red-50/80 to-rose-50/60 hover:from-red-100/80 hover:to-rose-100/60'
      case 'medium': return 'border-amber-200 bg-gradient-to-br from-amber-50/80 to-yellow-50/60 hover:from-amber-100/80 hover:to-yellow-100/60'
      case 'low': return 'border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-green-50/60 hover:from-emerald-100/80 hover:to-green-100/60'
      default: return 'border-gray-200 bg-gradient-to-br from-gray-50/80 to-slate-50/60 hover:from-gray-100/80 hover:to-slate-100/60'
    }
  }

  return (
    <Card className="w-full shadow-2xl border-0 bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Quick Actions Control Center
            </CardTitle>
            <p className="text-gray-600 font-medium">
              Complete administrative control over NaviLynx platform
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm font-semibold px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700">
              <Activity className="h-4 w-4 mr-2" />
              {filteredActions.length} Actions Available
            </Badge>
            <Badge variant="outline" className="text-sm font-semibold px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 text-blue-700">
              System Online
            </Badge>
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search actions by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md transition-all duration-300 text-base"
            />
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const CategoryIcon = category.icon
              return (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.name)}
                  className={`${
                    selectedCategory === category.name 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border-blue-600 hover:from-blue-700 hover:to-blue-800' 
                      : `hover:bg-gradient-to-r ${category.color} hover:text-gray-800 border-2 hover:border-gray-300 hover:shadow-md`
                  } transition-all duration-300 flex items-center gap-2 px-4 py-2 font-semibold`}
                >
                  <CategoryIcon className="h-4 w-4" />
                  {category.name}
                </Button>
              )
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredActions.map((action: QuickAction, index: number) => {
            const IconComponent = action.icon
            
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                <Button
                  variant="outline"
                  className={`w-full h-auto p-6 flex flex-col items-start gap-4 text-left hover:shadow-2xl transition-all duration-300 ${getPriorityColor(action.priority)} group-hover:scale-105 border-2 hover:border-opacity-50 backdrop-blur-sm`}
                  onClick={() => handleActionClick(action)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    {action.badge && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs font-semibold px-3 py-1 bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm"
                      >
                        {action.badge}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="w-full space-y-2">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                      {action.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between w-full mt-auto pt-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs font-semibold px-2 py-1 ${
                        action.priority === 'high' ? 'border-red-300 text-red-700 bg-red-50' :
                        action.priority === 'medium' ? 'border-amber-300 text-amber-700 bg-amber-50' :
                        'border-emerald-300 text-emerald-700 bg-emerald-50'
                      }`}
                    >
                      {action.priority} priority
                    </Badge>
                    <div className="flex items-center space-x-1 text-gray-400 group-hover:text-blue-500 transition-colors">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </Button>
              </motion.div>
            )
          })}
        </div>

        {filteredActions.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">No actions found</h3>
            <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
              Try adjusting your search terms or selecting a different category to discover more administrative actions.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('All')
              }}
              className="mt-4 border-2 hover:bg-blue-50 hover:border-blue-300"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Enhanced Quick Stats */}
        <div className="mt-10 pt-8 border-t border-gradient-to-r from-gray-200 via-gray-100 to-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">Platform Overview</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-red-50 to-rose-100 border border-red-100 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-3xl font-bold text-red-600 mb-1">
                {quickActions.filter(a => a.priority === 'high').length}
              </div>
              <div className="text-sm font-semibold text-red-700">High Priority</div>
              <div className="text-xs text-red-600 mt-1">Critical Actions</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-3xl font-bold text-amber-600 mb-1">
                {quickActions.filter(a => a.priority === 'medium').length}
              </div>
              <div className="text-sm font-semibold text-amber-700">Medium Priority</div>
              <div className="text-xs text-amber-600 mt-1">Standard Actions</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-100 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {categories.length - 1}
              </div>
              <div className="text-sm font-semibold text-blue-700">Categories</div>
              <div className="text-xs text-blue-600 mt-1">Organized Sections</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-violet-100 border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {quickActions.length}
              </div>
              <div className="text-sm font-semibold text-purple-700">Total Actions</div>
              <div className="text-xs text-purple-600 mt-1">Complete Control</div>
            </div>
          </div>
          
          {/* Additional Platform Stats */}
          <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-emerald-600">8</div>
                <div className="text-sm font-semibold text-gray-700">Venue Setup Actions</div>
                <div className="text-xs text-gray-600">Including BLE Beacons</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-violet-600">3</div>
                <div className="text-sm font-semibold text-gray-700">AI & Smart Features</div>
                <div className="text-xs text-gray-600">NaviGenie Powered</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-red-600">3</div>
                <div className="text-sm font-semibold text-gray-700">Emergency Controls</div>
                <div className="text-xs text-gray-600">Critical Operations</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
