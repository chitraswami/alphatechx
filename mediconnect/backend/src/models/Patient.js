const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  age: {
    type: Number
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say']
  },
  languagePreference: {
    type: String,
    enum: ['hi', 'en'],
    default: 'hi'
  },
  // Medical history (optional for future)
  allergies: [String],
  chronicConditions: [String],
  // Appointment history count
  totalAppointments: {
    type: Number,
    default: 0
  },
  completedAppointments: {
    type: Number,
    default: 0
  },
  cancelledAppointments: {
    type: Number,
    default: 0
  },
  noShowCount: {
    type: Number,
    default: 0
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

// Index for phone number lookups
patientSchema.index({ phoneNumber: 1 });

// Update timestamp on save
patientSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Patient', patientSchema);
