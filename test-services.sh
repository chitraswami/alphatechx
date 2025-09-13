#!/bin/bash

echo "🧪 Testing AlphaTechX Services..."

# Wait for services to be ready
sleep 10

echo "Testing Backend Health..."
curl -f http://localhost:5001/health && echo "✅ Backend is ready" || echo "❌ Backend not ready"

echo "Testing Bot Service Health..."
curl -f http://localhost:4000/health && echo "✅ Bot Service is ready" || echo "❌ Bot Service not ready"

echo "Testing Frontend..."
curl -f http://localhost:3000 > /dev/null && echo "✅ Frontend is ready" || echo "❌ Frontend not ready"

echo "Testing Nginx Proxy..."
curl -f http://localhost/health > /dev/null && echo "✅ Nginx is ready" || echo "❌ Nginx not ready"

echo ""
echo "🎯 If all services show ✅, your setup is working!"
echo "Open http://localhost:3000 in your browser to test the app."
