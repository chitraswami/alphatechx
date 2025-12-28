# 🎉 AlphaTechX Deployment on Digital Ocean - COMPLETE!

## ✅ What Has Been Done

### 1. Server Setup ✓
- **Droplet IP**: 157.245.96.101
- **Domain**: alfatechx.com (pointing to droplet)
- **OS**: Ubuntu 24.04 LTS
- **RAM**: 512MB + 1GB Swap
- **System**: Updated and secured

### 2. Software Installed ✓
- ✅ Docker 29.1.3
- ✅ Docker Compose
- ✅ Nginx (reverse proxy)
- ✅ Certbot (SSL certificates)
- ✅ Git

### 3. SSL Certificate ✓
- ✅ Let's Encrypt SSL installed for **alfatechx.com** and **www.alfatechx.com**
- ✅ HTTPS enabled and redirects configured
- ✅ Auto-renewal configured
- ✅ Certificate expires: March 28, 2026

### 4. Application ✓
- ✅ Repository cloned to `/root/alphatechx`
- ✅ Nginx configured with reverse proxy
- ✅ Domain configured in all files

### 5. Infrastructure ✓
- ✅ Swap space (1GB) configured for low memory
- ✅ Nginx sites configured
- ✅ HTTP to HTTPS redirect enabled

---

## ⚠️ IMPORTANT: What You Need to Do

### 1. Update Environment Variables

SSH into the server and edit the .env file:

```bash
ssh root@157.245.96.101
cd /root/alphatechx
nano .env
```

**Update these values:**

```env
# MongoDB Atlas (Required)
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/alphatechx?retryWrites=true&w=majority

# OpenAI API Key (Required)
OPENAI_API_KEY=sk-YOUR_ACTUAL_OPENAI_API_KEY

# Pinecone (Required)
PINECONE_API_KEY=YOUR_ACTUAL_PINECONE_API_KEY
PINECONE_ENVIRONMENT=us-east-1-aws  # Or your environment
PINECONE_INDEX_NAME=alphatechx-docs

# Microsoft Teams Bot (Required)
MICROSOFT_APP_PASSWORD=YOUR_ACTUAL_BOT_PASSWORD

# JWT Secret (Change this!)
JWT_SECRET=generate-a-random-32-character-minimum-secret-key
```

**Get these credentials from:**
- MongoDB Atlas: https://cloud.mongodb.com
- OpenAI: https://platform.openai.com/api-keys
- Pinecone: https://app.pinecone.io
- Microsoft Bot: Azure Portal → Your Bot → Configuration

### 2. Deploy the Application

After updating .env:

```bash
cd /root/alphatechx
./deploy-digitalocean.sh deploy
```

This will:
- Build all Docker containers
- Start all services
- Set up the application

### 3. Verify Services

```bash
# Check if services are running
docker ps

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Check specific service
docker compose -f docker-compose.prod.yml logs bot-service
```

### 4. Update Azure Bot Configuration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Bot resource
3. Click **Configuration**
4. Update **Messaging endpoint** to:
   ```
   https://alfatechx.com/api/teams/messages
   ```
5. Click **Apply**

### 5. Update Teams App Manifest

The manifest has already been updated with `alfatechx.com`. Recreate the Teams app package:

```bash
cd teams-app
zip -r AlphaTechX-Bot.zip manifest.json color.png outline.png
```

Upload this new package to Teams.

---

## 🌐 Your URLs

- **Website**: https://alfatechx.com
- **API**: https://alfatechx.com/api
- **Teams Bot Webhook**: https://alfatechx.com/api/teams/messages
- **SSL Certificate**: Valid until March 28, 2026

---

## 📝 Useful Commands

### Access the Server
```bash
ssh root@157.245.96.101
```

### Application Management
```bash
cd /root/alphatechx

# Deploy/Start
./deploy-digitalocean.sh deploy

# View logs
./deploy-digitalocean.sh logs

# Restart services
./deploy-digitalocean.sh restart

# Stop services
./deploy-digitalocean.sh stop

# Update code and redeploy
./deploy-digitalocean.sh update
```

### Docker Commands
```bash
# Check running containers
docker ps

# View all logs
docker compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker compose -f docker-compose.prod.yml logs -f bot-service

# Restart a service
docker compose -f docker-compose.prod.yml restart bot-service

# Check resource usage
docker stats
```

### Nginx Commands
```bash
# Test configuration
nginx -t

# Reload Nginx
systemctl reload nginx

# Check status
systemctl status nginx

# View Nginx logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

### SSL Certificate
```bash
# Check certificate status
certbot certificates

# Renew certificates manually
certbot renew

# Test renewal
certbot renew --dry-run
```

### System Monitoring
```bash
# Check memory usage
free -h

# Check disk space
df -h

# Check system load
htop

# Check swap usage
swapon --show
```

---

## 🔧 Troubleshooting

### Services Won't Start
```bash
# Check logs
cd /root/alphatechx
docker compose -f docker-compose.prod.yml logs

# Check if environment variables are set
cat .env

# Rebuild containers
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

### Out of Memory
The server has 512MB RAM + 1GB swap. If you still run out:
```bash
# Check memory usage
free -h

# Check what's using memory
docker stats

# Restart services one by one
docker compose -f docker-compose.prod.yml restart backend
docker compose -f docker-compose.prod.yml restart bot-service
docker compose -f docker-compose.prod.yml restart frontend
```

### Can't Access Website
1. Check if Nginx is running: `systemctl status nginx`
2. Check if services are running: `docker ps`
3. Check Nginx logs: `tail -f /var/log/nginx/error.log`
4. Verify DNS is pointing to 157.245.96.101

### Bot Not Responding
1. Check bot service logs: `docker compose -f docker-compose.prod.yml logs bot-service`
2. Verify Azure Bot messaging endpoint is: `https://alfatechx.com/api/teams/messages`
3. Test the endpoint: `curl https://alfatechx.com/api/teams/messages`
4. Check environment variables are set correctly in `.env`

---

## 💰 Monthly Cost

| Service | Cost |
|---------|------|
| Digital Ocean Droplet | $4.00 |
| MongoDB Atlas (Free) | $0.00 |
| Pinecone (Free Tier) | $0.00 |
| Let's Encrypt SSL | $0.00 |
| **Total** | **$4.00/month** |

---

## 🔒 Security Notes

1. **Change the root password** after first login
2. **Update JWT_SECRET** in .env to a strong random value
3. **Keep API keys secure** - never commit them to git
4. **Regular updates**: Run `apt update && apt upgrade` monthly
5. **Monitor logs** for suspicious activity
6. **Firewall**: Digital Ocean firewall is recommended

---

## 📞 Support

If you encounter issues:

1. Check the logs first: `docker compose -f docker-compose.prod.yml logs -f`
2. Review the deployment guide: `DIGITALOCEAN_DEPLOYMENT_GUIDE.md`
3. Check system resources: `free -h` and `df -h`
4. Verify environment variables: `cat .env`

---

## 🎯 Next Steps

1. ✅ Server is ready
2. ✅ Domain is configured
3. ✅ SSL is installed
4. ⏳ **Update .env with actual API keys**
5. ⏳ **Deploy the application**
6. ⏳ **Update Azure Bot configuration**
7. ⏳ **Test the bot in Teams**

**Once you update the .env file with your actual credentials and run the deployment, your bot will be live!**

---

## 📋 Server Details

- **IP Address**: 157.245.96.101
- **Domain**: alfatechx.com
- **Location**: Bangalore (BLR1)
- **OS**: Ubuntu 24.04 (Noble)
- **Kernel**: 6.8.0-90-generic
- **Architecture**: x86_64
- **RAM**: 512MB + 1GB swap
- **Disk**: 10GB SSD
- **Network**: 1 Gbps

---

**Deployment Date**: December 28, 2025
**Status**: Infrastructure Ready - Awaiting API Keys
**SSL Expires**: March 28, 2026
