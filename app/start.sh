#!/bin/bash

# DevOps Bootcamp Server Startup Script

echo "🚀 Starting DevOps Bootcamp Server..."
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🌟 Starting server on port 3000..."
echo "📱 Open your browser and go to: http://localhost:3000"
echo "🛑 Press Ctrl+C to stop the server"
echo "=================================="

node server.js
