const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  twilioPhoneNumber: {
    type: String,
    unique: true,
    sparse: true // Allows null values but enforces uniqueness when present
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  settings: {
    workingHours: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '18:00' }
    },
    workingDays: {
      type: [String],
      default: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    appointmentDuration: {
      type: Number,
      default: 30 // minutes
    },
    language: {
      type: String,
      enum: ['hi', 'en', 'both'],
      default: 'both'
    },
    greetingMessage: {
      en: { type: String, default: 'Hello! Welcome to MediConnect. How can I help you today?' },
      hi: { type: String, default: 'नमस्ते! MediConnect में आपका स्वागत है। मैं आपकी कैसे मदद कर सकता हूं?' }
    }
  },
  billing: {
    costPerCall: {
      type: Number,
      default: 50 // ₹50 per call
    },
    currency: {
      type: String,
      default: 'INR'
    },
    billingEmail: String,
    contactPerson: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
hospitalSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Hospital', hospitalSchema);
