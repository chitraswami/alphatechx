#!/bin/bash

# AlphaTechX Fly.io Deployment Script
# This script helps deploy the AlphaTechX app to Fly.io

set -e

echo "🚀 AlphaTechX Fly.io Deployment"
echo "================================"

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    echo "❌ Fly CLI not found. Installing..."
    curl -L https://fly.io/install.sh | sh
    echo "✅ Fly CLI installed. Please restart your terminal and run this script again."
    exit 1
fi

# Check if logged in
if ! flyctl auth whoami &> /dev/null; then
    echo "🔐 Please login to Fly.io..."
    flyctl auth login
fi

echo ""
echo "📋 Pre-deployment Checklist:"
echo "1. Do you have your OpenAI API key? (required)"
echo "2. Do you have your Pinecone API key and host? (required)"
echo "3. Do you have MongoDB Atlas connection string? (required)"
echo ""

read -p "Have you set all required environment variables? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Please set your secrets first:"
    echo ""
    echo "flyctl secrets set OPENAI_API_KEY=\"your-key\""
    echo "flyctl secrets set PINECONE_API_KEY=\"your-key\""
    echo "flyctl secrets set PINECONE_HOST=\"your-host\""
    echo "flyctl secrets set MONGODB_URI=\"mongodb+srv://...\""
    echo "flyctl secrets set JWT_SECRET=\"$(openssl rand -base64 32)\""
    echo ""
    exit 1
fi

echo ""
echo "🏗️  Starting deployment..."
echo ""

# Check if app exists
if flyctl status &> /dev/null; then
    echo "📦 App exists. Deploying update..."
    flyctl deploy --remote-only
else
    echo "🆕 First deployment. Creating app..."
    flyctl launch --no-deploy --name alphatechx --region sjc
    
    echo ""
    echo "⚙️  Setting up database..."
    echo "Creating PostgreSQL database..."
    flyctl postgres create --name alphatechx-db --region sjc
    
    echo ""
    echo "🔗 Attaching database to app..."
    flyctl postgres attach alphatechx-db
    
    echo ""
    echo "🚀 Deploying app..."
    flyctl deploy --remote-only
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your app is available at:"
flyctl status --json | grep hostname | awk '{print "   https://"$2}' | tr -d '",'
echo ""
echo "📊 View logs:"
echo "   flyctl logs -f"
echo ""
echo "🔧 SSH into machine:"
echo "   flyctl ssh console"
echo ""
echo "🎯 Next steps:"
echo "   1. Configure Teams webhook in Azure Portal"
echo "   2. Test your bot"
echo "   3. Add custom domain (optional)"
echo ""

