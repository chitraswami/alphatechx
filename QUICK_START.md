# ⚡ AlphaTechX Teams Bot - Quick Start

## 🎯 3 Steps to Get Your Bot Working in Teams

### Step 1: Configure Azure Bot (5 minutes)

1. Login to [Azure Portal](https://portal.azure.com) with `chitraswami@alphatechx.onmicrosoft.com`

2. Go to your Bot resource (App ID: `897997b6-abe3-40cd-b257-29e8c2117f85`)

3. **Set Messaging Endpoint**:
   - Click **Configuration**
   - Set endpoint to: `https://alfatechx.com/api/teams/messages`
   - Click **Apply**

4. **Enable Teams Channel**:
   - Click **Channels**
   - Click **Microsoft Teams** icon
   - Click **Save**

5. **Make Multi-Tenant**:
   - Go to **Azure Active Directory** → **App registrations**
   - Find your app: `897997b6-abe3-40cd-b257-29e8c2117f85`
   - Click **Authentication**
   - Select **"Accounts in any organizational directory (Multitenant)"**
   - Click **Save**

### Step 2: Test in Your Teams (2 minutes)

1. Open **Microsoft Teams**
2. Click **Apps** → **"Upload a custom app"**
3. Upload `teams-app/AlphaTechX-Bot.zip`
4. Click **"Add"**
5. Chat with the bot - it will give you your user ID

### Step 3: Upload Documents & Ask Questions (1 minute)

1. Go to https://alfatechx.com
2. Sign up with your Teams user ID
3. Upload a document
4. Return to Teams and ask questions!

---

## 📦 What You Have

| Item | Location | Purpose |
|------|----------|---------|
| Teams App Package | `teams-app/AlphaTechX-Bot.zip` | Share with users to install |
| Setup Guide | `TEAMS_SETUP_GUIDE.md` | Complete documentation |
| Bot Service | https://alfatechx.com | Running on Digital Ocean |
| Web UI | https://alfatechx.com | Users upload documents here |

---

## 🎉 How Users Install (30 seconds)

1. Download `AlphaTechX-Bot.zip`
2. Teams → Apps → Upload custom app
3. Select the zip file
4. Click "Add"
5. Done!

---

## 🔑 Your Credentials

**Microsoft App ID**: `897997b6-abe3-40cd-b257-29e8c2117f85`  
**Tenant ID**: `460fb4b5-0450-4532-8a69-978be450f548`  
**Webhook URL**: `https://alfatechx.com/api/teams/messages`

---

## ✅ Checklist

- [ ] Set messaging endpoint in Azure
- [ ] Enable Teams channel in Azure
- [ ] Make app registration multi-tenant
- [ ] Test bot in your Teams
- [ ] Upload a test document
- [ ] Ask bot a question
- [ ] Share `AlphaTechX-Bot.zip` with users

---

## 🐛 Quick Troubleshooting

**Bot not responding?**
- Check messaging endpoint is set correctly
- Check Teams channel is enabled
- Run: `docker compose logs bot-service` to see errors

**Can't install in Teams?**
- Make sure app registration is multi-tenant
- Re-download the zip file
- Try in Teams desktop app instead of web

**Bot says "no documents found"?**
- Make sure you uploaded documents with the SAME user ID
- Check web UI shows "Bot ready!"

---

## 📞 Need Help?

Check the full guide: `TEAMS_SETUP_GUIDE.md`

---

That's it! You now have an enterprise-grade SaaS bot! 🚀

