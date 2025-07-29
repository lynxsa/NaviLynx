"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/enhanced-sidebar";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/error-boundary";
import { motion } from "framer-motion";
import { Bell, Search, Menu, Sun, Globe } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  userRole?: "admin" | "manager" | "moderator" | "viewer";
  title?: string;
}

export function AdminLayout({ children, userRole = "admin", title }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar 
            userRole={userRole} 
            collapsed={sidebarCollapsed} 
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl">
              <Sidebar 
                userRole={userRole} 
                collapsed={false} 
                onToggle={() => setMobileMenuOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Enhanced Header */}
          <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
            <div className="px-6 py-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-6">
                  {/* Mobile Menu Toggle */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setMobileMenuOpen(true)}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>

                  <div>
                    {title && (
                      <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
                    )}
                    <div className="flex items-center space-x-2 text-sm text-slate-600 mt-1">
                      <span>NaviLynx Admin Dashboard</span>
                      <span>•</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Online
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Search Bar */}
                  <div className="hidden sm:block relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="pl-10 pr-4 py-2 w-64 rounded-lg border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>

                  {/* Theme Toggle */}
                  <Button variant="ghost" size="icon">
                    <Sun className="h-5 w-5" />
                  </Button>

                  {/* Notifications */}
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                  </Button>

                  {/* User Menu */}
                  <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-semibold text-slate-900">Admin User</p>
                      <p className="text-xs text-slate-500 capitalize">{userRole}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-sm font-semibold text-white">A</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="h-full"
            >
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </motion.div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
