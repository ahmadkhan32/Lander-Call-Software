import { v4 as uuidv4 } from 'uuid';
import TelephonyProvider from './TelephonyProvider.js';
import logger from '../../utils/logger.js';

/**
 * Mock Telephony Provider
 * Simulates real telephony behaviors (ringing, answered, duration, hangup)
 * with predictable state transitions for local development, demo, and test environments.
 */
export class MockProvider extends TelephonyProvider {
  constructor() {
    super('mock');
    this.activeCalls = new Map();
  }

  async initiateCall({ callId, from, to, leadId, agentId, callbackUrl }) {
    const providerCallId = `mock_${uuidv4()}`;
    const startTime = new Date();

    const callRecord = {
      providerCallId,
      callId,
      from: from || '+15550001234',
      to,
      leadId,
      agentId,
      callbackUrl,
      status: 'ringing',
      startTime,
      answeredAt: new Date(startTime.getTime() + 1500),
    };

    this.activeCalls.set(providerCallId, callRecord);
    logger.info(`[MockTelephony] Outbound call initiated to ${to} (ID: ${providerCallId})`);

    return {
      providerCallId,
      status: 'initiated',
      provider: 'mock',
    };
  }

  async hangupCall(providerCallId) {
    const callRecord = this.activeCalls.get(providerCallId);
    if (!callRecord) {
      logger.warn(`[MockTelephony] Call ${providerCallId} not found to hang up`);
      return { status: 'completed' };
    }

    const endTime = new Date();
    const durationSeconds = Math.max(1, Math.round((endTime - callRecord.startTime) / 1000));
    callRecord.status = 'completed';
    callRecord.endedAt = endTime;
    callRecord.durationSeconds = durationSeconds;
    this.activeCalls.delete(providerCallId);

    logger.info(`[MockTelephony] Call ${providerCallId} ended. Duration: ${durationSeconds}s`);

    return {
      providerCallId,
      status: 'completed',
      durationSeconds,
    };
  }

  verifyWebhookSignature(_signature, _body) {
    return true;
  }
}

export default new MockProvider();
