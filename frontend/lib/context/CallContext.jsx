'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { callsApi } from '../api.js';

const CallContext = createContext(null);

export function CallProvider({ children }) {
  const [isDialerOpen, setIsDialerOpen] = useState(false);
  const [callState, setCallState] = useState('idle'); // idle | dialing | ringing | in_call | wrap_up
  const [activeCall, setActiveCall] = useState(null);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isHeld, setIsHeld] = useState(false);
  const [keypadInput, setKeypadInput] = useState('');
  const [error, setError] = useState(null);

  const timerRef = useRef(null);

  // Timer effect for active call
  useEffect(() => {
    if (callState === 'in_call') {
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  const openDialer = (phone = '', lead = null) => {
    if (phone) setKeypadInput(phone);
    if (lead) {
      setActiveCall((prev) => ({
        ...(prev || {}),
        leadId: lead.id,
        contactName: lead.full_name || lead.name,
        phoneTo: phone || lead.phone,
      }));
    }
    setIsDialerOpen(true);
  };

  const closeDialer = () => {
    if (callState === 'idle') {
      setIsDialerOpen(false);
      setError(null);
    }
  };

  const startCall = async ({ phone, leadId = null, name = null, campaignId = null }) => {
    const targetPhone = phone || keypadInput;
    if (!targetPhone) {
      setError('Please enter a phone number to dial');
      return;
    }

    setError(null);
    setCallState('dialing');
    setDuration(0);
    setIsDialerOpen(true);

    try {
      const res = await callsApi.dial({
        phone_to: targetPhone,
        lead_id: leadId,
        campaign_id: campaignId,
      });

      setActiveCall({
        id: res.callId,
        providerCallId: res.providerCallId,
        phoneTo: res.phoneTo || targetPhone,
        contactName: name || 'Lead Contact',
        leadId,
        campaignId,
        provider: res.provider,
      });

      // Simulate ringing then connect
      setCallState('ringing');
      setTimeout(() => {
        setCallState('in_call');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Call failed to connect');
      setCallState('idle');
    }
  };

  const hangup = async () => {
    if (!activeCall?.id) {
      setCallState('idle');
      return;
    }

    try {
      await callsApi.hangup(activeCall.id);
    } catch (err) {
      console.warn('Hangup notification error:', err);
    }

    setCallState('wrap_up');
  };

  const submitDisposition = async ({ disposition, notes, followUpDate }) => {
    if (!activeCall?.id) {
      setCallState('idle');
      setActiveCall(null);
      return;
    }

    try {
      await callsApi.disposition(activeCall.id, {
        disposition_name: disposition,
        notes,
        outcome: disposition,
        follow_up_date: followUpDate || null,
      });
    } catch (err) {
      console.error('Disposition recording error:', err);
    } finally {
      setCallState('idle');
      setActiveCall(null);
      setDuration(0);
      setIsMuted(false);
      setIsHeld(false);
      setIsDialerOpen(false);
    }
  };

  const toggleMute = () => setIsMuted((prev) => !prev);
  const toggleHold = () => setIsHeld((prev) => !prev);

  return (
    <CallContext.Provider
      value={{
        isDialerOpen,
        setIsDialerOpen,
        callState,
        activeCall,
        duration,
        isMuted,
        isHeld,
        keypadInput,
        setKeypadInput,
        error,
        openDialer,
        closeDialer,
        startCall,
        hangup,
        submitDisposition,
        toggleMute,
        toggleHold,
      }}
    >
      {children}
    </CallContext.Provider>
  );
}

export function useCall() {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
}
