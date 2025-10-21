# 🏢 Production Deployment Guide - Enterprise Grade

## ⚠️ CRITICAL: Teams Integration Requires Production Deployment

**Microsoft Teams CANNOT integrate with localhost.** Your application must be deployed to a public server.

---

## 🏗️ Enterprise Architecture

### Multi-Tenant SaaS Requirements:

```
┌─────────────────────────────────────────────────────────┐
│                  Internet / Public                       │
│                                                          │
│  Microsoft Teams Servers                                 │
│       ↓                                                  │
│  https://api.alphatechx.com (Your Domain)               │
│       ↓                                                  │
│  Load Balancer / Nginx                                  │
│       ↓                                                  │
│  ┌──────────────────────────────────────┐              │
│  │  Per-User Webhook Routing:            │              │
│  │  /api/teams/messages?userId=user1     │              │
│  │  /api/teams/messages?userId=user2     │              │
│  └──────────────────────────────────────┘              │
│       ↓                                                  │
│  Bot Service Container (Port 4000)                      │
│       ↓                                                  │
│  User-specific Pinecone Namespace                       │
│  (user-{userId})                                        │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Pre-Deployment Checklist

### 1. Domain & DNS
- [ ] Purchase domain name (e.g., `alphatechx.com`)
- [ ] Configure DNS records:
  - `A` record: `api.alphatechx.com` → Your server IP
  - `A` record: `app.alphatechx.com` → Your server IP

### 2. SSL Certificate
- [ ] Install Let's Encrypt (free SSL)
- [ ] Configure auto-renewal
- [ ] Verify HTTPS working

### 3. Server Requirements
- [ ] **Minimum**: 2 vCPU, 4GB RAM
- [ ] **Recommended**: 4 vCPU, 8GB RAM
- [ ] Ubuntu 22.04 LTS or similar
- [ ] Docker & Docker Compose installed
- [ ] Firewall configured (ports 80, 443)

---

## 🚀 Deployment Options

### Option 1: AWS EC2 (Recommended)

**Cost**: ~$30-50/month for t3.medium

**Steps:**
1. Launch EC2 instance (Ubuntu 22.04)
2. Attach Elastic IP
3. Configure Security Group (80, 443, 22)
4. Install Docker & Docker Compose
5. Clone your repository
6. Set up environment variables
7. Run `docker-compose up -d`

**Pros:**
- Scalable
- Reliable
- Easy to manage
- Auto-scaling available

**Cons:**
- Monthly cost
- Requires AWS knowledge

---

### Option 2: Azure App Service

**Cost**: ~$13-55/month

**Steps:**
1. Create App Service (Docker Compose support)
2. Configure container settings
3. Deploy from GitHub/GitLab
4. Set environment variables
5. Enable custom domain

**Pros:**
- Integrated with Azure Bot Service
- Auto-scaling
- Built-in SSL

**Cons:**
- Vendor lock-in
- Learning curve

---

### Option 3: DigitalOcean Droplet

**Cost**: ~$12-24/month

**Steps:**
1. Create Droplet (Docker pre-installed)
2. Point domain to Droplet IP
3. SSH into server
4. Clone repo & configure
5. Run docker-compose

**Pros:**
- Simple
- Affordable
- Good docs

**Cons:**
- Manual scaling
- Self-managed

---

### Option 4: Railway.app / Render.com

**Cost**: ~$5-20/month

**Steps:**
1. Connect GitHub repo
2. Configure services
3. Set environment variables
4. Deploy

**Pros:**
- Easiest deployment
- Built-in CI/CD
- Free tier available

**Cons:**
- Less control
- May need plan upgrade

---

## 🔧 Production Configuration

### 1. Update `docker-compose.yml`

Replace `localhost` with your domain:

```yaml
environment:
  BOT_SERVICE_URL: https://api.alphatechx.com
  REACT_APP_API_URL: https://api.alphatechx.com/api
  REACT_APP_BOT_API_URL: https://api.alphatechx.com/api
```

### 2. Nginx Configuration for Production

Create `nginx-prod.conf`:

```nginx
server {
    listen 80;
    server_name api.alphatechx.com app.alphatechx.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.alphatechx.com;

    ssl_certificate /etc/letsencrypt/live/api.alphatechx.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.alphatechx.com/privkey.pem;

    # Backend API
    location /api/ {
        proxy_pass http://backend:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Bot Service
    location /api/teams/ {
        proxy_pass http://bot-service:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 443 ssl http2;
    server_name app.alphatechx.com;

    ssl_certificate /etc/letsencrypt/live/app.alphatechx.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.alphatechx.com/privkey.pem;

    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. Environment Variables (Production)

Create `.env.production`:

```bash
# Production URLs
DOMAIN=alphatechx.com
API_URL=https://api.alphatechx.com
APP_URL=https://app.alphatechx.com

# Database
POSTGRES_PASSWORD=<strong-password>
MONGODB_PASSWORD=<strong-password>

# JWT
JWT_SECRET=<strong-secret-key>

# OpenAI
OPENAI_API_KEY=<your-key>

# Pinecone
PINECONE_API_KEY=<your-key>
PINECONE_HOST=<your-host>

# NOTE: Teams credentials are USER-PROVIDED, stored in database
```

---

## 🔐 Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env` files
- ✅ Use secrets management (AWS Secrets Manager, Azure Key Vault)
- ✅ Rotate credentials regularly

### 2. SSL/TLS
- ✅ Force HTTPS
- ✅ Use strong cipher suites
- ✅ Enable HSTS headers

### 3. Rate Limiting
```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

location /api/ {
    limit_req zone=api burst=20;
    ...
}
```

### 4. Firewall
```bash
# Allow only necessary ports
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw enable
```

---

## 📊 Monitoring & Logging

### Required Services:

1. **Application Monitoring**: DataDog, New Relic, or Prometheus
2. **Error Tracking**: Sentry
3. **Uptime Monitoring**: UptimeRobot, Pingdom
4. **Log Aggregation**: ELK Stack or CloudWatch

---

## 🔄 Deployment Process

### Initial Deployment:

```bash
# 1. SSH to server
ssh user@your-server-ip

# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 3. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 4. Clone repository
git clone https://github.com/your-repo/alphatechx-app.git
cd alphatechx-app/alphatechx

# 5. Create .env.production
nano .env.production
# (paste production environment variables)

# 6. Build and start
docker-compose --env-file .env.production up -d --build

# 7. Setup SSL with Certbot
sudo certbot --nginx -d api.alphatechx.com -d app.alphatechx.com
```

### Updates & Rollbacks:

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Rollback if needed
git checkout <previous-commit>
docker-compose up -d --build
```

---

## 🧪 Testing Production Deployment

### 1. Health Checks
```bash
curl https://api.alphatechx.com/health
curl https://api.alphatechx.com/api/health
```

### 2. Teams Webhook Test
```bash
curl -X POST https://api.alphatechx.com/api/teams/messages \
  -H "Content-Type: application/json" \
  -d '{"type": "message", "text": "test"}'
```

### 3. SSL Verification
```bash
curl -I https://api.alphatechx.com
# Should return 200 OK with valid certificate
```

---

## 💰 Cost Estimation

### Monthly Costs (Small Scale):

| Service | Provider | Cost |
|---------|----------|------|
| Compute | AWS EC2 t3.medium | $30 |
| Database | Managed PostgreSQL | $15 |
| Domain | Namecheap/GoDaddy | $12/year |
| SSL | Let's Encrypt | Free |
| Monitoring | Free tier | $0 |
| **Total** | | **~$45/month** |

### Scaling (1000+ users):

| Service | Cost |
|---------|------|
| Compute (Load balanced) | $100-200 |
| Database (HA) | $50-100 |
| Monitoring | $50 |
| **Total** | **~$200-350/month** |

---

## 🎯 Next Steps

1. **Choose deployment platform** (AWS/Azure/DigitalOcean)
2. **Purchase domain name**
3. **Set up server & Docker**
4. **Configure DNS & SSL**
5. **Deploy application**
6. **Configure Azure Bot messaging endpoint** with production URL
7. **Test Teams integration**

---

## ⚠️ Important Notes

### For Development/Testing ONLY:

If you want to test locally before production deployment, you can use:

```bash
# Install ngrok
brew install ngrok

# Start ngrok (temporary tunnel)
ngrok http 4000

# Use the ngrok URL in Azure Bot configuration
# Example: https://abc123.ngrok.io/api/teams/messages
```

**BUT THIS IS NOT FOR PRODUCTION!** 
- ngrok URLs change on restart
- Not scalable
- Not secure for multi-tenant
- Enterprise clients won't accept it

---

## 📞 Support & Resources

- **AWS Deployment**: https://aws.amazon.com/getting-started/
- **Azure Deployment**: https://learn.microsoft.com/azure/
- **Docker Compose**: https://docs.docker.com/compose/
- **Let's Encrypt**: https://letsencrypt.org/getting-started/

---

**Remember**: For an ENTERPRISE-GRADE SaaS platform, proper production deployment is non-negotiable. Teams integration REQUIRES a public, stable endpoint.

