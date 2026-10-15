import TelephonyProvider from './TelephonyProvider.js';
import logger from '../../utils/logger.js';

/**
 * Twilio Telephony Provider
 * Integrates with Twilio Programmable Voice REST API.
 */
export class TwilioProvider extends TelephonyProvider {
  constructor(accountSid, authToken, defaultFromNumber) {
    super('twilio');
    this.accountSid = accountSid || process.env.TWILIO_ACCOUNT_SID;
    this.authToken = authToken || process.env.TWILIO_AUTH_TOKEN;
    this.defaultFromNumber = defaultFromNumber || process.env.TWILIO_FROM_NUMBER;
  }

  isConfigured() {
    return Boolean(this.accountSid && this.authToken && this.defaultFromNumber);
  }

  async initiateCall({ from, to, callbackUrl }) {
    if (!this.isConfigured()) {
      throw new Error('Twilio credentials (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN) are not configured');
    }

    const auth = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');
    const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Calls.json`;

    const bodyParams = new URLSearchParams({
      To: to,
      From: from || this.defaultFromNumber,
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
    };
  }

  async hangupCall(providerCallId) {
    if (!this.isConfigured()) {
      return { status: 'completed' };
    }

    const auth = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');
    const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Calls/${providerCallId}.json`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ Status: 'completed' }).toString(),
    });

    const data = await response.json();
    return {
      providerCallId,
      status: data.status || 'completed',
    };
  }
}

export default new TwilioProvider();
