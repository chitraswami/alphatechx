const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  section: {
    type: String,
    required: [true, 'Please provide content section'],
    enum: ['home', 'about', 'contact', 'general'],
    index: true,
  },
  key: {
    type: String,
    required: [true, 'Please provide content key'],
    index: true,
  },
  type: {
    type: String,
    required: [true, 'Please provide content type'],
    enum: ['text', 'html', 'image', 'json', 'array'],
    default: 'text',
  },
  title: {
    type: String,
    required: [true, 'Please provide content title'],
    trim: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Please provide content value'],
  },
  description: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Create compound index for section and key
contentSchema.index({ section: 1, key: 1 }, { unique: true });

module.exports = mongoose.model('Content', contentSchema); 