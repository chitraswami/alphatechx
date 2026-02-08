/**
 * Conversation Routes (call logs)
 */
const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');

// GET /api/conversations - List conversations
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.hospitalId) filter.hospitalId = req.query.hospitalId;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.from) filter.startTime = { $gte: new Date(req.query.from) };
    if (req.query.to) {
      filter.startTime = filter.startTime || {};
      filter.startTime.$lte = new Date(req.query.to);
    }

    const conversations = await Conversation.find(filter)
      .sort({ startTime: -1 })
      .limit(parseInt(req.query.limit) || 50);

    res.json({ success: true, count: conversations.length, conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/conversations/:callSid - Get conversation by call SID
router.get('/:callSid', async (req, res) => {
  try {
    const conversation = await Conversation.findOne({ callSid: req.params.callSid });
    if (!conversation) return res.status(404).json({ success: false, message: 'Conversation not found' });
    res.json({ success: true, conversation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
