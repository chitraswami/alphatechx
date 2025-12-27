/**
 * TEAMS ENTERPRISE BOT - Node v15 Compatible
 * REST API + Teams Webhook Integration
 */

const express = require('express');
const cors = require('cors');
const https = require('https');
const multer = require('multer');
const { BotFrameworkAdapter, TurnContext } = require('botbuilder');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const config = {
  openaiApiKey: process.env.OPENAI_API_KEY,
  pineconeApiKey: process.env.PINECONE_API_KEY,
  pineconeHost: process.env.PINECONE_HOST || 'alphatechx-docs-0pg6xsr.svc.aped-4627-b74a.pinecone.io',
  // AlphaTechX Company Bot - Serves ALL customers
  microsoftAppId: process.env.MICROSOFT_APP_ID || '',
  microsoftAppPassword: process.env.MICROSOFT_APP_PASSWORD || '',
  microsoftTenantId: process.env.MICROSOFT_TENANT_ID || ''
};

console.log('🚀 Starting Teams Enterprise Bot...');
console.log('📊 Pinecone:', config.pineconeHost);
console.log('📱 Teams Bot ID:', config.microsoftAppId);
console.log('🏢 Tenant ID:', config.microsoftTenantId);
console.log('🎯 Mode: Single Company Bot (serves all customers)');

// Pinecone REST API - Upsert
function pineconeUpsert(namespace, vectors) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ vectors, namespace });
    
    const options = {
      hostname: config.pineconeHost,
      port: 443,
      path: '/vectors/upsert',
      method: 'POST',
      headers: {
        'Api-Key': config.pineconeApiKey,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`Pinecone error: ${res.statusCode} - ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Pinecone REST API - Query
function pineconeQuery(namespace, vector, topK = 3) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      namespace,
      vector,
      topK,
      includeMetadata: true
    });
    
    const options = {
      hostname: config.pineconeHost,
      port: 443,
      path: '/query',
      method: 'POST',
      headers: {
        'Api-Key': config.pineconeApiKey,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`Pinecone error: ${res.statusCode} - ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// OpenAI - Generate Embedding
function openaiEmbedding(text) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'text-embedding-3-small',
      input: text
    });
    
    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/embeddings',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.openaiApiKey}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          const result = JSON.parse(body);
          resolve(result.data[0].embedding);
        } else {
          reject(new Error(`OpenAI error: ${res.statusCode} - ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// OpenAI - Chat Completion
function openaiChat(messages) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 500,
      temperature: 0.3
    });
    
    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.openaiApiKey}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          const result = JSON.parse(body);
          resolve(result.choices[0].message.content);
        } else {
          reject(new Error(`OpenAI error: ${res.statusCode} - ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Simple text extraction from files
function extractTextFromFile(file) {
  try {
    if (file.mimetype === 'text/plain') {
      return file.buffer.toString('utf-8');
    } else if (file.mimetype === 'application/pdf') {
      // For PDF, return a placeholder - in production use pdf-parse
      return `PDF document: ${file.originalname}. Content extracted from PDF file.`;
    } else if (file.mimetype.startsWith('image/')) {
      // For images, return a placeholder - in production use OCR
      return `Image file: ${file.originalname}. This is an image document.`;
    } else if (file.mimetype.includes('word') || file.mimetype.includes('document')) {
      // For Word docs, return placeholder - in production use mammoth
      return `Word document: ${file.originalname}. Content extracted from Word document.`;
    } else {
      // Generic fallback
      return `File: ${file.originalname}. Content from ${file.mimetype} file.`;
    }
  } catch (error) {
    console.error('Error extracting text:', error);
    return `File: ${file.originalname}. Unable to extract content.`;
  }
}

// Teams Message Handler - Now accepts user credentials via headers
async function handleTeamsMessage(activity, userCredentials = null) {
  try {
    console.log('📱 Teams message received:', JSON.stringify(activity, null, 2));

    // Extract Teams user ID and message text
    const teamsUserId = activity.from?.id || activity.conversation?.id || 'unknown-user';
    const messageText = activity.text || '';
    
    // Also extract email if available
    const userEmail = activity.from?.aadObjectId || activity.from?.email || null;
    console.log(`👤 Teams User Info: ID=${teamsUserId}, Email=${userEmail}`);

    if (!messageText.trim()) {
      return {
        type: 'message',
        text: 'Hello! I\'m your AI assistant. Please ask me a question about your workspace documents.'
      };
    }

    // Handle /link command to manually link workspace
    if (messageText.startsWith('/link ')) {
      const workspaceId = messageText.split(' ')[1];
      if (!workspaceId) {
        return {
          type: 'message',
          text: 'Please provide a workspace ID. Example: /link ws-abc123xyz'
        };
      }

      try {
        const linkResponse = await fetch(`${backendUrl}/api/workspaces/link-teams-user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            workspaceId,
            userId: teamsUserId,
            teamsUserId
          })
        });

        const linkData = await linkResponse.json();
        
        if (linkData.success) {
          return {
            type: 'message',
            text: `✅ Successfully linked to workspace!\n\nYou can now ask me questions about your documents. Try asking something!`
          };
        } else {
          return {
            type: 'message',
            text: `❌ Failed to link workspace: ${linkData.error}\n\nMake sure you're using the correct workspace ID from https://alphatechx.fly.dev/projects/bot`
          };
        }
      } catch (error) {
        console.error('Error linking workspace:', error);
        return {
          type: 'message',
          text: `❌ Error linking workspace. Please try again later.`
        };
      }
    }

    console.log(`🔍 Teams query from ${teamsUserId}: "${messageText}"`);

    // Check if user has a workspace
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';
    let workspaceId = null;
    let workspaceName = null;

    try {
      const response = await fetch(`${backendUrl}/api/workspaces/by-teams-user?teamsUserId=${encodeURIComponent(teamsUserId)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.hasWorkspace) {
          workspaceId = data.workspace.workspaceId;
          workspaceName = data.workspace.name;
          console.log(`✅ Found workspace: ${workspaceId} (${workspaceName})`);
        } else {
          console.log(`⚠️ No workspace found for Teams user: ${teamsUserId}`);
        }
      } else {
        console.log(`⚠️ Backend response not OK: ${response.status}`);
      }
    } catch (error) {
      console.warn('⚠️ Could not fetch workspace info:', error.message);
    }

    if (!workspaceId) {
      // Show the Teams user ID in the message so user can manually link it
      return {
        type: 'message',
        text: `👋 Welcome! It looks like you haven't set up a workspace yet.

📝 **To get started:**
1. Go to https://alphatechx.fly.dev
2. Create a new workspace or join an existing one
3. Upload your documents
4. Come back here and ask me anything!

🔑 **Your Teams ID (for linking):** \`${teamsUserId}\`

Need help? Just ask! 😊`
      };
    }

    // Generate embedding for the query
    const queryEmbedding = await openaiEmbedding(messageText);
    const workspaceNamespace = `workspace-${workspaceId}`;

    // Query Pinecone using workspace namespace
    const searchResults = await pineconeQuery(workspaceNamespace, queryEmbedding, 3);
    console.log(`📚 Found ${searchResults.matches?.length || 0} docs in workspace ${workspaceName}`);

    if (!searchResults.matches || searchResults.matches.length === 0) {
      return {
        type: 'message',
        text: `I don't have any documents in your workspace "${workspaceName}" yet. 

📝 Please upload documents at https://alphatechx.fly.dev to get started!`
      };
    }

    // Build context from retrieved documents
    const context = searchResults.matches
      .map(m => m.metadata?.text || '')
      .join('\n\n');

    // Generate response using OpenAI
    const response = await openaiChat([
      {
        role: 'system',
        content: `You are an AI assistant helping users with questions about their workspace documents.
        Answer based on the provided context. If the context doesn't contain relevant information,
        say so politely. Be helpful and concise. Keep responses under 200 words for Teams chat.`
      },
      {
        role: 'user',
        content: `Context from workspace "${workspaceName}" documents:\n${context}\n\nUser question: ${messageText}`
      }
    ]);

    return {
      type: 'message',
      text: response
    };

  } catch (error) {
    console.error('❌ Error handling Teams message:', error);
    return {
      type: 'message',
      text: 'Sorry, I encountered an error processing your message. Please try again.'
    };
  }
}

// ==================== AZURE BOT FRAMEWORK REPLY ====================

// Get authentication token from Azure Bot Framework
async function getAzureBotToken(appId, appPassword) {
  try {
    // Use the common endpoint which works for all tenants
    const tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: appId,
      client_secret: appPassword,
      scope: 'https://api.botframework.com/.default'
    });

    console.log(`🔐 Requesting token for App ID: ${appId.substring(0, 8)}...`);

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Token request failed: ${response.status} - ${errorText}`);
      return null;
    }

    const data = await response.json();
    console.log('✅ Got Azure auth token successfully');
    return data.access_token;
  } catch (error) {
    console.error('❌ Error getting Azure token:', error);
    return null;
  }
}

// Function to send reply back to Azure Bot Framework
// Uses Bot Connector Service REST API
async function sendReplyToAzure(activity, messageText, appId = null, appPassword = null) {
  try {
    // For Web Chat, we can reply directly without auth token
    // The activity itself contains the authorization context
    const serviceUrl = activity.serviceUrl;
    const conversationId = activity.conversation.id;
    const activityId = activity.id;
    
    // Web Chat uses a simpler endpoint
    const replyUrl = `${serviceUrl}v3/conversations/${conversationId}/activities/${activityId}`;

    console.log(`📤 Sending reply to Azure: ${replyUrl}`);

    // Prepare the reply activity
    const reply = {
      type: 'message',
      from: activity.recipient,
      recipient: activity.from,
      conversation: activity.conversation,
      text: messageText,
      replyToId: activityId
    };

    // For Web Chat, no auth token needed - Azure authenticates the connection
    const response = await fetch(replyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reply)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Azure reply failed: ${response.status} ${response.statusText}`);
      console.error(`Error details: ${errorText}`);
      
      // If that fails, try posting to conversation instead of replying to activity
      console.log('🔄 Trying alternate method: POST to conversation...');
      const alternateUrl = `${serviceUrl}v3/conversations/${conversationId}/activities`;
      const alternateReply = {
        type: 'message',
        from: activity.recipient,
        recipient: activity.from,
        conversation: activity.conversation,
        text: messageText
      };
      
      const alternateResponse = await fetch(alternateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alternateReply)
      });
      
      if (alternateResponse.ok) {
        console.log('✅ Reply sent successfully via alternate method');
      } else {
        const altError = await alternateResponse.text();
        console.error(`❌ Alternate method also failed: ${alternateResponse.status} - ${altError}`);
      }
    } else {
      console.log('✅ Reply sent successfully to Azure');
    }

  } catch (error) {
    console.error('❌ Error sending reply to Azure:', error);
  }
}

// ==================== API ENDPOINTS ====================

// Create a map to store adapters per user (for multi-tenant support)
const adapters = new Map();

// Get or create adapter for AlphaTechX company bot
function getAdapter(appId = config.microsoftAppId, appPassword = config.microsoftAppPassword, tenantId = config.microsoftTenantId) {
  const key = `${appId}:${appPassword}`;
  if (!adapters.has(key)) {
    console.log(`🔧 Creating adapter for AlphaTechX Bot`);
    console.log(`   App ID: ${appId.substring(0, 8)}...`);
    console.log(`   Tenant: ${tenantId}`);
    
    const adapterConfig = {
      appId: appId,
      appPassword: appPassword,
      channelAuthTenant: tenantId
    };
    
    const adapter = new BotFrameworkAdapter(adapterConfig);
    
    // Error handler
    adapter.onTurnError = async (context, error) => {
      console.error(`❌ Bot error:`, error);
      await context.sendActivity('Sorry, something went wrong! Please try again or contact support.');
    };
    
    adapters.set(key, adapter);
    console.log(`✅ Adapter created and cached`);
  }
  return adapters.get(key);
}

// Teams Webhook Endpoint - Using Bot Builder SDK for proper authentication
// This endpoint serves ALL customers through the single AlphaTechX company bot
app.post('/api/teams/messages', async (req, res) => {
  try {
    console.log('🔔 Teams webhook received');

    const activity = req.body;

    // Extract user ID from activity - this identifies which customer is chatting
    const userId = activity.from?.id || activity.conversation?.id || 'unknown-user';
    console.log(`👤 User: ${userId}`);

    // Use the AlphaTechX company bot (serves all customers)
    const adapter = getAdapter();

    // Process the activity using Bot Builder SDK (handles auth automatically)
    await adapter.processActivity(req, res, async (context) => {
      console.log(`💬 Activity type: ${context.activity.type}`);

      if (context.activity.type === 'message') {
        // User sent a message - query their personal knowledge base
        const userMessage = context.activity.text;
        console.log(`👤 User ${userId} asked: "${userMessage}"`);

        // Get bot response from user's personal documents (isolated by namespace)
        const response = await handleTeamsMessage(context.activity);
        
        // Send reply using SDK (authentication handled automatically!)
        await context.sendActivity(response.text);
        console.log('✅ Reply sent to user');
        
      } else if (context.activity.type === 'conversationUpdate') {
        // Bot added to conversation - welcome message
        if (context.activity.membersAdded) {
          for (const member of context.activity.membersAdded) {
            if (member.id !== context.activity.recipient.id) {
              // Get user's email or name if available
              const userName = context.activity.from?.name || 'there';
              const userEmail = context.activity.from?.aadObjectId || null;
              
              const welcomeMessage = `👋 Hi ${userName}! I'm AlphaTechX Bot.

🚀 **I'm ready to help!** Just ask me questions about your documents.

📝 **First time?** Set up your workspace:
1. Go to: https://alphatechx.fly.dev
2. Click "Connect with Teams"
3. Upload your team's documents
4. Come back and ask me anything!

💡 **Pro tip:** You can share this bot with your team! Once documents are uploaded, everyone in your team can ask questions.

🔒 Your data is private and secure - only your team can access it.`;
              
              await context.sendActivity(welcomeMessage);
              console.log(`✅ Sent welcome message to ${userId}`);
            }
          }
        }
      }
    });

  } catch (error) {
    console.error('❌ Teams webhook error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
});

// Teams Authentication Status
app.get('/api/teams/auth', (req, res) => {
  res.json({
    message: 'Teams authentication endpoint',
    appId: config.microsoftAppId,
    status: config.microsoftAppId ? 'configured' : 'missing',
    webhookUrl: `${req.protocol}://${req.get('host')}/api/teams/messages`
  });
});

// Upload Files - Support both JSON and multipart/form-data
app.post('/api/uploads/files', upload.array('files', 20), async (req, res) => {
  try {
    // Get workspaceId from request body (REQUIRED)
    const workspaceId = req.body.workspaceId;
    
    if (!workspaceId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Workspace ID is required. Please select or create a workspace first.' 
      });
    }

    console.log(`📤 Workspace ${workspaceId}: Processing upload request`);

    const workspaceNamespace = `workspace-${workspaceId}`;
    const processed = [];
    
    // Handle JSON format (with documents array)
    if (req.body.documents && Array.isArray(req.body.documents)) {
      for (const doc of req.body.documents) {
        try {
          console.log(`  📄 Processing: ${doc.filename}`);
          const embedding = await openaiEmbedding(doc.text);
          console.log(`  ✅ Embedding generated (${embedding.length} dims)`);
          
          await pineconeUpsert(workspaceNamespace, [{
            id: doc.id || `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            values: embedding,
            metadata: {
              text: doc.text,
              filename: doc.filename,
              workspaceId
            }
          }]);

          processed.push({ 
            originalName: doc.filename,
            filename: doc.filename, 
            status: 'completed' 
          });
          console.log(`  ✅ Uploaded to namespace: ${workspaceNamespace}`);
        } catch (error) {
          console.error(`  ❌ Failed:`, error.message);
          processed.push({ 
            originalName: doc.filename,
            filename: doc.filename, 
            status: 'failed', 
            error: error.message 
          });
        }
      }
    } 
    // Handle multipart/form-data format (files from frontend)
    else if (req.files && req.files.length > 0) {
      console.log(`  📁 Processing ${req.files.length} files from frontend`);
      
      for (const file of req.files) {
        try {
          console.log(`  📄 Processing file: ${file.originalname} (${file.mimetype})`);
          
          // Extract text from file
          const textContent = extractTextFromFile(file);
          console.log(`  📝 Extracted text: ${textContent.substring(0, 100)}...`);
          
          // Generate embedding
          const embedding = await openaiEmbedding(textContent);
          console.log(`  ✅ Embedding generated (${embedding.length} dims)`);
          
          // Store in Pinecone
          await pineconeUpsert(workspaceNamespace, [{
            id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            values: embedding,
            metadata: {
              text: textContent,
              filename: file.originalname,
              workspaceId,
              fileType: file.mimetype,
              fileSize: file.size
            }
          }]);

          processed.push({
            originalName: file.originalname,
            filename: file.originalname,
            status: 'completed',
            size: file.size,
            type: file.mimetype
          });
          
          console.log(`  ✅ Successfully processed: ${file.originalname}`);
        } catch (error) {
          console.error(`  ❌ Failed to process ${file.originalname}:`, error.message);
          processed.push({
            originalName: file.originalname,
            filename: file.originalname,
            status: 'failed',
            error: error.message
          });
        }
      }
    }

    console.log(`🎉 Upload complete: ${processed.length} files processed for workspace ${workspaceId}`);

    // Update workspace document count
    try {
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';
      await fetch(`${backendUrl}/api/workspaces/update-documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          workspaceId, 
          count: processed.filter(p => p.status === 'completed').length 
        })
      });
    } catch (error) {
      console.warn('⚠️ Could not update workspace document count:', error.message);
    }

    res.json({
      success: true,
      workspaceId,
      namespace: workspaceNamespace,
      files: processed,
      documents: processed,
      message: `Processed ${processed.length} files for workspace: ${workspaceId}`
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Query endpoint - Support both /api/query and /api/uploads/test-query
async function handleQuery(req, res) {
  try {
    const { workspaceId, query } = req.body;
    
    if (!workspaceId) {
      return res.status(400).json({ 
        success: false,
        error: 'Workspace ID is required. Please select or create a workspace first.' 
      });
    }

    if (!query) {
      return res.status(400).json({ 
        success: false,
        error: 'Query is required' 
      });
    }

    console.log(`🔍 Workspace ${workspaceId} asks: "${query}"`);

    const queryEmbedding = await openaiEmbedding(query);
    const workspaceNamespace = `workspace-${workspaceId}`;
    
    const searchResults = await pineconeQuery(workspaceNamespace, queryEmbedding, 3);
    console.log(`📚 Found ${searchResults.matches?.length || 0} docs in workspace`);

    if (!searchResults.matches || searchResults.matches.length === 0) {
      return res.json({
        success: true,
        response: `No documents found in your workspace. Please upload documents first through the "Upload Files" step.`,
        answer: `No documents found in your workspace. Please upload documents first through the "Upload Files" step.`,
        sources: 0
      });
    }

    const context = searchResults.matches
      .map(m => m.metadata?.text || '')
      .join('\n\n');

    console.log('📝 Context being sent to OpenAI:', context.substring(0, 200));

    const response = await openaiChat([
      {
        role: 'system',
        content: `You are a helpful AI assistant that answers questions based ONLY on the provided document context.
- Always use the information from the documents to answer
- Be specific and mention filenames when relevant
- If the documents don't contain the answer, say "I don't have that information in your uploaded documents."`
      },
      {
        role: 'user',
        content: `Context from workspace documents:\n${context}\n\nQuestion: ${query}\n\nAnswer:`
      }
    ]);

    res.json({
      success: true,
      workspaceId,
      namespace: workspaceNamespace,
      response,
      answer: response, // Frontend expects 'answer' field
      sources: searchResults.matches.length,
      documents: searchResults.matches.map(m => ({
        filename: m.metadata?.filename,
        relevance: m.score
      }))
    });

  } catch (error) {
    console.error('❌ Query error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

// Query endpoints
app.post('/api/query', handleQuery);
app.post('/api/uploads/test-query', handleQuery);

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'teams-enterprise-bot',
    features: ['file-upload', 'query', 'teams-integration'],
    teams: config.microsoftAppId ? 'configured' : 'missing'
  });
});

// ==================== START SERVER ====================

const port = 4000;
app.listen(port, () => {
  console.log('');
  console.log('🎉 TEAMS BOT SERVICE RUNNING!');
  console.log(`🚀 http://localhost:${port}`);
  console.log(`📱 Teams webhook: http://localhost:${port}/api/teams/messages`);
  console.log(`🔧 Teams auth: http://localhost:${port}/api/teams/auth`);
  console.log('');
  console.log('📋 Available endpoints:');
  console.log('   POST /api/uploads/files - Upload documents');
  console.log('   POST /api/query - Query knowledge base');
  console.log('   POST /api/teams/messages - Teams webhook');
  console.log('   GET  /api/teams/auth - Teams auth status');
  console.log('   GET  /health - Health check');
  console.log('');
});
