"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TeamsBotService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamsBotService = void 0;
const common_1 = require("@nestjs/common");
const botbuilder_1 = require("botbuilder");
const openai_1 = require("openai");
const file_processor_service_1 = require("./file-processor.service");
let TeamsBotService = TeamsBotService_1 = class TeamsBotService extends botbuilder_1.ActivityHandler {
    constructor(fileProcessor) {
        super();
        this.fileProcessor = fileProcessor;
        this.logger = new common_1.Logger(TeamsBotService_1.name);
        this.openai = new openai_1.OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        this.adapter = new botbuilder_1.BotFrameworkAdapter({
            appId: process.env.MICROSOFT_APP_ID,
            appPassword: process.env.MICROSOFT_APP_PASSWORD,
        });
        const memoryStorage = new botbuilder_1.MemoryStorage();
        this.conversationState = new botbuilder_1.ConversationState(memoryStorage);
        this.userState = new botbuilder_1.UserState(memoryStorage);
        this.onMessage(async (context, next) => {
            await this.handleMessage(context);
            await next();
        });
        this.onMembersAdded(async (context, next) => {
            const welcomeText = `👋 Hello! I'm your AI assistant powered by AlphaTechX. I can help answer questions based on your uploaded documents. Just ask me anything!`;
            const membersAdded = context.activity.membersAdded || [];
            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity(botbuilder_1.MessageFactory.text(welcomeText));
                }
            }
            await next();
        });
        this.adapter.onTurnError = async (context, error) => {
            this.logger.error(`Bot encountered an error:`, error);
            await context.sendActivity(botbuilder_1.MessageFactory.text('Sorry, I encountered an error processing your request. Please try again.'));
        };
    }
    async handleMessage(context) {
        const userMessage = context.activity.text?.trim();
        if (!userMessage) {
            await context.sendActivity(botbuilder_1.MessageFactory.text('I didn\'t receive any text. Please send me a question!'));
            return;
        }
        this.logger.log(`Received message: ${userMessage}`);
        try {
            await context.sendActivity({ type: botbuilder_1.ActivityTypes.Typing });
            const similarContent = await this.fileProcessor.searchSimilarContent(userMessage, 5);
            let contextText = '';
            if (similarContent.length > 0) {
                contextText = similarContent
                    .map(match => `Source: ${match.metadata?.source}\nContent: ${match.metadata?.content}`)
                    .join('\n\n');
            }
            const response = await this.generateResponse(userMessage, contextText);
            await context.sendActivity(botbuilder_1.MessageFactory.text(response));
        }
        catch (error) {
            this.logger.error(`Error handling message:`, error);
            await context.sendActivity(botbuilder_1.MessageFactory.text('I apologize, but I encountered an error while processing your question. Please try again.'));
        }
    }
    async generateResponse(userQuery, context) {
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
        }
        catch (error) {
            this.logger.error(`Error generating OpenAI response:`, error);
            return 'I\'m having trouble accessing my AI capabilities right now. Please try again in a moment.';
        }
    }
    async validateTeamsCredentials(appId, appPassword) {
        try {
            const testAdapter = new botbuilder_1.BotFrameworkAdapter({
                appId,
                appPassword,
            });
            return true;
        }
        catch (error) {
            this.logger.error(`Invalid Teams credentials:`, error);
            return false;
        }
    }
    getBotAdapter() {
        return this.adapter;
    }
    async processWebhook(req, res) {
        await this.adapter.process(req, res, async (context) => {
            await this.run(context);
        });
    }
};
exports.TeamsBotService = TeamsBotService;
exports.TeamsBotService = TeamsBotService = TeamsBotService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [file_processor_service_1.FileProcessorService])
], TeamsBotService);
//# sourceMappingURL=teams-bot.service.js.map