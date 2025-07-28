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
    <div className="flex h-screen bg-gradient-to-br from-white via-navilynx-purple-50/10 to-navilynx-purple-100/5">
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
        <header className="h-18 bg-gradient-to-r from-white/95 via-navilynx-purple-50/80 to-white/95 backdrop-blur-2xl border-b border-navilynx-purple-300/40 flex items-center justify-between px-8 shadow-xl">
          <div className="flex items-center space-x-6">
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-12 w-12 rounded-2xl hover:bg-navilynx-purple-100/60 transition-all duration-300 hover:scale-110 shadow-md"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6 text-navilynx-gray-700" />
            </Button>

            {/* Enhanced Search Bar */}
            <div className="hidden sm:block">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-navilynx-gray-500 group-focus-within:text-navilynx-primary transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="pl-12 pr-6 py-4 w-96 rounded-2xl border-2 border-navilynx-purple-300/50 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-navilynx-primary/20 focus:border-navilynx-primary transition-all duration-300 font-semibold placeholder:text-navilynx-gray-400 shadow-lg focus:shadow-xl"
                />
                {/* Search suggestions indicator */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300">
                  <kbd className="px-2 py-1 text-xs bg-navilynx-purple-100 rounded-md text-navilynx-gray-600 font-semibold">⌘K</kbd>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Enhanced Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-2xl hover:bg-navilynx-purple-100/60 transition-all duration-300 hover:scale-110 shadow-md"
            >
              <Sun className="h-6 w-6 text-navilynx-gray-700" />
            </Button>

            {/* Enhanced Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-12 w-12 rounded-2xl hover:bg-navilynx-purple-100/60 transition-all duration-300 hover:scale-110 shadow-md"
            >
              <Bell className="h-6 w-6 text-navilynx-gray-700" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full border-2 border-white animate-pulse flex items-center justify-center">
                <span className="text-xs font-bold text-white">3</span>
              </span>
            </Button>

            {/* Enhanced User Menu */}
            <div className="flex items-center space-x-4 pl-6 border-l-2 border-navilynx-purple-200/50">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-navilynx-dark">Admin User</p>
                <p className="text-xs text-navilynx-primary capitalize font-semibold bg-navilynx-purple-100 px-2 py-1 rounded-full">{userRole}</p>
              </div>
              <div className="relative group">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-navilynx-primary via-navilynx-secondary to-navilynx-accent flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 border-2 border-white/20">
                  <span className="text-lg font-bold text-white">A</span>
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white"></div>
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
