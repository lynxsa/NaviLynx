'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MessageSquare,
  Search,
  Filter,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  XCircle,
  Send,
  Phone,
  Video,
  MoreHorizontal,
  Star,
  ThumbsUp,
  ThumbsDown,
  Eye,
  RefreshCw,
  Download,
  Archive,
  Users,
  MessageCircle,
  Headphones,
  TrendingUp
} from "lucide-react"

// Mobile App Aligned Chat Interface
interface ChatTicket {
  id: string
  userId: string
  userName: string
  userEmail: string
  userPhone?: string
  subject: string
  category: 'technical' | 'navigation' | 'venue' | 'billing' | 'general' | 'ar_issue' | 'store_card'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed'
  assignedTo?: string
  assignedAgent?: string
  venueId?: string
  venueName?: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
  rating?: number
  feedback?: string
  tags: string[]
  language: string
  deviceInfo: {
    platform: 'iOS' | 'Android'
    version: string
    model: string
  }
}

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderType: 'user' | 'agent' | 'system'
  content: string
  timestamp: Date
  attachments?: string[]
  type: 'text' | 'image' | 'file' | 'system_notification'
}

interface ChatAgent {
  id: string
  name: string
  email: string
  avatar: string
  status: 'online' | 'away' | 'busy' | 'offline'
  activeChats: number
  totalResolved: number
  avgRating: number
  languages: string[]
  specialties: string[]
}

// South African focused chat data
const mockChatData = {
  tickets: [
    {
      id: 'ticket_001',
      userId: 'user_001',
      userName: 'Sipho Mthembu',
      userEmail: 'sipho.mthembu@gmail.com',
      userPhone: '+27823456789',
      subject: 'AR Navigation not working at Sandton City',
      category: 'ar_issue',
      priority: 'high',
      status: 'open',
      assignedTo: 'agent_001',
      assignedAgent: 'Thabo Ndlovu',
      venueId: 'sandton-city',
      venueName: 'Sandton City',
      messages: [
        {
          id: 'msg_001',
          senderId: 'user_001',
          senderName: 'Sipho Mthembu',
          senderType: 'user',
          content: 'Hi, I\'m having trouble with the AR navigation at Sandton City. The camera keeps showing a black screen when I try to use indoor navigation.',
          timestamp: new Date('2025-07-29T10:30:00'),
          type: 'text'
        },
        {
          id: 'msg_002',
          senderId: 'agent_001',
          senderName: 'Thabo Ndlovu',
          senderType: 'agent',
          content: 'Hello Sipho! Thank you for contacting us. I\'m sorry to hear about the AR navigation issue. Let me help you troubleshoot this. Can you please tell me which device you\'re using and if you\'ve given camera permissions to the NaviLynx app?',
          timestamp: new Date('2025-07-29T10:35:00'),
          type: 'text'
        }
      ],
      createdAt: new Date('2025-07-29T10:30:00'),
      updatedAt: new Date('2025-07-29T10:35:00'),
      tags: ['ar-navigation', 'camera-issue', 'sandton-city'],
      language: 'en',
      deviceInfo: {
        platform: 'Android',
        version: '14',
        model: 'Samsung Galaxy S23'
      }
    },
    {
      id: 'ticket_002',
      userId: 'user_002',
      userName: 'Nomsa Khumalo',
      userEmail: 'nomsa.khumalo@yahoo.com',
      subject: 'Store Card payment failed',
      category: 'store_card',
      priority: 'medium',
      status: 'in_progress',
      assignedTo: 'agent_002',
      assignedAgent: 'Lerato Motsepe',
      messages: [
        {
          id: 'msg_003',
          senderId: 'user_002',
          senderName: 'Nomsa Khumalo',
          senderType: 'user',
          content: 'My Store Card payment was declined at Woolworths even though I have sufficient balance. Can you help?',
          timestamp: new Date('2025-07-29T09:15:00'),
          type: 'text'
        },
        {
          id: 'msg_004',
          senderId: 'agent_002',
          senderName: 'Lerato Motsepe',
          senderType: 'agent',
          content: 'Hi Nomsa, I can see your Store Card balance is R450.50. Let me check the transaction logs to see what happened with your payment attempt.',
          timestamp: new Date('2025-07-29T09:20:00'),
          type: 'text'
        }
      ],
      createdAt: new Date('2025-07-29T09:15:00'),
      updatedAt: new Date('2025-07-29T09:20:00'),
      tags: ['store-card', 'payment-issue', 'woolworths'],
      language: 'en',
      deviceInfo: {
        platform: 'iOS',
        version: '17.5',
        model: 'iPhone 14'
      }
    },
    {
      id: 'ticket_003',
      userId: 'user_003',
      userName: 'Johan van der Merwe',
      userEmail: 'johan.vdm@gmail.com',
      subject: 'Cannot find parking at V&A Waterfront',
      category: 'navigation',
      priority: 'low',
      status: 'resolved',
      assignedTo: 'agent_003',
      assignedAgent: 'Aisha Patel',
      resolvedAt: new Date('2025-07-29T08:45:00'),
      rating: 5,
      feedback: 'Excellent service! Very helpful and quick response.',
      messages: [
        {
          id: 'msg_005',
          senderId: 'user_003',
          senderName: 'Johan van der Merwe',
          senderType: 'user',
          content: 'The app is showing that parking at V&A Waterfront is full, but I can see empty spaces. Is the system updated?',
          timestamp: new Date('2025-07-29T08:30:00'),
          type: 'text'
        },
        {
          id: 'msg_006',
          senderId: 'agent_003',
          senderName: 'Aisha Patel',
          senderType: 'agent',
          content: 'Hi Johan! The parking sensors were experiencing a delay. I\'ve refreshed the system and you should now see the updated availability. The parking levels 2-4 have spaces available.',
          timestamp: new Date('2025-07-29T08:40:00'),
          type: 'text'
        }
      ],
      createdAt: new Date('2025-07-29T08:30:00'),
      updatedAt: new Date('2025-07-29T08:45:00'),
      tags: ['parking', 'navigation', 'v-a-waterfront'],
      language: 'en',
      deviceInfo: {
        platform: 'Android',
        version: '13',
        model: 'Google Pixel 7'
      }
    },
    {
      id: 'ticket_004',
      userId: 'user_004',
      userName: 'Priya Sharma',
      userEmail: 'priya.sharma@outlook.com',
      subject: 'NaviGenie not responding in Afrikaans',
      category: 'technical',
      priority: 'medium',
      status: 'pending',
      assignedTo: 'agent_001',
      assignedAgent: 'Thabo Ndlovu',
      messages: [
        {
          id: 'msg_007',
          senderId: 'user_004',
          senderName: 'Priya Sharma',
          senderType: 'user',
          content: 'When I set NaviGenie to Afrikaans, it doesn\'t respond to my voice commands. English works fine.',
          timestamp: new Date('2025-07-29T07:20:00'),
          type: 'text'
        }
      ],
      createdAt: new Date('2025-07-29T07:20:00'),
      updatedAt: new Date('2025-07-29T07:20:00'),
      tags: ['navigenie', 'afrikaans', 'voice-commands'],
      language: 'af',
      deviceInfo: {
        platform: 'iOS',
        version: '17.0',
        model: 'iPhone 15'
      }
    }
  ] as ChatTicket[],

  agents: [
    {
      id: 'agent_001',
      name: 'Thabo Ndlovu',
      email: 'thabo.ndlovu@navilynx.co.za',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      status: 'online',
      activeChats: 3,
      totalResolved: 247,
      avgRating: 4.8,
      languages: ['English', 'Zulu', 'Xhosa'],
      specialties: ['AR Navigation', 'Technical Support']
    },
    {
      id: 'agent_002',
      name: 'Lerato Motsepe',
      email: 'lerato.motsepe@navilynx.co.za',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=100',
      status: 'online',
      activeChats: 2,
      totalResolved: 189,
      avgRating: 4.9,
      languages: ['English', 'Sotho', 'Tswana'],
      specialties: ['Store Card', 'Billing', 'Payments']
    },
    {
      id: 'agent_003',
      name: 'Aisha Patel',
      email: 'aisha.patel@navilynx.co.za',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100',
      status: 'away',
      activeChats: 1,
      totalResolved: 156,
      avgRating: 4.7,
      languages: ['English', 'Hindi', 'Afrikaans'],
      specialties: ['Navigation', 'Venue Support']
    }
  ] as ChatAgent[]
}

export default function ChatSupportPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [selectedTicket, setSelectedTicket] = useState<ChatTicket | null>(null)

  const filteredTickets = useMemo(() => {
    return mockChatData.tickets.filter(ticket => {
      const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
      const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter
      
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory
    })
  }, [searchTerm, statusFilter, priorityFilter, categoryFilter])

  const chatMetrics = useMemo(() => {
    return {
      totalTickets: mockChatData.tickets.length,
      openTickets: mockChatData.tickets.filter(t => t.status === 'open').length,
      inProgress: mockChatData.tickets.filter(t => t.status === 'in_progress').length,
      resolved: mockChatData.tickets.filter(t => t.status === 'resolved').length,
      avgRating: mockChatData.tickets.filter(t => t.rating).reduce((sum, t) => sum + (t.rating || 0), 0) / mockChatData.tickets.filter(t => t.rating).length,
      onlineAgents: mockChatData.agents.filter(a => a.status === 'online').length
    }
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'in_progress': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'resolved': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4" />
      case 'in_progress': return <Clock className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'resolved': return <CheckCircle className="w-4 h-4" />
      case 'closed': return <XCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-emerald-500'
      case 'away': return 'bg-amber-500'
      case 'busy': return 'bg-red-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60)
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Chat Support</h1>
              <p className="text-lg text-gray-600">Manage customer support tickets and live chat sessions</p>
            </div>
            <div className="flex items-center gap-3 mt-4 lg:mt-0">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </Button>
              <Button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                <MessageSquare className="w-4 h-4 mr-2" />
                New Ticket
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
                    <p className="text-sm text-gray-600 mb-1">Total Tickets</p>
                    <p className="text-3xl font-bold text-gray-900">{chatMetrics.totalTickets}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Open</p>
                    <p className="text-3xl font-bold text-red-600">{chatMetrics.openTickets}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">In Progress</p>
                    <p className="text-3xl font-bold text-purple-600">{chatMetrics.inProgress}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Resolved</p>
                    <p className="text-3xl font-bold text-emerald-600">{chatMetrics.resolved}</p>
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
                    <p className="text-sm text-gray-600 mb-1">Avg Rating</p>
                    <p className="text-3xl font-bold text-amber-600">{chatMetrics.avgRating.toFixed(1)}</p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <Star className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Online Agents</p>
                    <p className="text-3xl font-bold text-green-600">{chatMetrics.onlineAgents}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Headphones className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tickets List */}
            <div className="lg:col-span-2">
              {/* Filters */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg mb-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search tickets..."
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
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>

                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                  >
                    <option value="all">All Priorities</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>

                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="technical">Technical</option>
                    <option value="navigation">Navigation</option>
                    <option value="venue">Venue</option>
                    <option value="billing">Billing</option>
                    <option value="ar_issue">AR Issue</option>
                    <option value="store_card">Store Card</option>
                    <option value="general">General</option>
                  </select>

                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    More Filters
                  </Button>
                </div>
              </motion.div>

              {/* Tickets */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                {filteredTickets.map((ticket, index) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${selectedTicket?.id === ticket.id ? 'ring-2 ring-purple-500' : ''}`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <MessageSquare className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                          <p className="text-sm text-gray-600">{ticket.userName} • {ticket.userEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                          <span className="capitalize">{ticket.priority}</span>
                        </div>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                          {getStatusIcon(ticket.status)}
                          <span className="capitalize">{ticket.status.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        {ticket.assignedAgent && (
                          <span>Assigned to: {ticket.assignedAgent}</span>
                        )}
                        {ticket.venueName && (
                          <span>Venue: {ticket.venueName}</span>
                        )}
                        <span>Category: {ticket.category.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span>{formatRelativeTime(ticket.updatedAt)}</span>
                        {ticket.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span>{ticket.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {ticket.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Online Agents */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-white border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      Support Agents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockChatData.agents.map((agent) => (
                        <div key={agent.id} className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={agent.avatar}
                              alt={agent.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getAgentStatusColor(agent.status)}`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{agent.name}</p>
                            <p className="text-xs text-gray-600">
                              {agent.activeChats} active • {agent.totalResolved} resolved
                            </p>
                          </div>
                          <div className="text-xs">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              <span>{agent.avgRating}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="bg-white border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Start Live Chat
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Archive className="w-4 h-4 mr-2" />
                        Archive Resolved
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Sync with Mobile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Selected Ticket Details */}
              {selectedTicket && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Card className="bg-white border-gray-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-purple-600" />
                        Ticket Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900">{selectedTicket.subject}</h4>
                          <p className="text-sm text-gray-600 mt-1">{selectedTicket.userName}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Status:</span>
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedTicket.status)}`}>
                              {getStatusIcon(selectedTicket.status)}
                              <span className="capitalize">{selectedTicket.status.replace('_', ' ')}</span>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Priority:</span>
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedTicket.priority)}`}>
                              <span className="capitalize">{selectedTicket.priority}</span>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Category:</span>
                            <span className="capitalize">{selectedTicket.category.replace('_', ' ')}</span>
                          </div>
                          {selectedTicket.assignedAgent && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Agent:</span>
                              <span>{selectedTicket.assignedAgent}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Device:</span>
                            <span>{selectedTicket.deviceInfo.platform} {selectedTicket.deviceInfo.version}</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <div className="space-y-2">
                            <Button size="sm" className="w-full bg-purple-600 text-white">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Open Chat
                            </Button>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="flex-1">
                                <Phone className="w-4 h-4 mr-1" />
                                Call
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1">
                                <Video className="w-4 h-4 mr-1" />
                                Video
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
