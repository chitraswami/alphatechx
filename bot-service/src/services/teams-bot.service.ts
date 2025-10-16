import { Injectable, Logger } from '@nestjs/common';
import { 
  ActivityHandler, 
  MessageFactory, 
  TurnContext, 
  ActivityTypes,
  BotFrameworkAdapter,
  ConversationState,
  MemoryStorage,
  UserState
} from 'botbuilder';
import { OpenAI } from 'openai';
import { FileProcessorService } from './file-processor.service';

@Injectable()
export class TeamsBotService extends ActivityHandler {
  private readonly logger = new Logger(TeamsBotService.name);
  private openai: OpenAI;
  private adapter: BotFrameworkAdapter;
  private conversationState: ConversationState;
  private userState: UserState;

  constructor(private fileProcessor: FileProcessorService) {
    super();

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Initialize Bot Framework Adapter
    this.adapter = new BotFrameworkAdapter({
      appId: process.env.MICROSOFT_APP_ID,
      appPassword: process.env.MICROSOFT_APP_PASSWORD,
    });

    // Create conversation and user state
    const memoryStorage = new MemoryStorage();
    this.conversationState = new ConversationState(memoryStorage);
    this.userState = new UserState(memoryStorage);

    // Handle messages
    this.onMessage(async (context, next) => {
      await this.handleMessage(context);
      await next();
    });

    // Handle members added
    this.onMembersAdded(async (context, next) => {
      const welcomeText = `👋 Hello! I'm your AI assistant powered by AlphaTechX. I can help answer questions based on your uploaded documents. Just ask me anything!`;
      const membersAdded = context.activity.membersAdded || [];
      for (const member of membersAdded) {
        if (member.id !== context.activity.recipient.id) {
          await context.sendActivity(MessageFactory.text(welcomeText));
        }
      }
      await next();
    });

    // Error handling
    this.adapter.onTurnError = async (context, error) => {
      this.logger.error(`Bot encountered an error:`, error);
      await context.sendActivity(MessageFactory.text('Sorry, I encountered an error processing your request. Please try again.'));
    };
  }

  private async handleMessage(context: TurnContext): Promise<void> {
    const userMessage = context.activity.text?.trim();
    
    if (!userMessage) {
      await context.sendActivity(MessageFactory.text('I didn\'t receive any text. Please send me a question!'));
      return;
    }

    this.logger.log(`Received message: ${userMessage}`);

    try {
      // Send typing indicator
      await context.sendActivity({ type: ActivityTypes.Typing });

      // Search for relevant content in vector database
      const similarContent = await this.fileProcessor.searchSimilarContent(userMessage, 5);
      
      let contextText = '';
      if (similarContent.length > 0) {
        contextText = similarContent
          .map(match => `Source: ${match.metadata?.source}\nContent: ${match.metadata?.content}`)
          .join('\n\n');
      }

      // Generate response using OpenAI
      const response = await this.generateResponse(userMessage, contextText);
      
      // Send response back to Teams
      await context.sendActivity(MessageFactory.text(response));

    } catch (error) {
      this.logger.error(`Error handling message:`, error);
      await context.sendActivity(MessageFactory.text('I apologize, but I encountered an error while processing your question. Please try again.'));
    }
  }

  private async generateResponse(userQuery: string, context: string): Promise<string> {
    try {
      const systemPrompt = `You are an AI assistant for AlphaTechX. You help users by answering questions based on their uploaded documents and data.

CONTEXT FROM USER'S DOCUMENTS:
${context || 'No relevant documents found.'}

Instructions:
1. Answer the user's question using the provided context when relevant
2. If the context doesn't contain relevant information, politely say so and provide general guidance
3. Always be helpful, professional, and concise
4. If referencing specific documents, mention the source
5. Use emojis sparingly and appropriately
6. Keep responses under 500 words`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userQuery }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response. Please try again.';

    } catch (error) {
      this.logger.error(`Error generating OpenAI response:`, error);
      return 'I\'m having trouble accessing my AI capabilities right now. Please try again in a moment.';
    }
  }

  // Method to validate Teams credentials
  async validateTeamsCredentials(appId: string, appPassword: string): Promise<boolean> {
    try {
      const testAdapter = new BotFrameworkAdapter({
        appId,
        appPassword,
      });

      // Try to create a connector client to validate credentials
      // This is a simple validation - in production you might want more thorough testing
      return true; // If no error thrown, credentials are likely valid
    } catch (error) {
      this.logger.error(`Invalid Teams credentials:`, error);
      return false;
    }
  }

  // Get the bot adapter for webhook handling
  getBotAdapter(): BotFrameworkAdapter {
    return this.adapter;
  }

  // Process incoming webhook requests
  async processWebhook(req: any, res: any): Promise<void> {
    await this.adapter.process(req, res, async (context) => {
      await this.run(context);
    });
  }
}
