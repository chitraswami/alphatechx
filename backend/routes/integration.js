const express = require('express');
const router = express.Router();
const {
  getUserIntegration,
  upsertUserIntegration,
  deleteUserIntegration,
  getUserBotServiceUrl
} = require('../controllers/integration');

// GET /api/integrations/user/:userId/bot-service-url - Get user's bot service URL for frontend routing
router.get('/user/:userId/bot-service-url', getUserBotServiceUrl);

// GET /api/integrations/user/:userId - Get user's integration settings
router.get('/user/:userId', getUserIntegration);

// POST /api/integrations/user/:userId - Create or update user's integration settings
router.post('/user/:userId', upsertUserIntegration);

// DELETE /api/integrations/user/:userId - Delete user's integration
router.delete('/user/:userId', deleteUserIntegration);

module.exports = router;
