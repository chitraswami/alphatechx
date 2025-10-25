const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
  workspaceId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  inviteCode: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  ownerId: {
    type: String,
    required: true,
    index: true
  },
  ownerName: {
    type: String,
    default: ''
  },
  ownerEmail: {
    type: String,
    default: ''
  },
  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free'
  },
  trialEndsAt: {
    type: Date,
    default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
  },
  documentCount: {
    type: Number,
    default: 0
  },
  memberCount: {
    type: Number,
    default: 1
  },
  maxDocuments: {
    type: Number,
    default: 20 // Free plan limit
  },
  maxMembers: {
    type: Number,
    default: 5 // Free plan limit
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

// Update the updatedAt timestamp before saving
workspaceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate a unique workspace ID
workspaceSchema.statics.generateWorkspaceId = function() {
  return 'ws-' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

// Generate a unique invite code (6 characters, uppercase)
workspaceSchema.statics.generateInviteCode = function() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude similar looking chars
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

module.exports = mongoose.model('Workspace', workspaceSchema);

