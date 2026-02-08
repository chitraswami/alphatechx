/**
 * Exotel Telephony Service
 * Handles inbound call webhooks and call control via Exotel API
 * 
 * Exotel Flow:
 * 1. Patient calls exophone (01140036376)
 * 2. Exotel hits our webhook URL with call details
 * 3. We respond with XML (ExoML) to greet and collect voice input
 * 4. Exotel sends voice recording to our passthru applet
 * 5. We process speech → OpenAI → text-to-speech → respond
 */

const axios = require('axios');
const config = require('../config/credentials');

class ExotelService {
  constructor() {
    this.apiKey = config.exotel.apiKey;
    this.apiToken = config.exotel.apiToken;
    this.sid = config.exotel.sid;
    this.exophone = config.exotel.exophone;
    this.baseUrl = config.exotel.baseUrl;
    this.webhookBaseUrl = config.server.baseUrl;
  }

  /**
   * Generate ExoML response for greeting the caller
   * This is sent back to Exotel when a call comes in
   */
  generateGreetingXml(callSid, language = 'hi-IN') {
    const voiceName = language === 'hi-IN' ? 'Aditi' : 'Raveena';
    const greeting = language === 'hi-IN'
      ? 'नमस्ते, मेडीकनेक्ट में आपका स्वागत है। मैं आपकी अपॉइंटमेंट बुकिंग में मदद कर सकती हूँ। कृपया बताइए आपको किस डॉक्टर से मिलना है या आपकी क्या समस्या है?'
      : 'Hello, welcome to MediConnect. I can help you book an appointment. Please tell me which doctor you want to see or describe your health concern.';

    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${voiceName}" language="${language}">${greeting}</Say>
  <Record 
    action="${this.webhookBaseUrl}/api/voice/process-speech?callSid=${callSid}&amp;language=${language}" 
    method="POST" 
    maxLength="30" 
    timeout="5" 
    finishOnKey="#"
    playBeep="false"
  />
  <Say voice="${voiceName}" language="${language}">${language === 'hi-IN' ? 'मुझे आपकी बात सुनाई नहीं दी। कृपया दोबारा बोलें।' : 'I could not hear you. Please try again.'}</Say>
</Response>`;
  }

  /**
   * Generate ExoML for continuing the conversation
   */
  generateResponseXml(responseText, callSid, language = 'hi-IN', isEnd = false) {
    const voiceName = language === 'hi-IN' ? 'Aditi' : 'Raveena';

    if (isEnd) {
      return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${voiceName}" language="${language}">${responseText}</Say>
  <Hangup />
</Response>`;
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="${voiceName}" language="${language}">${responseText}</Say>
  <Record 
    action="${this.webhookBaseUrl}/api/voice/process-speech?callSid=${callSid}&amp;language=${language}" 
    method="POST" 
    maxLength="30" 
    timeout="5" 
    finishOnKey="#"
    playBeep="false"
  />
</Response>`;
  }

  /**
   * Generate ExoML for language selection
   */
  generateLanguageSelectionXml(callSid) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Aditi" language="hi-IN">हिंदी के लिए एक दबाएं।</Say>
  <Say voice="Raveena" language="en-IN">For English, press 2.</Say>
  <Gather 
    action="${this.webhookBaseUrl}/api/voice/language-selected?callSid=${callSid}" 
    method="POST" 
    numDigits="1" 
    timeout="10"
  />
  <Say voice="Raveena" language="en-IN">We did not receive your input. Connecting you in English.</Say>
  <Redirect method="POST">${this.webhookBaseUrl}/api/voice/greeting?callSid=${callSid}&amp;language=en-IN</Redirect>
</Response>`;
  }

  /**
   * Make an outbound call via Exotel API (for appointment reminders)
   */
  async makeOutboundCall(toNumber, callbackUrl) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/Calls/connect.json`,
        new URLSearchParams({
          From: toNumber,
          CallerId: this.exophone,
          Url: callbackUrl,
          StatusCallback: `${this.webhookBaseUrl}/api/voice/status-callback`,
        }),
        {
          auth: {
            username: this.apiKey,
            password: this.apiToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('❌ Exotel outbound call error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get call details from Exotel
   */
  async getCallDetails(callSid) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/Calls/${callSid}.json`,
        {
          auth: {
            username: this.apiKey,
            password: this.apiToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('❌ Exotel get call details error:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new ExotelService();
