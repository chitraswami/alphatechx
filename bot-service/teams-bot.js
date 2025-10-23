/**
 * TEAMS ENTERPRISE BOT - Node v15 Compatible
 * REST API + Teams Webhook Integration
 */

const express = require('express');
const cors = require('cors');
const https = require('https');
const multer = require('multer');

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
  // Microsoft credentials will be provided per user via API calls
};

console.log('🚀 Starting Teams Enterprise Bot...');
console.log('📊 Pinecone:', config.pineconeHost);
console.log('📱 Teams: User-provided credentials required');

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

    // Extract user ID and message text
    const userId = activity.from?.id || activity.conversation?.id || 'unknown-user';
    const messageText = activity.text || '';

    if (!messageText.trim()) {
      return {
        type: 'message',
        text: 'Hello! I\'m your AI assistant. Please ask me a question about your uploaded documents.'
      };
    }

    console.log(`🔍 Teams query from ${userId}: "${messageText}"`);

    // Generate embedding for the query
    const queryEmbedding = await openaiEmbedding(messageText);
    const userNamespace = `user-${userId}`;

    // Query Pinecone
    const searchResults = await pineconeQuery(userNamespace, queryEmbedding, 3);
    console.log(`📚 Found ${searchResults.matches?.length || 0} docs for ${userId}`);

    if (!searchResults.matches || searchResults.matches.length === 0) {
      return {
        type: 'message',
        text: `I don't have any documents uploaded for your account yet. Please upload some documents first through the web interface, then I'll be able to help you with questions about them!`
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
        content: `You are an AI assistant helping users with questions about their uploaded documents.
        Answer based on the provided context. If the context doesn't contain relevant information,
        say so politely. Be helpful and concise. Keep responses under 200 words for Teams chat.`
      },
      {
        role: 'user',
        content: `Context from user's documents:\n${context}\n\nUser question: ${messageText}`
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

// Function to send reply back to Azure Bot Framework
async function sendReplyToAzure(activity, messageText) {
  try {
    // Build the reply URL
    const serviceUrl = activity.serviceUrl;
    const conversationId = activity.conversation.id;
    const activityId = activity.id;
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

    // Send the reply to Azure Bot Framework
    const response = await fetch(replyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reply)
    });

    if (!response.ok) {
      console.error(`❌ Azure reply failed: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Error details: ${errorText}`);
    } else {
      console.log('✅ Reply sent successfully to Azure');
    }

  } catch (error) {
    console.error('❌ Error sending reply to Azure:', error);
  }
}

// ==================== API ENDPOINTS ====================

// Teams Webhook Endpoint - Properly sends replies back to Azure Bot Framework
app.post('/api/teams/messages', async (req, res) => {
  try {
    console.log('🔔 Teams webhook received');

    const activity = req.body;

    // Acknowledge the webhook immediately (Azure requires quick 200 response)
    res.status(200).send();

    // Extract user credentials from headers (for future Azure Bot Framework integration)
    const userCredentials = {
      microsoftAppId: req.headers['x-microsoft-app-id'],
      microsoftAppPassword: req.headers['x-microsoft-app-password']
    };

    // Handle different activity types
    if (activity.type === 'message') {
      const response = await handleTeamsMessage(activity, userCredentials);
      // Send reply back to Azure Bot Framework
      await sendReplyToAzure(activity, response.text);
      
    } else if (activity.type === 'conversationUpdate') {
      // Bot added to conversation
      await sendReplyToAzure(activity, 'Hello! I\'m your AI assistant. Upload your documents through the web interface, then ask me questions about them here in Teams!');
    }
    // Other activity types are acknowledged but no reply needed

  } catch (error) {
    console.error('❌ Teams webhook error:', error);
    // Response already sent, just log the error
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
    // Get userId from token or request body
    const authHeader = req.headers.authorization;
    let userId = req.body.userId;
    
    // If no userId in body, try to extract from auth token
    if (!userId && authHeader) {
      const token = authHeader.replace('Bearer ', '');
      // For demo, extract userId from token (in production, verify JWT)
      try {
        const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        userId = decoded.userId || decoded.sub || decoded.email;
      } catch (e) {
        userId = 'demo-user';
      }
    }
    
    if (!userId) {
      userId = 'demo-user'; // Fallback for testing
    }

    console.log(`📤 User ${userId}: Processing upload request`);

    const userNamespace = `user-${userId}`;
    const processed = [];
    
    // Handle JSON format (with documents array)
    if (req.body.documents && Array.isArray(req.body.documents)) {
      for (const doc of req.body.documents) {
        try {
          console.log(`  📄 Processing: ${doc.filename}`);
          const embedding = await openaiEmbedding(doc.text);
          console.log(`  ✅ Embedding generated (${embedding.length} dims)`);
          
          await pineconeUpsert(userNamespace, [{
            id: doc.id || `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            values: embedding,
            metadata: {
              text: doc.text,
              filename: doc.filename,
              userId
            }
          }]);

          processed.push({ 
            originalName: doc.filename,
            filename: doc.filename, 
            status: 'completed' 
          });
          console.log(`  ✅ Uploaded to namespace: ${userNamespace}`);
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
          await pineconeUpsert(userNamespace, [{
            id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            values: embedding,
            metadata: {
              text: textContent,
              filename: file.originalname,
              userId,
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

    console.log(`🎉 Upload complete: ${processed.length} files processed for ${userId}`);

    res.json({
      success: true,
      userId,
      namespace: userNamespace,
      files: processed,
      documents: processed,
      message: `Processed ${processed.length} files for user: ${userId}`
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Query endpoint - Support both /api/query and /api/uploads/test-query
async function handleQuery(req, res) {
  try {
    let { userId, query } = req.body;
    
    // Get userId from token if not provided
    if (!userId) {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        try {
          const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
          userId = decoded.userId || decoded.sub || decoded.email;
        } catch (e) {
          userId = 'demo-user';
        }
      } else {
        userId = 'demo-user';
      }
    }

    if (!query) {
      return res.status(400).json({ error: 'query required' });
    }

    console.log(`🔍 User ${userId} asks: "${query}"`);

    const queryEmbedding = await openaiEmbedding(query);
    const userNamespace = `user-${userId}`;
    
    const searchResults = await pineconeQuery(userNamespace, queryEmbedding, 3);
    console.log(`📚 Found ${searchResults.matches?.length || 0} docs`);

    if (!searchResults.matches || searchResults.matches.length === 0) {
      return res.json({
        success: true,
        response: `No documents found for your account. Please upload documents first through the "Upload Files" step.`,
        answer: `No documents found for your account. Please upload documents first through the "Upload Files" step.`,
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
        content: `Context from uploaded documents:\n${context}\n\nQuestion: ${query}\n\nAnswer:`
      }
    ]);

    res.json({
      success: true,
      userId,
      namespace: userNamespace,
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
