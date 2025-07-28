import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Shield,
  Clock,
  UserCheck,
  UserX,
  Mail,
  Phone,
  TrendingUp,
  Activity,
  Calendar,
} from "lucide-react";

const mockUsers = [
  {
    id: "1",
    email: "admin@navilynx.com",
    username: "admin",
    firstName: "John",
    lastName: "Administrator",
    role: "admin" as const,
    status: "active" as const,
    avatar: null,
    phone: "+1-555-0123",
    lastLogin: new Date("2025-01-29T10:30:00Z"),
    createdAt: new Date("2024-01-15T09:00:00Z"),
    department: "IT",
    position: "System Administrator",
  },
  {
    id: "2",
    email: "sarah.manager@navilynx.com",
    username: "sarah_m",
    firstName: "Sarah",
    lastName: "Johnson",
    role: "manager" as const,
    status: "active" as const,
    avatar: null,
    phone: "+1-555-0124",
    lastLogin: new Date("2025-01-29T08:15:00Z"),
    createdAt: new Date("2024-02-20T14:30:00Z"),
    department: "Operations",
    position: "Operations Manager",
  },
  {
    id: "3",
    email: "mike.moderator@navilynx.com",
    username: "mike_mod",
    firstName: "Mike",
    lastName: "Chen",
    role: "moderator" as const,
    status: "active" as const,
    avatar: null,
    phone: "+1-555-0125",
    lastLogin: new Date("2025-01-28T16:45:00Z"),
    createdAt: new Date("2024-03-10T11:20:00Z"),
    department: "Support",
    position: "Content Moderator",
  },
  {
    id: "4",
    email: "emma.viewer@navilynx.com",
    username: "emma_v",
    firstName: "Emma",
    lastName: "Wilson",
    role: "viewer" as const,
    status: "inactive" as const,
    avatar: null,
    phone: "+1-555-0126",
    lastLogin: new Date("2025-01-25T13:20:00Z"),
    createdAt: new Date("2024-04-05T10:15:00Z"),
    department: "Analytics",
    position: "Data Analyst",
  },
  {
    id: "5",
    email: "david.support@navilynx.com",
    username: "david_s",
    firstName: "David",
    lastName: "Park",
    role: "moderator" as const,
    status: "pending" as const,
    avatar: null,
    phone: "+1-555-0127",
    lastLogin: null,
    createdAt: new Date("2025-01-28T15:30:00Z"),
    department: "Support",
    position: "Customer Support",
  },
];

function getRoleBadgeVariant(role: string) {
  switch (role) {
    case "admin":
      return "destructive";
    case "manager":
      return "default";
    case "moderator":
      return "secondary";
    case "viewer":
      return "outline";
    default:
      return "outline";
  }
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "active":
      return "success";
    case "inactive":
      return "secondary";
    case "pending":
      return "warning";
    case "suspended":
      return "destructive";
    default:
      return "outline";
  }
}

function formatRelativeTime(date: Date | null) {
  if (!date) return "Never";
  
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
}

export default function UsersPage() {
  return (
    <AdminLayout userRole="admin">
      <div className="space-y-6">
        {/* Enhanced Page Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-navilynx-primary/10 via-navilynx-secondary/10 to-navilynx-accent/10 rounded-2xl p-8 border border-navilynx-primary/20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-navilynx-purple-50/80 backdrop-blur-sm"></div>
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-purple rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gradient-purple mb-2">User Management</h1>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Manage admin users and their permissions across the NaviLynx platform with advanced controls and analytics.
                </p>
              </div>
            </div>
            <div className="mt-6 sm:mt-0 flex space-x-3">
              <Button variant="outline" size="sm" className="glass-effect hover:shadow-purple-soft transition-all duration-300">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" className="gradient-purple hover:shadow-purple-medium transition-all duration-300 transform hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Overview with Animations */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="relative group card-hover overflow-hidden border-navilynx-primary/20">
            <div className="absolute inset-0 bg-gradient-to-br from-navilynx-primary/5 to-navilynx-secondary/5"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{mockUsers.length}</p>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600 font-medium">+12%</span>
                    <span className="text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-gradient-purple rounded-xl flex items-center justify-center shadow-lg card-glow">
                  <Users className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </CardContent>
          </Card>

          <Card className="relative group card-hover overflow-hidden border-green-200">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Users</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {mockUsers.filter(u => u.status === "active").length}
                  </p>
                  <div className="flex items-center text-sm">
                    <Activity className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600 font-medium">98.5%</span>
                    <span className="text-gray-500 ml-1">uptime</span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg card-glow">
                  <UserCheck className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </CardContent>
          </Card>

          <Card className="relative group card-hover overflow-hidden border-yellow-200">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Pending Users</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {mockUsers.filter(u => u.status === "pending").length}
                  </p>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-yellow-600 font-medium">2 today</span>
                    <span className="text-gray-500 ml-1">awaiting review</span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg card-glow">
                  <Clock className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </CardContent>
          </Card>

                    <Card className="relative group card-hover overflow-hidden border-red-200">
            <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-pink-50"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Inactive Users</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {mockUsers.filter(u => u.status === "inactive").length}
                  </p>
                  <div className="flex items-center text-sm">
                    <Shield className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-red-600 font-medium">Security</span>
                    <span className="text-gray-500 ml-1">reviewed</span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg card-glow">
                  <UserX className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Filters and Search */}
        <Card className="glass-effect border-navilynx-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navilynx-primary" />
                  <Input
                    placeholder="Search users by name, email, or role..."
                    className="w-80 pl-10 border-navilynx-primary/30 focus:border-navilynx-primary focus:ring-navilynx-primary/20"
                  />
                </div>
                <Button variant="outline" size="sm" className="border-navilynx-primary/30 hover:bg-navilynx-primary/10">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-600">Sort by:</span>
                <select className="text-sm border border-navilynx-primary/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-navilynx-primary/20 focus:border-navilynx-primary bg-white">
                  <option>Created Date</option>
                  <option>Last Login</option>
                  <option>Name</option>
                  <option>Role</option>
                  <option>Status</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactive Users</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {mockUsers.filter(u => u.status === "inactive").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <UserX className="h-6 w-6 text-gray-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
                    placeholder="Search users..."
                    className="w-64 pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-navilynx-primary">
                  <option>Created Date</option>
                  <option>Last Login</option>
                  <option>Name</option>
                  <option>Role</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-navilynx-primary" />
              Admin Users ({mockUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Last Login</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Created</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map((user, index) => (
                    <tr key={user.id} className={`border-b border-gray-100 hover:bg-gray-50 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-navilynx-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {user.firstName[0]}{user.lastName[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </p>
                            <div className="flex items-center space-x-2 text-gray-500 text-xs">
                              <Mail className="h-3 w-3" />
                              <span>{user.email}</span>
                            </div>
                            {user.phone && (
                              <div className="flex items-center space-x-2 text-gray-500 text-xs">
                                <Phone className="h-3 w-3" />
                                <span>{user.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={getStatusBadgeVariant(user.status)}>
                          {user.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{user.department}</p>
                          <p className="text-gray-500 text-xs">{user.position}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-600">
                          {formatRelativeTime(user.lastLogin)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-600">
                          {user.createdAt.toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing 1 to {mockUsers.length} of {mockUsers.length} results
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-navilynx-primary text-white">
                  1
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
