const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  callSid: {
    type: String,
    unique: true,
    sparse: true
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital'
  },
  hospitalName: String,
  callerNumber: {
    type: String,
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  },
  channel: {
    type: String,
    enum: ['voice', 'whatsapp', 'sms', 'web'],
    default: 'voice'
  },
  language: {
    type: String,
    default: 'hi-IN'
  },
  // Conversation turns (voice call dialogue)
  turns: [{
    userSpeech: String,
    botResponse: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
  }],
  // Conversation state
  state: {
    type: String,
    default: 'greeting'
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'failed', 'abandoned'],
    default: 'in_progress'
  },
  callStatus: String,
  // Outcome
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
