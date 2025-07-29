'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  Search,
  Filter,
  Eye,
  MessageSquare,
  Trash2,
  Flag,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Download,
  Clock,
  Shield,
  TrendingUp,
  TrendingDown,
  Users,
  MapPin,
  Calendar,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react"

// Mobile App Aligned Review Interface
interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  venueId: string
  venueName: string
  rating: number
  title: string
  content: string
  images: string[]
  helpfulCount: number
  notHelpfulCount: number
  responseFromVenue?: {
    content: string
    respondedBy: string
    respondedAt: Date
  }
  reportCount: number
  status: 'published' | 'pending' | 'flagged' | 'hidden' | 'spam'
  verifiedPurchase: boolean
  categories: string[]
  visitDate?: Date
  createdAt: Date
  updatedAt: Date
  moderatedBy?: string
  moderationNotes?: string
}

// South African venue reviews data
const mockReviews: Review[] = [
  {
    id: 'rv_001',
    userId: 'user_123',
    userName: 'Thabo Mthembu',
    userAvatar: 'user1.jpg',
    venueId: 'sandton-city',
    venueName: 'Sandton City',
    rating: 5,
    title: 'Amazing shopping experience with great navigation!',
    content: 'NaviLynx made finding stores so easy! The AR navigation guided me perfectly from the parking to Woolworths and then to Pick n Pay. Staff were friendly and the mall was very clean. The deals section helped me save money on my groceries.',
    images: ['review_1_img1.jpg', 'review_1_img2.jpg'],
    helpfulCount: 24,
    notHelpfulCount: 2,
    responseFromVenue: {
      content: 'Thank you Thabo! We\'re delighted that NaviLynx enhanced your shopping experience. We look forward to welcoming you back soon.',
      respondedBy: 'Sandton City Management',
      respondedAt: new Date('2024-01-18')
    },
    reportCount: 0,
    status: 'published',
    verifiedPurchase: true,
    categories: ['navigation', 'shopping', 'customer_service'],
    visitDate: new Date('2024-01-15'),
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    moderatedBy: 'mod_001',
    moderationNotes: 'Verified review - excellent feedback'
  },
  {
    id: 'rv_002',
    userId: 'user_456',
    userName: 'Lerato Ndlovu',
    userAvatar: 'user2.jpg',
    venueId: 'v-a-waterfront',
    venueName: 'V&A Waterfront',
    rating: 4,
    title: 'Good experience but parking was challenging',
    content: 'The NaviLynx app worked well for finding restaurants and shops. The AR features are impressive and very helpful for tourists. However, finding parking took forever and the app could use better parking guidance. Overall enjoyed my visit.',
    images: ['review_2_img1.jpg'],
    helpfulCount: 18,
    notHelpfulCount: 3,
    reportCount: 0,
    status: 'published',
    verifiedPurchase: true,
    categories: ['navigation', 'parking', 'tourism'],
    visitDate: new Date('2024-01-12'),
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
    moderatedBy: 'mod_002'
  },
  {
    id: 'rv_003',
    userId: 'user_789',
    userName: 'Aisha Patel',
    userAvatar: 'user3.jpg',
    venueId: 'gateway-theatre',
    venueName: 'Gateway Theatre of Shopping',
    rating: 3,
    title: 'Mixed experience - some features need work',
    content: 'The mall itself is great with lots of shops and restaurants. NaviLynx helped with basic navigation but the AR scanner didn\'t work properly on some products. Also experienced some lag with the app. Hope they fix these issues soon.',
    images: [],
    helpfulCount: 12,
    notHelpfulCount: 8,
    reportCount: 1,
    status: 'flagged',
    verifiedPurchase: false,
    categories: ['navigation', 'ar_scanner', 'technical_issues'],
    visitDate: new Date('2024-01-10'),
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-14'),
    moderatedBy: 'mod_001',
    moderationNotes: 'Flagged for review - potential technical feedback'
  },
  {
    id: 'rv_004',
    userId: 'user_321',
    userName: 'Johan van der Merwe',
    userAvatar: 'user4.jpg',
    venueId: 'menlyn-park',
    venueName: 'Menlyn Park Shopping Centre',
    rating: 2,
    title: 'App crashes frequently, very frustrating',
    content: 'Tried using NaviLynx multiple times but it keeps crashing. When it works, the navigation is helpful, but the constant crashes make it unusable. Needs serious bug fixes before I\'ll use it again.',
    images: [],
    helpfulCount: 15,
    notHelpfulCount: 5,
    reportCount: 0,
    status: 'published',
    verifiedPurchase: true,
    categories: ['technical_issues', 'bugs', 'crashes'],
    visitDate: new Date('2024-01-08'),
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-09'),
    moderatedBy: 'mod_002',
    moderationNotes: 'Valid technical feedback - forwarded to dev team'
  },
  {
    id: 'rv_005',
    userId: 'user_654',
    userName: 'Nomsa Dlamini',
    userAvatar: 'user5.jpg',
    venueId: 'canal-walk',
    venueName: 'Canal Walk Shopping Centre',
    rating: 5,
    title: 'Excellent for families! Kids loved the AR features',
    content: 'Visited with my family and the children were amazed by the AR navigation. It made shopping fun for them! Found great deals and the store recommendations were spot on. The app made our family outing much more enjoyable.',
    images: ['review_5_img1.jpg', 'review_5_img2.jpg', 'review_5_img3.jpg'],
    helpfulCount: 31,
    notHelpfulCount: 1,
    responseFromVenue: {
      content: 'So wonderful to hear the family enjoyed their visit! We love seeing children excited about our AR features. Thank you for choosing Canal Walk.',
      respondedBy: 'Canal Walk Team',
      respondedAt: new Date('2024-01-12')
    },
    reportCount: 0,
    status: 'published',
    verifiedPurchase: true,
    categories: ['family', 'ar_features', 'entertainment', 'deals'],
    visitDate: new Date('2024-01-06'),
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-07'),
    moderatedBy: 'mod_001'
  },
  {
    id: 'rv_006',
    userId: 'user_987',
    userName: 'Sarah Johnson',
    userAvatar: 'user6.jpg',
    venueId: 'rosebank-mall',
    venueName: 'Rosebank Mall',
    rating: 1,
    title: 'Terrible app, waste of time!',
    content: 'This app is completely useless! Navigation doesn\'t work, keeps showing wrong directions, and the deals are fake. Don\'t waste your time downloading this garbage. Mall management should find a better solution.',
    images: [],
    helpfulCount: 3,
    notHelpfulCount: 22,
    reportCount: 5,
    status: 'pending',
    verifiedPurchase: false,
    categories: ['negative_feedback', 'navigation', 'deals'],
    visitDate: new Date('2024-01-05'),
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-15'),
    moderatedBy: 'mod_003',
    moderationNotes: 'Multiple reports - investigating authenticity'
  }
]

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [venueFilter, setVenueFilter] = useState<string>('all')
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)

  const filteredReviews = useMemo(() => {
    return mockReviews.filter(review => {
      const matchesSearch = review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           review.venueName.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter
      const matchesStatus = statusFilter === 'all' || review.status === statusFilter
      const matchesVenue = venueFilter === 'all' || review.venueId === venueFilter
      
      return matchesSearch && matchesRating && matchesStatus && matchesVenue
    })
  }, [searchTerm, ratingFilter, statusFilter, venueFilter])

  const reviewMetrics = useMemo(() => {
    const totalReviews = mockReviews.length
    const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
    const publishedReviews = mockReviews.filter(r => r.status === 'published').length
    const pendingReviews = mockReviews.filter(r => r.status === 'pending').length
    const flaggedReviews = mockReviews.filter(r => r.status === 'flagged').length
    const totalHelpful = mockReviews.reduce((sum, review) => sum + review.helpfulCount, 0)
    
    return {
      totalReviews,
      averageRating,
      publishedReviews,
      pendingReviews,
      flaggedReviews,
      totalHelpful
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'flagged': return 'bg-red-100 text-red-800 border-red-200'
      case 'hidden': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'spam': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'flagged': return <Flag className="w-4 h-4" />
      case 'hidden': return <XCircle className="w-4 h-4" />
      case 'spam': return <AlertTriangle className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  const renderStars = (rating: number, size = 'w-4 h-4') => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${size} ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Reviews Management</h1>
              <p className="text-lg text-gray-600">Monitor and moderate user reviews across South African venues</p>
            </div>
            <div className="flex items-center gap-3 mt-4 lg:mt-0">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Reviews
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Moderation Queue
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
                    <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
                    <p className="text-3xl font-bold text-gray-900">{reviewMetrics.totalReviews}</p>
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
                    <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                    <div className="flex items-center gap-2">
                      <p className="text-3xl font-bold text-yellow-600">{reviewMetrics.averageRating.toFixed(1)}</p>
                      <div className="flex">
                        {renderStars(Math.round(reviewMetrics.averageRating))}
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Published</p>
                    <p className="text-3xl font-bold text-emerald-600">{reviewMetrics.publishedReviews}</p>
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
                    <p className="text-sm text-gray-600 mb-1">Pending</p>
                    <p className="text-3xl font-bold text-amber-600">{reviewMetrics.pendingReviews}</p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Flagged</p>
                    <p className="text-3xl font-bold text-red-600">{reviewMetrics.flaggedReviews}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Flag className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Helpful Votes</p>
                    <p className="text-2xl font-bold text-purple-600">{reviewMetrics.totalHelpful}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <ThumbsUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reviews List */}
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
                      placeholder="Search reviews..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>

                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="published">Published</option>
                    <option value="pending">Pending</option>
                    <option value="flagged">Flagged</option>
                    <option value="hidden">Hidden</option>
                    <option value="spam">Spam</option>
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
                    <option value="canal-walk">Canal Walk</option>
                    <option value="rosebank-mall">Rosebank Mall</option>
                  </select>

                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    More Filters
                  </Button>
                </div>
              </motion.div>

              {/* Review Items */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                {filteredReviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${selectedReview?.id === review.id ? 'ring-2 ring-purple-500' : ''}`}
                    onClick={() => setSelectedReview(review)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {review.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{review.userName}</h3>
                            {review.verifiedPurchase && (
                              <Badge variant="secondary" className="text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-gray-600">• {review.venueName}</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {review.visitDate && `Visited ${review.visitDate.toLocaleDateString()} • `}
                            Posted {review.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(review.status)}`}>
                          {getStatusIcon(review.status)}
                          <span className="capitalize">{review.status}</span>
                        </div>
                        {review.reportCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {review.reportCount} reports
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                      <p className="text-gray-700 leading-relaxed">{review.content}</p>
                    </div>

                    {review.images.length > 0 && (
                      <div className="flex gap-2 mb-4">
                        {review.images.slice(0, 3).map((image, idx) => (
                          <div key={idx} className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-xs text-gray-500">IMG</span>
                          </div>
                        ))}
                        {review.images.length > 3 && (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-xs text-gray-600">+{review.images.length - 3}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{review.helpfulCount}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <ThumbsDown className="w-4 h-4" />
                          <span>{review.notHelpfulCount}</span>
                        </div>
                        {review.responseFromVenue && (
                          <Badge variant="outline" className="text-xs">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Venue Responded
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Flag className="w-3 h-3 mr-1" />
                          Flag
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {review.responseFromVenue && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-900">{review.responseFromVenue.respondedBy}</span>
                          <span className="text-sm text-blue-600">
                            • {review.responseFromVenue.respondedAt.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-blue-800">{review.responseFromVenue.content}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Review Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-white border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-600" />
                      Rating Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const count = mockReviews.filter(r => r.rating === stars).length
                        const percentage = (count / mockReviews.length) * 100
                        return (
                          <div key={stars} className="flex items-center gap-3">
                            <div className="flex items-center gap-1 w-16">
                              <span className="text-sm">{stars}</span>
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-8">{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Venue Performance */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="bg-white border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      Venue Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { venue: 'Sandton City', rating: 4.8, trend: 'up', reviews: 45 },
                        { venue: 'V&A Waterfront', rating: 4.6, trend: 'up', reviews: 38 },
                        { venue: 'Canal Walk', rating: 4.5, trend: 'stable', reviews: 29 },
                        { venue: 'Gateway Theatre', rating: 4.2, trend: 'down', reviews: 22 },
                        { venue: 'Menlyn Park', rating: 3.9, trend: 'down', reviews: 18 },
                        { venue: 'Rosebank Mall', rating: 3.7, trend: 'up', reviews: 12 }
                      ].map((venue, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{venue.venue}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {renderStars(Math.round(venue.rating), 'w-3 h-3')}
                              </div>
                              <span className="text-xs text-gray-600">{venue.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">{venue.reviews}</span>
                            {venue.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
                            {venue.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
                            {venue.trend === 'stable' && <div className="w-4 h-4" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="bg-white border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-purple-600" />
                      Moderation Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Flag className="w-4 h-4 mr-2" />
                        Review Flagged Items
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Clock className="w-4 h-4 mr-2" />
                        Approve Pending
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        User Management
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Selected Review Details */}
              {selectedReview && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Card className="bg-white border-gray-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-purple-600" />
                        Review Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900">{selectedReview.userName}</h4>
                          <p className="text-sm text-gray-600 mt-1">{selectedReview.venueName}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Rating:</span>
                            <div className="flex">
                              {renderStars(selectedReview.rating, 'w-3 h-3')}
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Status:</span>
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedReview.status)}`}>
                              {getStatusIcon(selectedReview.status)}
                              <span className="capitalize">{selectedReview.status}</span>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Helpful:</span>
                            <span>{selectedReview.helpfulCount} / {selectedReview.helpfulCount + selectedReview.notHelpfulCount}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Reports:</span>
                            <span className={selectedReview.reportCount > 0 ? 'text-red-600 font-medium' : ''}>
                              {selectedReview.reportCount}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Created:</span>
                            <span>{selectedReview.createdAt.toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <div className="space-y-2">
                            <Button size="sm" className="w-full bg-purple-600 text-white">
                              <Eye className="w-4 h-4 mr-2" />
                              View Full Review
                            </Button>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="flex-1">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700">
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                            <Button variant="outline" size="sm" className="w-full">
                              <Flag className="w-4 h-4 mr-2" />
                              Flag for Review
                            </Button>
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
