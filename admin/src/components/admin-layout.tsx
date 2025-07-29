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
          <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
            <div className="px-6 py-3.5">
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
                      <h1 className="text-xl font-semibold text-slate-800 tracking-tight">{title}</h1>
                    )}
                    <div className="flex items-center space-x-2 text-sm text-slate-500 mt-0.5">
                      <span className="font-medium">NaviLynx Admin</span>
                      <span>•</span>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">
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
                      className="pl-10 pr-4 py-2 w-60 rounded-lg border border-slate-200/80 bg-slate-50/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-sm"
                    />
                  </div>

                  {/* Theme Toggle */}
                  <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700 hover:bg-slate-100/70">
                    <Sun className="h-4 w-4" />
                  </Button>

                  {/* Notifications */}
                  <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-700 hover:bg-slate-100/70">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-500 rounded-full"></span>
                  </Button>

                  {/* User Menu */}
                  <div className="flex items-center space-x-3 pl-4 border-l border-slate-200/60">
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-medium text-slate-800">Admin User</p>
                      <p className="text-xs text-slate-500 capitalize">{userRole}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                      <span className="text-sm font-medium text-white">A</span>
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
