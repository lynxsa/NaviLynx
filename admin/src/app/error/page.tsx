"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "@/components/admin-layout";
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Settings,
  Bug,
  Terminal,
  Copy,
  ExternalLink,
  ChevronRight,
  Shield,
  Zap,
  HelpCircle
} from "lucide-react";

export default function ErrorPage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleCopyError = () => {
    const errorDetails = `
NaviLynx Admin Error Report
Time: ${new Date().toISOString()}
User Agent: ${navigator.userAgent}
URL: ${window.location.href}
Error: Application crashed or encountered an unexpected error
    `.trim();
    
    navigator.clipboard.writeText(errorDetails).then(() => {
      alert("Error details copied to clipboard");
    });
  };

  const commonSolutions = [
    {
      title: "Clear Browser Cache",
      description: "Clear your browser cache and cookies",
      action: "Ctrl+Shift+Delete"
    },
    {
      title: "Restart Application",
      description: "Refresh the page to restart the application",
      action: "F5 or Ctrl+R"
    },
    {
      title: "Check Network",
      description: "Verify your internet connection is stable",
      action: "Network Settings"
    },
    {
      title: "Update Browser",
      description: "Ensure you're using the latest browser version",
      action: "Browser Settings"
    }
  ];

  const quickActions = [
    {
      icon: Home,
      label: "Go to Dashboard",
      href: "/dashboard",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: Settings,
      label: "System Settings",
      href: "/settings",
      color: "bg-gray-500 hover:bg-gray-600"
    },
    {
      icon: Terminal,
      label: "Debug Console",
      href: "/debug",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      icon: HelpCircle,
      label: "Get Help",
      href: "/help",
      color: "bg-green-500 hover:bg-green-600"
    }
  ];

  return (
    <AdminLayout title="Application Error">
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          {/* Main Error Card */}
          <Card className="mb-8 border-red-200 bg-white/90 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center pb-4">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-lg"
              >
                <AlertTriangle className="h-10 w-10 text-white" />
              </motion.div>
              <CardTitle className="text-3xl font-bold text-red-600 mb-2">
                Application Error
              </CardTitle>
              <p className="text-gray-600 text-lg">
                We encountered an unexpected error. Don't worry, we're here to help!
              </p>
              <div className="flex justify-center space-x-2 mt-4">
                <Badge variant="destructive" className="px-3 py-1">
                  <Bug className="h-4 w-4 mr-1" />
                  Error Detected
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  <Shield className="h-4 w-4 mr-1" />
                  Safe Mode
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Button
                      asChild
                      className={`w-full h-auto p-4 flex flex-col items-center space-y-2 ${action.color} text-white shadow-lg hover:shadow-xl transition-all duration-200`}
                    >
                      <a href={action.href}>
                        <action.icon className="h-6 w-6" />
                        <span className="text-sm font-medium">{action.label}</span>
                      </a>
                    </Button>
                  </motion.div>
                ))}
              </div>

              {/* Primary Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleRefresh}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Restart Application
                </Button>
                <Button
                  onClick={handleCopyError}
                  variant="outline"
                  size="lg"
                  className="border-gray-300 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Copy className="h-5 w-5 mr-2" />
                  Copy Error Details
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Solutions Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Common Solutions */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                  Quick Solutions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {commonSolutions.map((solution, index) => (
                  <motion.div
                    key={solution.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{solution.title}</h4>
                      <p className="text-sm text-gray-600">{solution.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {solution.action}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Terminal className="h-5 w-5 mr-2 text-green-500" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Application Status</span>
                    <Badge variant="destructive">Error</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database Connection</span>
                    <Badge variant="secondary">Checking...</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Services</span>
                    <Badge variant="secondary">Checking...</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Error Reporting</span>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    className="w-full justify-center"
                    onClick={() => window.open('/api/health', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Detailed Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center mt-8 text-gray-500"
          >
            <p className="text-sm">
              If the problem persists, please contact{" "}
              <a href="mailto:support@navilynx.com" className="text-blue-500 hover:underline">
                support@navilynx.com
              </a>
            </p>
            <p className="text-xs mt-2">
              Error ID: {Date.now().toString(36)} • NaviLynx Admin v2.0
            </p>
          </motion.div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
