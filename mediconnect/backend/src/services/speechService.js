/**
 * Google Cloud Speech Service
 * Handles Speech-to-Text (STT) using Google Cloud
 * Uses the service account from gcp-service-account.json
 */

const speech = require('@google-cloud/speech');
const config = require('../config/credentials');

class SpeechService {
  constructor() {
    // Set credentials path for Google Cloud
    process.env.GOOGLE_APPLICATION_CREDENTIALS = config.google.credentialsPath;

    this.client = new speech.SpeechClient({
      projectId: config.google.projectId,
    });
  }

  /**
   * Transcribe audio from a URL (Exotel recording URL)
   * @param {string} audioUrl - URL of the audio recording from Exotel
   * @param {string} languageCode - Language code (hi-IN for Hindi, en-IN for English)
   * @returns {string} Transcribed text
   */
  async transcribeFromUrl(audioUrl, languageCode = 'hi-IN') {
    try {
      const axios = require('axios');

      // Download audio from Exotel recording URL
      const audioResponse = await axios.get(audioUrl, {
        responseType: 'arraybuffer',
      });

      const audioBytes = Buffer.from(audioResponse.data).toString('base64');

      const request = {
        audio: {
          content: audioBytes,
        },
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 8000, // Exotel uses 8kHz for phone calls
          languageCode: languageCode,
          alternativeLanguageCodes: languageCode === 'hi-IN' ? ['en-IN'] : ['hi-IN'],
          model: 'phone_call', // Optimized for phone audio
          useEnhanced: true,
          enableAutomaticPunctuation: true,
          speechContexts: [
            {
              phrases: [
                // Common medical/appointment terms
                'appointment', 'doctor', 'book', 'cancel', 'reschedule',
                'tomorrow', 'today', 'morning', 'evening', 'afternoon',
                // Hindi terms
                'अपॉइंटमेंट', 'डॉक्टर', 'बुकिंग', 'कैंसल', 'कल', 'आज',
                'सुबह', 'शाम', 'दोपहर',
                // Department names
                'cardiology', 'orthopedic', 'dermatology', 'ENT', 'pediatric',
                'general medicine', 'gynecology', 'neurology', 'ophthalmology',
              ],
              boost: 15,
            },
          ],
        },
      };

      const [response] = await this.client.recognize(request);

      if (response.results && response.results.length > 0) {
        const transcript = response.results
          .map((result) => result.alternatives[0].transcript)
          .join(' ');

        console.log(`🎤 Transcribed (${languageCode}): "${transcript}"`);
        return transcript;
      }

      console.log('🎤 No speech detected');
      return '';
    } catch (error) {
      console.error('❌ Speech-to-text error:', error.message);
      throw error;
    }
  }

  /**
   * Transcribe from raw audio buffer
   */
  async transcribeFromBuffer(audioBuffer, languageCode = 'hi-IN') {
    try {
      const audioBytes = audioBuffer.toString('base64');

      const request = {
        audio: {
          content: audioBytes,
        },
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 8000,
          languageCode: languageCode,
          alternativeLanguageCodes: languageCode === 'hi-IN' ? ['en-IN'] : ['hi-IN'],
          model: 'phone_call',
          useEnhanced: true,
        },
      };

      const [response] = await this.client.recognize(request);

      if (response.results && response.results.length > 0) {
        return response.results
          .map((result) => result.alternatives[0].transcript)
          .join(' ');
      }

      return '';
    } catch (error) {
      console.error('❌ Buffer transcription error:', error.message);
      throw error;
    }
  }
}

module.exports = new SpeechService();
