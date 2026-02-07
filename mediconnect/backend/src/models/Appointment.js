const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  appointmentNumber: {
    type: String,
    unique: true,
    required: true
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  patientPhone: {
    type: String,
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String, // "14:00" format
    required: true
  },
  duration: {
    type: Number,
    default: 30 // minutes
  },
  chiefComplaint: {
    original: String, // In patient's language
    translated: String // English translation
  },
  symptoms: [String],
  specialty: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['booked', 'confirmed', 'completed', 'cancelled', 'no_show', 'rescheduled'],
    default: 'booked'
  },
  // Conversation details
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  },
  bookedVia: {
    type: String,
    enum: ['voice', 'whatsapp', 'sms', 'web', 'manual'],
    default: 'voice'
  },
  language: {
    type: String,
    enum: ['hi', 'en'],
    default: 'hi'
  },
  // Reminders sent
  remindersSent: [{
    sentAt: Date,
    type: { type: String, enum: ['sms', 'whatsapp', 'call'] },
    status: { type: String, enum: ['sent', 'delivered', 'failed'] }
  }],
  // Follow-up
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  // Notes from conversation
  botNotes: String,
  doctorNotes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for common queries
appointmentSchema.index({ hospitalId: 1, appointmentDate: 1 });
appointmentSchema.index({ doctorId: 1, appointmentDate: 1, status: 1 });
appointmentSchema.index({ patientId: 1, status: 1 });
appointmentSchema.index({ appointmentNumber: 1 });

// Generate appointment number before saving
appointmentSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.appointmentNumber = `MED-${dateStr}-${random}`;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);
