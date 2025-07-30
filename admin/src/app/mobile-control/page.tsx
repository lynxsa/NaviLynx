'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Smartphone,
  Settings,
  Users,
  Activity,
  Palette,
  Shield,
  Zap,
  BarChart3,
  Camera,
  Speaker,
  Navigation,
  Download,
  Bell,
  Eye,
  Lock,
  Gauge,
  RefreshCw,
  Save,
  AlertTriangle,
  CheckCircle,
  Globe,
  Monitor,
  Moon,
  Sun,
  Paintbrush,
  Sliders,
  Database,
  Cloud,
  Timer,
  Image,
  Cpu,
  Wifi
} from "lucide-react"

interface MobileConfig {
  features: {
    arNavigation: boolean;
    voiceGuidance: boolean;
    offlineMode: boolean;
    betaFeatures: boolean;
    debugMode: boolean;
  };
  ui: {
    theme: 'light' | 'dark' | 'auto';
    primaryColor: string;
    accentColor: string;
    borderRadius: 'sm' | 'md' | 'lg' | 'xl';
    fontScale: number;
    animationSpeed: 'slow' | 'normal' | 'fast';
  };
  content: {
    maxVenues: number;
    maxDeals: number;
    maxArticles: number;
    refreshInterval: number;
    cacheTimeout: number;
  };
  analytics: {
    enabled: boolean;
    level: 'basic' | 'detailed' | 'comprehensive';
    retention: number;
    exportEnabled: boolean;
  };
  security: {
    requireAuth: boolean;
    biometricEnabled: boolean;
    sessionTimeout: number;
    dataEncryption: boolean;
  };
  performance: {
    imageQuality: 'low' | 'medium' | 'high';
    preloadContent: boolean;
    backgroundSync: boolean;
    compressionLevel: number;
  };
}

const defaultConfig: MobileConfig = {
  features: {
    arNavigation: true,
    voiceGuidance: true,
    offlineMode: false,
    betaFeatures: false,
    debugMode: false,
  },
  ui: {
    theme: 'auto',
    primaryColor: '#8B5CF6',
    accentColor: '#7C3AED',
    borderRadius: 'lg',
    fontScale: 1.0,
    animationSpeed: 'normal',
  },
  content: {
    maxVenues: 100,
    maxDeals: 50,
    maxArticles: 25,
    refreshInterval: 300000,
    cacheTimeout: 3600000,
  },
  analytics: {
    enabled: true,
    level: 'detailed',
    retention: 30,
    exportEnabled: true,
  },
  security: {
    requireAuth: false,
    biometricEnabled: true,
    sessionTimeout: 30,
    dataEncryption: true,
  },
  performance: {
    imageQuality: 'medium',
    preloadContent: true,
    backgroundSync: true,
    compressionLevel: 0.8,
  },
};

export default function MobileAppControlPage() {
  const [config, setConfig] = useState<MobileConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Load configuration on mount
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/mobile-config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    }
  };

  const saveConfig = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/mobile-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        setLastSaved(new Date());
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Failed to save config:', error);
    }
    setIsLoading(false);
  };

  const updateConfig = (section: keyof MobileConfig, key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const resetToDefaults = () => {
    setConfig(defaultConfig);
    setHasChanges(true);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50/80 via-indigo-50/60 to-purple-100/40 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur border-b border-purple-200/60 dark:bg-gray-800/90 dark:border-purple-700/60">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-2xl">
                  <Smartphone className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-800 via-indigo-700 to-purple-600 bg-clip-text text-transparent dark:from-purple-400 dark:via-indigo-300 dark:to-purple-200">
                    Mobile App Control Center
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Comprehensive control over mobile app features, UI, and performance
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {hasChanges && (
                  <Badge variant="outline" className="border-orange-300 text-orange-700 dark:border-orange-600 dark:text-orange-400">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Unsaved Changes
                  </Badge>
                )}
                
                {lastSaved && (
                  <Badge variant="outline" className="border-green-300 text-green-700 dark:border-green-600 dark:text-green-400">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Saved {lastSaved.toLocaleTimeString()}
                  </Badge>
                )}
                
                <Button
                  variant="outline"
                  onClick={resetToDefaults}
                  className="border-slate-300 dark:border-gray-600"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                
                <Button
                  onClick={saveConfig}
                  disabled={isLoading || !hasChanges}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Tabs defaultValue="features" className="space-y-6">
            <TabsList className="grid grid-cols-6 w-full bg-white/50 dark:bg-gray-800/50 backdrop-blur">
              <TabsTrigger value="features" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Features</span>
              </TabsTrigger>
              <TabsTrigger value="ui" className="flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <span>UI/UX</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <span>Content</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Security</span>
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Performance</span>
              </TabsTrigger>
            </TabsList>

            {/* Features Tab */}
            <TabsContent value="features">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* AR Navigation */}
                <Card className="bg-white/90 backdrop-blur border border-purple-200/60 dark:bg-gray-800/90 dark:border-purple-700/60">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                        <Camera className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg dark:text-white">AR Navigation</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Augmented reality features</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium dark:text-gray-200">Enable AR Navigation</span>
                      <Switch
                        checked={config.features.arNavigation}
                        onCheckedChange={(checked) => updateConfig('features', 'arNavigation', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Voice Guidance */}
                <Card className="bg-white/90 backdrop-blur border border-purple-200/60 dark:bg-gray-800/90 dark:border-purple-700/60">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                        <Speaker className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg dark:text-white">Voice Guidance</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Audio navigation instructions</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium dark:text-gray-200">Enable Voice Guidance</span>
                      <Switch
                        checked={config.features.voiceGuidance}
                        onCheckedChange={(checked) => updateConfig('features', 'voiceGuidance', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Offline Mode */}
                <Card className="bg-white/90 backdrop-blur border border-purple-200/60 dark:bg-gray-800/90 dark:border-purple-700/60">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                        <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg dark:text-white">Offline Mode</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Offline navigation capability</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium dark:text-gray-200">Enable Offline Mode</span>
                      <Switch
                        checked={config.features.offlineMode}
                        onCheckedChange={(checked) => updateConfig('features', 'offlineMode', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Beta Features */}
                <Card className="bg-white/90 backdrop-blur border border-purple-200/60 dark:bg-gray-800/90 dark:border-purple-700/60">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                        <Eye className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg dark:text-white">Beta Features</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Experimental functionality</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium dark:text-gray-200">Enable Beta Features</span>
                      <Switch
                        checked={config.features.betaFeatures}
                        onCheckedChange={(checked) => updateConfig('features', 'betaFeatures', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Debug Mode */}
                <Card className="bg-white/90 backdrop-blur border border-purple-200/60 dark:bg-gray-800/90 dark:border-purple-700/60">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                        <Activity className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg dark:text-white">Debug Mode</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Development tools</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium dark:text-gray-200">Enable Debug Mode</span>
                      <Switch
                        checked={config.features.debugMode}
                        onCheckedChange={(checked) => updateConfig('features', 'debugMode', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* UI/UX Tab */}
            <TabsContent value="ui">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Theme Settings */}
                <Card className="bg-white/90 backdrop-blur border border-purple-200/60 dark:bg-gray-800/90 dark:border-purple-700/60">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 dark:text-white">
                      <Monitor className="h-5 w-5" />
                      <span>Theme Settings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium dark:text-gray-200">App Theme</label>
                      <Select
                        value={config.ui.theme}
                        onValueChange={(value) => updateConfig('ui', 'theme', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">
                            <div className="flex items-center space-x-2">
                              <Sun className="h-4 w-4" />
                              <span>Light</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="dark">
                            <div className="flex items-center space-x-2">
                              <Moon className="h-4 w-4" />
                              <span>Dark</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="auto">
                            <div className="flex items-center space-x-2">
                              <Monitor className="h-4 w-4" />
                              <span>Auto</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium dark:text-gray-200">Border Radius</label>
                      <Select
                        value={config.ui.borderRadius}
                        onValueChange={(value) => updateConfig('ui', 'borderRadius', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sm">Small</SelectItem>
                          <SelectItem value="md">Medium</SelectItem>
                          <SelectItem value="lg">Large</SelectItem>
                          <SelectItem value="xl">Extra Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium dark:text-gray-200">Animation Speed</label>
                      <Select
                        value={config.ui.animationSpeed}
                        onValueChange={(value) => updateConfig('ui', 'animationSpeed', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="slow">Slow</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="fast">Fast</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Color Settings */}
                <Card className="bg-white/90 backdrop-blur border border-purple-200/60 dark:bg-gray-800/90 dark:border-purple-700/60">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 dark:text-white">
                      <Paintbrush className="h-5 w-5" />
                      <span>Color Settings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium dark:text-gray-200">Primary Color</label>
                      <div className="flex items-center space-x-3 mt-2">
                        <input
                          type="color"
                          value={config.ui.primaryColor}
                          onChange={(e) => updateConfig('ui', 'primaryColor', e.target.value)}
                          className="w-12 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600"
                        />
                        <input
                          type="text"
                          value={config.ui.primaryColor}
                          onChange={(e) => updateConfig('ui', 'primaryColor', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium dark:text-gray-200">Accent Color</label>
                      <div className="flex items-center space-x-3 mt-2">
                        <input
                          type="color"
                          value={config.ui.accentColor}
                          onChange={(e) => updateConfig('ui', 'accentColor', e.target.value)}
                          className="w-12 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600"
                        />
                        <input
                          type="text"
                          value={config.ui.accentColor}
                          onChange={(e) => updateConfig('ui', 'accentColor', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium dark:text-gray-200">
                        Font Scale: {config.ui.fontScale.toFixed(1)}x
                      </label>
                      <Slider
                        value={[config.ui.fontScale]}
                        onValueChange={([value]) => updateConfig('ui', 'fontScale', value)}
                        min={0.8}
                        max={1.4}
                        step={0.1}
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Additional tabs would continue here with similar structure... */}
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
}
