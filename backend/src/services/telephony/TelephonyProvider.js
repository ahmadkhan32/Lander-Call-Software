/**
 * Telephony Provider Interface & Base Class
 * Ensures all telephony providers implement a consistent interface.
 */
export class TelephonyProvider {
  constructor(name) {
    this.name = name;
  }

  /**
   * Initiate an outbound call.
   * @param {Object} params - { callId, from, to, leadId, agentId, callbackUrl }
   * @returns {Promise<{ providerCallId: string, status: string }>}
   */
  async initiateCall(_params) {
    throw new Error('initiateCall must be implemented by provider');
  }

  /**
   * Terminate/hang up an active call.
   * @param {string} providerCallId
   * @returns {Promise<{ status: string }>}
   */
  async hangupCall(_providerCallId) {
    throw new Error('hangupCall must be implemented by provider');
  }

  /**
   * Verify an incoming webhook signature.
   * @param {string} signature
   * @param {Object} body
   * @returns {boolean}
   */
  verifyWebhookSignature(_signature, _body) {
    return true;
  }
}
export default TelephonyProvider;
