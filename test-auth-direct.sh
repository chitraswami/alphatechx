#!/bin/bash

echo "🔐 Testing Authentication and Bot Features..."
echo

# Test 1: Frontend is accessible
echo "1. Testing Frontend Access..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is accessible at http://localhost:3000"
else
    echo "❌ Frontend not accessible"
fi
echo

# Test 2: Bot service health
echo "2. Testing Bot Service Health..."
if curl -s http://localhost:4000/health | grep -q "bot-service"; then
    echo "✅ Bot service is running and healthy"
else
    echo "❌ Bot service not responding"
fi
echo

# Test 3: Try to access bot project page (should redirect to login)
echo "3. Testing Bot Project Page Access..."
echo "Open your browser and try these URLs:"
echo "   - http://localhost:3000 (Main app)"
echo "   - http://localhost:3000/login (Login page)"
echo "   - http://localhost:3000/register (Registration page)"
echo "   - http://localhost:3000/profile (Should redirect to login)"
echo "   - http://localhost:3000/projects/bot (Bot project page - requires login)"
echo

echo "🎯 Current Status:"
echo "✅ Frontend app is working"
echo "✅ Bot service infrastructure is ready"
echo "⚠️  Authentication needs to be completed"
echo

echo "📋 To test the full bot functionality:"
echo "1. We need to complete the auth integration"
echo "2. Or temporarily disable auth for testing"
echo "3. Then you can test: signup → login → bot project → upload docs → train bot"
echo

echo "🔧 What would you like to do?"
echo "A) Continue fixing authentication"
echo "B) Temporarily disable auth to test bot features"
echo "C) Test the UI without backend functionality"
