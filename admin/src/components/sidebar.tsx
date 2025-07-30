"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Users,
  MapPin,
  Tag,
  BarChart3,
  Settings,
  ShoppingBag,
  MessageSquare,
  Star,
  FileText,
  Shield,
  Bell,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Camera,
  Wifi,
  Brain,
  CreditCard,
  Package,
  ChevronDown,
  ChevronUp,
  Zap,
  Globe
} from "lucide-react";

export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface SidebarProps {
  userRole: "admin" | "manager" | "moderator" | "viewer";
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  color?: string;
  roles?: string[];
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    color: "text-blue-600",
    roles: ["admin", "manager", "moderator", "viewer"]
  },
  {
    title: "User Management",
    href: "/users",
    icon: Users,
    color: "text-green-600",
    badge: "Live",
    roles: ["admin", "manager"]
  },
  {
    title: "Venue Management",
    href: "/venues",
    icon: MapPin,
    color: "text-purple-600",
    roles: ["admin", "manager"],
    children: [
      {
        title: "All Venues",
        href: "/venues",
        icon: MapPin,
        color: "text-purple-500"
      },
      {
        title: "AR Content",
        href: "/ar-content",
        icon: Camera,
        color: "text-orange-500",
        badge: "AR"
      },
      {
        title: "Beacons",
        href: "/beacons",
        icon: Wifi,
        color: "text-cyan-500",
        badge: "IoT"
      }
    ]
  },
  {
    title: "Commerce",
    href: "/products",
    icon: ShoppingBag,
    color: "text-emerald-600",
    roles: ["admin", "manager", "moderator"],
    children: [
      {
        title: "Products",
        href: "/products",
        icon: Package,
        color: "text-emerald-500"
      },
      {
        title: "Deals",
        href: "/deals",
        icon: Tag,
        color: "text-yellow-500",
        badge: "Active"
      },
      {
        title: "Store Cards",
        href: "/store-cards",
        icon: CreditCard,
        color: "text-indigo-500"
      }
    ]
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    color: "text-cyan-600",
    badge: "Real-time",
    roles: ["admin", "manager", "moderator"]
  },
  {
    title: "Reviews",
    href: "/reviews",
    icon: Star,
    color: "text-amber-600",
    roles: ["admin", "manager", "moderator"]
  },
  {
    title: "AI & Smart",
    href: "/navigenie",
    icon: Brain,
    color: "text-violet-600",
    badge: "AI",
    roles: ["admin", "manager"],
    children: [
      {
        title: "NaviGenie AI",
        href: "/navigenie",
        icon: Brain,
        color: "text-violet-500",
        badge: "AI"
      },
      {
        title: "Chat System",
        href: "/chat",
        icon: MessageSquare,
        color: "text-pink-500"
      }
    ]
  },
  {
    title: "User Profiles",
    href: "/profiles",
    icon: FileText,
    color: "text-slate-600",
    roles: ["admin", "manager"]
  },
  {
    title: "System",
    href: "/settings",
    icon: Settings,
    color: "text-gray-600",
    roles: ["admin"],
    children: [
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
        color: "text-gray-500"
      },
      {
        title: "Security",
        href: "/settings?tab=security",
        icon: Shield,
        color: "text-red-500"
      },
      {
        title: "Notifications",
        href: "/settings?tab=notifications",
        icon: Bell,
        color: "text-blue-500"
      }
    ]
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "manager", "moderator", "viewer"],
  },
  {
    title: "User Management",
    href: "/users",
    icon: Users,
    badge: "12",
    roles: ["admin", "manager"],
    children: [
      { title: "All Users", href: "/users", icon: Users },
      { title: "Admin Users", href: "/users/admins", icon: Shield },
      { title: "Mobile Users", href: "/users/mobile", icon: Users },
    ],
  },
  {
    title: "Venues",
    href: "/venues",
    icon: MapPin,
    badge: "45",
    roles: ["admin", "manager", "moderator"],
  },
  {
    title: "Deals & Offers",
    href: "/deals",
    icon: Tag,
    badge: "8",
    roles: ["admin", "manager"],
  },
  {
    title: "Products",
    href: "/products",
    icon: ShoppingBag,
    roles: ["admin", "manager"],
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    roles: ["admin", "manager", "moderator"],
  },
  {
    title: "Chat Support",
    href: "/chat",
    icon: MessageSquare,
    badge: "3",
    roles: ["admin", "manager", "moderator"],
  },
  {
    title: "AR Content",
    href: "/ar-content",
    icon: Globe,
    roles: ["admin", "manager"],
  },
  {
    title: "Reviews",
    href: "/reviews",
    icon: Star,
    roles: ["admin", "manager", "moderator"],
  },
  {
    title: "Articles",
    href: "/articles",
    icon: FileText,
    roles: ["admin", "manager"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["admin"],
  },
];

export function Sidebar({ userRole, collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(userRole);
  });

  return (
    <div className={cn(
      "relative h-full bg-gradient-to-br from-white via-purple-50/60 to-indigo-50/40 border-r border-purple-200/60 backdrop-blur-lg transition-all duration-300 ease-in-out shadow-xl shadow-purple-100/50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 dark:border-purple-700/60 dark:shadow-purple-900/50",
      collapsed ? "w-16" : "w-72"
    )}>
      {/* Logo Section */}
      <div className="flex h-20 items-center border-b border-purple-200/60 px-6 bg-gradient-to-r from-purple-600/5 to-indigo-600/5 dark:border-purple-700/60 dark:from-purple-800/10 dark:to-indigo-800/10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            {/* Enhanced Logo with Navigation Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 shadow-2xl shadow-purple-500/30 border-2 border-white/20">
              <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.95 9 11 5.16-1.05 9-5.45 9-11V7l-10-5z"/>
                <path d="M10 14l-2-2 1.41-1.41L10 11.17l4.59-4.58L16 8l-6 6z" fill="white" opacity="0.9"/>
              </svg>
            </div>
            {/* Online Status Indicator */}
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
                            <span className="text-2xl font-display font-black bg-gradient-to-r from-purple-800 via-indigo-700 to-purple-600 bg-clip-text text-transparent dark:from-purple-400 dark:via-indigo-300 dark:to-purple-200">
                NaviLynx
              </span>
              <span className="text-xs text-gray-600 font-medium tracking-wider uppercase dark:text-gray-300">
                Admin Portal
              </span>
            </div>
          )}
        </div>
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="ml-auto h-10 w-10 rounded-2xl hover:bg-purple-200/50 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="h-5 w-5 text-purple-600" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-2 px-4">
          {filteredNavItems.map((item: NavItem) => {
            const isActive = pathname === item.href
            const IconComponent = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden",
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-500/40 transform scale-[1.02] border border-purple-400/50"
                    : "text-gray-800 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:text-purple-700 hover:shadow-lg hover:shadow-purple-200/50"
                )}
              >
                {/* Background animation effect */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                )}
                
                {/* Icon with enhanced styling */}
                <div className={cn(
                  "relative z-10 flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300",
                  isActive 
                    ? "bg-white/20 shadow-lg" 
                    : "group-hover:bg-purple-100/80 group-hover:shadow-md"
                )}>
                  <IconComponent className={cn(
                    "h-5 w-5 transition-all duration-300",
                    isActive ? "text-white" : "text-gray-800 group-hover:text-purple-700"
                  )} />
                </div>
                
                {!collapsed && (
                  <>
                    <span className="relative z-10 flex-1 font-semibold">{item.title}</span>
                    {item.badge && (
                      <span className={cn(
                        "relative z-10 px-2.5 py-1 text-xs rounded-xl font-bold transition-all duration-300",
                        isActive
                          ? "bg-white/25 text-white shadow-lg"
                          : "bg-purple-600 text-white shadow-md group-hover:shadow-lg group-hover:scale-110 group-hover:bg-purple-700"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white/40 rounded-l-full"></div>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Enhanced Bottom Section */}
      {!collapsed && (
        <div className="border-t border-navilynx-purple-300/40 p-6 space-y-4 bg-gradient-to-r from-navilynx-primary/5 to-navilynx-secondary/5">
          {/* Enhanced User Profile */}
          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-r from-white/80 to-navilynx-purple-50/60 border border-navilynx-purple-200/50 shadow-lg backdrop-blur-sm">
            <div className="relative">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-navilynx-primary to-navilynx-secondary flex items-center justify-center shadow-lg">
                <span className="text-sm font-bold text-white">A</span>
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-navilynx-dark truncate">Admin User</p>
              <p className="text-xs text-navilynx-primary capitalize font-semibold">{userRole}</p>
            </div>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="flex space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-purple-100/80 transition-all duration-300 hover:scale-110 shadow-sm"
            >
              <Bell className="h-4 w-4 text-purple-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-purple-100/80 transition-all duration-300 hover:scale-110 shadow-sm"
            >
              <Settings className="h-4 w-4 text-purple-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-red-50 transition-all duration-300 hover:scale-110 shadow-sm"
            >
              <LogOut className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      )}

      {/* Collapsed Toggle Button */}
      {collapsed && (
        <div className="absolute -right-4 top-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-10 w-10 rounded-full bg-white shadow-xl border border-navilynx-purple-200 hover:bg-navilynx-purple-50 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="h-5 w-5 text-navilynx-primary" />
          </Button>
        </div>
      )}
    </div>
  );
}
