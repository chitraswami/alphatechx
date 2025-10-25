const mongoose = require('mongoose');

const workspaceMemberSchema = new mongoose.Schema({
  workspaceId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  teamsUserId: {
    type: String,
    default: '',
    index: true
  },
  userName: {
    type: String,
    default: ''
  },
  userEmail: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['owner', 'admin', 'member'],
    default: 'member'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  lastActiveAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for workspace + user lookups
workspaceMemberSchema.index({ workspaceId: 1, userId: 1 }, { unique: true });
workspaceMemberSchema.index({ workspaceId: 1, teamsUserId: 1 });

// Update last active timestamp
workspaceMemberSchema.methods.updateActivity = function() {
  this.lastActiveAt = Date.now();
  return this.save();
};

module.exports = mongoose.model('WorkspaceMember', workspaceMemberSchema);

