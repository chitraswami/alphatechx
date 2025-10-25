# 🚀 AlphaTechX Teams Bot - Complete Setup Guide

## ✅ What's Been Done

Your AlphaTechX Bot is now configured as an **enterprise SaaS bot** that serves ALL customers through a single bot registration. Here's what's ready:

### ✅ Bot Service Configuration
- **Microsoft App ID**: `897997b6-abe3-40cd-b257-29e8c2117f85`
- **Tenant ID**: `460fb4b5-0450-4532-8a69-978be450f548`
- **Webhook URL**: `https://alphatechx.fly.dev/api/teams/messages`
- **Status**: ✅ Deployed to Fly.io

### ✅ Teams App Package
- **Location**: `teams-app/AlphaTechX-Bot.zip`
- **Contents**: Manifest + Icons
- **Status**: ✅ Ready for distribution

### ✅ Data Isolation
- Each user gets their own Pinecone namespace: `user-{userId}`
- Users can only access their own uploaded documents
- Multi-tenant architecture with complete data separation

---

## 📋 Azure Portal Setup (One-Time)

### Step 1: Configure Bot Messaging Endpoint

1. Login to **Azure Portal** with `chitraswami@alphatechx.onmicrosoft.com`
2. Go to your **Bot resource** (the one with App ID: `897997b6-abe3-40cd-b257-29e8c2117f85`)
3. Click **Configuration** (left sidebar)
4. Set **Messaging endpoint** to:
   ```
   https://alphatechx.fly.dev/api/teams/messages
   ```
5. Click **Apply**

### Step 2: Enable Microsoft Teams Channel

1. In the same Bot resource, click **Channels** (left sidebar)
2. Click the **Microsoft Teams** icon
3. Click **Save**
4. You should see "Microsoft Teams" appear in your channels list

### Step 3: Make App Registration Multi-Tenant (IMPORTANT!)

1. Go to **Azure Active Directory** → **App registrations**
2. Find your app: `897997b6-abe3-40cd-b257-29e8c2117f85`
3. Click **Authentication** (left sidebar)
4. Under **Supported account types**, select:
   - ✅ **"Accounts in any organizational directory (Any Azure AD directory - Multitenant)"**
5. Click **Save**

This allows the bot to work for ANY organization, not just yours!

---

## 🎉 How Users Install the Bot

### Option 1: Direct Installation (Easiest)

1. Share the file `teams-app/AlphaTechX-Bot.zip` with your users
2. Users open **Microsoft Teams**
3. Click **Apps** (bottom left)
4. Click **"Upload a custom app"** or **"Manage your apps"** → **"Upload an app"**
5. Select `AlphaTechX-Bot.zip`
6. Click **"Add"**
7. Done! The bot appears in their chat list

### Option 2: Organization-Wide Installation (For Enterprise Customers)

1. Customer's Teams Admin goes to **Teams Admin Center**
2. **Manage apps** → **Upload**
3. Upload `AlphaTechX-Bot.zip`
4. Approve for the organization
5. All users in that organization can now install the bot from their Teams app store

---

## 👥 User Experience Flow

### 1. User Installs Bot in Teams
- User uploads `AlphaTechX-Bot.zip` to Teams
- Bot appears in their chat list

### 2. User Starts Chat
- User opens chat with AlphaTechX Bot
- Bot sends welcome message with their unique user ID

### 3. User Uploads Documents
- User goes to `https://alphatechx.fly.dev`
- Signs up/logs in with their Teams user ID
- Uploads documents (PDF, DOCX, images, etc.)
- Documents are processed and stored in their private namespace

### 4. User Asks Questions in Teams
- User returns to Teams chat with AlphaTechX Bot
- Asks questions about their documents
- Bot responds with answers based ONLY on their uploaded documents

---

## 🔒 Security & Data Isolation

### How It Works:
1. **Single Bot, Multiple Users**: One bot serves all customers
2. **User Identification**: Teams user ID uniquely identifies each user
3. **Data Isolation**: Each user's documents stored in separate Pinecone namespace: `user-{userId}`
4. **Query Isolation**: Bot only searches the specific user's namespace
5. **No Cross-User Access**: User A cannot access User B's documents

### Example:
- User `alice@company1.com` uploads "Company1 Handbook.pdf"
- User `bob@company2.com` uploads "Company2 Policy.docx"
- When Alice asks a question, bot only searches `user-alice@company1.com` namespace
- When Bob asks a question, bot only searches `user-bob@company2.com` namespace
- Complete isolation! ✅

---

## 🧪 Testing the Bot

### Test in Azure Web Chat (Quick Test)

1. Go to Azure Portal → Your Bot → **Test in Web Chat**
2. Send a message: `hello`
3. Bot should respond with welcome message
4. ✅ If it works here, it will work in Teams!

### Test in Teams (Full Test)

1. Install the bot in YOUR Teams (using `AlphaTechX-Bot.zip`)
2. Open chat with AlphaTechX Bot
3. Bot sends welcome message with your user ID
4. Go to `https://alphatechx.fly.dev`
5. Sign up with your Teams user ID
6. Upload a test document
7. Return to Teams and ask a question about the document
8. Bot should respond with information from YOUR document

---

## 📤 Distributing to Customers

### Method 1: Download Link
Host `AlphaTechX-Bot.zip` on your website:
```
https://alphatechx.fly.dev/downloads/AlphaTechX-Bot.zip
```

Users download and upload to Teams.

### Method 2: Email Attachment
Email the zip file directly to customers with installation instructions.

### Method 3: Microsoft Teams App Store (Future)
Submit to Microsoft Teams App Store for public distribution:
- Requires app validation by Microsoft
- Makes bot discoverable in Teams app store
- Professional distribution method

---

## 🎯 Key Benefits of This Architecture

✅ **No Azure Setup for Users** - Users don't need Azure accounts
✅ **One-Click Install** - Just upload zip file to Teams
✅ **Multi-Tenant** - Works for any organization
✅ **Data Isolated** - Each user has private knowledge base
✅ **Scalable** - Single bot serves unlimited users
✅ **Enterprise-Grade** - Professional, secure architecture

---

## 🐛 Troubleshooting

### Bot Not Responding in Teams

**Check:**
1. Is the messaging endpoint configured correctly in Azure?
   - Should be: `https://alphatechx.fly.dev/api/teams/messages`
2. Is the Teams channel enabled in Azure Bot?
3. Is the app registration set to "Multi-tenant"?
4. Check Fly.io logs: `flyctl logs`

### User Can't Find Their Documents

**Check:**
1. Did user upload documents using the SAME user ID shown by the bot?
2. Check Pinecone namespace: `user-{userId}`
3. Verify documents were processed successfully in web UI

### Bot Installation Fails in Teams

**Check:**
1. Is the manifest.json valid?
2. Are the icon files present in the zip?
3. Try re-creating the package: `cd teams-app && ./create-simple-package.sh`

---

## 📊 Current Status

| Component | Status | Details |
|-----------|--------|---------|
| Bot Service | ✅ Deployed | Running on Fly.io |
| Azure Bot | ✅ Configured | App ID: 897997b6... |
| Teams Channel | ⏳ Pending | Enable in Azure Portal |
| Messaging Endpoint | ⏳ Pending | Configure in Azure Portal |
| Teams App Package | ✅ Ready | teams-app/AlphaTechX-Bot.zip |
| Multi-Tenant | ✅ Ready | Needs Azure app registration update |

---

## 🎯 Next Steps for YOU

1. **Configure Azure Bot**:
   - Set messaging endpoint
   - Enable Teams channel
   - Make app registration multi-tenant

2. **Test the Bot**:
   - Install in your Teams
   - Upload a document
   - Ask questions

3. **Distribute to Users**:
   - Share `AlphaTechX-Bot.zip`
   - Provide installation instructions
   - Support users as needed

---

## 📞 Support

If you need help:
1. Check Fly.io logs: `flyctl logs`
2. Check Azure Bot logs in Azure Portal
3. Verify webhook is receiving requests: Look for "🔔 Teams webhook received" in logs

---

## 🎉 You're All Set!

Your AlphaTechX Bot is ready to serve customers! Just complete the Azure Portal configuration and start distributing the Teams app package.

**Remember**: This is a true enterprise SaaS bot - one bot, unlimited users, complete data isolation! 🚀

