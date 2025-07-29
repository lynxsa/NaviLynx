"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  MapPin,
  Tag,
  BarChart3,
  Settings,
  ShoppingBag,
  MessageSquare,
  Globe,
  Star,
  FileText,
  Shield,
  Bell,
  LogOut,
  ChevronRight,
  ChevronLeft,
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
  roles?: string[];
  children?: NavItem[];
}

const navItems: NavItem[] = [
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
      "relative h-full bg-gradient-to-br from-white via-navilynx-purple-100/40 to-navilynx-purple-200/20 border-r border-navilynx-purple-300/40 backdrop-blur-lg transition-all duration-300 ease-in-out shadow-xl",
      collapsed ? "w-16" : "w-72"
    )}>
      {/* Logo Section */}
      <div className="flex h-20 items-center border-b border-navilynx-purple-300/40 px-6 bg-gradient-to-r from-navilynx-primary/5 to-navilynx-secondary/5">
        <div className="flex items-center space-x-3">
          <div className="relative">
            {/* Enhanced Logo with Navigation Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-navilynx-primary via-navilynx-secondary to-navilynx-accent shadow-2xl shadow-navilynx-primary/30 border-2 border-white/20">
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
              <span className="text-2xl font-display font-black bg-gradient-to-r from-navilynx-primary via-navilynx-secondary to-navilynx-accent bg-clip-text text-transparent">
                NaviLynx
              </span>
              <span className="text-xs text-navilynx-primary font-bold tracking-wider uppercase opacity-75">Admin Portal</span>
            </div>
          )}
        </div>
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="ml-auto h-10 w-10 rounded-2xl hover:bg-navilynx-purple-200/50 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="h-5 w-5 text-navilynx-primary" />
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
                    ? "bg-gradient-to-r from-navilynx-primary to-navilynx-secondary text-white shadow-xl shadow-navilynx-primary/40 transform scale-[1.02]"
                    : "text-navilynx-gray-700 hover:bg-gradient-to-r hover:from-navilynx-purple-100/80 hover:to-navilynx-purple-50/60 hover:text-navilynx-primary hover:shadow-lg hover:shadow-navilynx-purple-200/50"
                )}
              >
                {/* Background animation effect */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-navilynx-primary/10 to-navilynx-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                )}
                
                {/* Icon with enhanced styling */}
                <div className={cn(
                  "relative z-10 flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300",
                  isActive 
                    ? "bg-white/20 shadow-lg" 
                    : "group-hover:bg-white/60 group-hover:shadow-md"
                )}>
                  <IconComponent className={cn(
                    "h-5 w-5 transition-all duration-300",
                    isActive ? "text-white" : "text-navilynx-gray-700 group-hover:text-navilynx-primary"
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
                          : "bg-navilynx-secondary text-white shadow-md group-hover:shadow-lg group-hover:scale-110"
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
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-2xl hover:bg-navilynx-purple-100/80 transition-all duration-300 hover:scale-110 shadow-md"
            >
              <Bell className="h-4 w-4 text-navilynx-primary" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-2xl hover:bg-navilynx-purple-100/80 transition-all duration-300 hover:scale-110 shadow-md"
            >
              <Settings className="h-4 w-4 text-navilynx-primary" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-2xl hover:bg-red-50 transition-all duration-300 hover:scale-110 shadow-md"
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
