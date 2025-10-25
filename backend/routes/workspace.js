const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspace');

// Create a new workspace
router.post('/create', workspaceController.createWorkspace);

// Join workspace with invite code
router.post('/join', workspaceController.joinWorkspace);

// Get user's workspaces
router.get('/list', workspaceController.getUserWorkspaces);

// Get workspace by Teams user ID
router.get('/by-teams-user', workspaceController.getWorkspaceByTeamsUser);

// Get workspace members
router.get('/members', workspaceController.getWorkspaceMembers);

// Update workspace document count
router.post('/update-documents', workspaceController.updateDocumentCount);

module.exports = router;

