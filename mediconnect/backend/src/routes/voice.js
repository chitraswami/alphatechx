/**
 * Voice Route Handler
 * Handles all Exotel webhook callbacks for inbound voice calls
 * 
 * Flow:
 * 1. POST /api/voice/incoming     → Exotel hits this when call comes in
 * 2. POST /api/voice/language-selected → After language selection
 * 3. POST /api/voice/greeting     → Greet and start conversation
 * 4. POST /api/voice/process-speech → Process recorded speech
 * 5. POST /api/voice/status-callback → Call ended
 */

const express = require('express');
const router = express.Router();
const exotelService = require('../services/exotelService');
const speechService = require('../services/speechService');
const conversationService = require('../services/conversationService');
const Conversation = require('../models/Conversation');
const Hospital = require('../models/Hospital');

/**
 * POST /api/voice/incoming
 * Exotel webhook - called when a patient dials the exophone
 */
router.post('/incoming', async (req, res) => {
  try {
    const callSid = req.body.CallSid || req.query.callSid || `call-${Date.now()}`;
    const callerNumber = req.body.From || req.body.CallFrom || 'unknown';

    console.log(`📞 Incoming call from ${callerNumber}, CallSid: ${callSid}`);

    // Determine hospital from the exophone number called
    const calledNumber = req.body.To || req.body.DialWhomNumber || '';
    const hospital = await Hospital.findOne({
      $or: [
        { exophoneNumber: calledNumber },
        { 'settings.exophoneNumber': calledNumber },
      ],
    });

    // Create conversation record
    await Conversation.create({
      callSid,
      callerNumber,
      hospitalId: hospital?._id || null,
      hospitalName: hospital?.name || 'Default Hospital',
      startTime: new Date(),
      status: 'in_progress',
      language: 'hi-IN',
    });

    // Respond with language selection
    res.set('Content-Type', 'application/xml');
    res.send(exotelService.generateLanguageSelectionXml(callSid));
  } catch (error) {
    console.error('❌ Incoming call error:', error);
    res.set('Content-Type', 'application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Raveena" language="en-IN">Sorry, we are experiencing technical difficulties. Please try again later.</Say>
  <Hangup />
</Response>`);
  }
});

/**
 * POST /api/voice/language-selected
 * Called after patient selects language (1=Hindi, 2=English)
 */
router.post('/language-selected', async (req, res) => {
  try {
    const callSid = req.query.callSid || req.body.CallSid;
    const digit = req.body.Digits || req.body.digits || '2';
    const language = digit === '1' ? 'hi-IN' : 'en-IN';

    console.log(`🌐 Language selected: ${language} for call ${callSid}`);

    // Update conversation record
    await Conversation.findOneAndUpdate(
      { callSid },
      { language }
    );

    // Redirect to greeting with selected language
    res.set('Content-Type', 'application/xml');
    res.send(exotelService.generateGreetingXml(callSid, language));
  } catch (error) {
    console.error('❌ Language selection error:', error);
    res.set('Content-Type', 'application/xml');
    res.send(exotelService.generateGreetingXml(req.query.callSid, 'en-IN'));
  }
});

/**
 * POST /api/voice/greeting
 * Explicit greeting endpoint (fallback from language selection timeout)
 */
router.post('/greeting', async (req, res) => {
  const callSid = req.query.callSid || req.body.CallSid;
  const language = req.query.language || 'en-IN';

  res.set('Content-Type', 'application/xml');
  res.send(exotelService.generateGreetingXml(callSid, language));
});

/**
 * POST /api/voice/process-speech
 * Called after patient speaks - processes speech and generates AI response
 * This is the main conversation loop
 */
router.post('/process-speech', async (req, res) => {
  try {
    const callSid = req.query.callSid || req.body.CallSid;
    const language = req.query.language || 'hi-IN';
    const recordingUrl = req.body.RecordingUrl || req.body.RecordUrl;
    const callerNumber = req.body.From || req.body.CallFrom || '';

    console.log(`🎙️ Processing speech for call ${callSid}, recording: ${recordingUrl}`);

    if (!recordingUrl) {
      console.log('⚠️ No recording URL received');
      res.set('Content-Type', 'application/xml');
      const retryMsg = language === 'hi-IN'
        ? 'मुझे आपकी बात सुनाई नहीं दी। कृपया दोबारा बोलें।'
        : 'I could not hear you. Please try again.';
      res.send(exotelService.generateResponseXml(retryMsg, callSid, language, false));
      return;
    }

    // Step 1: Transcribe speech using Google Cloud STT
    const transcribedText = await speechService.transcribeFromUrl(recordingUrl, language);

    if (!transcribedText || transcribedText.trim() === '') {
      console.log('⚠️ No speech detected in recording');
      res.set('Content-Type', 'application/xml');
      const retryMsg = language === 'hi-IN'
        ? 'मुझे आपकी बात समझ नहीं आई। कृपया दोबारा बोलें।'
        : 'I did not understand. Please try again.';
      res.send(exotelService.generateResponseXml(retryMsg, callSid, language, false));
      return;
    }

    // Step 2: Get conversation context
    const convoRecord = await Conversation.findOne({ callSid });
    const hospitalId = convoRecord?.hospitalId;

    // Step 3: Process with OpenAI
    const aiResult = await conversationService.processInput(
      callSid,
      transcribedText,
      callerNumber,
      hospitalId,
      language
    );

    console.log(`🤖 AI Response: "${aiResult.responseText}" | State: ${aiResult.state}`);

    // Step 4: Update conversation record
    await Conversation.findOneAndUpdate(
      { callSid },
      {
        $push: {
          turns: {
            userSpeech: transcribedText,
            botResponse: aiResult.responseText,
            timestamp: new Date(),
          },
        },
        state: aiResult.state,
        ...(aiResult.appointmentDetails && {
          appointmentId: aiResult.appointmentDetails.appointmentId,
        }),
      }
    );

    // Step 5: Respond with ExoML
    res.set('Content-Type', 'application/xml');
    res.send(exotelService.generateResponseXml(
      aiResult.responseText,
      callSid,
      language,
      aiResult.isEnd
    ));
  } catch (error) {
    console.error('❌ Process speech error:', error);
    const language = req.query.language || 'en-IN';
    res.set('Content-Type', 'application/xml');
    const errorMsg = language === 'hi-IN'
      ? 'क्षमा करें, कुछ गड़बड़ हो गई। कृपया रिसेप्शन पर कॉल करें।'
      : 'Sorry, something went wrong. Please call our reception directly.';
    res.send(exotelService.generateResponseXml(errorMsg, req.query.callSid, language, true));
  }
});

/**
 * POST /api/voice/status-callback
 * Called by Exotel when call ends
 */
router.post('/status-callback', async (req, res) => {
  try {
    const callSid = req.body.CallSid;
    const status = req.body.Status || req.body.CallStatus || 'completed';
    const duration = req.body.Duration || req.body.CallDuration || 0;

    console.log(`📞 Call ${callSid} ended. Status: ${status}, Duration: ${duration}s`);

    // Update conversation record
    await Conversation.findOneAndUpdate(
      { callSid },
      {
        status: 'completed',
        endTime: new Date(),
        duration: parseInt(duration),
        callStatus: status,
      }
    );

    // Clean up in-memory conversation state
    conversationService.endConversation(callSid);

    res.json({ success: true });
  } catch (error) {
    console.error('❌ Status callback error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
