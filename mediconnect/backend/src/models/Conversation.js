const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  callSid: {
    type: String,
    unique: true,
    sparse: true // For Twilio calls
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  },
  patientPhone: {
    type: String,
    required: true
  },
  channel: {
    type: String,
    enum: ['voice', 'whatsapp', 'sms', 'web'],
    default: 'voice'
  },
  language: {
    type: String,
    enum: ['hi', 'en', 'mixed'],
    default: 'hi'
  },
  // Conversation turns
  messages: [{
    role: {
      type: String,
      enum: ['bot', 'patient', 'system']
    },
    text: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    intent: String, // Detected intent
    entities: mongoose.Schema.Types.Mixed // Extracted entities
  }],
  // Full transcript
  transcript: {
    raw: String, // Raw speech-to-text
    cleaned: String // Cleaned and formatted
  },
  // Conversation state
  currentState: {
    type: String,
    enum: [
      'greeting',
      'language_detection',
      'symptom_collection',
      'specialty_routing',
      'doctor_selection',
      'time_selection',
      'patient_info',
      'confirmation',
      'booking',
      'closure',
      'escalation'
    ],
    default: 'greeting'
  },
  collectedData: {
    symptoms: [String],
    specialty: String,
    selectedDoctor: mongoose.Schema.Types.ObjectId,
    selectedDate: Date,
    selectedTime: String,
    patientName: String,
    patientAge: Number
  },
  // Outcome
  bookingSuccessful: {
    type: Boolean,
    default: false
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  escalatedToHuman: {
    type: Boolean,
    default: false
  },
  escalationReason: String,
  // Call metrics
  duration: {
    type: Number, // seconds
    default: 0
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  // Satisfaction
  patientSatisfaction: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String
  },
  // Billing
  billable: {
    type: Boolean,
    default: true
  },
  billingAmount: {
    type: Number,
    default: 50 // ₹50 per call
  },
  billed: {
    type: Boolean,
    default: false
  },
  billedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
conversationSchema.index({ hospitalId: 1, createdAt: -1 });
conversationSchema.index({ patientPhone: 1, createdAt: -1 });
conversationSchema.index({ callSid: 1 });
conversationSchema.index({ billed: 1, billable: 1 });

// Update timestamp and duration on save
conversationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.endTime && this.startTime) {
    this.duration = Math.floor((this.endTime - this.startTime) / 1000);
  }
  next();
});

module.exports = mongoose.model('Conversation', conversationSchema);
