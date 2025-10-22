const mongoose = require('mongoose');

const userIntegrationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  // Microsoft Teams Bot Integration
  microsoftAppId: {
    type: String,
    required: false
  },
  microsoftAppPassword: {
    type: String,
    required: false
  },
  microsoftBotServiceUrl: {
    type: String,
    required: false
  },
  // Slack Bot Integration (for future use)
  slackBotToken: {
    type: String,
    required: false
  },
  slackSigningSecret: {
    type: String,
    required: false
  },
  // Integration status
  isActive: {
    type: Boolean,
    default: false
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

// Ensure one integration per user
userIntegrationSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('UserIntegration', userIntegrationSchema);
