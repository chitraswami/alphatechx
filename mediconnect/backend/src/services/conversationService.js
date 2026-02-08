/**
 * OpenAI Conversation Service
 * Handles the AI conversation logic for appointment booking
 * Uses GPT-4o-mini for cost-effective, fast responses
 */

const OpenAI = require('openai');
const config = require('../config/credentials');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const moment = require('moment-timezone');

class ConversationService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });
    this.model = config.openai.model;

    // In-memory conversation state (use Redis in production for scale)
    this.conversations = new Map();
  }

  /**
   * Get or create conversation state for a call
   */
  getConversation(callSid) {
    if (!this.conversations.has(callSid)) {
      this.conversations.set(callSid, {
        callSid,
        messages: [],
        state: 'greeting', // greeting → collecting_info → confirming → booked → ended
        collectedData: {
          patientName: null,
          patientPhone: null,
          department: null,
          doctorName: null,
          doctorId: null,
          preferredDate: null,
          preferredTime: null,
          symptoms: null,
        },
        hospitalId: null,
        language: 'hi-IN',
        turnCount: 0,
      });
    }
    return this.conversations.get(callSid);
  }

  /**
   * Process user input and generate AI response
   */
  async processInput(callSid, userText, callerNumber, hospitalId, language = 'hi-IN') {
    const conversation = this.getConversation(callSid);
    conversation.hospitalId = hospitalId;
    conversation.language = language;
    conversation.collectedData.patientPhone = callerNumber;
    conversation.turnCount++;

    // Add user message to history
    conversation.messages.push({
      role: 'user',
      content: userText,
    });

    // Fetch available doctors for context
    const doctors = await Doctor.find({
      hospitalId: hospitalId,
      isActive: true,
    }).lean();

    const doctorInfo = doctors.map((d) => ({
      name: d.name,
      department: d.department,
      specialization: d.specialization,
      availableDays: d.availableDays,
      availableSlots: d.availableSlots,
      consultationFee: d.consultationFee,
    }));

    // Build system prompt
    const systemPrompt = this.buildSystemPrompt(conversation, doctorInfo, language);

    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversation.messages,
        ],
        temperature: 0.7,
        max_tokens: 300,
        response_format: { type: 'json_object' },
      });

      const aiResponse = JSON.parse(response.choices[0].message.content);

      // Update conversation state based on AI response
      if (aiResponse.extracted_data) {
        Object.assign(conversation.collectedData, aiResponse.extracted_data);
      }

      if (aiResponse.next_state) {
        conversation.state = aiResponse.next_state;
      }

      // Add AI response to history
      conversation.messages.push({
        role: 'assistant',
        content: aiResponse.response_text,
      });

      // If appointment confirmed, book it
      let appointmentDetails = null;
      if (aiResponse.action === 'book_appointment' && conversation.state === 'booked') {
        appointmentDetails = await this.bookAppointment(conversation);
      }

      return {
        responseText: aiResponse.response_text,
        state: conversation.state,
        isEnd: conversation.state === 'ended' || conversation.state === 'booked',
        appointmentDetails,
        collectedData: conversation.collectedData,
      };
    } catch (error) {
      console.error('❌ OpenAI conversation error:', error.message);

      const fallbackMsg =
        language === 'hi-IN'
          ? 'क्षमा करें, कुछ गड़बड़ हो गई। कृपया दोबारा कोशिश करें या हमारे रिसेप्शन पर कॉल करें।'
          : 'Sorry, something went wrong. Please try again or call our reception directly.';

      return {
        responseText: fallbackMsg,
        state: 'error',
        isEnd: true,
      };
    }
  }

  /**
   * Build system prompt for OpenAI
   */
  buildSystemPrompt(conversation, doctorInfo, language) {
    const today = moment().tz('Asia/Kolkata').format('YYYY-MM-DD (dddd)');
    const currentTime = moment().tz('Asia/Kolkata').format('hh:mm A');

    const languageInstruction =
      language === 'hi-IN'
        ? 'Respond ONLY in Hindi (Devanagari script). Be polite and conversational like a helpful hospital receptionist.'
        : 'Respond in English. Be polite and conversational like a helpful hospital receptionist.';

    return `You are MediConnect, an AI voice assistant for a hospital. You help patients book appointments over phone calls.

${languageInstruction}

TODAY: ${today}
CURRENT TIME: ${currentTime}
TIMEZONE: Asia/Kolkata (IST)

AVAILABLE DOCTORS:
${JSON.stringify(doctorInfo, null, 2)}

CURRENT CONVERSATION STATE: ${conversation.state}
COLLECTED DATA SO FAR: ${JSON.stringify(conversation.collectedData, null, 2)}
CALLER PHONE: ${conversation.collectedData.patientPhone}

YOUR TASK:
1. Understand what the patient needs (appointment booking, cancellation, or info)
2. Collect required info: patient name, department/doctor preference, preferred date & time
3. Match with an available doctor and time slot
4. Confirm the appointment details with the patient
5. Keep responses SHORT (under 50 words) - this is a phone call, not a chat

RESPOND WITH JSON:
{
  "response_text": "Your spoken response to the patient (short and clear)",
  "extracted_data": { "field_name": "value" },
  "next_state": "collecting_info|confirming|booked|ended",
  "action": "none|book_appointment|cancel_appointment|transfer_to_human"
}

RULES:
- NEVER make up doctor names - only use the ones provided above
- If patient asks for a department you don't have, politely say so
- If a slot is not available, suggest alternatives
- Maximum 6 turns before offering to transfer to human receptionist
- Always confirm the full appointment details before booking
- For dates, map "kal" = tomorrow, "aaj" = today, "parso" = day after tomorrow`;
  }

  /**
   * Book the appointment in the database
   */
  async bookAppointment(conversation) {
    try {
      const { collectedData, hospitalId } = conversation;

      // Find or create patient
      let patient = await Patient.findOne({
        phone: collectedData.patientPhone,
        hospitalId,
      });

      if (!patient) {
        patient = await Patient.create({
          name: collectedData.patientName || 'Unknown Patient',
          phone: collectedData.patientPhone,
          hospitalId,
          language: conversation.language === 'hi-IN' ? 'hindi' : 'english',
        });
      }

      // Find the doctor
      const doctor = await Doctor.findById(collectedData.doctorId);
      if (!doctor) {
        console.error('❌ Doctor not found:', collectedData.doctorId);
        return null;
      }

      // Create the appointment
      const appointment = await Appointment.create({
        patientId: patient._id,
        doctorId: doctor._id,
        hospitalId,
        appointmentDate: collectedData.preferredDate,
        appointmentTime: collectedData.preferredTime,
        department: doctor.department,
        symptoms: collectedData.symptoms,
        status: 'confirmed',
        bookedVia: 'voice_bot',
        callSid: conversation.callSid,
      });

      console.log(`✅ Appointment booked: ${appointment._id}`);

      return {
        appointmentId: appointment._id,
        doctor: doctor.name,
        department: doctor.department,
        date: collectedData.preferredDate,
        time: collectedData.preferredTime,
        patient: patient.name,
      };
    } catch (error) {
      console.error('❌ Booking error:', error.message);
      return null;
    }
  }

  /**
   * Clean up conversation state
   */
  endConversation(callSid) {
    this.conversations.delete(callSid);
  }
}

module.exports = new ConversationService();
