'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Settings,
  Save,
  Shield,
  Bell,
  Globe,
  Database,
  Key,
  Mail,
  Smartphone,
  Monitor,
  Palette,
  Lock,
  Users,
  MapPin,
  Zap,
  Download,
  AlertTriangle,
  Info,
  Moon,
  Sun,
  Eye,
  EyeOff
} from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [showApiKeys, setShowApiKeys] = useState(false)
  const [settings, setSettings] = useState({
    general: {
      siteName: 'NaviLynx Admin',
      siteDescription: 'Advanced navigation and AR experiences',
      contactEmail: 'admin@navilynx.com',
      timezone: 'UTC',
      language: 'en',
      maintenanceMode: false
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      weeklyReports: true,
      securityAlerts: true,
      userRegistrations: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 120,
      passwordExpiry: 90,
      loginAttempts: 5,
      ipWhitelist: '',
      encryptionLevel: 'AES-256'
    },
    appearance: {
      darkMode: false,
      compactView: false,
      animationsEnabled: true,
      autoTheme: true
    },
    api: {
      googleMapsKey: 'sk-••••••••••••••••••••••••••••••••',
      openaiKey: 'sk-••••••••••••••••••••••••••••••••',
      stripeKey: 'sk_test_••••••••••••••••••••••••••••',
      firebaseKey: 'AIza••••••••••••••••••••••••••••••'
    }
  })

  const updateSetting = (category: string, key: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }))
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'api', label: 'API Keys', icon: Key },
  ]

  return (
    <AdminLayout>
      <div className="p-8 max-w-8xl mx-auto space-y-8 bg-gradient-to-br from-slate-50/50 via-purple-50/20 to-indigo-50/10 min-h-screen">
        {/* Enhanced Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-700 via-gray-800 to-slate-900 p-8 shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <Settings className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">System Settings</h1>
                    <p className="text-gray-300 text-lg font-medium">Configure your admin dashboard preferences</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 transition-all duration-300 hover:scale-105 shadow-lg">
                  <Download className="h-5 w-5 mr-2" />
                  Export Config
                </Button>
                <Button className="bg-emerald-500/80 backdrop-blur-sm hover:bg-emerald-500 text-white transition-all duration-300 hover:scale-105 shadow-lg">
                  <Save className="h-5 w-5 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-1 space-y-2"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-left transition-all duration-300 hover:scale-[1.02] ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-[1.02]'
                      : 'bg-white/80 hover:bg-white text-gray-700 hover:shadow-md'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="font-semibold">{tab.label}</span>
                </button>
              )
            })}
          </motion.div>

          {/* Enhanced Settings Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="lg:col-span-3"
          >
            {activeTab === 'general' && (
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
                <CardHeader className="pb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl">
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <Settings className="h-7 w-7 text-blue-600" />
                    General Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="siteName" className="text-lg font-semibold text-gray-700">Site Name</Label>
                      <Input
                        id="siteName"
                        value={settings.general.siteName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSetting('general', 'siteName', e.target.value)}
                        className="h-12 text-lg border-2 border-gray-200 focus:border-purple-500 rounded-xl"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="contactEmail" className="text-lg font-semibold text-gray-700">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={settings.general.contactEmail}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSetting('general', 'contactEmail', e.target.value)}
                        className="h-12 text-lg border-2 border-gray-200 focus:border-purple-500 rounded-xl"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="siteDescription" className="text-lg font-semibold text-gray-700">Site Description</Label>
                    <Textarea
                      id="siteDescription"
                      value={settings.general.siteDescription}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateSetting('general', 'siteDescription', e.target.value)}
                      className="min-h-[120px] text-lg border-2 border-gray-200 focus:border-purple-500 rounded-xl"
                    />
                  </div>

                  <div className="flex items-center justify-between p-6 bg-orange-50 rounded-2xl border border-orange-200">
                    <div className="flex items-center gap-4">
                      <AlertTriangle className="h-8 w-8 text-orange-600" />
                      <div>
                        <Label className="text-lg font-semibold text-orange-800">Maintenance Mode</Label>
                        <p className="text-orange-600 text-sm">Temporarily disable user access</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.general.maintenanceMode}
                      onCheckedChange={(checked: boolean) => updateSetting('general', 'maintenanceMode', checked)}
                      className="data-[state=checked]:bg-orange-500"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
                <CardHeader className="pb-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl">
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <Bell className="h-7 w-7 text-green-600" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
                      <div className="flex items-center gap-4">
                        {key === 'emailNotifications' && <Mail className="h-6 w-6 text-blue-600" />}
                        {key === 'pushNotifications' && <Smartphone className="h-6 w-6 text-purple-600" />}
                        {key === 'smsNotifications' && <Smartphone className="h-6 w-6 text-green-600" />}
                        {key === 'weeklyReports' && <Download className="h-6 w-6 text-orange-600" />}
                        {key === 'securityAlerts' && <Shield className="h-6 w-6 text-red-600" />}
                        {key === 'userRegistrations' && <Users className="h-6 w-6 text-indigo-600" />}
                        <div>
                          <Label className="text-lg font-semibold text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </Label>
                          <p className="text-gray-500 text-sm">
                            {key === 'emailNotifications' && 'Receive notifications via email'}
                            {key === 'pushNotifications' && 'Browser push notifications'}
                            {key === 'smsNotifications' && 'Text message alerts'}
                            {key === 'weeklyReports' && 'Weekly analytics summary'}
                            {key === 'securityAlerts' && 'Critical security notifications'}
                            {key === 'userRegistrations' && 'New user signup alerts'}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={value as boolean}
                        onCheckedChange={(checked: boolean) => updateSetting('notifications', key, checked)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
                <CardHeader className="pb-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-t-xl">
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <Shield className="h-7 w-7 text-red-600" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="flex items-center justify-between p-6 bg-red-50 rounded-2xl border border-red-200">
                    <div className="flex items-center gap-4">
                      <Lock className="h-8 w-8 text-red-600" />
                      <div>
                        <Label className="text-lg font-semibold text-red-800">Two-Factor Authentication</Label>
                        <p className="text-red-600 text-sm">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.security.twoFactorAuth}
                      onCheckedChange={(checked: boolean) => updateSetting('security', 'twoFactorAuth', checked)}
                      className="data-[state=checked]:bg-red-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-lg font-semibold text-gray-700">Session Timeout (minutes)</Label>
                      <Input
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                        className="h-12 text-lg border-2 border-gray-200 focus:border-red-500 rounded-xl"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-lg font-semibold text-gray-700">Max Login Attempts</Label>
                      <Input
                        type="number"
                        value={settings.security.loginAttempts}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSetting('security', 'loginAttempts', parseInt(e.target.value))}
                        className="h-12 text-lg border-2 border-gray-200 focus:border-red-500 rounded-xl"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'appearance' && (
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
                <CardHeader className="pb-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <Palette className="h-7 w-7 text-purple-600" />
                    Appearance & Theme
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {Object.entries(settings.appearance).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
                      <div className="flex items-center gap-4">
                        {key === 'darkMode' && <Moon className="h-6 w-6 text-gray-700" />}
                        {key === 'compactView' && <Monitor className="h-6 w-6 text-blue-600" />}
                        {key === 'animationsEnabled' && <Zap className="h-6 w-6 text-yellow-600" />}
                        {key === 'autoTheme' && <Sun className="h-6 w-6 text-orange-600" />}
                        <div>
                          <Label className="text-lg font-semibold text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </Label>
                          <p className="text-gray-500 text-sm">
                            {key === 'darkMode' && 'Use dark color scheme'}
                            {key === 'compactView' && 'Reduce spacing and padding'}
                            {key === 'animationsEnabled' && 'Enable smooth animations'}
                            {key === 'autoTheme' && 'Follow system theme preference'}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={value as boolean}
                        onCheckedChange={(checked) => updateSetting('appearance', key, checked)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeTab === 'api' && (
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
                <CardHeader className="pb-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-t-xl">
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <Key className="h-7 w-7 text-yellow-600" />
                    API Keys & Integrations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Info className="h-6 w-6 text-blue-600" />
                      <span className="text-blue-800 font-medium">Click the eye icon to reveal API keys</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowApiKeys(!showApiKeys)}
                      className="border-blue-300 text-blue-700 hover:bg-blue-100"
                    >
                      {showApiKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {Object.entries(settings.api).map(([key, value]) => (
                      <div key={key} className="space-y-3">
                        <Label className="text-lg font-semibold text-gray-700 capitalize flex items-center gap-2">
                          {key === 'googleMapsKey' && <MapPin className="h-5 w-5 text-red-500" />}
                          {key === 'openaiKey' && <Zap className="h-5 w-5 text-green-500" />}
                          {key === 'stripeKey' && <Globe className="h-5 w-5 text-blue-500" />}
                          {key === 'firebaseKey' && <Database className="h-5 w-5 text-orange-500" />}
                          {key.replace(/([A-Z])/g, ' $1').replace('Key', ' API Key').trim()}
                        </Label>
                        <Input
                          type={showApiKeys ? "text" : "password"}
                          value={value as string}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSetting('api', key, e.target.value)}
                          className="h-12 text-lg font-mono border-2 border-gray-200 focus:border-yellow-500 rounded-xl"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  )
}
