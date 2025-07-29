'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Brain,
  MessageSquare,
  Settings,
  TrendingUp,
  Clock,
  Star,
  Plus,
  Edit,
  Save,
  RefreshCw,
  Download,
  Search,
  Filter,
  BarChart3,
  Languages,
  CheckCircle,
  AlertTriangle
} from "lucide-react"

// NaviGenie AI interfaces aligned with mobile app
interface NaviGenieQuery {
  id: string
  userId: string
  userName?: string
  query: string
  response: string
  category: 'navigation' | 'store_info' | 'accessibility' | 'facilities' | 'deals' | 'general'
  language: 'en' | 'af' | 'zu' | 'xh' | 'st' | 'tn' | 'ss' | 'nd' | 've' | 'ts' | 'nr'
  venue: string
  satisfaction: number | null
  responseTime: number
  timestamp: Date
  resolved: boolean
  escalated: boolean
}

interface NaviGenieKnowledgeBase {
  id: string
  category: string
  question: string
  answer: string
  keywords: string[]
  venueSpecific: boolean
  venueIds?: string[]
  language: string
  confidence: number
  lastUpdated: Date
  usageCount: number
  averageRating: number
}

interface NaviGenieSettings {
  responseDelay: number
  confidence_threshold: number
  multilingual_enabled: boolean
  voice_enabled: boolean
  escalation_threshold: number
  learning_mode: boolean
  analytics_enabled: boolean
  supported_languages: string[]
  fallback_responses: Record<string, string>
}

// Mock data for South African context
const mockQueryData: NaviGenieQuery[] = [
  {
    id: 'query_001',
    userId: 'user_123',
    userName: 'Sarah M.',
    query: 'Where is the nearest wheelchair accessible bathroom?',
    response: 'The nearest accessible bathroom is on Level 1, near the Food Court entrance. It\'s about 50 meters from your current location. I can guide you there with AR navigation.',
    category: 'accessibility',
    language: 'en',
    venue: 'Sandton City',
    satisfaction: 5,
    responseTime: 1.2,
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    resolved: true,
    escalated: false
  },
  {
    id: 'query_002',
    userId: 'user_456',
    userName: 'Thabo K.',
    query: 'Waar is die naaste Woolworths winkel?',
    response: 'Die naaste Woolworths winkel is op Vlak 2, Seksie B. Dit is ongeveer 2 minute se stap van jou huidige ligging. Ek kan jou met AR navigasie daarheen lei.',
    category: 'store_info',
    language: 'af',
    venue: 'V&A Waterfront',
    satisfaction: 4,
    responseTime: 0.8,
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    resolved: true,
    escalated: false
  },
  {
    id: 'query_003',
    userId: 'user_789',
    query: 'Are there any current deals at Cotton On?',
    response: 'Yes! Cotton On currently has a 40% off summer sale on selected items. The promotion is valid until the end of this month. Would you like me to show you the way to Cotton On and highlight the sale items?',
    category: 'deals',
    language: 'en',
    venue: 'Gateway Theatre of Shopping',
    satisfaction: 5,
    responseTime: 1.5,
    timestamp: new Date(Date.now() - 35 * 60 * 1000),
    resolved: true,
    escalated: false
  },
  {
    id: 'query_004',
    userId: 'user_321',
    query: 'How do I get to the Nando\'s from here?',
    response: 'Nando\'s is located on Level 2 in the Food Court area. From your current position at the main entrance, take the escalator to Level 2 and turn right. It\'s about a 3-minute walk. I can provide AR turn-by-turn directions if you prefer.',
    category: 'navigation',
    language: 'en',
    venue: 'Canal Walk Shopping Centre',
    satisfaction: null,
    responseTime: 2.1,
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    resolved: false,
    escalated: false
  },
  {
    id: 'query_005',
    userId: 'user_654',
    query: 'Ngingathola kuphi isitolo se-Pick n Pay?',
    response: 'Isitolo se-Pick n Pay sitholakala ePhansi kakhulu, engxenyeni ye-A. Kusuka lapho ukhona manje, hamba ngokweqile bese ujika kwesokunxele. Kuzothatha imizuzu emi-2 ukufika khona. Ngingakusiza ngokukhonjiswa kwe-AR uma ufuna.',
    category: 'store_info',
    language: 'zu',
    venue: 'Menlyn Park Shopping Centre',
    satisfaction: 4,
    responseTime: 1.8,
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    resolved: true,
    escalated: false
  }
]

const mockKnowledgeBase: NaviGenieKnowledgeBase[] = [
  {
    id: 'kb_001',
    category: 'Accessibility',
    question: 'Where are the wheelchair accessible facilities?',
    answer: 'All venues have wheelchair accessible bathrooms, elevators, and entrances. Specific locations vary by venue but are clearly marked with accessibility symbols.',
    keywords: ['wheelchair', 'accessible', 'disabled', 'facilities', 'bathroom', 'elevator'],
    venueSpecific: false,
    language: 'en',
    confidence: 95,
    lastUpdated: new Date('2024-01-20'),
    usageCount: 234,
    averageRating: 4.7
  },
  {
    id: 'kb_002',
    category: 'Store Information',
    question: 'Woolworths trading hours',
    answer: 'Woolworths stores typically operate from 8:00 AM to 9:00 PM Monday to Saturday, and 9:00 AM to 7:00 PM on Sundays. Holiday hours may vary.',
    keywords: ['woolworths', 'hours', 'trading', 'open', 'close', 'time'],
    venueSpecific: true,
    venueIds: ['sandton-city', 'v-a-waterfront', 'gateway-theatre'],
    language: 'en',
    confidence: 98,
    lastUpdated: new Date('2024-01-18'),
    usageCount: 156,
    averageRating: 4.9
  },
  {
    id: 'kb_003',
    category: 'Navigation',
    question: 'How to use AR navigation',
    answer: 'To use AR navigation, open the NaviLynx app, search for your destination, and tap "AR Guide". Point your phone camera forward and follow the virtual arrows and waypoints overlaid on your screen.',
    keywords: ['ar', 'navigation', 'augmented reality', 'directions', 'guide', 'camera'],
    venueSpecific: false,
    language: 'en',
    confidence: 92,
    lastUpdated: new Date('2024-01-22'),
    usageCount: 389,
    averageRating: 4.5
  }
]

const mockSettings: NaviGenieSettings = {
  responseDelay: 1.5,
  confidence_threshold: 85,
  multilingual_enabled: true,
  voice_enabled: true,
  escalation_threshold: 3,
  learning_mode: true,
  analytics_enabled: true,
  supported_languages: ['en', 'af', 'zu', 'xh', 'st', 'tn'],
  fallback_responses: {
    en: "I'm sorry, I don't have enough information to answer that question. Would you like me to connect you with a human assistant?",
    af: "Jammer, ek het nie genoeg inligting om daardie vraag te beantwoord nie. Wil jy hê ek moet jou met 'n menslike assistent verbind?",
    zu: "Ngiyaxolisa, anginalo ulwazi olwanele ukuphendula lowo mbuzo. Ingabe ufuna ngikuxhumane nomuntu ozokusiza?"
  }
}

export default function NaviGenieManagementPage() {
  const [activeTab, setActiveTab] = useState<'queries' | 'knowledge' | 'settings' | 'analytics'>('queries')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [languageFilter, setLanguageFilter] = useState<string>('all')
  const [settings, setSettings] = useState(mockSettings)

  const filteredQueries = mockQueryData.filter(query => {
    const matchesSearch = query.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.response.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.venue.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || query.category === categoryFilter
    const matchesLanguage = languageFilter === 'all' || query.language === languageFilter
    
    return matchesSearch && matchesCategory && matchesLanguage
  })

  const getLanguageName = (code: string) => {
    const languages: Record<string, string> = {
      'en': 'English',
      'af': 'Afrikaans',
      'zu': 'Zulu',
      'xh': 'Xhosa',
      'st': 'Sotho',
      'tn': 'Tswana',
      'ss': 'Swati',
      'nd': 'Ndebele',
      've': 'Venda',
      'ts': 'Tsonga',
      'nr': 'Northern Sotho'
    }
    return languages[code] || code
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'navigation': 'bg-blue-100 text-blue-800',
      'store_info': 'bg-emerald-100 text-emerald-800',
      'accessibility': 'bg-purple-100 text-purple-800',
      'facilities': 'bg-amber-100 text-amber-800',
      'deals': 'bg-pink-100 text-pink-800',
      'general': 'bg-gray-100 text-gray-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const queryStats = {
    total: mockQueryData.length,
    resolved: mockQueryData.filter(q => q.resolved).length,
    avgResponseTime: mockQueryData.reduce((acc, q) => acc + q.responseTime, 0) / mockQueryData.length,
    avgSatisfaction: mockQueryData.filter(q => q.satisfaction).reduce((acc, q) => acc + (q.satisfaction || 0), 0) / mockQueryData.filter(q => q.satisfaction).length
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">NaviGenie AI Management</h1>
              <p className="text-lg text-gray-600">Configure and monitor your AI assistant for South African venues</p>
            </div>
            <div className="flex items-center gap-3 mt-4 lg:mt-0">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Logs
              </Button>
              <Button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Add Knowledge
              </Button>
            </div>
          </motion.div>

          {/* Key Metrics */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Queries</p>
                    <p className="text-3xl font-bold text-gray-900">{queryStats.total}</p>
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
                    <p className="text-sm text-gray-600 mb-1">Resolution Rate</p>
                    <p className="text-3xl font-bold text-emerald-600">
                      {((queryStats.resolved / queryStats.total) * 100).toFixed(1)}%
                    </p>
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
                    <p className="text-sm text-gray-600 mb-1">Avg Response Time</p>
                    <p className="text-3xl font-bold text-purple-600">{queryStats.avgResponseTime.toFixed(1)}s</p>
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
                    <p className="text-sm text-gray-600 mb-1">User Satisfaction</p>
                    <p className="text-3xl font-bold text-amber-600">{queryStats.avgSatisfaction.toFixed(1)}/5</p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <Star className="w-6 h-6 text-amber-600" />
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
                  { id: 'queries', label: 'Recent Queries', icon: MessageSquare },
                  { id: 'knowledge', label: 'Knowledge Base', icon: Brain },
                  { id: 'settings', label: 'AI Settings', icon: Settings },
                  { id: 'analytics', label: 'Analytics', icon: BarChart3 }
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'queries' | 'analytics' | 'knowledge' | 'settings')}
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
              {activeTab === 'queries' && (
                <div className="space-y-6">
                  {/* Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search queries..."
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
                      <option value="navigation">Navigation</option>
                      <option value="store_info">Store Info</option>
                      <option value="accessibility">Accessibility</option>
                      <option value="facilities">Facilities</option>
                      <option value="deals">Deals</option>
                      <option value="general">General</option>
                    </select>

                    <select
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={languageFilter}
                      onChange={(e) => setLanguageFilter(e.target.value)}
                    >
                      <option value="all">All Languages</option>
                      <option value="en">English</option>
                      <option value="af">Afrikaans</option>
                      <option value="zu">Zulu</option>
                      <option value="xh">Xhosa</option>
                    </select>

                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      More Filters
                    </Button>
                  </div>

                  {/* Queries List */}
                  <div className="space-y-4">
                    {filteredQueries.map((query, index) => (
                      <motion.div
                        key={query.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Brain className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{query.userName || 'Anonymous User'}</p>
                              <p className="text-sm text-gray-600">{query.venue} • {formatTimeAgo(query.timestamp)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(query.category)}`}>
                              {query.category.replace('_', ' ')}
                            </span>
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                              {getLanguageName(query.language)}
                            </span>
                            {query.satisfaction && (
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-amber-400 fill-current" />
                                <span className="text-xs text-gray-600">{query.satisfaction}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">User Query:</p>
                            <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{query.query}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">NaviGenie Response:</p>
                            <p className="text-sm text-gray-900 bg-purple-50 p-3 rounded-lg">{query.response}</p>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Response time: {query.responseTime}s</span>
                            <div className="flex items-center gap-2">
                              {query.resolved ? (
                                <span className="flex items-center gap-1 text-emerald-600">
                                  <CheckCircle className="w-3 h-3" />
                                  Resolved
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-amber-600">
                                  <AlertTriangle className="w-3 h-3" />
                                  Pending
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'knowledge' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Knowledge Base Entries</h3>
                    <Button className="bg-purple-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Entry
                    </Button>
                  </div>
                  
                  <div className="grid gap-4">
                    {mockKnowledgeBase.map((entry, index) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{entry.question}</h4>
                            <p className="text-sm text-gray-600 mt-1">{entry.category}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {entry.confidence}% confidence
                            </span>
                            <Button variant="outline" size="sm">
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg mb-3">
                          {entry.answer}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-4">
                            <span>Used {entry.usageCount} times</span>
                            <span>Rating: {entry.averageRating}/5</span>
                            <span>Updated: {entry.lastUpdated.toLocaleDateString()}</span>
                          </div>
                          <div className="flex gap-1">
                            {entry.keywords.slice(0, 3).map((keyword) => (
                              <span key={keyword} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Configuration</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Response Delay (seconds)
                          </label>
                          <input
                            type="range"
                            min="0.5"
                            max="5"
                            step="0.1"
                            value={settings.responseDelay}
                            onChange={(e) => setSettings({...settings, responseDelay: parseFloat(e.target.value)})}
                            className="w-full"
                          />
                          <span className="text-sm text-gray-600">{settings.responseDelay}s</span>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confidence Threshold (%)
                          </label>
                          <input
                            type="range"
                            min="60"
                            max="100"
                            value={settings.confidence_threshold}
                            onChange={(e) => setSettings({...settings, confidence_threshold: parseInt(e.target.value)})}
                            className="w-full"
                          />
                          <span className="text-sm text-gray-600">{settings.confidence_threshold}%</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700">Multilingual Support</label>
                          <button
                            onClick={() => setSettings({...settings, multilingual_enabled: !settings.multilingual_enabled})}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.multilingual_enabled ? 'bg-purple-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.multilingual_enabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700">Voice Responses</label>
                          <button
                            onClick={() => setSettings({...settings, voice_enabled: !settings.voice_enabled})}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.voice_enabled ? 'bg-purple-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.voice_enabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700">Learning Mode</label>
                          <button
                            onClick={() => setSettings({...settings, learning_mode: !settings.learning_mode})}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.learning_mode ? 'bg-purple-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.learning_mode ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
                    <Button className="bg-purple-600 text-white">
                      <Save className="w-4 h-4 mr-2" />
                      Save Settings
                    </Button>
                    <Button variant="outline">
                      Reset to Default
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">NaviGenie Analytics Dashboard</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">Query Categories</h4>
                          <BarChart3 className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="space-y-3">
                          {['Navigation', 'Store Info', 'Accessibility', 'Deals'].map((category, index) => (
                            <div key={category} className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">{category}</span>
                              <span className="font-medium">{[35, 28, 20, 17][index]}%</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">Language Usage</h4>
                          <Languages className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="space-y-3">
                          {['English', 'Afrikaans', 'Zulu', 'Xhosa'].map((lang, index) => (
                            <div key={lang} className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">{lang}</span>
                              <span className="font-medium">{[65, 20, 10, 5][index]}%</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">Performance Trends</h4>
                          <TrendingUp className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Response Time</span>
                            <span className="font-medium text-emerald-600">↓ 15%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Accuracy</span>
                            <span className="font-medium text-emerald-600">↑ 8%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">User Satisfaction</span>
                            <span className="font-medium text-emerald-600">↑ 12%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
