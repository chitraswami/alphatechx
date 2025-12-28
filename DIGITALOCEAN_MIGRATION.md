# 🚀 AlphaTechX - Digital Ocean Deployment Ready

## ✅ What's Changed

All Fly.io dependencies have been removed and replaced with Digital Ocean VM deployment configuration.

### 🗑️ Removed Files:
- `deploy-fly.sh` - Fly.io deployment script
- `fly.toml` - Fly.io configuration
- `nginx.flyio.conf` - Fly.io nginx config
- `Dockerfile.flyio` - Fly.io specific Dockerfile
- `FLY_DEPLOYMENT_GUIDE.md` - Fly.io deployment guide

### ✨ New Files Added:
- `DIGITALOCEAN_DEPLOYMENT_GUIDE.md` - Complete guide for deploying on Digital Ocean
- `deploy-digitalocean.sh` - Automated deployment script
- `docker-compose.prod.yml` - Production-optimized Docker Compose configuration

### 📝 Updated Files:
- `QUICK_START.md` - Updated with YOUR_DOMAIN placeholders
- `ENTERPRISE_SAAS_SUMMARY.md` - Removed Fly.io references
- `teams-app/manifest.json` - Updated valid domains to YOUR_DOMAIN
- `teams-app/README.md` - Updated URLs
- `teams-app/create-simple-package.sh` - Updated webhook URL
- `bot-service/teams-bot.js` - Using environment variables instead of hardcoded URLs

---

## 🎯 Next Steps

### 1. Set Up Digital Ocean Droplet ($4/month)

Follow the comprehensive guide in `DIGITALOCEAN_DEPLOYMENT_GUIDE.md`:

```bash
# Quick steps:
1. Create a Basic droplet ($4/mo) with Ubuntu 24.04
2. SSH into the server
3. Install Docker and Docker Compose
4. Clone your repository
5. Configure environment variables
6. Run: ./deploy-digitalocean.sh deploy
```

### 2. Configure Your Domain

Replace `YOUR_DOMAIN` with your actual domain throughout the project:

**Files to update:**
- `.env` - Set `BOT_SERVICE_URL=https://yourdomain.com`
- `teams-app/manifest.json` - Update all domain references
- Azure Bot messaging endpoint

**Use this command to find all instances:**
```bash
grep -r "YOUR_DOMAIN" .
```

### 3. Deploy Your Application

```bash
# Make script executable
chmod +x deploy-digitalocean.sh

# Full deployment
./deploy-digitalocean.sh deploy

# View logs
./deploy-digitalocean.sh logs

# Restart services
./deploy-digitalocean.sh restart
```

---

## 💰 Cost Comparison

| Service | Fly.io (Previous) | Digital Ocean (New) |
|---------|-------------------|---------------------|
| Hosting | ~$5-10/month | **$4/month** |
| MongoDB | Atlas Free | Atlas Free |
| Pinecone | Free Tier | Free Tier |
| SSL | Included | Free (Let's Encrypt) |
| **Total** | **$5-10/month** | **$4/month** 💚 |

---

## 🛠️ Quick Commands

### Deployment Script Commands:

```bash
./deploy-digitalocean.sh deploy     # Full deployment
./deploy-digitalocean.sh start      # Start services
./deploy-digitalocean.sh stop       # Stop services
./deploy-digitalocean.sh restart    # Restart services
./deploy-digitalocean.sh logs       # View all logs
./deploy-digitalocean.sh logs bot-service  # View specific service
./deploy-digitalocean.sh status     # Check service status
./deploy-digitalocean.sh update     # Pull code and redeploy
./deploy-digitalocean.sh swap       # Set up swap space
```

### Manual Docker Commands:

```bash
# Build and start
docker compose -f docker-compose.prod.yml up -d

# Stop all services
docker compose -f docker-compose.prod.yml down

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Check status
docker compose -f docker-compose.prod.yml ps

# Restart specific service
docker compose -f docker-compose.prod.yml restart bot-service
```

---

## 🌐 Architecture

Your application will run on a single Digital Ocean droplet:

```
Digital Ocean Droplet ($4/mo)
├── Nginx (Port 80/443) - Reverse Proxy + SSL
│   ├── Frontend (Port 3000) - React App
│   ├── Backend (Port 5001) - Express API
│   └── Bot Service (Port 4000) - Teams Bot + AI
├── MongoDB Atlas (Free) - Database
├── Pinecone (Free) - Vector Database
└── OpenAI API - AI Processing
```

---

## 🔐 Environment Variables

Make sure to configure these in your `.env` file:

```env
# MongoDB Atlas (Free Tier)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/alphatechx

# JWT
JWT_SECRET=your-super-secret-32-character-minimum-key
JWT_EXPIRE=30d

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Pinecone
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_INDEX_NAME=alphatechx-docs

# Microsoft Teams
MICROSOFT_APP_ID=897997b6-abe3-40cd-b257-29e8c2117f85
MICROSOFT_APP_PASSWORD=your-bot-password

# Your Domain
BOT_SERVICE_URL=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| `DIGITALOCEAN_DEPLOYMENT_GUIDE.md` | Complete deployment guide |
| `QUICK_START.md` | Quick setup instructions |
| `ENTERPRISE_SAAS_SUMMARY.md` | Architecture overview |
| `TEAMS_SETUP_GUIDE.md` | Teams bot setup |
| `README.md` | Project overview |

---

## ✅ Deployment Checklist

- [ ] Created Digital Ocean droplet ($4/month)
- [ ] Installed Docker and Docker Compose
- [ ] Cloned repository to server
- [ ] Created `.env` file with all variables
- [ ] Ran `./deploy-digitalocean.sh deploy`
- [ ] Configured domain DNS (A record)
- [ ] Set up Nginx reverse proxy
- [ ] Installed SSL certificate (Let's Encrypt)
- [ ] Updated Azure Bot messaging endpoint
- [ ] Updated `teams-app/manifest.json` with domain
- [ ] Recreated Teams app package
- [ ] Tested bot in Teams
- [ ] Verified document upload works

---

## 🆘 Troubleshooting

### Services Won't Start
```bash
# Check logs
./deploy-digitalocean.sh logs

# Check Docker status
docker ps -a

# Rebuild
./deploy-digitalocean.sh stop
./deploy-digitalocean.sh build
./deploy-digitalocean.sh start
```

### Out of Memory (512MB RAM)
```bash
# Add swap space
./deploy-digitalocean.sh swap
```

### SSL Certificate Issues
```bash
# Renew certificate
sudo certbot renew

# Check status
sudo certbot certificates
```

### Bot Not Responding
1. Check logs: `docker compose logs bot-service`
2. Verify Azure Bot messaging endpoint
3. Test endpoint: `curl https://yourdomain.com/api/teams/messages`
4. Check environment variables are set

---

## 🎉 Success!

Your AlphaTechX bot is now ready to deploy on Digital Ocean for just **$4/month**!

For detailed setup instructions, see: **`DIGITALOCEAN_DEPLOYMENT_GUIDE.md`**

Need help? Check the documentation or review the logs with `./deploy-digitalocean.sh logs`
