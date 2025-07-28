import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  MapPin,
  Tag,
  Activity,
  DollarSign,
  BarChart3,
  Plus,
  Building2,
  Settings,
  MessageSquare,
  Zap,
  CheckCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  Globe,
} from "lucide-react";

export default function Dashboard() {
  return (
    <AdminLayout userRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-navilynx-primary/10 to-navilynx-secondary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-navilynx-accent/10 to-navilynx-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-6 py-8 space-y-8 relative z-10">
          {/* Enhanced Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {/* Logo Icon */}
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-navilynx-primary via-navilynx-secondary to-navilynx-accent shadow-2xl shadow-navilynx-primary/30 border-2 border-white/20">
                  <svg className="h-9 w-9 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.95 9 11 5.16-1.05 9-5.45 9-11V7l-10-5z"/>
                    <path d="M10 14l-2-2 1.41-1.41L10 11.17l4.59-4.58L16 8l-6 6z" fill="white" opacity="0.9"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-5xl font-display font-black bg-gradient-to-r from-navilynx-primary via-navilynx-secondary to-navilynx-accent bg-clip-text text-transparent">
                    NaviLynx Dashboard
                  </h1>
                  <p className="text-lg text-navilynx-gray-600 font-semibold mt-2">
                    Welcome back! Here&apos;s what&apos;s happening with your platform today.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" size="lg" className="rounded-2xl border-2 border-navilynx-primary/30 text-navilynx-primary hover:bg-navilynx-primary/10 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <BarChart3 className="h-5 w-5 mr-3" />
                View Analytics
              </Button>
              <Button size="lg" className="rounded-2xl bg-gradient-to-r from-navilynx-primary via-navilynx-secondary to-navilynx-accent shadow-2xl shadow-navilynx-primary/40 font-bold hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <Plus className="h-5 w-5 mr-3" />
                Add New
              </Button>
            </div>
          </div>

          {/* Enhanced Stats Overview */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Total Users",
                value: "12,486",
                change: "+12.5%",
                trend: "up",
                icon: Users,
                color: "from-navilynx-primary to-navilynx-secondary",
                bgColor: "from-purple-50 to-indigo-50"
              },
              {
                title: "Active Venues",
                value: "456",
                change: "+3.2%",
                trend: "up",
                icon: MapPin,
                color: "from-navilynx-secondary to-navilynx-accent",
                bgColor: "from-blue-50 to-purple-50"
              },
              {
                title: "Active Deals",
                value: "89",
                change: "-2.1%",
                trend: "down",
                icon: Tag,
                color: "from-emerald-500 to-teal-600",
                bgColor: "from-emerald-50 to-teal-50"
              },
              {
                title: "Revenue",
                value: "$24,580",
                change: "+18.7%",
                trend: "up",
                icon: DollarSign,
                color: "from-amber-500 to-orange-600",
                bgColor: "from-amber-50 to-orange-50"
              }
            ].map((stat, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-xl hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-40 group-hover:opacity-60 transition-opacity duration-500`}></div>
                
                {/* Floating animation dots */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-navilynx-primary/30 rounded-full animate-ping"></div>
                <div className="absolute top-6 right-8 w-1 h-1 bg-navilynx-secondary/40 rounded-full animate-pulse delay-300"></div>
                
                <CardContent className="relative z-10 p-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-4">
                      <p className="text-sm font-bold text-navilynx-gray-600 uppercase tracking-widest">{stat.title}</p>
                      <p className="text-4xl font-display font-black text-navilynx-dark group-hover:scale-110 transition-transform duration-300">{stat.value}</p>
                      <div className="flex items-center space-x-2">
                        {stat.trend === "up" ? (
                          <ArrowUp className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <ArrowDown className="h-5 w-5 text-red-500" />
                        )}
                        <span className={`text-sm font-bold ${
                          stat.trend === "up" ? "text-emerald-600" : "text-red-500"
                        }`}>
                          {stat.change}
                        </span>
                        <span className="text-sm text-navilynx-gray-600 font-semibold">vs last month</span>
                      </div>
                    </div>
                    <div className={`relative p-5 bg-gradient-to-br ${stat.color} rounded-3xl shadow-2xl group-hover:shadow-3xl group-hover:scale-110 transition-all duration-300`}>
                      <stat.icon className="h-10 w-10 text-white" />
                      {/* Glowing effect */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-3xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300`}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enhanced Charts and Activities Row */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Enhanced Recent Activity */}
            <Card className="col-span-2 border-0 shadow-2xl bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-xl overflow-hidden group">
              {/* Header with gradient */}
              <CardHeader className="pb-6 bg-gradient-to-r from-navilynx-primary/5 to-navilynx-secondary/5 border-b border-navilynx-purple-100">
                <CardTitle className="text-2xl font-display font-black text-navilynx-dark flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-navilynx-primary to-navilynx-secondary rounded-xl">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {[
                  { 
                    action: "New user registered", 
                    user: "Sarah Johnson", 
                    time: "2 minutes ago", 
                    icon: Users, 
                    color: "text-navilynx-primary",
                    bgColor: "from-purple-100 to-indigo-100"
                  },
                  { 
                    action: "Venue approved", 
                    user: "Westfield Mall", 
                    time: "15 minutes ago", 
                    icon: MapPin, 
                    color: "text-emerald-600",
                    bgColor: "from-emerald-100 to-teal-100"
                  },
                  { 
                    action: "Deal created", 
                    user: "Nike Store", 
                    time: "1 hour ago", 
                    icon: Tag, 
                    color: "text-navilynx-secondary",
                    bgColor: "from-blue-100 to-purple-100"
                  },
                  { 
                    action: "Support ticket resolved", 
                    user: "System", 
                    time: "2 hours ago", 
                    icon: MessageSquare, 
                    color: "text-amber-600",
                    bgColor: "from-amber-100 to-orange-100"
                  },
                  { 
                    action: "AR content updated", 
                    user: "Tech Team", 
                    time: "3 hours ago", 
                    icon: Globe, 
                    color: "text-navilynx-accent",
                    bgColor: "from-purple-100 to-pink-100"
                  },
                ].map((activity, index) => (
                  <div key={index} className="group/item flex items-center space-x-4 p-5 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-transparent hover:border-navilynx-purple-200/50 hover:bg-gradient-to-r hover:from-white hover:to-navilynx-purple-50/30">
                    <div className={`p-4 bg-gradient-to-r ${activity.bgColor} rounded-2xl shadow-lg group-hover/item:shadow-xl group-hover/item:scale-110 transition-all duration-300 border border-white/50`}>
                      <activity.icon className={`h-6 w-6 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-navilynx-dark group-hover/item:text-navilynx-primary transition-colors duration-300">{activity.action}</p>
                      <p className="text-sm text-navilynx-gray-600 truncate font-semibold">{activity.user}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-navilynx-gray-500 whitespace-nowrap font-semibold bg-navilynx-purple-50 px-3 py-1 rounded-full">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Enhanced System Status */}
            <Card className="col-span-1 border-0 shadow-2xl bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-xl overflow-hidden">
              <CardHeader className="pb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                <CardTitle className="text-2xl font-display font-black text-navilynx-dark flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <span>System Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {[
                  { name: "API Services", status: "operational", icon: Zap, color: "text-emerald-600" },
                  { name: "Database", status: "operational", icon: CheckCircle, color: "text-emerald-600" },
                  { name: "AR Engine", status: "operational", icon: Activity, color: "text-emerald-600" },
                  { name: "Payment Gateway", status: "maintenance", icon: Clock, color: "text-amber-600" },
                  { name: "Analytics", status: "operational", icon: BarChart3, color: "text-emerald-600" },
                ].map((service, index) => (
                  <div key={index} className="group/service flex items-center justify-between p-4 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-transparent hover:border-navilynx-purple-200/50 hover:bg-gradient-to-r hover:from-white hover:to-emerald-50/30">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gradient-to-r from-white to-emerald-50 rounded-xl shadow-md group-hover/service:shadow-lg group-hover/service:scale-110 transition-all duration-300">
                        <service.icon className={`h-5 w-5 ${service.color}`} />
                      </div>
                      <span className="font-bold text-navilynx-dark group-hover/service:text-navilynx-primary transition-colors duration-300">{service.name}</span>
                    </div>
                    <span className={`text-xs px-4 py-2 rounded-2xl font-bold transition-all duration-300 shadow-md ${
                      service.status === 'operational' 
                        ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-200'
                        : 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200'
                    }`}>
                      {service.status}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Quick Actions */}
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-xl overflow-hidden">
            <CardHeader className="pb-6 bg-gradient-to-r from-navilynx-primary/5 to-navilynx-secondary/5 border-b border-navilynx-purple-100">
              <CardTitle className="text-2xl font-display font-black text-navilynx-dark flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-navilynx-primary to-navilynx-secondary rounded-xl">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { 
                    icon: Users, 
                    title: "Add User", 
                    description: "Create new admin user", 
                    color: "from-navilynx-primary to-navilynx-secondary",
                    bgGradient: "from-purple-50 to-indigo-50",
                    hoverColor: "hover:from-purple-100 hover:to-indigo-100"
                  },
                  { 
                    icon: Building2, 
                    title: "Add Venue", 
                    description: "Register new venue", 
                    color: "from-navilynx-secondary to-navilynx-accent",
                    bgGradient: "from-blue-50 to-purple-50",
                    hoverColor: "hover:from-blue-100 hover:to-purple-100"
                  },
                  { 
                    icon: Tag, 
                    title: "Create Deal", 
                    description: "Launch new promotion", 
                    color: "from-emerald-500 to-teal-600",
                    bgGradient: "from-emerald-50 to-teal-50",
                    hoverColor: "hover:from-emerald-100 hover:to-teal-100"
                  },
                  { 
                    icon: Settings, 
                    title: "System Settings", 
                    description: "Configure platform", 
                    color: "from-slate-600 to-slate-700",
                    bgGradient: "from-slate-50 to-gray-50",
                    hoverColor: "hover:from-slate-100 hover:to-gray-100"
                  },
                ].map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className={`group relative h-auto p-6 flex flex-col items-start space-y-4 rounded-3xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border-2 border-transparent hover:border-navilynx-purple-200/50 bg-gradient-to-br ${action.bgGradient} ${action.hoverColor} shadow-lg hover:shadow-2xl`}
                  >
                    {/* Floating animation elements */}
                    <div className="absolute top-3 right-3 w-2 h-2 bg-navilynx-primary/20 rounded-full animate-pulse"></div>
                    <div className="absolute top-5 right-6 w-1 h-1 bg-navilynx-secondary/30 rounded-full animate-ping delay-500"></div>
                    
                    {/* Icon with enhanced styling */}
                    <div className={`relative p-4 bg-gradient-to-r ${action.color} rounded-2xl shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}>
                      <action.icon className="h-8 w-8 text-white" />
                      {/* Glowing effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${action.color} rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300`}></div>
                    </div>
                    
                    {/* Content */}
                    <div className="text-left space-y-2">
                      <p className="font-black text-navilynx-dark group-hover:text-navilynx-primary transition-colors duration-300 text-lg">{action.title}</p>
                      <p className="text-sm text-navilynx-gray-600 font-semibold group-hover:text-navilynx-gray-700 transition-colors duration-300">{action.description}</p>
                    </div>
                    
                    {/* Hover arrow indicator */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <ArrowUp className="h-4 w-4 text-navilynx-primary rotate-45" />
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
