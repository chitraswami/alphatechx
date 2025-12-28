# AlphaTechX Teams App Package

This directory contains the Microsoft Teams app package for AlphaTechX Bot.

## 📦 What's Included:

- `manifest.json` - Teams app configuration
- `color.png` - 192x192px color icon (required)
- `outline.png` - 32x32px outline icon (required)

## 🎨 Icon Requirements:

### Color Icon (color.png):
- Size: 192x192 pixels
- Format: PNG
- Background: Your brand color (#4F46E5 - indigo)
- Content: AlphaTechX logo or "A" letter

### Outline Icon (outline.png):
- Size: 32x32 pixels
- Format: PNG with transparency
- Color: White outline only
- Background: Transparent

## 📦 How to Create the Package:

1. Add your icons (color.png and outline.png) to this directory
2. Zip all three files together:
   ```bash
   cd teams-app
   zip -r AlphaTechX-Bot.zip manifest.json color.png outline.png
   ```

## 🚀 How Users Install:

### Option 1: Direct Install (Easiest)
1. Go to Microsoft Teams
2. Click "Apps" (bottom left)
3. Click "Manage your apps" → "Upload a custom app"
4. Upload `AlphaTechX-Bot.zip`
5. Click "Add" to install

### Option 2: Admin Install (For Organizations)
1. Admin goes to Teams Admin Center
2. Manage apps → Upload custom app
3. Upload `AlphaTechX-Bot.zip`
4. Approve for organization
5. All users can now install from their Teams app store

## 🎯 User Experience:

Once installed:
1. User opens chat with AlphaTechX Bot in Teams
2. Bot greets them and provides their unique user ID
3. User goes to https://YOUR_DOMAIN
4. Signs up/logs in with that user ID
5. Uploads documents
6. Returns to Teams and asks questions!

## 🔧 Configuration:

The bot is already configured with:
- Bot ID: `17f24117-7419-4fa2-bd29-f77504c40e03`
- Webhook URL: `https://YOUR_DOMAIN/api/teams/messages`
- Multi-tenant support: ✅ Enabled
- Data isolation: ✅ Per-user namespaces in Pinecone

## 📝 Next Steps:

1. Create the icon files (or use placeholders)
2. Zip the package
3. Distribute to users via:
   - Email attachment
   - Download link on your website
   - Teams Admin Center (for enterprise customers)

## 🎉 Benefits:

- ✅ **No Azure setup required** for users
- ✅ **One-click install** in Teams
- ✅ **Works for all organizations** (multi-tenant)
- ✅ **Secure data isolation** per user
- ✅ **Enterprise-grade** architecture

