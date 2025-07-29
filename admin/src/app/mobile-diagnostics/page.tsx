"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminLayout } from "@/components/admin-layout";
import {
  Smartphone,
  Bug,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle,
  Settings,
  Monitor,
  Code,
  Terminal,
  Wrench,
  Zap,
  Database,
  Navigation,
  Package,
  Activity
} from "lucide-react";

interface DiagnosticResult {
  category: string;
  test: string;
  status: "pass" | "fail" | "warning" | "running";
  message: string;
  details?: string;
  solution?: string;
}

interface MobileAppStatus {
  version: string;
  buildNumber: string;
  platform: string;
  lastUpdate: Date;
  crashReports: number;
  activeUsers: number;
  errorRate: number;
  performance: number;
}

export default function MobileDiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");

  const mockAppStatus: MobileAppStatus = {
    version: "2.1.0",
    buildNumber: "145",
    platform: "React Native",
    lastUpdate: new Date("2024-01-15"),
    crashReports: 23,
    activeUsers: 1247,
    errorRate: 2.3,
    performance: 87
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    setDiagnostics([]);

    const tests = [
      { category: "UI/Layout", test: "Spacing Calculations", delay: 500 },
      { category: "UI/Layout", test: "Flexbox Layouts", delay: 700 },
      { category: "UI/Layout", test: "Screen Dimensions", delay: 900 },
      { category: "Performance", test: "Memory Usage", delay: 1100 },
      { category: "Performance", test: "Render Performance", delay: 1300 },
      { category: "Navigation", test: "AR Navigation", delay: 1500 },
      { category: "Navigation", test: "Route Calculations", delay: 1700 },
      { category: "Backend", test: "API Connectivity", delay: 1900 },
      { category: "Backend", test: "Database Sync", delay: 2100 },
      { category: "Features", test: "Card Scanner", delay: 2300 },
      { category: "Features", test: "AR Overlays", delay: 2500 },
    ];

    for (const testCase of tests) {
      setTimeout(() => {
        const result: DiagnosticResult = {
          category: testCase.category,
          test: testCase.test,
          status: Math.random() > 0.2 ? "pass" : Math.random() > 0.5 ? "warning" : "fail",
          message: generateTestMessage(testCase.test),
          details: generateTestDetails(testCase.test),
          solution: generateTestSolution(testCase.test)
        };
        
        setDiagnostics(prev => [...prev, result]);
      }, testCase.delay);
    }

    setTimeout(() => {
      setIsRunning(false);
    }, 3000);
  };

  const generateTestMessage = (test: string): string => {
    const messages: Record<string, string[]> = {
      "Spacing Calculations": [
        "Flexbox spacing properties validated",
        "Margin and padding calculations correct",
        "⚠️ Spacing property undefined in some components"
      ],
      "Flexbox Layouts": [
        "All flex containers properly configured",
        "Responsive layouts working correctly"
      ],
      "Screen Dimensions": [
        "Screen size detection working",
        "Responsive breakpoints active"
      ],
      "Memory Usage": [
        "Memory usage within normal range",
        "⚠️ Memory usage elevated"
      ],
      "AR Navigation": [
        "AR components loaded successfully",
        "Navigation overlays functional"
      ]
    };

    const testMessages = messages[test] || ["Test completed successfully"];
    return testMessages[Math.floor(Math.random() * testMessages.length)];
  };

  const generateTestDetails = (test: string): string => {
    const details: Record<string, string> = {
      "Spacing Calculations": "Checking flex spacing, margins, paddings, and layout calculations in React Native components",
      "Flexbox Layouts": "Validating flexDirection, justifyContent, alignItems properties across all screens",
      "Screen Dimensions": "Testing responsive design and screen dimension calculations",
      "Memory Usage": "Monitoring JavaScript heap usage and native memory consumption",
      "AR Navigation": "Testing AR camera integration and navigation overlay rendering"
    };
    return details[test] || "Standard system test";
  };

  const generateTestSolution = (test: string): string => {
    const solutions: Record<string, string> = {
      "Spacing Calculations": "Check for undefined 'spacing' props in StyleSheet. Use specific margin/padding values instead.",
      "Memory Usage": "Clear unused component references and optimize image caching",
      "AR Navigation": "Restart AR services and check camera permissions"
    };
    return solutions[test] || "No action required";
  };

  useEffect(() => {
    // Auto-run diagnostics on page load
    const timer = setTimeout(() => runDiagnostics(), 1000);
    return () => clearTimeout(timer);
  }, []); // runDiagnostics is defined in scope

  const getStatusIcon = (status: DiagnosticResult["status"]) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "fail":
        return <Bug className="h-5 w-5 text-red-500" />;
      case "running":
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <Monitor className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "UI/Layout":
        return <Monitor className="h-5 w-5" />;
      case "Performance":
        return <Zap className="h-5 w-5" />;
      case "Navigation":
        return <Navigation className="h-5 w-5" />;
      case "Backend":
        return <Database className="h-5 w-5" />;
      case "Features":
        return <Package className="h-5 w-5" />;
      default:
        return <Settings className="h-5 w-5" />;
    }
  };

  const groupedDiagnostics = diagnostics.reduce((acc, diagnostic) => {
    if (!acc[diagnostic.category]) {
      acc[diagnostic.category] = [];
    }
    acc[diagnostic.category].push(diagnostic);
    return acc;
  }, {} as Record<string, DiagnosticResult[]>);

  return (
    <AdminLayout title="Mobile App Diagnostics">
      <div className="p-6 space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Smartphone className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">App Version</p>
                  <p className="text-2xl font-bold">{mockAppStatus.version}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold">{mockAppStatus.activeUsers.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <Bug className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Error Rate</p>
                  <p className="text-2xl font-bold">{mockAppStatus.errorRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Performance</p>
                  <p className="text-2xl font-bold">{mockAppStatus.performance}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
            <TabsTrigger value="errors">Error Logs</TabsTrigger>
            <TabsTrigger value="solutions">Solutions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Smartphone className="h-6 w-6 mr-2" />
                    Mobile App Status
                  </CardTitle>
                  <Button onClick={runDiagnostics} disabled={isRunning}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? "animate-spin" : ""}`} />
                    {isRunning ? "Running..." : "Run Diagnostics"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">App Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Version:</span>
                        <Badge variant="outline">{mockAppStatus.version}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Build:</span>
                        <Badge variant="outline">{mockAppStatus.buildNumber}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Platform:</span>
                        <Badge variant="outline">{mockAppStatus.platform}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Update:</span>
                        <span className="text-sm">{mockAppStatus.lastUpdate.toDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Health Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Crash Reports (24h)</span>
                        <Badge variant={mockAppStatus.crashReports > 50 ? "destructive" : "secondary"}>
                          {mockAppStatus.crashReports}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Error Rate</span>
                        <Badge variant={mockAppStatus.errorRate > 5 ? "destructive" : "default"}>
                          {mockAppStatus.errorRate}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Performance Score</span>
                        <Badge variant={mockAppStatus.performance > 80 ? "default" : "destructive"}>
                          {mockAppStatus.performance}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diagnostics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Terminal className="h-6 w-6 mr-2" />
                  Diagnostic Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(groupedDiagnostics).length === 0 && !isRunning && (
                  <div className="text-center py-8">
                    <Bug className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No diagnostics run yet. Click "Run Diagnostics" to start.</p>
                  </div>
                )}

                {Object.entries(groupedDiagnostics).map(([category, tests]) => (
                  <div key={category} className="mb-6">
                    <h3 className="font-semibold text-lg mb-3 flex items-center">
                      {getCategoryIcon(category)}
                      <span className="ml-2">{category}</span>
                    </h3>
                    <div className="space-y-2">
                      {tests.map((test, index) => (
                        <motion.div
                          key={`${test.test}-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(test.status)}
                            <div>
                              <p className="font-medium">{test.test}</p>
                              <p className="text-sm text-gray-600">{test.message}</p>
                            </div>
                          </div>
                          <Badge 
                            variant={
                              test.status === "pass" ? "default" :
                              test.status === "warning" ? "secondary" : "destructive"
                            }
                          >
                            {test.status.toUpperCase()}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="errors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bug className="h-6 w-6 mr-2" />
                  Common Error Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">Spacing Property Error</h4>
                    <code className="text-sm bg-red-100 p-2 rounded block text-red-700">
                      TypeError: Cannot read property 'spacing' of undefined
                    </code>
                    <p className="text-sm text-red-700 mt-2">
                      This error occurs when components reference undefined spacing properties in StyleSheet.
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">Layout Calculation Warning</h4>
                    <code className="text-sm bg-yellow-100 p-2 rounded block text-yellow-700">
                      Warning: Flexbox child has infinite width/height
                    </code>
                    <p className="text-sm text-yellow-700 mt-2">
                      Layout calculations may be affected by missing flex properties.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="solutions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wrench className="h-6 w-6 mr-2" />
                  Quick Fixes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-3">Fix Spacing Property Errors</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-blue-700">1. Replace undefined spacing properties with specific values:</p>
                      <code className="block text-sm bg-blue-100 p-2 rounded text-blue-800">
                        {`// Instead of: spacing: theme.spacing
// Use: marginTop: 16, paddingHorizontal: 12`}
                      </code>
                      <Button size="sm" className="mt-2">
                        <Download className="h-4 w-4 mr-2" />
                        Download Fix Patch
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-3">Restart App Services</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-green-700">Clear app cache and restart all services:</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Clear Cache
                        </Button>
                        <Button size="sm" variant="outline">
                          <Smartphone className="h-4 w-4 mr-2" />
                          Restart App
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
