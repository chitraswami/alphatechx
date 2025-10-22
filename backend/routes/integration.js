const express = require('express');
const router = express.Router();
const {
  getUserIntegration,
  upsertUserIntegration,
  deleteUserIntegration,
  getUserBotServiceUrl
} = require('../controllers/integration');

// GET /api/integrations/:userId/bot-service-url - Get user's bot service URL for frontend routing
// NOTE: This route must come BEFORE /:userId to avoid path conflicts
router.get('/:userId/bot-service-url', getUserBotServiceUrl);

// GET /api/integrations/:userId - Get user's integration settings
router.get('/:userId', getUserIntegration);

// POST /api/integrations/:userId - Create or update user's integration settings
router.post('/:userId', upsertUserIntegration);

// DELETE /api/integrations/:userId - Delete user's integration
router.delete('/:userId', deleteUserIntegration);

module.exports = router;
