import TelephonyProvider from './TelephonyProvider.js';
import {
  twilioConfig,
  twilioClient,
  normalizePhoneNumber,
  createVoiceToken,
  sendWhatsAppMessage,
} from '../../config/twilio.js';
import logger from '../../utils/logger.js';

/**
 * Twilio Telephony Provider
 * Integrates with Twilio Programmable Voice & WhatsApp REST API.
 * Default Caller ID: +923470838718 (Ufone Pakistan / International E.164)
 */
export class TwilioProvider extends TelephonyProvider {
  constructor(accountSid, authToken, defaultFromNumber) {
    super('twilio');
    this.accountSid = accountSid || twilioConfig.accountSid;
    this.authToken = authToken || twilioConfig.authToken;
    this.apiKey = twilioConfig.apiKey;
    this.apiSecret = twilioConfig.apiSecret;
    this.defaultFromNumber = defaultFromNumber || twilioConfig.callerId || '+923470838718';
  }

  isConfigured() {
    return Boolean(
      this.accountSid &&
      (this.authToken || (this.apiKey && this.apiSecret)) &&
      this.defaultFromNumber
    );
  }

  async initiateCall({ from, to, callbackUrl }) {
    if (!this.isConfigured()) {
      throw new Error('Twilio credentials (TWILIO_ACCOUNT_SID, TWILIO_API_KEY / TWILIO_AUTH_TOKEN) are not configured');
    }

    const normalizedTo = normalizePhoneNumber(to);
    const callerId = from || this.defaultFromNumber;

    if (twilioClient) {
      try {
        const call = await twilioClient.calls.create({
          to: normalizedTo,
          from: callerId,
          url: callbackUrl || 'https://demo.twilio.com/welcome/voice/',
          statusCallback: callbackUrl ? `${callbackUrl}/status` : undefined,
          statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
        });

        logger.info(`[TwilioTelephony] Call queued SID: ${call.sid} from ${callerId} to ${normalizedTo}`);
        return {
          providerCallId: call.sid,
          status: call.status || 'initiated',
          provider: 'twilio',
          callerId,
          to: normalizedTo,
        };
      } catch (err) {
        logger.error('[TwilioTelephony] Twilio call failed:', err.message);
        throw new Error(err.message || 'Twilio call failed');
      }
    }

    // Direct HTTP basic auth fallback
    const authSecret = this.authToken || this.apiSecret;
    const authUser = this.apiKey || this.accountSid;
    const auth = Buffer.from(`${authUser}:${authSecret}`).toString('base64');
    const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Calls.json`;

    const bodyParams = new URLSearchParams({
      To: normalizedTo,
      From: callerId,
      Url: callbackUrl || 'https://demo.twilio.com/welcome/voice/',
    });

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: bodyParams.toString(),
    });

    const data = await response.json();
    if (!response.ok) {
      logger.error('Twilio call initiation failed', { data });
      throw new Error(data.message || 'Twilio call failed');
    }

    logger.info(`[TwilioTelephony] Call queued SID: ${data.sid}`);
    return {
      providerCallId: data.sid,
      status: data.status,
      provider: 'twilio',
      callerId,
      to: normalizedTo,
    };
  }

  async hangupCall(providerCallId) {
    if (!this.isConfigured() || !providerCallId) {
      return { status: 'completed' };
    }

    if (twilioClient) {
      try {
        await twilioClient.calls(providerCallId).update({ status: 'completed' });
        return { providerCallId, status: 'completed' };
      } catch (err) {
        logger.warn(`[TwilioTelephony] Hangup error on SID ${providerCallId}: ${err.message}`);
      }
    }

    return { providerCallId, status: 'completed' };
  }

  getVoiceToken(identity) {
    return createVoiceToken(identity);
  }

  async sendWhatsApp({ to, from, body, mediaUrl }) {
    return sendWhatsAppMessage({ to, from, body, mediaUrl });
  }
}

export default new TwilioProvider();
