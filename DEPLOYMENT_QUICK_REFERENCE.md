# 🚀 AlphaTechX Deployment Quick Reference

## 📍 Deployment Information

- **Domain**: https://alfatechx.com
- **Server**: Digital Ocean Droplet (157.245.96.101)
- **Deployment**: GitHub Actions (Automated)
- **Code Location**: `/root/alphatechx`

---

## 🔄 Automated Deployment

### Push to Deploy
```bash
git add .
git commit -m "your changes"
git push origin main
```

**That's it!** GitHub Actions will:
1. ✅ Build Docker containers
2. ✅ Deploy to alfatechx.com
3. ✅ Run health checks
4. ✅ Notify you of success/failure

**Deployment Time:** ~5-8 minutes

---

## 🖥️ Manual Commands (If Needed)

### SSH into Server
```bash
ssh root@157.245.96.101
cd /root/alphatechx
```

### Quick Deploy
```bash
./deploy-digitalocean.sh deploy
```

### Update Only
```bash
./deploy-digitalocean.sh update
```

### Check Status
```bash
docker compose -f docker-compose.prod.yml ps
```

### View Logs
```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f bot-service
docker compose -f docker-compose.prod.yml logs -f frontend
```

### Restart Services
```bash
docker compose -f docker-compose.prod.yml restart
```

### Stop Services
```bash
docker compose -f docker-compose.prod.yml down
```

### Start Services
```bash
docker compose -f docker-compose.prod.yml up -d
```

---

## 🔧 Troubleshooting

### Check Service Health
```bash
curl https://alfatechx.com
curl https://alfatechx.com/api/health
curl https://alfatechx.com/api/teams/messages
```

### Clean Docker
```bash
docker system prune -af --volumes
```

### Clear Swap (if memory issues)
```bash
./clear-swap.sh
```

### Rebuild Everything
```bash
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d
```

---

## 📊 Monitoring

### GitHub Actions
https://github.com/YOUR_USERNAME/alphatechx-app/actions

### Server Monitoring
```bash
# CPU/Memory usage
htop

# Disk space
df -h

# Docker stats
docker stats

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## 🔑 Environment Variables

Location: `/root/alphatechx/.env`

Edit:
```bash
nano /root/alphatechx/.env
```

After editing, restart services:
```bash
docker compose -f docker-compose.prod.yml restart
```

---

## 📱 Teams Bot

### Webhook URL
```
https://alfatechx.com/api/teams/messages
```

### Update Azure Bot
1. Go to Azure Portal
2. Your Bot → Configuration
3. Messaging endpoint: `https://alfatechx.com/api/teams/messages`
4. Save

---

## 🎯 URLs

| Service | URL |
|---------|-----|
| Website | https://alfatechx.com |
| Backend API | https://alfatechx.com/api |
| API Health | https://alfatechx.com/api/health |
| Bot Webhook | https://alfatechx.com/api/teams/messages |
| Bot Projects | https://alfatechx.com/projects/bot |

---

## 🆘 Emergency Rollback

If deployment breaks:

```bash
ssh root@157.245.96.101
cd /root/alphatechx

# Revert to previous commit
git log --oneline  # Find previous commit hash
git reset --hard COMMIT_HASH

# Redeploy
./deploy-digitalocean.sh deploy
```

---

## 📞 Quick Support

**Server Issues:**
```bash
ssh root@157.245.96.101 "cd /root/alphatechx && docker compose -f docker-compose.prod.yml logs --tail=100"
```

**GitHub Actions Issues:**
- Check Actions tab in GitHub
- Verify secrets are set correctly
- Test SSH connection manually

---

## ✅ Health Check Commands

```bash
# Frontend
curl -I https://alfatechx.com

# Backend
curl https://alfatechx.com/api/health

# Bot Service
curl https://alfatechx.com/api/teams/messages

# All at once
curl -I https://alfatechx.com && \
curl https://alfatechx.com/api/health && \
curl https://alfatechx.com/api/teams/messages
```

---

## 🎉 That's It!

Your deployment is fully automated. Just push code and let GitHub Actions handle the rest!

**Need help?** Check `GITHUB_ACTIONS_SETUP.md` for detailed setup.
