#!/bin/bash

echo "🚀 Starting AlphaTechX Application with Docker..."

# Clean up any existing containers
echo "📦 Cleaning up existing containers..."
docker-compose down -v

# Build and start all services
echo "🏗️  Building and starting services..."
docker-compose up --build --remove-orphans

echo "✅ All services started!"
echo ""
echo "Access your application at:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:5000/api"
echo "- Bot Service API: http://localhost:4000/api"
echo "- Main App (via Nginx): http://localhost"
echo ""
echo "To stop all services: docker-compose down"
echo "To view logs: docker-compose logs -f [service-name]"
