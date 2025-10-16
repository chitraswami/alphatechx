const UserIntegration = require('../models/UserIntegration');

// Get user's integration settings
const getUserIntegration = async (req, res) => {
  try {
    const { userId } = req.params;

    const integration = await UserIntegration.findOne({ userId });

    if (!integration) {
      return res.status(404).json({
        success: false,
        message: 'No integration found for this user'
      });
    }

    res.json({
      success: true,
      integration: {
        microsoftAppId: integration.microsoftAppId,
        microsoftAppPassword: integration.microsoftAppPassword ? '***' : null, // Don't send password back
        microsoftBotServiceUrl: integration.microsoftBotServiceUrl,
        slackBotToken: integration.slackBotToken ? '***' : null,
        slackSigningSecret: integration.slackSigningSecret ? '***' : null,
        isActive: integration.isActive,
        createdAt: integration.createdAt,
        updatedAt: integration.updatedAt
      }
    });
  } catch (error) {
    console.error('Error getting user integration:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create or update user's integration settings
const upsertUserIntegration = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      microsoftAppId,
      microsoftAppPassword,
      microsoftBotServiceUrl,
      slackBotToken,
      slackSigningSecret
    } = req.body;

    // Validate required fields for Teams integration
    if (microsoftAppId && microsoftAppPassword) {
      if (!microsoftBotServiceUrl) {
        return res.status(400).json({
          success: false,
          message: 'Bot service URL is required when providing Microsoft credentials'
        });
      }
    }

    // Find existing integration or create new one
    let integration = await UserIntegration.findOne({ userId });

    if (integration) {
      // Update existing
      integration.microsoftAppId = microsoftAppId || integration.microsoftAppId;
      integration.microsoftAppPassword = microsoftAppPassword || integration.microsoftAppPassword;
      integration.microsoftBotServiceUrl = microsoftBotServiceUrl || integration.microsoftBotServiceUrl;
      integration.slackBotToken = slackBotToken || integration.slackBotToken;
      integration.slackSigningSecret = slackSigningSecret || integration.slackSigningSecret;
      integration.isActive = !!(microsoftAppId && microsoftAppPassword && microsoftBotServiceUrl);
      integration.updatedAt = new Date();
    } else {
      // Create new
      integration = new UserIntegration({
        userId,
        microsoftAppId,
        microsoftAppPassword,
        microsoftBotServiceUrl,
        slackBotToken,
        slackSigningSecret,
        isActive: !!(microsoftAppId && microsoftAppPassword && microsoftBotServiceUrl)
      });
    }

    await integration.save();

    res.json({
      success: true,
      message: 'Integration settings updated successfully',
      integration: {
        microsoftAppId: integration.microsoftAppId,
        microsoftAppPassword: integration.microsoftAppPassword ? '***' : null,
        microsoftBotServiceUrl: integration.microsoftBotServiceUrl,
        isActive: integration.isActive,
        updatedAt: integration.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating user integration:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete user's integration
const deleteUserIntegration = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await UserIntegration.findOneAndDelete({ userId });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'No integration found for this user'
      });
    }

    res.json({
      success: true,
      message: 'Integration deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user integration:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get bot service URL for a user (for frontend routing)
const getUserBotServiceUrl = async (req, res) => {
  try {
    const { userId } = req.params;

    const integration = await UserIntegration.findOne({ userId });

    if (!integration || !integration.microsoftBotServiceUrl) {
      return res.status(404).json({
        success: false,
        message: 'No bot service URL configured for this user'
      });
    }

    res.json({
      success: true,
      botServiceUrl: integration.microsoftBotServiceUrl
    });
  } catch (error) {
    console.error('Error getting user bot service URL:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getUserIntegration,
  upsertUserIntegration,
  deleteUserIntegration,
  getUserBotServiceUrl
};
