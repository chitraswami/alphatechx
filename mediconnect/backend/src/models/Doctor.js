const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  specialty: {
    type: String,
    required: true,
    enum: [
      'general',
      'dentistry',
      'dermatology',
      'ent', // Ear, Nose, Throat
      'pediatrics',
      'cardiology',
      'orthopedics',
      'gynecology',
      'neurology',
      'ophthalmology'
    ]
  },
  qualification: {
    type: String,
    trim: true
  },
  experience: {
    type: Number, // years
    default: 0
  },
  languages: {
    type: [String],
    default: ['hi', 'en']
  },
  consultationFee: {
    type: Number,
    default: 500
  },
  // Weekly schedule
  schedule: {
    monday: { available: Boolean, slots: [{ start: String, end: String }] },
    tuesday: { available: Boolean, slots: [{ start: String, end: String }] },
    wednesday: { available: Boolean, slots: [{ start: String, end: String }] },
    thursday: { available: Boolean, slots: [{ start: String, end: String }] },
    friday: { available: Boolean, slots: [{ start: String, end: String }] },
    saturday: { available: Boolean, slots: [{ start: String, end: String }] },
    sunday: { available: Boolean, slots: [{ start: String, end: String }] }
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  bio: {
    en: String,
    hi: String
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

// Indexes for faster queries
doctorSchema.index({ hospitalId: 1, specialty: 1 });
doctorSchema.index({ hospitalId: 1, isActive: 1 });

// Update timestamp on save
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctorSchema);
