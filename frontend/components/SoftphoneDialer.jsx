'use client';

import React, { useState } from 'react';
import { useCall } from '../lib/context/CallContext.jsx';
import {
  Phone, PhoneOff, Mic, MicOff, Pause, Play,
  Delete, X, Check, Clock, Calendar, AlertCircle
} from 'lucide-react';
import clsx from 'clsx';

const KEYPAD_BUTTONS = [
  { num: '1', sub: '' },
  { num: '2', sub: 'ABC' },
  { num: '3', sub: 'DEF' },
  { num: '4', sub: 'GHI' },
  { num: '5', sub: 'JKL' },
  { num: '6', sub: 'MNO' },
  { num: '7', sub: 'PQRS' },
  { num: '8', sub: 'TUV' },
  { num: '9', sub: 'WXYZ' },
  { num: '*', sub: '' },
  { num: '0', sub: '+' },
  { num: '#', sub: '' },
];

const DISPOSITIONS = [
  { label: 'Sale / Converted', value: 'Converted', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { label: 'Interested / Warm', value: 'Interested', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { label: 'Callback Requested', value: 'Callback Requested', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { label: 'Left Voicemail', value: 'Left Voicemail', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { label: 'Not Interested', value: 'Not Interested', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  { label: 'Wrong Number / Bad', value: 'Wrong Number', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
];

export default function SoftphoneDialer() {
  const {
    isDialerOpen,
    closeDialer,
    callState,
    activeCall,
    duration,
    isMuted,
    isHeld,
    keypadInput,
    setKeypadInput,
    error,
    startCall,
    hangup,
    submitDisposition,
    toggleMute,
    toggleHold,
  } = useCall();

  const [callNotes, setCallNotes] = useState('');
  const [selectedDisposition, setSelectedDisposition] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  if (!isDialerOpen) return null;

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleKeypadPress = (val) => {
    setKeypadInput((prev) => prev + val);
  };

  const handleBackspace = () => {
    setKeypadInput((prev) => prev.slice(0, -1));
  };

  return (
    <div className="fixed bottom-3 sm:bottom-6 right-3 sm:right-6 left-3 sm:left-auto sm:w-96 z-50 max-w-[calc(100vw-24px)] rounded-2xl bg-surface-card border border-surface-muted shadow-2xl overflow-hidden backdrop-blur-xl animate-in">
      {/* Dialer Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface-muted/60 border-b border-surface-muted">
        <div className="flex items-center gap-2">
          <div className={clsx(
            'w-2.5 h-2.5 rounded-full',
            callState === 'in_call' ? 'bg-emerald-500 animate-pulse' :
            callState === 'ringing' || callState === 'dialing' ? 'bg-amber-500 animate-ping' :
            callState === 'wrap_up' ? 'bg-blue-500' : 'bg-slate-400'
          )} />
          <span className="font-semibold text-sm text-surface-50">
            {callState === 'in_call' ? 'Call in Progress' :
             callState === 'ringing' ? 'Ringing...' :
             callState === 'dialing' ? 'Connecting...' :
             callState === 'wrap_up' ? 'Call Summary & Disposition' : 'Softphone'}
          </span>
        </div>
        {callState === 'idle' && (
          <button
            onClick={closeDialer}
            className="p-1 rounded-lg text-surface-muted hover:text-surface-50 hover:bg-surface"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Body per state */}
      <div className="p-4">
        {error && (
          <div className="mb-3 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ── State: Idle Keypad ──────────────────────────────────────────────── */}
        {callState === 'idle' && (
          <div className="space-y-4">
            {/* Input display */}
            <div className="flex items-center justify-between px-3 py-2 bg-surface rounded-xl border border-surface-muted">
              <input
                type="tel"
                value={keypadInput}
                onChange={(e) => setKeypadInput(e.target.value)}
                placeholder="Enter phone number"
                className="bg-transparent text-lg font-mono text-surface-50 focus:outline-none w-full"
              />
              {keypadInput && (
                <button
                  onClick={handleBackspace}
                  className="p-1 text-surface-muted hover:text-surface-50"
                >
                  <Delete className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Keypad Grid */}
            <div className="grid grid-cols-3 gap-2">
              {KEYPAD_BUTTONS.map(({ num, sub }) => (
                <button
                  key={num}
                  onClick={() => handleKeypadPress(num)}
                  className="flex flex-col items-center justify-center h-12 rounded-xl bg-surface/50 hover:bg-surface border border-surface-muted/50 text-surface-50 transition-colors active:scale-95"
                >
                  <span className="text-base font-semibold">{num}</span>
                  {sub && <span className="text-[9px] text-surface-muted tracking-wider">{sub}</span>}
                </button>
              ))}
            </div>

            {/* Call button */}
            <button
              onClick={() => startCall({ phone: keypadInput })}
              disabled={!keypadInput}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-950/40"
            >
              <Phone className="w-5 h-5" />
              <span>Call Now</span>
            </button>
          </div>
        )}

        {/* ── State: Dialing / Ringing / In Call ───────────────────────────────── */}
        {(callState === 'dialing' || callState === 'ringing' || callState === 'in_call') && (
          <div className="space-y-4 text-center">
            {/* Contact & Status */}
            <div className="py-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-brand-600/20 border-2 border-brand-500 flex items-center justify-center text-brand-300 font-bold text-xl mb-3">
                {activeCall?.contactName?.[0]?.toUpperCase() || 'L'}
              </div>
              <h3 className="font-bold text-base text-surface-50">{activeCall?.contactName || 'Active Call'}</h3>
              <p className="text-sm font-mono text-surface-muted">{activeCall?.phoneTo}</p>
              <div className="flex items-center justify-center gap-2 mt-2 text-brand-400 font-mono text-sm">
                <Clock className="w-4 h-4" />
                <span>{callState === 'in_call' ? formatDuration(duration) : callState}</span>
              </div>
            </div>

            {/* In-call Notes */}
            <div className="text-left">
              <label className="text-xs font-medium text-surface-muted">Live Call Notes</label>
              <textarea
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                placeholder="Type notes during the conversation..."
                rows={2}
                className="w-full mt-1 bg-surface rounded-lg p-2 text-xs text-surface-50 border border-surface-muted focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={toggleMute}
                title={isMuted ? 'Unmute' : 'Mute'}
                className={clsx(
                  'p-3 rounded-full border transition-colors',
                  isMuted ? 'bg-red-500/20 border-red-500 text-red-300' : 'bg-surface border-surface-muted text-surface-50 hover:bg-surface-muted'
                )}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={hangup}
                title="Hang up"
                className="p-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/40 active:scale-95 transition-all"
              >
                <PhoneOff className="w-6 h-6" />
              </button>

              <button
                onClick={toggleHold}
                title={isHeld ? 'Resume' : 'Hold'}
                className={clsx(
                  'p-3 rounded-full border transition-colors',
                  isHeld ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-surface border-surface-muted text-surface-50 hover:bg-surface-muted'
                )}
              >
                {isHeld ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </button>
            </div>
          </div>
        )}

        {/* ── State: Wrap-Up / Disposition ────────────────────────────────────── */}
        {callState === 'wrap_up' && (
          <div className="space-y-4">
            <div className="text-center pb-2 border-b border-surface-muted">
              <p className="text-xs text-surface-muted uppercase tracking-wider font-semibold">Call Ended</p>
              <p className="text-lg font-bold text-surface-50 mt-0.5">{formatDuration(duration)}</p>
              <p className="text-xs text-surface-muted">{activeCall?.contactName} ({activeCall?.phoneTo})</p>
            </div>

            {/* Select Disposition */}
            <div>
              <label className="text-xs font-semibold text-surface-50 block mb-2">Select Disposition</label>
              <div className="grid grid-cols-2 gap-2">
                {DISPOSITIONS.map(({ label, value, color }) => (
                  <button
                    key={value}
                    onClick={() => setSelectedDisposition(value)}
                    className={clsx(
                      'p-2 rounded-lg border text-xs font-medium text-left transition-all',
                      color,
                      selectedDisposition === value ? 'ring-2 ring-brand-400 font-bold' : 'opacity-80 hover:opacity-100'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Follow-up reminder if Callback */}
            {selectedDisposition === 'Callback Requested' && (
              <div className="p-2.5 rounded-lg bg-surface border border-surface-muted space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                  <Calendar className="w-3.5 h-3.5" /> Callback Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full bg-surface-card rounded p-1.5 text-xs text-surface-50 border border-surface-muted focus:outline-none"
                />
              </div>
            )}

            {/* Notes summary */}
            <div>
              <label className="text-xs font-semibold text-surface-50 block mb-1">Final Call Notes</label>
              <textarea
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                placeholder="Add final notes regarding this call..."
                rows={2}
                className="w-full bg-surface rounded-lg p-2 text-xs text-surface-50 border border-surface-muted focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Complete Wrap-up button */}
            <button
              onClick={() => submitDisposition({
                disposition: selectedDisposition || 'Completed',
                notes: callNotes,
                followUpDate,
              })}
              disabled={!selectedDisposition}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>Save & Complete Call</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
