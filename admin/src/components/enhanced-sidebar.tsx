"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
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
  }
];

export function Sidebar({ userRole, collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isItemExpanded = (title: string) => expandedItems.includes(title);

  const filteredNavItems = navItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative h-screen bg-white border-r border-slate-200/60 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200/60">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                <Globe className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-slate-800 tracking-tight">NaviLynx</h1>
                <p className="text-xs text-slate-500">Admin Panel</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Button
          onClick={onToggle}
          variant="ghost"
          size="icon"
          className="text-slate-500 hover:text-slate-700 hover:bg-slate-100/70 transition-all duration-200 h-8 w-8"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-slate-200/60">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
            <Users className="h-4 w-4 text-white" />
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-slate-800 truncate">Administrator</p>
                <p className="text-xs text-slate-500 truncate capitalize">{userRole} Access</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {filteredNavItems.map((item) => (
          <NavItemComponent
            key={item.href}
            item={item}
            pathname={pathname}
            collapsed={collapsed}
            expanded={isItemExpanded(item.title)}
            onToggleExpanded={() => toggleExpanded(item.title)}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
          onClick={() => {
            // Handle logout
            console.log('Logout clicked');
          }}
        >
          <LogOut className="h-5 w-5 mr-3" />
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </div>
    </motion.div>
  );
}

interface NavItemComponentProps {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
  expanded: boolean;
  onToggleExpanded: () => void;
}

function NavItemComponent({ 
  item, 
  pathname, 
  collapsed, 
  expanded, 
  onToggleExpanded 
}: NavItemComponentProps) {
  const isActive = pathname === item.href || 
    (item.children?.some(child => pathname === child.href));
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div>
      {hasChildren ? (
        <Button
          onClick={onToggleExpanded}
          variant="ghost"
          className={cn(
            "w-full justify-start text-left transition-all duration-200 group",
            collapsed ? "px-3" : "px-4",
            isActive
              ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border-r-2 border-blue-500"
              : "text-slate-300 hover:text-white hover:bg-slate-700/50"
          )}
        >
          <item.icon className={cn("h-5 w-5 mr-3 transition-colors", item.color)} />
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex items-center justify-between"
              >
                <span className="font-medium truncate">{item.title}</span>
                <div className="flex items-center space-x-2">
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className="text-xs px-2 py-0.5 bg-white/10 text-white border-white/20"
                    >
                      {item.badge}
                    </Badge>
                  )}
                  {expanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      ) : (
        <Link href={item.href}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start transition-all duration-200 group",
              collapsed ? "px-3" : "px-4",
              isActive
                ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border-r-2 border-blue-500"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50"
            )}
          >
            <item.icon className={cn("h-5 w-5 mr-3 transition-colors", item.color)} />
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex items-center justify-between"
                >
                  <span className="font-medium truncate">{item.title}</span>
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className="text-xs px-2 py-0.5 bg-white/10 text-white border-white/20"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </Link>
      )}

      {/* Submenu */}
      <AnimatePresence>
        {hasChildren && expanded && !collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="ml-6 mt-2 space-y-1 border-l border-slate-700/50 pl-4"
          >
            {item.children?.map((child) => (
              <Link key={child.href} href={child.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-sm transition-all duration-200",
                    pathname === child.href
                      ? "bg-slate-700/50 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-700/30"
                  )}
                >
                  <child.icon className={cn("h-4 w-4 mr-3", child.color)} />
                  <span className="truncate">{child.title}</span>
                  {child.badge && (
                    <Badge 
                      variant="outline" 
                      className="ml-auto text-xs px-1.5 py-0.5 bg-white/5 text-white border-white/20"
                    >
                      {child.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
