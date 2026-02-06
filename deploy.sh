#!/bin/bash

# The Sovereign Agent OS - One-Click Deployment Script
# Usage: ./deploy.sh

set -e

echo "🦞 Initializing Sovereign Agent Protocol Deployment..."

# 1. Environment Check
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js (v18+) first."
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not found. Please install Python3 first."
    exit 1
fi

echo "✅ Environment check passed."

# 2. Dependency Installation
echo "📦 Installing Node.js dependencies..."
npm install @google/genai @anthropic-ai/sdk dotenv pm2

echo "📦 Installing Python dependencies..."
pip3 install requests pydantic --user

# 3. Configuration Setup
if [ ! -f .env ]; then
    echo "🔑 Configuring API Keys..."
    read -p "Enter your Google Gemini API Key: " GEMINI_KEY
    read -p "Enter your Anthropic API Key: " ANTHROPIC_KEY
    
    echo "GEMINI_API_KEY=$GEMINI_KEY" > .env
    echo "ANTHROPIC_API_KEY=$ANTHROPIC_KEY" >> .env
    echo "✅ .env file created."
else
    echo "ℹ️ .env file already exists. Skipping configuration."
fi

# 4. System Boot
echo "🚀 Booting up the Agent Swarm..."

# Use PM2 to keep the router alive
if command -v pm2 &> /dev/null; then
    pm2 start core/router.js --name "agent-router"
    echo "✅ Agent Router started in background via PM2."
    pm2 save
else
    echo "⚠️ PM2 not found globally. Running in foreground..."
    node core/router.js
fi

echo ""
echo "🦞 Deployment Complete. Your Sovereign Agent is alive."
echo "Monitor logs using: pm2 logs agent-router"
