# 🚀 Fly.io Deployment Guide - Step by Step

## Prerequisites

1. **Fly.io Account**: Sign up at https://fly.io
2. **Fly CLI installed**
3. **Credit card** (for free tier verification)

---

## Step 1: Install Fly CLI

```bash
# macOS
brew install flyctl

# Or using install script
curl -L https://fly.io/install.sh | sh
```

Verify installation:
```bash
flyctl version
```

---

## Step 2: Login to Fly.io

```bash
flyctl auth login
```

This will open your browser to authenticate.

---

## Step 3: Create PostgreSQL Database

```bash
# Create Postgres cluster
flyctl postgres create --name alphatechx-db --region sjc

# Note down the connection string shown
# It will look like: postgres://user:password@host.internal:5432/dbname
```

**Save these credentials!** You'll need them.

---

## Step 4: Create MongoDB on MongoDB Atlas (Free)

Fly.io doesn't provide managed MongoDB, so use MongoDB Atlas:

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free M0 cluster
3. Get connection string
4. Whitelist Fly.io IPs (or use 0.0.0.0/0 for simplicity)

---

## Step 5: Set Environment Variables

From your project directory:

```bash
cd /Users/skswami91/alphatechx-app/alphatechx

# Set secrets (one by one)
flyctl secrets set OPENAI_API_KEY="your-openai-key"
flyctl secrets set PINECONE_API_KEY="your-pinecone-key"
flyctl secrets set PINECONE_HOST="your-pinecone-host"
flyctl secrets set JWT_SECRET="your-strong-secret-key"

# Database URLs
flyctl secrets set POSTGRES_URL="postgres://user:pass@host:5432/db"
flyctl secrets set MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/alphatechx"

# Optional (Teams integration)
flyctl secrets set MICROSOFT_APP_ID="your-app-id"
flyctl secrets set MICROSOFT_APP_PASSWORD="your-app-password"
```

---

## Step 6: Deploy Application

```bash
# First deployment (creates app)
flyctl launch --no-deploy

# Answer the prompts:
# - App name: alphatechx (or your choice)
# - Region: Choose closest to you (sjc, iad, lhr, etc.)
# - Setup Postgres: No (we already did this)
# - Deploy now: No

# Now deploy
flyctl deploy
```

---

## Step 7: Check Deployment Status

```bash
# Watch deployment
flyctl status

# View logs
flyctl logs

# Open your app
flyctl open
```

Your app will be available at: `https://alphatechx.fly.dev`

---

## Step 8: Custom Domain (Optional)

```bash
# Add your domain
flyctl certs add yourdomain.com

# You'll get DNS records to add:
# - A record: @ -> IP address
# - AAAA record: @ -> IPv6 address
# - Add these to your domain registrar

# Check certificate status
flyctl certs show yourdomain.com
```

---

## Step 9: Configure Teams Webhook

Now that your app is live:

1. Go to Azure Portal → Your Bot → Configuration
2. Set Messaging endpoint: `https://alphatechx.fly.dev/api/teams/messages`
3. Click Save

---

## Step 10: Test Your Bot

```bash
# Test health endpoint
curl https://alphatechx.fly.dev/api/health

# Test Teams webhook (from Azure Bot "Test in Web Chat")
```

---

## 🔧 Troubleshooting

### Build Fails

```bash
# Check build logs
flyctl logs

# Try building locally first
docker build -f Dockerfile.flyio -t alphatechx .
```

### App Won't Start

```bash
# SSH into the machine
flyctl ssh console

# Check processes
ps aux

# Check logs
tail -f /var/log/supervisor/*.log
```

### Database Connection Issues

```bash
# Test PostgreSQL connection
flyctl postgres connect -a alphatechx-db

# Check secrets are set
flyctl secrets list
```

---

## 💰 Cost Estimation

**Free Tier Includes:**
- 3 shared-cpu-1x VMs with 256MB RAM each
- 3GB persistent volume storage
- 160GB outbound data transfer

**Your App on Free Tier:**
- 1 VM (2 CPU, 2GB RAM) = **$0/month** (within free tier)
- PostgreSQL = **$0/month** (Fly's free Postgres)
- MongoDB Atlas M0 = **$0/month** (free tier)
- **Total: $0/month** for testing!

**Paid Tier (when you scale):**
- 1 dedicated-cpu-2x with 4GB RAM = ~$30/month
- Increased storage = ~$0.15/GB/month

---

## 📊 Monitoring

```bash
# View metrics
flyctl dashboard

# View logs in real-time
flyctl logs -f

# Check machine status
flyctl machine list
```

---

## 🔄 Update Deployment

When you make changes:

```bash
# Commit changes to git
git add .
git commit -m "Updated feature"

# Deploy update
flyctl deploy

# Rollback if needed
flyctl releases rollback
```

---

## ⚡ Quick Commands Reference

```bash
# Status
flyctl status

# Logs
flyctl logs -f

# SSH into machine
flyctl ssh console

# Scale up
flyctl scale vm shared-cpu-2x --memory 4096

# Scale down
flyctl scale count 1

# Restart app
flyctl machine restart

# Delete app (careful!)
flyctl apps destroy alphatechx
```

---

## 🎯 Post-Deployment Checklist

- [ ] App is accessible at URL
- [ ] Database connections working
- [ ] Environment variables set
- [ ] Teams webhook configured
- [ ] Test bot functionality
- [ ] Set up monitoring/alerts
- [ ] Add custom domain (optional)
- [ ] Configure backups

---

## 🆘 Common Issues

### Issue 1: "No such file or directory @ rb_sysopen - /tmp/manifest.json"

**Solution**: You need the `fly.toml` file (now created)

### Issue 2: Build takes too long / times out

**Solution**: 
```bash
# Use remote builder
flyctl deploy --remote-only
```

### Issue 3: App crashes on startup

**Solution**:
```bash
# Check logs
flyctl logs

# Check supervisor logs
flyctl ssh console
tail -f /var/log/supervisor/supervisord.log
```

### Issue 4: Can't connect to database

**Solution**:
```bash
# Verify secrets
flyctl secrets list

# Reconnect PostgreSQL
flyctl postgres attach alphatechx-db
```

---

## 📞 Support

- **Fly.io Community**: https://community.fly.io
- **Docs**: https://fly.io/docs
- **Status**: https://status.fly.io

---

**Ready to deploy?** Run the commands in order and your app will be live in ~10 minutes! 🚀

