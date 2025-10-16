# 🚀 AlphaTechX AI Bot - Complete Setup Guide

## 🎉 **CONGRATULATIONS!** 

Your AI Bot Creation System is now **FULLY FUNCTIONAL** with:

✅ **Real File Processing** (PDF, DOCX, Images, Excel, etc.)  
✅ **OpenAI Integration** (GPT-4 + Vision + Embeddings)  
✅ **Pinecone Vector Database** (Semantic Search)  
✅ **Microsoft Teams Bot** (Real Bot Framework Integration)  
✅ **Slack Integration** (Webhook Support)  
✅ **Multi-step Wizard UI** (Trial → Upload → Train → Integrate → Live)  

---

## 🔧 **Required API Keys Setup**

### 1. **OpenAI API Key** 🤖
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key (starts with `sk-...`)

### 2. **Pinecone API Key** 📊
1. Go to [Pinecone Console](https://app.pinecone.io/)
2. Create a free account (Starter plan)
3. Create a new index:
   - **Index Name**: `alphatechx-docs`
   - **Dimensions**: `1536` (for text-embedding-3-small)
   - **Metric**: `cosine`
   - **Environment**: Note your environment (e.g., `us-east-1-aws`)
4. Copy your API key from the dashboard

### 3. **Microsoft Teams Bot** (Optional) 🔵
1. Go to [Azure Portal](https://portal.azure.com)
2. Create **App Registration**:
   - Name: `AlphaTechX Bot`
   - Supported account types: `Any organizational directory`
3. Note the **Application (client) ID**
4. Go to **Certificates & secrets** → Create **New client secret**
5. Copy the **Value** (this is your App Password)
6. Go to [Bot Framework Portal](https://dev.botframework.com/bots)
7. Create new bot with your App ID and Password
8. Set **Messaging endpoint**: `http://your-domain.com:4000/api/integrations/teams/webhook`

---

## 🌍 **Environment Variables Setup**

Create a `.env` file in the project root:

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# Pinecone Configuration  
PINECONE_API_KEY=your-pinecone-api-key-here
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_INDEX_NAME=alphatechx-docs

# Microsoft Teams Bot Configuration (Optional)
MICROSOFT_APP_ID=your-microsoft-app-id-guid
MICROSOFT_APP_PASSWORD=your-microsoft-app-password

# Bot Service URL (for webhooks)
BOT_SERVICE_URL=http://localhost:4000
```

---

## 🚀 **Start the Application**

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f bot-service
```

---

## 🧪 **Test the Complete Flow**

### **Step 1: Access the App**
- Frontend: http://localhost:3000
- Bot Service: http://localhost:4000
- Health Check: http://localhost:4000/health

### **Step 2: Login**
Use demo credentials:
- **User**: `demo@alphatechx.com` / `demo123`
- **Admin**: `admin@alphatechx.com` / `admin123`

### **Step 3: Create Your Bot**
1. **Go to Profile** → Click **"Start 14-day Pro Trial"**
2. **Upload Files**: Drag & drop PDFs, images, documents (max 5MB each)
3. **Watch Training**: Real OpenAI embeddings generation + Pinecone storage
4. **Setup Integrations**: 
   - **Teams**: Enter `AppID|AppPassword` or just `AppPassword`
   - **Slack**: Enter `xoxb-your-bot-token`
   - **Webhook**: Enter your webhook URL
5. **Go Live**: Your bot is now responding 24/7!

---

## 🔗 **Integration Endpoints**

### **Microsoft Teams**
- **Webhook URL**: `http://localhost:4000/api/integrations/teams/webhook`
- **Validation**: Real Bot Framework credential validation
- **Features**: Welcome messages, Q&A with your documents

### **Slack** 
- **Webhook URL**: `http://localhost:4000/api/integrations/slack/webhook`
- **Features**: Event handling, message processing

### **Custom Webhook**
- **Your URL**: Any webhook endpoint you provide
- **Features**: Custom integration support

---

## 🧠 **How It Works**

### **File Processing Pipeline**
1. **Upload** → Files saved to `/uploads`
2. **Extract** → Text from PDFs, images analyzed with GPT-4 Vision
3. **Chunk** → Content split into semantic chunks (3 sentences each)
4. **Embed** → OpenAI `text-embedding-3-small` generates vectors
5. **Store** → Vectors saved to Pinecone with metadata

### **Query Processing**
1. **Message Received** → From Teams/Slack webhook
2. **Search** → Query embedded and searched in Pinecone
3. **Context** → Top 5 relevant chunks retrieved
4. **Generate** → GPT-4 generates response with context
5. **Reply** → Response sent back to Teams/Slack

---

## 🛠️ **API Endpoints**

### **File Upload**
```bash
POST /api/uploads/files
Content-Type: multipart/form-data
Authorization: Bearer <token>

# Upload multiple files (max 20, 5MB each)
```

### **Integration Validation**
```bash
POST /api/integrations/validate
{
  "type": "teams",
  "credentials": {
    "appId": "your-app-id",
    "appPassword": "your-app-password"
  }
}
```

### **Test Query**
```bash
POST /api/uploads/test-query
{
  "query": "What is AlphaTechX?"
}
```

---

## 🎯 **Next Steps**

### **For Production**
1. **Deploy** to cloud (AWS, Azure, GCP)
2. **Domain** setup for webhook endpoints
3. **SSL** certificates for HTTPS
4. **Scale** Pinecone index for more documents
5. **Monitor** with logging and analytics

### **Advanced Features**
1. **Multi-tenant** support (separate indexes per user)
2. **Advanced chunking** strategies
3. **Custom embeddings** models
4. **Real-time** collaboration
5. **Analytics** dashboard

---

## 🆘 **Troubleshooting**

### **Common Issues**

**1. OpenAI API Errors**
```bash
# Check API key
curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models
```

**2. Pinecone Connection Issues**
```bash
# Verify index exists
# Check environment and API key in Pinecone console
```

**3. Teams Bot Not Responding**
```bash
# Check webhook URL is accessible
# Verify App ID and Password in Azure
# Check bot-service logs: docker-compose logs bot-service
```

**4. File Upload Failures**
```bash
# Check file size (max 5MB)
# Verify supported formats: PDF, DOCX, XLSX, JPG, PNG, TXT
# Check bot-service logs for processing errors
```

---

## 🎉 **You're All Set!**

Your AI Bot Creation System is now **LIVE** and ready to:

🤖 **Process any document type**  
🧠 **Answer questions intelligently**  
💬 **Respond in Teams/Slack**  
🔍 **Search through your data**  
⚡ **Scale to thousands of users**  

**Happy Bot Building!** 🚀

---

*Need help? Check the logs with `docker-compose logs -f` or create an issue.*
