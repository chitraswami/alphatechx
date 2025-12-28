# 🚀 Digital Ocean Deployment Guide

Deploy AlphaTechX on a Digital Ocean Droplet for just **$4/month**!

---

## 📋 Prerequisites

1. **Digital Ocean Account**: Sign up at https://digitalocean.com
2. **Domain Name** (optional but recommended): e.g., `alphatechx.com`
3. **MongoDB Atlas Account**: Free tier at https://mongodb.com/atlas
4. **Pinecone Account**: For vector database
5. **OpenAI API Key**: For AI capabilities
6. **Azure Bot Registration**: For Microsoft Teams integration

---

## 🖥️ Step 1: Create Digital Ocean Droplet

### 1.1 Create a New Droplet

1. Log in to [Digital Ocean](https://cloud.digitalocean.com)
2. Click **"Create"** → **"Droplets"**
3. Choose the following options:

| Setting | Recommended Value |
|---------|-------------------|
| **Region** | Choose closest to your users (e.g., `NYC1`, `BLR1` for India) |
| **Image** | Ubuntu 24.04 (LTS) x64 |
| **Size** | Basic → Regular → **$4/mo** (512 MB / 1 CPU / 10 GB SSD) |
| **Authentication** | SSH Keys (recommended) or Password |
| **Hostname** | `alphatechx-server` |

4. Click **"Create Droplet"**
5. Note down the **IP Address** (e.g., `164.90.xxx.xxx`)

### 1.2 Configure Firewall (Optional but Recommended)

1. Go to **Networking** → **Firewalls**
2. Create a new firewall with these rules:

**Inbound Rules:**
| Type | Protocol | Port Range | Sources |
|------|----------|------------|---------|
| SSH | TCP | 22 | All IPv4, All IPv6 |
| HTTP | TCP | 80 | All IPv4, All IPv6 |
| HTTPS | TCP | 443 | All IPv4, All IPv6 |

3. Apply to your droplet

---

## 🔧 Step 2: Initial Server Setup

### 2.1 Connect to Your Server

```bash
ssh root@YOUR_DROPLET_IP
```

### 2.2 Create a Non-Root User (Recommended)

```bash
# Create user
adduser alphatechx

# Add to sudo group
usermod -aG sudo alphatechx

# Switch to new user
su - alphatechx
```

### 2.3 Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### 2.4 Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Start Docker
sudo systemctl enable docker
sudo systemctl start docker

# Log out and back in for group changes
exit
ssh alphatechx@YOUR_DROPLET_IP

# Verify Docker
docker --version
```

### 2.5 Install Docker Compose

```bash
sudo apt install docker-compose-plugin -y

# Verify
docker compose version
```

### 2.6 Install Nginx (for SSL)

```bash
sudo apt install nginx certbot python3-certbot-nginx -y
```

---

## 📦 Step 3: Deploy Application

### 3.1 Clone Repository

```bash
cd ~
git clone https://github.com/YOUR_USERNAME/alphatechx.git
cd alphatechx
```

Or upload files via SCP:
```bash
# From your local machine
scp -r /path/to/alphatechx alphatechx@YOUR_DROPLET_IP:~/
```

### 3.2 Configure Environment Variables

```bash
# Copy example env file
cp env.example .env

# Edit environment variables
nano .env
```

Add these values to `.env`:

```env
# Database (use MongoDB Atlas for persistence)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/alphatechx?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRE=30d

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Pinecone
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_INDEX_NAME=alphatechx-docs

# Microsoft Teams Bot
MICROSOFT_APP_ID=897997b6-abe3-40cd-b257-29e8c2117f85
MICROSOFT_APP_PASSWORD=your-bot-password

# Your Domain (update after DNS setup)
BOT_SERVICE_URL=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com

# Node Environment
NODE_ENV=production
```

### 3.3 Create Production Docker Compose

Create a production-optimized docker-compose file:

```bash
nano docker-compose.prod.yml
```

```yaml
services:
  # Backend Service
  backend:
    build:
      context: ./backend
      dockerfile: ../backend.Dockerfile
    container_name: alphatechx-backend
    environment:
      NODE_ENV: production
      PORT: 5001
      MONGODB_URI: ${MONGODB_URI}
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRE: ${JWT_EXPIRE}
    ports:
      - "5001:5001"
    restart: always

  # Bot Service
  bot-service:
    build:
      context: ./bot-service
      dockerfile: Dockerfile
    container_name: alphatechx-bot-service
    environment:
      NODE_ENV: production
      PORT: 4000
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      PINECONE_API_KEY: ${PINECONE_API_KEY}
      PINECONE_ENVIRONMENT: ${PINECONE_ENVIRONMENT}
      PINECONE_INDEX_NAME: ${PINECONE_INDEX_NAME}
      MICROSOFT_APP_ID: ${MICROSOFT_APP_ID}
      MICROSOFT_APP_PASSWORD: ${MICROSOFT_APP_PASSWORD}
      BOT_SERVICE_URL: ${BOT_SERVICE_URL}
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "4000:4000"
    restart: always

  # Frontend Service
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        REACT_APP_API_URL: ${BOT_SERVICE_URL}/api
        REACT_APP_BOT_API_URL: ${BOT_SERVICE_URL}/api
    container_name: alphatechx-frontend
    ports:
      - "3000:3000"
    restart: always
```

### 3.4 Build and Start Services

```bash
# Build all containers
docker compose -f docker-compose.prod.yml build

# Start in detached mode
docker compose -f docker-compose.prod.yml up -d

# Check status
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs -f
```

---

## 🌐 Step 4: Configure Domain & SSL

### 4.1 Point Domain to Droplet

In your domain registrar (e.g., GoDaddy, Namecheap, Cloudflare):

1. Add an **A Record**:
   - **Host**: `@` (or your subdomain)
   - **Points to**: Your Droplet IP
   - **TTL**: 3600

2. Add a **CNAME Record** (optional, for www):
   - **Host**: `www`
   - **Points to**: `yourdomain.com`

Wait 5-10 minutes for DNS propagation.

### 4.2 Configure Nginx Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/alphatechx
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Bot Service API (Teams webhook)
    location /api/teams/ {
        proxy_pass http://localhost:4000/api/teams/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Bot Service (other endpoints)
    location /bot/ {
        proxy_pass http://localhost:4000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/alphatechx /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 4.3 Install SSL Certificate (Free with Let's Encrypt)

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts:
- Enter your email
- Agree to terms
- Choose whether to redirect HTTP to HTTPS (recommended: Yes)

SSL auto-renewal is enabled by default.

---

## 🤖 Step 5: Configure Azure Bot

### 5.1 Update Messaging Endpoint

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Bot resource
3. Click **Configuration**
4. Set **Messaging endpoint** to:
   ```
   https://yourdomain.com/api/teams/messages
   ```
5. Click **Apply**

### 5.2 Update Teams App Manifest

Edit `teams-app/manifest.json`:

```json
{
  "validDomains": [
    "yourdomain.com"
  ]
}
```

Recreate the Teams app package:
```bash
cd teams-app
zip -r AlphaTechX-Bot.zip manifest.json color.png outline.png
```

---

## 🔄 Step 6: Maintenance & Updates

### View Logs

```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f bot-service
```

### Restart Services

```bash
docker compose -f docker-compose.prod.yml restart
```

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

### Check Resource Usage

```bash
# Docker stats
docker stats

# System resources
htop
df -h
```

---

## 💰 Cost Breakdown

| Service | Cost/Month |
|---------|------------|
| Digital Ocean Droplet (Basic) | **$4** |
| MongoDB Atlas (Free Tier) | **$0** |
| Pinecone (Free Tier) | **$0** |
| Let's Encrypt SSL | **$0** |
| **Total** | **$4/month** |

---

## 🛟 Troubleshooting

### Container Not Starting

```bash
# Check logs
docker compose -f docker-compose.prod.yml logs bot-service

# Check container status
docker ps -a
```

### Out of Memory

The $4 droplet has only 512MB RAM. If you run out of memory:

```bash
# Add swap space
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### SSL Certificate Issues

```bash
# Renew certificates
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

### Bot Not Responding

1. Check bot service is running: `docker ps`
2. Check logs: `docker compose logs bot-service`
3. Verify Azure Bot messaging endpoint is correct
4. Test endpoint: `curl https://yourdomain.com/api/teams/messages`

---

## 📚 Quick Reference

| Action | Command |
|--------|---------|
| Start services | `docker compose -f docker-compose.prod.yml up -d` |
| Stop services | `docker compose -f docker-compose.prod.yml down` |
| View logs | `docker compose -f docker-compose.prod.yml logs -f` |
| Restart | `docker compose -f docker-compose.prod.yml restart` |
| Rebuild | `docker compose -f docker-compose.prod.yml build` |
| SSH to server | `ssh alphatechx@YOUR_DROPLET_IP` |

---

## ✅ Deployment Checklist

- [ ] Created Digital Ocean droplet
- [ ] Installed Docker and Docker Compose
- [ ] Cloned/uploaded application code
- [ ] Configured environment variables
- [ ] Started Docker containers
- [ ] Configured domain DNS
- [ ] Set up Nginx reverse proxy
- [ ] Installed SSL certificate
- [ ] Updated Azure Bot messaging endpoint
- [ ] Updated Teams app manifest
- [ ] Tested bot in Teams

---

## 🎉 You're Done!

Your AlphaTechX bot is now running on Digital Ocean for just $4/month!

- **Web UI**: `https://yourdomain.com`
- **Bot API**: `https://yourdomain.com/api/teams/messages`
- **Teams Bot**: Install using `AlphaTechX-Bot.zip`

For support, check the logs or open an issue on GitHub.
