'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Search, RotateCcw, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AdminLayout } from '@/components/admin-layout'

export default function NotFound() {
  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-12">
              {/* 404 Number */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-8"
              >
                <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  404
                </h1>
              </motion.div>

              {/* Icon */}
              <motion.div
                initial={{ rotate: -10, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-8"
              >
                <MapPin className="h-12 w-12 text-white" />
              </motion.div>

              {/* Title and Description */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mb-8"
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Page Not Found
                </h2>
                <p className="text-lg text-gray-600 mb-2">
                  The page you're looking for doesn't exist or has been moved.
                </p>
                <p className="text-gray-500">
                  Don't worry, let's get you back on track!
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
              >
                <Link href="/dashboard">
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8"
                    size="lg"
                  >
                    <Home className="h-5 w-5 mr-2" />
                    Go to Dashboard
                  </Button>
                </Link>
                
                <Button
                  onClick={() => window.history.back()}
                  variant="outline"
                  size="lg"
                  className="border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 px-8"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Go Back
                </Button>
                
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  size="lg"
                  className="border-2 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 px-8"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Refresh Page
                </Button>
              </motion.div>

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="border-t border-gray-200 pt-8"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Quick Links
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Link 
                    href="/users" 
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    Users
                  </Link>
                  <Link 
                    href="/venues" 
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    Venues
                  </Link>
                  <Link 
                    href="/products" 
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    Products
                  </Link>
                  <Link 
                    href="/analytics" 
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    Analytics
                  </Link>
                </div>
              </motion.div>

              {/* Help Text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="mt-8 text-center"
              >
                <p className="text-sm text-gray-500">
                  Need help? Contact the administrator or check the documentation.
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  )
}
