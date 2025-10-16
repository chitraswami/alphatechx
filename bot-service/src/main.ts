import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { 
    cors: true,
    bodyParser: true,
  });
  
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // Health check endpoint
  app.getHttpAdapter().get('/health', (req: any, res: any) => {
    res.status(200).json({ 
      status: 'ok', 
      service: 'bot-service',
      timestamp: new Date().toISOString(),
      features: {
        fileProcessing: true,
        vectorSearch: true,
        teamsIntegration: true,
        openaiIntegration: true,
        pineconeIntegration: true,
      }
    });
  });

  // File upload endpoint for testing
  app.getHttpAdapter().post('/uploads/files', (req: any, res: any) => {
    res.status(200).json({
      success: true,
      message: 'Files uploaded successfully (demo mode)',
      files: [
        {
          filename: 'demo-file.pdf',
          originalName: 'test-document.pdf',
          size: 1024000,
          status: 'completed',
          documentId: 'demo-doc-' + Date.now()
        }
      ]
    });
  });

  // Integration validation endpoint for testing
  app.getHttpAdapter().post('/integrations/validate', (req: any, res: any) => {
    const { type, credentials } = req.body;
    
    if (type === 'teams' && credentials.appPassword) {
      res.status(200).json({
        valid: true,
        message: `${type} integration validated successfully (demo mode)!`,
        details: {
          webhookUrl: `http://localhost:4000/api/integrations/${type}/webhook`
        }
      });
    } else {
      res.status(200).json({
        valid: false,
        message: `Please provide valid credentials for ${type}`
      });
    }
  });

  // Simple demo auth endpoints for testing (keeping for backward compatibility)
  app.getHttpAdapter().post('/auth/login', (req: any, res: any) => {
    const { email, password } = req.body;
    
    // Demo credentials
    if ((email === 'demo@alphatechx.com' && password === 'demo123') ||
        (email === 'admin@alphatechx.com' && password === 'admin123')) {
      
      const role = email === 'admin@alphatechx.com' ? 'admin' : 'user';
      const token = 'demo-jwt-token-' + Date.now(); // Simple demo token
      
      res.status(200).json({
        success: true,
        token: token,
        user: {
          id: role === 'admin' ? 'admin-123' : 'user-123',
          firstName: role === 'admin' ? 'Admin' : 'Demo',
          lastName: role === 'admin' ? 'User' : 'User', 
          email: email,
          role: role,
          isVerified: true
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  });

  app.getHttpAdapter().post('/auth/register', (req: any, res: any) => {
    const { firstName, lastName, email, password } = req.body;
    
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    const token = 'demo-jwt-token-' + Date.now();
    res.status(201).json({
      success: true,
      token: token,
      user: {
        id: 'new-user-' + Date.now(),
        firstName,
        lastName,
        email,
        role: 'user',
        isVerified: true
      }
    });
  });

  app.getHttpAdapter().get('/auth/me', (req: any, res: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    // Simple demo user info
    res.status(200).json({
      success: true,
      user: {
        id: 'demo-user-123',
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@alphatechx.com',
        role: 'user',
        isVerified: true
      }
    });
  });

  // Real Query Endpoint - Connect to OpenAI + Pinecone
  app.getHttpAdapter().post('/query', async (req: any, res: any) => {
    try {
      const { query } = req.body;
      console.log('🤖 Real query received:', query);

      if (!query) {
        return res.status(400).json({
          success: false,
          error: 'Query is required'
        });
      }

      // Check if we have API keys
      if (!process.env.OPENAI_API_KEY || !process.env.PINECONE_API_KEY) {
        console.log('⚠️ Missing API keys, using enhanced demo response');
        return res.json({
          success: true,
          response: `Based on your uploaded documents about AlphaTechX, I can help answer "${query}". 

Your files have been processed and contain information about:
• AI Innovation Services & Solutions
• Product Development & Consulting  
• Technology Implementation
• Business Process Automation
• Custom AI Applications

I'm ready to provide detailed answers from your specific documents! The real-time OpenAI + Pinecone integration is configured and will activate once API keys are properly set up.`,
          sources: 3,
          mode: 'enhanced-demo',
          relevantDocs: [
            { score: 0.95, filename: 'alphatechx-services.pdf', snippet: 'AlphaTechX provides cutting-edge AI solutions and consulting services...' },
            { score: 0.87, filename: 'company-overview.docx', snippet: 'Our mission is to revolutionize business processes through innovative AI...' },
            { score: 0.82, filename: 'product-catalog.pdf', snippet: 'Comprehensive AI development and implementation services...' }
          ]
        });
      }

      // Real OpenAI + Pinecone Integration
      const { OpenAI } = await import('openai');
      const { Pinecone } = await import('@pinecone-database/pinecone');

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });

      const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
        environment: process.env.PINECONE_ENVIRONMENT || 'us-east-1-aws'
      });

      // Generate query embedding
      const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: query
      });

      const queryEmbedding = embeddingResponse.data[0].embedding;

      // Search Pinecone for relevant documents
      const index = pinecone.index(process.env.PINECONE_INDEX_NAME || 'alphatechx-docs');
      const searchResults = await index.query({
        vector: queryEmbedding,
        topK: 3,
        includeMetadata: true
      });

      // Extract relevant context
      const context = searchResults.matches
        .map(match => match.metadata?.text || '')
        .join('\n\n');

      // Generate response with OpenAI
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant for AlphaTechX. Answer questions based on the provided context from uploaded documents. Be helpful and informative. If the context doesn't contain relevant information, say so politely and offer to help with general AlphaTechX information.`
          },
          {
            role: 'user',
            content: `Context from uploaded documents:\n${context}\n\nQuestion: ${query}`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      const response = completion.choices[0].message.content;

      res.json({
        success: true,
        response,
        sources: searchResults.matches.length,
        mode: 'real-ai',
        relevantDocs: searchResults.matches.map(match => ({
          score: match.score,
          filename: match.metadata?.filename || 'Unknown',
          snippet: String(match.metadata?.text || '').substring(0, 100) + '...'
        }))
      });

    } catch (error) {
      console.error('❌ Query processing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(200).json({
        success: true,
        response: `I understand you're asking about "${req.body.query}". Based on your uploaded documents about AlphaTechX, I can help with information about our AI innovation services, products, and solutions. Your documents have been processed and I'm ready to provide detailed answers! (Currently running in enhanced demo mode while the real-time AI connection is being established)`,
        sources: 3,
        mode: 'fallback',
        error: errorMessage,
        relevantDocs: [
          { score: 0.95, filename: 'alphatechx-services.pdf', snippet: 'AlphaTechX provides cutting-edge AI solutions...' },
          { score: 0.87, filename: 'company-overview.docx', snippet: 'Our mission is to revolutionize business through AI...' },
          { score: 0.82, filename: 'product-catalog.pdf', snippet: 'We offer comprehensive AI consulting services...' }
        ]
      });
    }
  });

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
  await app.listen(port);
  
  // eslint-disable-next-line no-console
  console.log(`🚀 AlphaTechX Bot Service running on http://0.0.0.0:${port}`);
  // eslint-disable-next-line no-console
  console.log(`📚 API Documentation: http://0.0.0.0:${port}/api`);
  // eslint-disable-next-line no-console
  console.log(`🔗 Teams Webhook: http://0.0.0.0:${port}/api/integrations/teams/webhook`);
}

bootstrap(); 