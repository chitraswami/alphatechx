/**
 * MediConnect Credentials Configuration
 * All secrets loaded from environment variables - NEVER hardcoded
 */

module.exports = {
  // Google Cloud Speech-to-Text
  google: {
    projectId: process.env.GCP_PROJECT_ID || 'zinc-forge-310508',
    credentialsPath: process.env.GOOGLE_APPLICATION_CREDENTIALS || './gcp-service-account.json',
  },

  // Exotel Telephony
  exotel: {
    apiKey: process.env.EXOTEL_API_KEY,
    apiToken: process.env.EXOTEL_API_TOKEN,
    sid: process.env.EXOTEL_SID,
    exophone: process.env.EXOTEL_EXOPHONE || '01140036376',
    baseUrl: `https://api.exotel.com/v1/Accounts/${process.env.EXOTEL_SID}`,
  },

  // OpenAI
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  },

  // MongoDB
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mediconnect',
  },

  // Server
  server: {
    port: process.env.MEDICONNECT_PORT || 6000,
    baseUrl: process.env.MEDICONNECT_BASE_URL || 'https://alfatechx.com/mediconnect',
  },
};
