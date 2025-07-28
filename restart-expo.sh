#!/bin/bash

# Kill any existing Expo processes
pkill -f "expo start" 2>/dev/null || true
pkill -f "metro" 2>/dev/null || true

# Clear cache
npm start cache clean 2>/dev/null || true

# Wait a moment
sleep 2

# Start Expo with clear cache
npx expo start --clear --reset-cache --port 8081
