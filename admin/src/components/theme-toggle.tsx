'use client'

import React from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/providers/theme-provider'

export function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-9 w-9 rounded-xl hover:bg-purple-100/80 dark:hover:bg-purple-900/50 transition-all duration-200"
        >
          {actualTheme === 'light' ? (
            <Sun className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          ) : (
            <Moon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-800 shadow-lg"
      >
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className="hover:bg-purple-50 dark:hover:bg-purple-900/50 cursor-pointer"
        >
          <Sun className="mr-2 h-4 w-4 text-purple-600" />
          <span className="text-gray-900 dark:text-gray-100">Light</span>
          {theme === 'light' && (
            <div className="ml-auto h-2 w-2 bg-purple-600 rounded-full" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className="hover:bg-purple-50 dark:hover:bg-purple-900/50 cursor-pointer"
        >
          <Moon className="mr-2 h-4 w-4 text-purple-600" />
          <span className="text-gray-900 dark:text-gray-100">Dark</span>
          {theme === 'dark' && (
            <div className="ml-auto h-2 w-2 bg-purple-600 rounded-full" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className="hover:bg-purple-50 dark:hover:bg-purple-900/50 cursor-pointer"
        >
          <Monitor className="mr-2 h-4 w-4 text-purple-600" />
          <span className="text-gray-900 dark:text-gray-100">System</span>
          {theme === 'system' && (
            <div className="ml-auto h-2 w-2 bg-purple-600 rounded-full" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
