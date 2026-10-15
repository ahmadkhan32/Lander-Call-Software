import { describe, it, expect } from 'vitest';
import mockProvider from '../src/services/telephony/mockProvider.js';

describe('Telephony Provider - MockProvider', () => {
  it('should successfully initiate an outbound call with generated providerCallId', async () => {
    const result = await mockProvider.initiateCall({
      callId: '00000000-0000-0000-0000-000000000001',
      from: '+15551234567',
      to: '+15559876543',
      leadId: '00000000-0000-0000-0000-000000000002',
      agentId: '00000000-0000-0000-0000-000000000003',
    });

    expect(result).toHaveProperty('providerCallId');
    expect(result.providerCallId).toMatch(/^mock_/);
    expect(result.status).toBe('initiated');
    expect(result.provider).toBe('mock');
  });

  it('should successfully hang up an active call and calculate duration', async () => {
    const initRes = await mockProvider.initiateCall({
      callId: '00000000-0000-0000-0000-000000000001',
      to: '+15559876543',
    });

    const hangupRes = await mockProvider.hangupCall(initRes.providerCallId);
    expect(hangupRes.status).toBe('completed');
    expect(hangupRes.durationSeconds).toBeGreaterThanOrEqual(0);
  });

  it('should verify webhook signature safely', () => {
    const isValid = mockProvider.verifyWebhookSignature('any-sig', {});
    expect(isValid).toBe(true);
  });
});
