# MediConnect - Complete Implementation Plan

## 📦 Project Structure Created

```
alphatechx-app/alphatechx/
├── app/                          # Existing AlphaTechX enterprise bot
├── backend/                      # Existing AlphaTechX backend
├── bot-service/                  # Existing AlphaTechX Teams bot
├── frontend/                     # Existing AlphaTechX frontend
└── mediconnect/                  # NEW - Hospital Voice Bot
    ├── backend/                  # MediConnect API (Port 5003)
    │   ├── src/
    │   │   ├── models/          ✅ DONE
    │   │   │   ├── Hospital.js
    │   │   │   ├── Doctor.js
    │   │   │   ├── Patient.js
    │   │   │   ├── Appointment.js
    │   │   │   └── Conversation.js
    │   │   ├── controllers/     🔄 IN PROGRESS
    │   │   ├── routes/          🔄 IN PROGRESS
    │   │   └── server.js        ✅ DONE
    │   └── package.json         ✅ DONE
    ├── voice-service/           ⏳ NEXT
    │   ├── src/
    │   │   ├── server.js        # Twilio webhook handler
    │   │   ├── speechToText.js  # Google STT / Deepgram
    │   │   ├── textToSpeech.js  # Google TTS
    │   │   ├── conversationManager.js
    │   │   ├── intentRouter.js
    │   │   └── appointmentBooker.js
    │   └── package.json
    ├── frontend/                ⏳ LATER
    │   └── # React dashboard for hospitals
    └── COST_OPTIMIZED_SETUP.md  ✅ DONE
```

---

## 🎯 What I'm Building Now

### Current Phase: Backend API (30% Complete)

#### ✅ Completed:
1. Database models (Hospital, Doctor, Patient, Appointment, Conversation)
2. Server setup with Express
3. MongoDB connection
4. Cost-optimized setup guide

#### 🔄 In Progress (Next 5 files):
1. Hospital controller & routes
2. Doctor controller & routes
3. Appointment controller & routes
4. Seed script for demo-hospital1
5. Analytics routes

#### ⏳ Coming Next:
1. Voice service (Twilio integration)
2. Speech-to-Text integration (Deepgram/Google)
3. Conversational AI (Gemini 2.0 Flash)
4. SMS/WhatsApp notifications
5. Frontend dashboard

---

## 🏗️ Architecture on Same Server

### Digital Ocean Server (157.245.96.101)

```
Current Services:
├── AlphaTechX Frontend (Port 3000)
├── AlphaTechX Backend (Port 5001)
└── AlphaTechX Bot Service (Port 4000)

NEW Services (Same Server):
├── MediConnect Backend (Port 5003)
├── MediConnect Voice Service (Port 5002)
└── MediConnect Frontend (Port 3001)

Database:
└── MongoDB Atlas (Shared with AlphaTechX)
    ├── alphatechx (existing database)
    └── mediconnect (new database)
```

### Nginx Configuration

```nginx
# AlphaTechX (Existing)
location /api {
    proxy_pass http://localhost:5001;
}

location /teams {
    proxy_pass http://localhost:4000;
}

# MediConnect (NEW)
location /api/mediconnect {
    proxy_pass http://localhost:5003;
}

location /api/voice {
    proxy_pass http://localhost:5002;
}

location /mediconnect {
    proxy_pass http://localhost:3001;
}
```

---

## 💰 Billing Model: ₹50/Call

### How It Works:

```javascript
// Every call creates a Conversation record
{
  callSid: "CA1234567890",
  hospitalId: "demo-hospital1",
  patientPhone: "+919876543210",
  duration: 480, // 8 minutes
  bookingSuccessful: true,
  billable: true, // ✅ Charged
  billingAmount: 50, // ₹50
  billed: false // Invoice not generated yet
}

// At end of month: Generate invoices
Hospital: demo-hospital1
Total Calls: 150
Billable Calls: 145 (5 failed calls < 30 seconds = free)
Amount: 145 × ₹50 = ₹7,250
```

### Billing Rules:
- ✅ Charge ₹50 per call (regardless of booking success)
- ✅ Only calls > 30 seconds are billable
- ✅ Failed/dropped calls < 30 sec = FREE
- ✅ Monthly invoice generation
- ✅ Track revenue per hospital

---

## 🎤 Voice Bot Flow

### Call Journey:

```
1. Patient dials: +91-XXXXX-XXXXX (Hospital's Twilio number)
   ↓
2. Twilio webhook: POST https://alfatechx.com/api/voice/incoming
   {
     "From": "+919876543210",
     "CallSid": "CA1234567890",
     "To": "+91XXXXX" // Hospital's number
   }
   ↓
3. Look up hospital by Twilio number
   ↓
4. Create Conversation record
   ↓
5. Play greeting (TTS):
   "नमस्ते! demo-hospital1 में आपका स्वागत है। मैं आपकी कैसे मदद कर सकता हूं?"
   ↓
6. Listen for patient response (STT)
   ↓
7. Detect language (Hindi/English)
   ↓
8. Extract intent:
   - BOOK_APPOINTMENT
   - ASK_AVAILABILITY
   - DESCRIBE_SYMPTOM
   - ASK_ABOUT_DOCTOR
   etc.
   ↓
9. Route to appropriate flow:
   
   If BOOK_APPOINTMENT:
   ├─► Collect symptoms
   ├─► Route to specialty
   ├─► Show available doctors
   ├─► Show time slots
   ├─► Collect patient info
   ├─► Confirm booking
   └─► Send SMS confirmation
   
   If ASK_AVAILABILITY:
   ├─► Ask which doctor/specialty
   └─► List available slots
   
   etc.
   ↓
10. End call & save conversation
    ↓
11. Generate bill record (₹50)
    ↓
12. Send post-call SMS:
    "आपका अपॉइंटमेंट बुक हो गया! 15 Feb 2026, 2:00 PM, Dr. Sharma के साथ।"
```

---

## 🗄️ Database Design

### Collections:

#### 1. **hospitals**
```javascript
{
  _id: ObjectId("..."),
  name: "demo-hospital1",
  slug: "demo-hospital1",
  phoneNumber: "0141-4000000",
  twilioPhoneNumber: "+91XXXXXXXXXX", // Unique per hospital
  address: {
    street: "123 Main Street",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302001"
  },
  settings: {
    workingHours: { start: "09:00", end: "18:00" },
    workingDays: ["monday", "tuesday", ...],
    appointmentDuration: 30,
    language: "both",
    greetingMessage: {
      en: "Hello! Welcome to demo-hospital1...",
      hi: "नमस्ते! demo-hospital1 में..."
    }
  },
  billing: {
    costPerCall: 50,
    currency: "INR",
    billingEmail: "billing@demo-hospital1.com"
  },
  isActive: true
}
```

#### 2. **doctors**
```javascript
{
  _id: ObjectId("..."),
  hospitalId: ObjectId("..."),
  name: "Dr. Sharma",
  specialty: "dentistry",
  qualification: "BDS, MDS",
  experience: 15,
  languages: ["hi", "en"],
  consultationFee: 500,
  schedule: {
    monday: {
      available: true,
      slots: [
        { start: "10:00", end: "13:00" },
        { start: "14:00", end: "17:00" }
      ]
    },
    // ... other days
  },
  rating: 4.8,
  isActive: true
}
```

#### 3. **appointments**
```javascript
{
  _id: ObjectId("..."),
  appointmentNumber: "MED-20260215-1234",
  hospitalId: ObjectId("..."),
  doctorId: ObjectId("..."),
  patientId: ObjectId("..."),
  patientPhone: "+919876543210",
  appointmentDate: ISODate("2026-02-15T00:00:00Z"),
  appointmentTime: "14:00",
  duration: 30,
  chiefComplaint: {
    original: "मुझे दांत दर्द है",
    translated: "I have tooth pain"
  },
  symptoms: ["दांत दर्द", "tooth pain"],
  specialty: "dentistry",
  status: "booked",
  conversationId: ObjectId("..."),
  bookedVia: "voice",
  language: "hi"
}
```

#### 4. **conversations**
```javascript
{
  _id: ObjectId("..."),
  callSid: "CA1234567890",
  hospitalId: ObjectId("..."),
  patientPhone: "+919876543210",
  channel: "voice",
  language: "hi",
  messages: [
    {
      role: "bot",
      text: "नमस्ते! मैं आपकी कैसे मदद कर सकता हूं?",
      timestamp: ISODate("..."),
      intent: "greeting"
    },
    {
      role: "patient",
      text: "मुझे दांत दर्द है",
      timestamp: ISODate("..."),
      intent: "DESCRIBE_SYMPTOM",
      entities: {
        symptom: "दांत दर्द",
        specialty: "dentistry"
      }
    }
  ],
  currentState: "closure",
  bookingSuccessful: true,
  appointmentId: ObjectId("..."),
  duration: 480, // 8 minutes
  billable: true,
  billingAmount: 50,
  billed: false
}
```

---

## 📊 API Endpoints (Being Built)

### Hospital Management
```
GET    /api/hospitals              # List all hospitals
GET    /api/hospitals/:id          # Get hospital details
POST   /api/hospitals              # Create hospital (admin only)
PUT    /api/hospitals/:id          # Update hospital
DELETE /api/hospitals/:id          # Delete hospital
GET    /api/hospitals/slug/:slug   # Get by slug (demo-hospital1)
```

### Doctor Management
```
GET    /api/doctors                    # List doctors (filter by hospital/specialty)
GET    /api/doctors/:id                # Get doctor details
POST   /api/doctors                    # Add doctor
PUT    /api/doctors/:id                # Update doctor
DELETE /api/doctors/:id                # Delete doctor
GET    /api/doctors/:id/availability   # Get available slots
```

### Appointment Management
```
GET    /api/appointments                      # List appointments
GET    /api/appointments/:id                  # Get appointment
POST   /api/appointments                      # Create appointment
PUT    /api/appointments/:id                  # Update appointment
DELETE /api/appointments/:id                  # Cancel appointment
GET    /api/appointments/hospital/:id         # Hospital's appointments
GET    /api/appointments/doctor/:id           # Doctor's appointments
GET    /api/appointments/patient/:phone       # Patient's appointments
POST   /api/appointments/:id/reschedule       # Reschedule
```

### Conversation & Billing
```
GET    /api/conversations                     # List conversations
GET    /api/conversations/:id                 # Get conversation
GET    /api/conversations/hospital/:id        # Hospital's conversations
POST   /api/conversations                     # Create (from voice service)
PUT    /api/conversations/:id                 # Update conversation state
GET    /api/conversations/unbilled            # Get unbilled calls
POST   /api/conversations/generate-invoice    # Generate monthly invoice
```

### Analytics
```
GET    /api/analytics/hospital/:id            # Hospital dashboard stats
GET    /api/analytics/revenue                 # Revenue analytics
GET    /api/analytics/appointments            # Appointment trends
GET    /api/analytics/conversations           # Call analytics
```

---

## 🚀 Deployment Plan (Same Server)

### Docker Compose Update

```yaml
# docker-compose.prod.yml (Update)

services:
  # Existing services (keep as-is)
  alphatechx-frontend:
    # ... existing config ...
  
  alphatechx-backend:
    # ... existing config ...
  
  alphatechx-bot:
    # ... existing config ...

  # NEW: MediConnect services
  mediconnect-backend:
    build: ./mediconnect/backend
    container_name: mediconnect-backend
    ports:
      - "5003:5003"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - PORT=5003
    restart: always

  mediconnect-voice:
    build: ./mediconnect/voice-service
    container_name: mediconnect-voice
    ports:
      - "5002:5002"
    environment:
      - NODE_ENV=production
      - PORT=5002
      - TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID}
      - TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - OPENAI_MODEL=gpt-4o-mini
      - GOOGLE_APPLICATION_CREDENTIALS=/app/google-key.json
      - BACKEND_URL=http://mediconnect-backend:5003
    volumes:
      - ./google-key.json:/app/google-key.json:ro
    restart: always

  mediconnect-frontend:
    build: ./mediconnect/frontend
    container_name: mediconnect-frontend
    ports:
      - "3001:80"
    environment:
      - REACT_APP_API_URL=https://alfatechx.com/api/mediconnect
    restart: always
```

### No Additional Server Cost!
- Same Digital Ocean droplet (4GB RAM is enough)
- Only paying for external APIs (Twilio, Google Cloud)
- Total server cost: Still ₹0 increase

---

## 📅 Development Timeline

### Week 1: Backend & Voice Service (Current)
- ✅ Day 1: Database models (DONE)
- 🔄 Day 2: API routes & controllers (IN PROGRESS)
- ⏳ Day 3: Voice service setup
- ⏳ Day 4: Twilio integration
- ⏳ Day 5: Speech services (STT/TTS)
- ⏳ Day 6: Conversation AI (Gemini)
- ⏳ Day 7: End-to-end testing

### Week 2: Dashboard & Deployment
- ⏳ Day 8-9: React dashboard
- ⏳ Day 10-11: SMS/WhatsApp integration
- ⏳ Day 12-13: Deployment & testing
- ⏳ Day 14: Demo with demo-hospital1

---

## 🎯 MVP Features (2 Weeks)

### Must-Have (Week 1):
1. ✅ Multi-hospital database
2. ✅ Doctor & appointment management
3. ⏳ Voice call handling (Hindi + English)
4. ⏳ Automatic appointment booking
5. ⏳ SMS confirmations
6. ⏳ ₹50/call billing tracking

### Nice-to-Have (Week 2):
1. ⏳ Admin dashboard for hospitals
2. ⏳ WhatsApp notifications
3. ⏳ Analytics & reports
4. ⏳ Multi-language support
5. ⏳ Appointment reminders

---

## 🧪 Testing Strategy

### 1. Unit Tests
- Test each API endpoint
- Test database models
- Test intent detection

### 2. Integration Tests
- Test full voice call flow
- Test SMS delivery
- Test appointment booking

### 3. Load Tests
- Simulate 10 concurrent calls
- Test under 100 calls/hour

### 4. User Testing
- Call demo-hospital1 number
- Test Hindi conversation
- Test English conversation
- Test mixed language
- Test booking flow

---

## 🎬 Demo Scenario

### Test Call Flow:

```
Agent: "नमस्ते! demo-hospital1 में आपका स्वागत है। मैं आपकी कैसे मदद कर सकता हूं?"

Patient: "मुझे दांत दर्द है"

Agent: "मुझे खेद है सुनकर। मैं आपको dentist के पास अपॉइंटमेंट बुक कर देता हूं।
         हमारे पास Dr. Sharma हैं, जो dentistry में 15 साल के अनुभवी हैं।
         आप कब आना चाहेंगे?"

Patient: "कल दोपहर 2 बजे"

Agent: "बिल्कुल! 15 February को 2:00 PM का slot उपलब्ध है।
        आपका नाम क्या है?"

Patient: "राज कुमार"

Agent: "धन्यवाद राज जी। आपका मोबाइल नंबर?"

Patient: "९८७६५४३२१०"

Agent: "परफेक्ट! तो confirm कर दूं:
        📅 15 February 2026
        🕐 2:00 PM
        👨‍⚕️ Dr. Sharma (Dentistry)
        📍 demo-hospital1, Jaipur
        क्या यह ठीक है?"

Patient: "हां"

Agent: "बहुत अच्छा! आपका अपॉइंटमेंट बुक हो गया।
        Confirmation number: MED-20260215-1234
        आपको SMS आएगा। धन्यवाद!"

[SMS sent]:
"✅ अपॉइंटमेंट कन्फर्म!
📅 15 Feb 2026, 2:00 PM
👨‍⚕️ Dr. Sharma (दांत)
📍 demo-hospital1, Jaipur
📞 0141-4000000
Conf: MED-20260215-1234"
```

---

## 💡 Next Immediate Steps

### What I'm Building Next (Today):

1. ✅ Hospital controller & routes
2. ✅ Doctor controller & routes  
3. ✅ Appointment controller & routes
4. ✅ Seed script (populate demo-hospital1 data)
5. ✅ Test all endpoints

**ETA: 2-3 hours**

Then:
- Voice service with Twilio
- Speech integration
- Conversational AI

---

**Status:** 🟢 On Track | **Timeline:** 2 weeks MVP | **Cost:** ₹0 server increase

Ready to continue building! 🚀
