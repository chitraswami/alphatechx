# ⚡ Quick Deploy to Fly.io (5 Minutes)

## 🎯 Prerequisites

1. **Fly.io account** (free): https://fly.io/app/sign-up
2. **API Keys ready**:
   - OpenAI API key
   - Pinecone API key + host
   - MongoDB Atlas connection string (free tier)

---

## 🚀 Deploy in 3 Commands

```bash
# 1. Install Fly CLI (if not installed)
brew install flyctl

# 2. Login
flyctl auth login

# 3. Run deployment script
./deploy-fly.sh
```

That's it! ✅

---

## 🔑 Set Your Secrets (Required)

Before deploying, set these:

```bash
# Required
flyctl secrets set OPENAI_API_KEY="sk-proj-your-key-here"
flyctl secrets set PINECONE_API_KEY="pcsk_your-key-here"
flyctl secrets set PINECONE_HOST="your-index.svc.pinecone.io"
flyctl secrets set MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/alphatechx"
flyctl secrets set JWT_SECRET="$(openssl rand -base64 32)"

# Optional (for Teams)
flyctl secrets set MICROSOFT_APP_ID="your-app-id"
flyctl secrets set MICROSOFT_APP_PASSWORD="your-app-password"
```

---

## 📍 Your App URLs

After deployment:

- **App**: `https://alphatechx.fly.dev`
- **API**: `https://alphatechx.fly.dev/api`
- **Teams Webhook**: `https://alphatechx.fly.dev/api/teams/messages`

---

## 🔧 Useful Commands

```bash
# View logs
flyctl logs -f

# Check status
flyctl status

# SSH into server
flyctl ssh console

# Restart app
flyctl machine restart

# Scale up (if needed)
flyctl scale vm dedicated-cpu-2x --memory 4096
```

---

## 💰 Cost

**FREE** for your first deployment!
- Included in Fly.io free tier
- No credit card charge for testing
- Upgrade only when you're ready

---

## 🆘 Troubleshooting

### Build fails?
```bash
# Use remote builder
flyctl deploy --remote-only
```

### Can't see logs?
```bash
flyctl logs -f
```

### App not responding?
```bash
# Check machine status
flyctl machine list

# Restart
flyctl machine restart
```

---

## ✅ Post-Deployment

1. **Test your app**: Visit `https://alphatechx.fly.dev`
2. **Configure Teams webhook**: Copy URL to Azure Bot
3. **Test bot**: Upload data and query from Teams
4. **Monitor**: `flyctl dashboard`

---

**Need help?** Check `FLY_DEPLOYMENT_GUIDE.md` for detailed instructions!
