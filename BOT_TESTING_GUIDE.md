# 🤖 AlphaTechX Bot Service Testing Guide

## ✅ What's Working

Your AI Bot SaaS application is successfully running with the following components:

### 🏗️ Infrastructure Status
- ✅ **Frontend (React)**: `http://localhost:3000` - Serving the main application
- ✅ **Backend (Node.js)**: `http://localhost:5001` - Simple backend for basic operations  
- ✅ **Bot Service (NestJS)**: `http://localhost:4000` - AI bot functionality with TypeORM + PostgreSQL
- ✅ **PostgreSQL**: `localhost:5435` - Database for bot service data
- ✅ **MongoDB**: `localhost:27017` - Database for main application data
- ✅ **Redis**: `localhost:6379` - Caching and session storage
- ✅ **Nginx**: `http://localhost:80` - Reverse proxy

### 🔧 Bot Service API Endpoints

The bot service has the following working endpoints (all require JWT authentication):

1. **Health Check** (No auth required)
   ```bash
   curl http://localhost:4000/health
   ```

2. **Project Management**
   ```bash
   POST /api/projects/get-or-create  # Create or get user's bot project
   GET /api/projects/:id             # Get specific project details
   ```

3. **Billing & Trials**
   ```bash
   POST /api/billing/start-trial     # Start 14-day Pro trial
   ```

4. **Document Management**
   ```bash
   POST /api/projects/:id/documents/upload  # Upload training documents
   POST /api/projects/:id/train             # Train the bot
   ```

5. **Integrations**
   ```bash
   GET /api/projects/:id/integrations/install-urls  # Get Slack/Teams integration URLs
   ```

## 🔒 Authentication Issue & Solution

### Current Issue
- The frontend can't login because we're using a simplified backend for testing
- The bot service requires JWT authentication for all API endpoints
- You need proper authentication to test the full bot functionality

### Immediate Testing Options

#### Option 1: Test Bot Service Health
```bash
# Test if bot service is responding
curl http://localhost:4000/health

# Expected response:
# {"status":"ok","service":"bot-service"}
```

#### Option 2: Frontend Interface Testing
1. Open `http://localhost:3000` in your browser
2. The React app loads successfully
3. You can see the UI structure and navigation
4. Login/signup won't work yet due to simplified backend

#### Option 3: Direct API Testing (Advanced)
For testing with authentication, you would need to:
1. Set up the full backend with authentication endpoints
2. Get a valid JWT token from login
3. Use that token in API requests

## 🚀 Next Steps to Enable Full Bot Testing

### 1. Enable Authentication
To test the complete bot functionality, you need to:

```bash
# Option A: Use the full backend instead of simplified one
# Modify docker-compose.yml to use the real backend with auth endpoints

# Option B: Temporarily disable auth for testing
# (Not recommended for production)
```

### 2. Test Bot Features Through Frontend
Once authentication is working:
1. Sign up / Log in to the app
2. Navigate to Profile page
3. Click "Go to Project" or "Start 14-day Pro Trial"
4. Upload documents (PDFs, text files, images)
5. Click "Train Bot" to process the documents
6. Test Slack/Teams integration URLs

### 3. Database Verification
Check if data is being stored correctly:
```bash
# Connect to PostgreSQL to see bot service data
docker exec -it alphatechx-postgres psql -U postgres -d bot_service

# List tables
\dt

# Check projects
SELECT * FROM projects;
```

## 🎯 Testing Checklist

- [x] All Docker services running
- [x] Frontend accessible at localhost:3000
- [x] Bot service responding to health checks
- [x] PostgreSQL database connected and initialized
- [x] All API endpoints mapped correctly
- [ ] Authentication system working
- [ ] Bot project creation
- [ ] Document upload functionality
- [ ] Bot training process
- [ ] Integration URL generation

## 🔧 Quick Commands

```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# Test all services
./test-services.sh

# View logs
docker-compose logs [service-name]

# Stop all services
docker-compose down
```

## 📋 Current Architecture

```
Frontend (React) :3000
    ↓
Nginx Proxy :80
    ↓
├── Backend (Node.js) :5001    # Basic backend
└── Bot Service (NestJS) :4000  # AI bot functionality
    ↓
PostgreSQL :5435               # Bot service database
MongoDB :27017                 # Main app database
Redis :6379                    # Caching
```

Your bot service infrastructure is solid and ready for development! The main missing piece is connecting the authentication system to enable full end-to-end testing.
