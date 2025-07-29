'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Shield,
  Mail,
  Phone,
  TrendingUp,
  Activity,
  MapPin,
  Smartphone,
  Navigation,
  Eye as EyeIcon,
  Zap,
  UserPlus,
  RefreshCw,
  Calendar,
  Clock,
  Star,
  CreditCard
} from "lucide-react";

// Mobile App Aligned User Interface
interface MobileAppUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: "admin" | "manager" | "moderator" | "viewer";
  status: "active" | "inactive" | "pending" | "suspended";
  avatar?: string;
  phone?: string;
  lastLogin?: Date;
  createdAt: Date;
  department?: string;
  position?: string;
  permissions: string[];
  profile: {
    bio?: string;
    location?: string;
    timezone?: string;
    language?: string;
    preferences: {
      arNavigation: boolean;
      voiceGuidance: boolean;
      hapticFeedback: boolean;
      accessibility: {
        highContrast: boolean;
        largeText: boolean;
        colorBlindness?: boolean;
      };
    };
  };
  venueAccess: string[]; // Mobile app venue IDs
  arCapability: boolean;
  lastActiveVenue?: string;
  mobileAppUsage: {
    totalSessions: number;
    arNavigations: number;
    productsScanned: number;
    dealsViewed: number;
    averageSessionDuration: number; // minutes
    lastAppVersion?: string;
    deviceType?: string;
  };
}

// Aligned with mobile app venue data
const mockUsers: MobileAppUser[] = [
  {
    id: "1",
    email: "admin@navilynx.com",
    username: "admin",
    firstName: "John",
    lastName: "Administrator",
    role: "admin",
    status: "active",
    avatar: undefined,
    phone: "+27-11-555-0123", // SA format
    lastLogin: new Date("2025-01-29T10:30:00Z"),
    createdAt: new Date("2024-01-15T09:00:00Z"),
    department: "IT Operations",
    position: "System Administrator",
    permissions: ["venue.manage", "user.manage", "analytics.view", "ar.manage", "deals.manage"],
    profile: {
      bio: "Senior administrator managing NaviLynx platform operations across South African venues",
      location: "Sandton, Johannesburg",
      timezone: "Africa/Johannesburg",
      language: "en-ZA",
      preferences: { 
        arNavigation: true, 
        voiceGuidance: true, 
        hapticFeedback: true,
        accessibility: { highContrast: false, largeText: false, colorBlindness: false }
      }
    },
    venueAccess: ["sandton-city", "v-a-waterfront", "menlyn-park", "gateway-theatre"], // Mobile app venue IDs
    arCapability: true,
    lastActiveVenue: "sandton-city",
    mobileAppUsage: {
      totalSessions: 145,
      arNavigations: 89,
      productsScanned: 234,
      dealsViewed: 67,
      averageSessionDuration: 18.5,
      lastAppVersion: "1.2.0",
      deviceType: "Android"
    }
  },
  {
    id: "2",
    email: "sarah.manager@navilynx.com",
    username: "sarah_m",
    firstName: "Sarah",
    lastName: "Johnson",
    role: "manager",
    status: "active",
    avatar: undefined,
    phone: "+27-21-555-0124", // Cape Town number
    lastLogin: new Date("2025-01-29T08:15:00Z"),
    createdAt: new Date("2024-02-20T14:30:00Z"),
    department: "Venue Operations",
    position: "AR Navigation Manager",
    permissions: ["venue.view", "ar.moderate", "analytics.view", "deals.manage"],
    profile: {
      bio: "Managing AR navigation systems across Cape Town shopping venues",
      location: "Cape Town, Western Cape",
      timezone: "Africa/Johannesburg",
      language: "en-ZA",
      preferences: { 
        arNavigation: true, 
        voiceGuidance: true, 
        hapticFeedback: true,
        accessibility: { highContrast: false, largeText: true, colorBlindness: false }
      }
    },
    venueAccess: ["v-a-waterfront", "canal-walk", "tyger-valley"],
    arCapability: true,
    lastActiveVenue: "v-a-waterfront",
    mobileAppUsage: {
      totalSessions: 89,
      arNavigations: 156,
      productsScanned: 89,
      dealsViewed: 134,
      averageSessionDuration: 22.3,
      lastAppVersion: "1.2.0",
      deviceType: "iOS"
    }
  },
  {
    id: "3",
    email: "mike.mod@navilynx.com",
    username: "mike_mod",
    firstName: "Michael",
    lastName: "Rodriguez",
    role: "moderator",
    status: "active",
    avatar: undefined,
    phone: "+27-31-555-0125", // Durban number
    lastLogin: new Date("2025-01-28T16:45:00Z"),
    createdAt: new Date("2024-03-10T11:15:00Z"),
    department: "Content & AR Moderation",
    position: "AR Content Moderator",
    permissions: ["venue.view", "ar.moderate", "content.moderate"],
    profile: {
      bio: "Moderating AR content and ensuring navigation accuracy across venues",
      location: "Durban, KwaZulu-Natal",
      timezone: "Africa/Johannesburg",
      language: "en-ZA",
      preferences: { 
        arNavigation: true, 
        voiceGuidance: false, 
        hapticFeedback: true,
        accessibility: { highContrast: true, largeText: false, colorBlindness: true }
      }
    },
    venueAccess: ["gateway-theatre", "pavilion-shopping", "la-lucia-mall"],
    arCapability: true,
    lastActiveVenue: "gateway-theatre",
    mobileAppUsage: {
      totalSessions: 67,
      arNavigations: 234,
      productsScanned: 156,
      dealsViewed: 89,
      averageSessionDuration: 25.8,
      lastAppVersion: "1.1.9",
      deviceType: "Android"
    }
  },
  {
    id: "4",
    email: "lisa.viewer@navilynx.com",
    username: "lisa_v",
    firstName: "Lisa",
    lastName: "Chen",
    role: "viewer",
    status: "pending",
    avatar: undefined,
    phone: "+27-12-555-0126", // Pretoria number
    lastLogin: undefined,
    createdAt: new Date("2025-01-28T09:30:00Z"),
    department: "Analytics & Insights",
    position: "Data Analyst",
    permissions: ["analytics.view", "reports.view"],
    profile: {
      bio: "Analyzing mobile app usage patterns and AR navigation effectiveness",
      location: "Pretoria, Gauteng",
      timezone: "Africa/Johannesburg",
      language: "en-ZA",
      preferences: { 
        arNavigation: false, 
        voiceGuidance: false, 
        hapticFeedback: false,
        accessibility: { highContrast: false, largeText: false, colorBlindness: false }
      }
    },
    venueAccess: ["menlyn-park", "brooklyn-mall"],
    arCapability: false,
    lastActiveVenue: undefined,
    mobileAppUsage: {
      totalSessions: 12,
      arNavigations: 0,
      productsScanned: 5,
      dealsViewed: 23,
      averageSessionDuration: 8.2,
      lastAppVersion: "1.0.5",
      deviceType: "iOS"
    }
  },
  {
    id: "5",
    email: "david.admin@navilynx.com",
    username: "david_a",
    firstName: "David",
    lastName: "Wilson",
    role: "admin",
    status: "inactive",
    avatar: undefined,
    phone: "+27-11-555-0127",
    lastLogin: new Date("2025-01-20T14:20:00Z"),
    createdAt: new Date("2024-01-25T13:45:00Z"),
    department: "Security & Compliance",
    position: "Security Administrator",
    permissions: ["security.manage", "compliance.audit", "user.manage"],
    profile: {
      bio: "Managing security protocols and compliance for mobile app integrations",
      location: "Johannesburg, Gauteng",
      timezone: "Africa/Johannesburg",
      language: "en-ZA",
      preferences: { 
        arNavigation: true, 
        voiceGuidance: true, 
        hapticFeedback: false,
        accessibility: { highContrast: false, largeText: false, colorBlindness: false }
      }
    },
    venueAccess: ["sandton-city", "rosebank-mall", "eastgate-shopping"],
    arCapability: true,
    lastActiveVenue: "sandton-city",
    mobileAppUsage: {
      totalSessions: 234,
      arNavigations: 45,
      productsScanned: 67,
      dealsViewed: 123,
      averageSessionDuration: 15.7,
      lastAppVersion: "1.1.8",
      deviceType: "Android"
    }
  },
];

function getRoleColor(role: string) {
  switch (role) {
    case "admin":
      return "destructive";
    case "manager":
      return "default";
    case "moderator":
      return "secondary";
    case "viewer":
      return "outline";
    default:
      return "outline";
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "success";
    case "inactive":
      return "secondary";
    case "pending":
      return "warning";
    case "suspended":
      return "destructive";
    default:
      return "outline";
  }
}

function formatRelativeTime(date: Date | null | undefined) {
  if (!date) return "Never";
  
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
}

function getVenueNames(venueIds: string[]): string {
  const venueMap: Record<string, string> = {
    "sandton-city": "Sandton City",
    "v-a-waterfront": "V&A Waterfront",
    "menlyn-park": "Menlyn Park",
    "gateway-theatre": "Gateway Theatre",
    "canal-walk": "Canal Walk",
    "tyger-valley": "Tyger Valley",
    "pavilion-shopping": "Pavilion Shopping",
    "la-lucia-mall": "La Lucia Mall",
    "brooklyn-mall": "Brooklyn Mall",
    "rosebank-mall": "Rosebank Mall",
    "eastgate-shopping": "Eastgate Shopping"
  };
  
  return venueIds.map(id => venueMap[id] || id).join(", ");
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const filteredUsers = useMemo(() => {
    return mockUsers.filter(user => {
      const matchesSearch = `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (user.profile.location && user.profile.location.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesStatus = filterStatus === "all" || user.status === filterStatus
      
      return matchesSearch && matchesStatus
    })
  }, [searchTerm, filterStatus])

  return (
    <AdminLayout userRole="admin">
      <div className="p-6 max-w-7xl mx-auto space-y-6 min-h-screen">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-800 tracking-tight">User Management</h1>
                <p className="text-sm text-slate-600">Monitor and manage NaviLynx mobile app users</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="text-sm">
                <Download className="h-4 w-4 mr-2" />
                Export Users
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Total Mobile Users</p>
                  <p className="text-2xl font-semibold text-slate-900">{mockUsers.length}</p>
                  <div className="flex items-center text-xs mt-2">
                    <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />
                    <span className="text-emerald-600 font-medium">+15%</span>
                    <span className="text-slate-500 ml-1">adoption</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">AR Enabled Users</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {mockUsers.filter(u => u.arCapability).length}
                  </p>
                  <div className="flex items-center text-xs mt-2">
                    <Navigation className="h-3 w-3 text-blue-500 mr-1" />
                    <span className="text-blue-600 font-medium">AR Navigation</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Navigation className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Total AR Sessions</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {mockUsers.reduce((sum, user) => sum + user.mobileAppUsage.arNavigations, 0)}
                  </p>
                  <div className="flex items-center text-xs mt-2">
                    <Activity className="h-3 w-3 text-emerald-500 mr-1" />
                    <span className="text-emerald-600 font-medium">Navigation</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Active Users</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {mockUsers.filter(u => u.status === 'active').length}
                  </p>
                  <div className="flex items-center text-xs mt-2">
                    <Zap className="h-3 w-3 text-emerald-500 mr-1" />
                    <span className="text-emerald-600 font-medium">Online</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
                    <span className="text-gray-500 ml-1">sessions</span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg card-glow">
                  <EyeIcon className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </CardContent>
          </Card>

          <Card className="relative group card-hover overflow-hidden border-purple-200">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Products Scanned</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {mockUsers.reduce((sum, user) => sum + user.mobileAppUsage.productsScanned, 0)}
                  </p>
                  <div className="flex items-center text-sm">
                    <Zap className="h-4 w-4 text-purple-500 mr-1" />
                    <span className="text-purple-600 font-medium">Shopping</span>
                    <span className="text-gray-500 ml-1">assistant</span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg card-glow">
                  <Zap className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Filters and Search */}
        <Card className="glass-effect border-navilynx-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navilynx-primary" />
                  <Input
                    placeholder="Search by name, venue access, or mobile usage..."
                    className="w-80 pl-10 border-navilynx-primary/30 focus:border-navilynx-primary focus:ring-navilynx-primary/20"
                  />
                </div>
                <Button variant="outline" size="sm" className="border-navilynx-primary/30 hover:bg-navilynx-primary/10">
                  <Filter className="h-4 w-4 mr-2" />
                  Mobile App Filters
                </Button>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-600">Sort by:</span>
                <select className="text-sm border border-navilynx-primary/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-navilynx-primary/20 focus:border-navilynx-primary bg-white">
                  <option>AR Usage</option>
                  <option>Mobile Sessions</option>
                  <option>Last Login</option>
                  <option>Venue Access</option>
                  <option>Role</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Users Table - Mobile App Integration */}
        <Card className="shadow-purple-soft border-navilynx-primary/20">
          <CardHeader className="bg-gradient-to-r from-navilynx-primary/5 to-navilynx-secondary/5 border-b border-navilynx-primary/20">
            <CardTitle className="flex items-center text-xl">
              <Shield className="h-6 w-6 mr-3 text-navilynx-primary" />
              Mobile App Users ({mockUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-gray-50 to-navilynx-purple-50/30">
                  <tr className="border-b border-navilynx-primary/10">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">User</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Role & Access</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Mobile Usage</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">AR Navigation</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Venue Access</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Last Activity</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map((user, index) => (
                    <tr key={user.id} className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-navilynx-purple-50/20 hover:to-navilynx-purple-100/10 transition-colors duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 gradient-purple rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{user.firstName} {user.lastName}</div>
                            <div className="text-gray-600 text-sm flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {user.email}
                            </div>
                            <div className="text-gray-500 text-xs flex items-center mt-1">
                              <Phone className="h-3 w-3 mr-1" />
                              {user.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-2">
                          <Badge variant={getRoleColor(user.role)} className="font-medium">
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                          <Badge variant={getStatusColor(user.status)} className="font-medium ml-2">
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </Badge>
                          <div className="text-xs text-gray-600 mt-1">
                            {user.department}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            {user.mobileAppUsage.totalSessions} sessions
                          </div>
                          <div className="text-xs text-gray-600">
                            Avg: {user.mobileAppUsage.averageSessionDuration}min
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.mobileAppUsage.deviceType} • v{user.mobileAppUsage.lastAppVersion}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            {user.arCapability ? (
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            ) : (
                              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                            )}
                            <span className="text-sm font-medium">
                              {user.arCapability ? 'AR Enabled' : 'AR Disabled'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600">
                            {user.mobileAppUsage.arNavigations} AR sessions
                          </div>
                          <div className="text-xs text-gray-600">
                            {user.mobileAppUsage.productsScanned} scans
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-900 flex items-center">
                            <MapPin className="h-3 w-3 mr-1 text-navilynx-primary" />
                            {user.venueAccess.length} venues
                          </div>
                          <div className="text-xs text-gray-600 max-w-40 truncate" title={getVenueNames(user.venueAccess)}>
                            {getVenueNames(user.venueAccess)}
                          </div>
                          {user.lastActiveVenue && (
                            <div className="text-xs text-navilynx-primary">
                              Last: {getVenueNames([user.lastActiveVenue])}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">{formatRelativeTime(user.lastLogin)}</div>
                        {user.lastLogin && (
                          <div className="text-xs text-gray-500">{user.lastLogin.toLocaleDateString()}</div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          Created: {user.createdAt.toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-navilynx-primary/10" title="View Mobile App Data">
                            <Smartphone className="h-4 w-4 text-navilynx-primary" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-navilynx-primary/10" title="View User Profile">
                            <Eye className="h-4 w-4 text-navilynx-primary" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-navilynx-primary/10" title="Edit User">
                            <Edit className="h-4 w-4 text-navilynx-primary" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100" title="More Options">
                            <MoreHorizontal className="h-4 w-4 text-gray-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Enhanced Pagination */}
            <div className="flex items-center justify-between p-6 border-t border-navilynx-primary/10 bg-gradient-to-r from-gray-50/50 to-navilynx-purple-50/20">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">1-{mockUsers.length}</span> of{" "}
                <span className="font-medium">{mockUsers.length}</span> mobile app users
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled className="border-navilynx-primary/30">
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-navilynx-primary text-white border-navilynx-primary hover:bg-navilynx-secondary">
                  1
                </Button>
                <Button variant="outline" size="sm" disabled className="border-navilynx-primary/30">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
