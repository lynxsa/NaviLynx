"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, Search, Menu, Sun } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  userRole?: "admin" | "manager" | "moderator" | "viewer";
}

export function AdminLayout({ children, userRole = "admin" }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/20">
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
        {/* Enhanced Top Navigation */}
        <header className="h-20 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center space-x-6">
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-12 w-12 rounded-2xl hover:bg-purple-100/60 transition-all duration-300 hover:scale-105 shadow-sm"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </Button>

            {/* Enhanced Search Bar */}
            <div className="hidden sm:block">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="pl-12 pr-6 py-3 w-96 rounded-2xl border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 font-medium placeholder:text-gray-400 shadow-sm focus:shadow-lg focus:bg-white"
                />
                {/* Search suggestions indicator */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300">
                  <kbd className="px-2 py-1 text-xs bg-gray-100 rounded-md text-gray-600 font-semibold border border-gray-300">⌘K</kbd>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Enhanced Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-2xl hover:bg-purple-100/60 transition-all duration-300 hover:scale-105 shadow-sm"
            >
              <Sun className="h-6 w-6 text-gray-700" />
            </Button>

            {/* Enhanced Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-12 w-12 rounded-2xl hover:bg-purple-100/60 transition-all duration-300 hover:scale-105 shadow-sm"
            >
              <Bell className="h-6 w-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-red-600 rounded-full border-2 border-white animate-pulse flex items-center justify-center shadow-lg">
                <span className="text-xs font-bold text-white">3</span>
              </span>
            </Button>

            {/* Enhanced User Menu */}
            <div className="flex items-center space-x-4 pl-6 border-l-2 border-gray-200">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-gray-900">Admin User</p>
                <p className="text-xs text-purple-600 capitalize font-semibold bg-purple-100 px-2 py-1 rounded-full">{userRole}</p>
              </div>
              <div className="relative group">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 border-2 border-white/20 hover:scale-105">
                  <span className="text-lg font-bold text-white">A</span>
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Page Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50/50 via-purple-50/20 to-indigo-50/10">
          {children}
        </main>
      </div>
    </div>
  );
}
