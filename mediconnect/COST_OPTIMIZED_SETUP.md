# MediConnect - Cost-Optimized Setup Guide

## 💰 Budget-Friendly External Services for MVP

---

## 🎯 Goal: Keep Monthly Costs Under ₹10,000

For MVP with ~200 calls/month

---

## 📞 Option 1: Exotel (Recommended for India) ⭐

### **Cost Breakdown:**

| Service | Cost |
|---------|------|
| Virtual Number (India) | ₹500/month |
| Incoming Voice | ₹0.50/minute |
| Outgoing Voice | ₹1.00/minute |
| SMS (India) | ₹0.25/SMS |
| Setup Fee | ₹1,000 (one-time) |

### **Estimated Monthly Cost (200 calls, 5 min avg):**
```
Virtual Number: ₹500
Incoming Calls: 200 × 5 min × ₹0.50 = ₹500
SMS Confirmations: 200 × ₹0.25 = ₹50
TOTAL: ₹1,050/month
```

**28% cheaper than Twilio!** ✅

### **Setup Steps:**

1. **Sign Up for Exotel**
   ```
   URL: https://exotel.com/
   - Indian company, TRAI compliant
   - Free trial available
   - Better for Indian hospitals
   ```

2. **Complete KYC (1-2 days)**
   ```bash
   Required Documents:
   - PAN Card
   - Business Registration (or Aadhaar)
   - Address Proof
   - GST Certificate (optional)
   ```

3. **Get Virtual Number**
   ```bash
   # Choose from available cities:
   - Mumbai: 022-XXXX-XXXX
   - Delhi: 011-XXXX-XXXX
   - Bangalore: 080-XXXX-XXXX
   - Jaipur: 0141-XXXX-XXXX
   - And 40+ more cities
   
   Cost: ₹500/month per number
   ```

4. **Get API Credentials**
   ```
   API Key: xxxxxxxxxxxxx
   API Token: xxxxxxxxxxxxx
   SID: xxxxxxxxxxxxx
   Phone Number: +91XXXXXXXXXX
   ```

5. **Configure Webhook**
   ```
   Voice URL: https://alfatechx.com/api/mediconnect/voice/incoming
   Method: POST
   Format: Exotel Passthru App
   ```

**Why Exotel over Twilio:**
- ✅ Indian numbers readily available
- ✅ Better call quality in India
- ✅ 28% cheaper
- ✅ TRAI compliant
- ✅ Used by Apollo, Fortis, Max hospitals

---

## 🗣️ Option 2: Speech Services (Google vs Azure vs Open Source)

### **A. Google Cloud Speech-to-Text (Recommended)**

**Free Tier:**
- 60 minutes FREE per month
- After: ₹0.40 per 15 seconds (₹1.60/min)

**Cost for 200 calls (5 min avg = 1000 minutes):**
```
First 60 min: FREE
Remaining 940 min: 940 × ₹1.60 = ₹1,504/month
```

**Setup:**
```bash
# 1. Create Google Cloud Project
https://console.cloud.google.com/

# 2. Enable Speech-to-Text API
gcloud services enable speech.googleapis.com

# 3. Create Service Account
gcloud iam service-accounts create mediconnect-stt \
  --display-name="MediConnect Speech Service"

# 4. Download credentials
gcloud iam service-accounts keys create ./google-credentials.json \
  --iam-account=mediconnect-stt@PROJECT_ID.iam.gserviceaccount.com

# 5. Set environment variable
export GOOGLE_APPLICATION_CREDENTIALS="./google-credentials.json"
```

**Indian Language Support:**
- Hindi (hi-IN) ✅
- English (en-IN) ✅
- Tamil, Telugu, Bengali (Future)

---

### **B. Azure Cognitive Services (Alternative)**

**Free Tier:**
- 5 audio hours FREE per month
- After: ₹0.80 per minute

**Cost for 200 calls:**
```
First 300 min: FREE
Remaining 700 min: 700 × ₹0.80 = ₹560/month
```

**Setup:**
```bash
# 1. Create Azure Account
https://azure.microsoft.com/free/

# 2. Create Speech Service
az cognitiveservices account create \
  --name mediconnect-speech \
  --resource-group mediconnect-rg \
  --kind SpeechServices \
  --sku F0 \
  --location centralindia

# 3. Get API Key
az cognitiveservices account keys list \
  --name mediconnect-speech \
  --resource-group mediconnect-rg
```

---

### **C. Deepgram (Best Price/Performance)**

**Pricing:**
- ₹0.20 per minute (50% cheaper than Google!)
- Pay-as-you-go
- Free $200 credit for new accounts

**Cost for 200 calls:**
```
1000 minutes × ₹0.20 = ₹200/month 🎉
```

**Setup:**
```bash
# 1. Sign up at https://deepgram.com/
# Get $200 free credit

# 2. Get API Key from console
DEEPGRAM_API_KEY=xxxxxxxxxxxxx

# 3. Test API
curl -X POST "https://api.deepgram.com/v1/listen" \
  -H "Authorization: Token ${DEEPGRAM_API_KEY}" \
  -H "Content-Type: audio/wav" \
  --data-binary @test-audio.wav
```

**Indian Language Support:**
- Hindi ✅
- English (Indian accent) ✅

---

## 🔊 Text-to-Speech (TTS) Options

### **A. Google Cloud TTS**

**Free Tier:**
- 1 million characters FREE per month
- After: ₹16 per million characters

**Cost for 200 calls (avg 500 chars/response = 100,000 chars):**
```
100,000 chars = FREE (under 1M limit) ✅
```

---

### **B. ElevenLabs (Best Voice Quality)**

**Pricing:**
- Starter Plan: $5/month (₹415)
- 30,000 characters/month
- Ultra-realistic Indian voices

**Good for:** Premium quality demos

---

### **C. Open Source: Coqui TTS (FREE)**

**Cost: ₹0 (Self-hosted)**

**Setup:**
```bash
pip install TTS

# Download Indian English model
tts --text "Hello, welcome to MediConnect" \
    --model_name tts_models/en/ljspeech/tacotron2-DDC \
    --out_path output.wav
```

**Pros:**
- Completely free
- No API limits
- Run on your server

**Cons:**
- Lower quality than Google/ElevenLabs
- Requires GPU for real-time (optional)

---

## 🤖 LLM for Conversational AI

### **OpenAI GPT-4o-mini (✅ You Already Have This!)**

**Pricing:**
- Input: $0.15 per 1M tokens (₹12.50)
- Output: $0.60 per 1M tokens (₹50)

**Cost for 200 calls (avg 1000 tokens/call = 200K tokens):**
```
Input: 100K × ₹0.12 = ₹12
Output: 100K × ₹0.50 = ₹50
TOTAL: ₹62/month ✅
```

**Why OpenAI is Perfect for MediConnect:**
- ✅ Best Hindi language understanding (better than Gemini)
- ✅ Excellent intent detection
- ✅ Structured output (JSON mode) for extracting symptoms/dates
- ✅ Function calling for booking appointments
- ✅ Very reliable for production

**Setup:**
```bash
# You already have this!
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxx

# Use GPT-4o-mini for cost efficiency
MODEL=gpt-4o-mini
```

**Alternative Models:**
- `gpt-4o-mini` - ₹62/month (200 calls) - **Recommended for MVP**
- `gpt-4o` - ₹500/month (200 calls) - Better quality, 8x more expensive
- `gpt-3.5-turbo` - ₹30/month (200 calls) - Cheaper but lower quality

---

### **Option C: Llama 3.1 8B (Self-Hosted - FREE)**

**Cost: ₹0 (Run on your server)**

**Requirements:**
- 16GB RAM minimum
- Works without GPU (CPU inference)

**Setup:**
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Download model
ollama pull llama3.1:8b

# Test
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.1:8b",
  "prompt": "Patient says: मुझे दांत दर्द है। What specialty?"
}'
```

---

## 💳 Complete Cost Comparison

### **Budget Option (MVP - 200 calls/month):**

| Service | Provider | Monthly Cost |
|---------|----------|--------------|
| Phone Number | Exotel | ₹500 |
| Voice Calls | Exotel | ₹500 |
| SMS | Exotel | ₹50 |
| Speech-to-Text | Deepgram | ₹200 |
| Text-to-Speech | Google (Free tier) | ₹0 |
| LLM | OpenAI GPT-4o-mini | ₹62 |
| **TOTAL** | | **₹1,312/month** ✅ |

**Revenue at ₹50/call:** 200 × ₹50 = **₹10,000/month**  
**Profit:** ₹10,000 - ₹1,312 = **₹8,688/month** 💰

**₹410/month cheaper than Twilio!** 🎉

---

### **Production Option (1000 calls/month):**

| Service | Provider | Monthly Cost |
|---------|----------|--------------|
| Phone Number | Exotel | ₹500 |
| Voice Calls | Exotel | ₹2,500 |
| SMS | Exotel | ₹250 |
| Speech-to-Text | Deepgram | ₹1,000 |
| Text-to-Speech | Google | ₹0 (free tier) |
| LLM | OpenAI GPT-4o-mini | ₹310 |
| **TOTAL** | | **₹4,560/month** |

**Revenue at ₹50/call:** 1000 × ₹50 = **₹50,000/month**  
**Profit:** ₹50,000 - ₹4,560 = **₹45,440/month** 💰💰

**₹1,250/month cheaper than Twilio!** 🎉

---

## 🎯 Recommended Setup for Your MVP

### **Phase 1: Free Trial (0-50 calls)**
```
✅ Exotel Free Trial
✅ Google Cloud Free Tier (60 min STT)
✅ Google TTS Free Tier (1M chars)
✅ OpenAI API (You already have!)
✅ Deploy on existing Digital Ocean server

Total Cost: ~₹100 for first month (only OpenAI) 🎉
```

### **Phase 2: Paid Plan (50+ calls)**
```
✅ Exotel Pay-as-you-go (₹1,050/month)
✅ Deepgram STT (₹200/month)
✅ Google TTS (still free)
✅ OpenAI GPT-4o-mini (₹62/month)

Total Cost: ~₹1,312/month
Revenue: ₹2,500+ (50 calls × ₹50)
Profit: ₹1,188/month 💰
```

---

## 📋 Step-by-Step Setup

### **1. Exotel Setup (10 minutes + 1-2 days KYC)**
```bash
# Sign up at https://exotel.com/
# Click "Start Free Trial"

# Upload KYC Documents:
# - PAN Card (mandatory)
# - Business Registration or Aadhaar
# - Address Proof

# Wait 1-2 days for approval

# After approval:
# - Choose virtual number from available cities
# - Get API credentials from dashboard
# - Configure webhook URL
```

### **2. Google Cloud Setup (10 minutes)**
```bash
# Create free account: https://cloud.google.com/free
# Get ₹24,000 FREE credit for 90 days!

# Enable APIs
gcloud services enable speech.googleapis.com
gcloud services enable texttospeech.googleapis.com

# Create service account and download JSON key
gcloud iam service-accounts create mediconnect \
  --display-name="MediConnect Bot"

gcloud iam service-accounts keys create ./google-key.json \
  --iam-account=mediconnect@PROJECT_ID.iam.gserviceaccount.com
```

### **3. OpenAI API Key (Already Have!)**
```bash
# You already have your OpenAI API key!
# Just add it to environment variables

# Verify your key works:
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Say hello in Hindi"}]
  }'
```

### **4. Environment Variables**
```bash
# Add to mediconnect/voice-service/.env

# Voice Provider (Exotel)
VOICE_PROVIDER=exotel
EXOTEL_API_KEY=xxxxxxxxxxxxx
EXOTEL_API_TOKEN=xxxxxxxxxxxxx
EXOTEL_SID=xxxxxxxxxxxxx
EXOTEL_PHONE_NUMBER=+91XXXXXXXXXX

# Speech Services
GOOGLE_APPLICATION_CREDENTIALS=./google-key.json
DEEPGRAM_API_KEY=xxxxxxxxxxxxx

# OpenAI API (You already have this!)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4o-mini

# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/mediconnect

# Backend API URL
BACKEND_URL=http://localhost:5003

# Billing
COST_PER_CALL=50
```

---

## 🎉 Summary

### **Your MVP Setup:**

✅ **Total Initial Investment:** ₹0 (using free trials)  
✅ **Monthly Cost (after trial):** ₹1,500-2,000  
✅ **Revenue per call:** ₹50  
✅ **Break-even:** 30-40 calls/month  
✅ **Target:** 200+ calls/month = ₹8,000+ profit  

### **Next Steps:**

1. Sign up for Twilio (free trial)
2. Create Google Cloud project (free ₹24K credit)
3. Get Gemini API key (free forever)
4. I'll build the voice bot integration
5. Test with demo-hospital1
6. Scale to multiple hospitals

---

**Ready to proceed?** I'll now build the voice service with these cost-optimized providers! 🚀
