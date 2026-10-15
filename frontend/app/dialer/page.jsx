'use client';

import { useState } from 'react';
import { useCall } from '../../lib/context/CallContext.jsx';
import {
  Phone, PhoneOff, Mic, MicOff, Pause, Play,
  Delete, Clock, Calendar, CheckCircle2, AlertCircle, History,
  ShieldCheck, Volume2
} from 'lucide-react';
import clsx from 'clsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';

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
  { label: 'Sale / Converted', value: 'Converted', variant: 'green' },
  { label: 'Interested / Warm', value: 'Interested', variant: 'blue' },
  { label: 'Callback Requested', value: 'Callback Requested', variant: 'yellow' },
  { label: 'Left Voicemail', value: 'Left Voicemail', variant: 'purple' },
  { label: 'Not Interested', value: 'Not Interested', variant: 'red' },
  { label: 'Wrong Number / Bad', value: 'Wrong Number', variant: 'gray' },
];

const RECENT_DIALS = [
  { name: 'Sarah Jenkins', phone: '+1 (555) 019-2831', time: '10m ago', outcome: 'Completed' },
  { name: 'David Vance', phone: '+1 (555) 019-8822', time: '35m ago', outcome: 'Left Voicemail' },
  { name: 'Elena Rostova', phone: '+1 (555) 012-3991', time: '1h ago', outcome: 'Callback' },
];

export default function DialerPage() {
  const {
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
  const [callerId, setCallerId] = useState('+1 (555) 019-2834');

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleKeyPress = (num) => {
    setKeypadInput((prev) => prev + num);
  };

  const handleBackspace = () => {
    setKeypadInput((prev) => prev.slice(0, -1));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Agent Softphone Station
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Direct dialer, WebRTC live voice channel, and call disposition management.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Softphone Dialpad Column */}
        <div className="lg:col-span-7">
          <Card className="p-6 sm:p-8 space-y-6 shadow-md border-slate-200">
            {/* Caller ID selector */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Outbound Caller ID
              </span>
              <select
                value={callerId}
                onChange={(e) => setCallerId(e.target.value)}
                className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none"
              >
                <option value="+1 (555) 019-2834">+1 (555) 019-2834 (Main Sales)</option>
                <option value="+1 (800) 440-2000">+1 (800) 440-2000 (Toll Free)</option>
              </select>
            </div>

            {/* In-Call Active Display vs Idle Keypad */}
            {callState === 'idle' ? (
              <div className="space-y-5">
                {/* Phone display input */}
                <div className="flex items-center justify-between px-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <input
                    type="tel"
                    value={keypadInput}
                    onChange={(e) => setKeypadInput(e.target.value)}
                    placeholder="Enter phone or click keypad"
                    className="bg-transparent text-xl sm:text-2xl font-mono text-slate-900 font-bold focus:outline-none w-full"
                  />
                  {keypadInput && (
                    <button
                      onClick={handleBackspace}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      <Delete className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Keypad Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {KEYPAD_BUTTONS.map(({ num, sub }) => (
                    <button
                      key={num}
                      onClick={() => handleKeyPress(num)}
                      className="flex flex-col items-center justify-center h-16 rounded-2xl bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 text-slate-900 transition-all duration-150 active:scale-95 shadow-sm"
                    >
                      <span className="text-xl font-bold">{num}</span>
                      {sub && <span className="text-[10px] font-semibold text-slate-400 tracking-wider">{sub}</span>}
                    </button>
                  ))}
                </div>

                {/* Place Call Button */}
                <button
                  onClick={() => startCall({ phone: keypadInput })}
                  disabled={!keypadInput}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-emerald-600/20 active:scale-[0.98]"
                >
                  <Phone className="w-5 h-5" />
                  <span>Start Outbound Call</span>
                </button>
              </div>
            ) : callState === 'wrap_up' ? (
              /* Wrap-up Disposition Form */
              <div className="space-y-5 animate-in">
                <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <Badge variant="blue">Call Completed</Badge>
                  <p className="text-3xl font-extrabold text-slate-900 mt-2 font-mono">
                    {formatDuration(duration)}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeCall?.contactName || 'Lead'} ({activeCall?.phoneTo})
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Select Call Disposition <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {DISPOSITIONS.map(({ label, value, variant }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSelectedDisposition(value)}
                        className={clsx(
                          'p-3 rounded-xl border text-xs font-bold text-left transition-all',
                          selectedDisposition === value
                            ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/20'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedDisposition === 'Callback Requested' && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5 animate-in">
                    <label className="flex items-center gap-1.5 text-xs text-amber-900 font-bold">
                      <Calendar className="w-4 h-4 text-amber-700" /> Scheduled Callback Date
                    </label>
                    <input
                      type="datetime-local"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="input"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Call Wrap-Up Notes
                  </label>
                  <textarea
                    rows={3}
                    value={callNotes}
                    onChange={(e) => setCallNotes(e.target.value)}
                    placeholder="Key talking points, client requests, and next steps..."
                    className="input resize-none"
                  />
                </div>

                <button
                  onClick={() => submitDisposition({
                    disposition: selectedDisposition || 'Completed',
                    notes: callNotes,
                    followUpDate,
                  })}
                  disabled={!selectedDisposition}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all disabled:opacity-40 shadow-sm"
                >
                  Save Call & Close Wrap-Up
                </button>
              </div>
            ) : (
              /* Live Call in Progress */
              <div className="space-y-6 text-center py-4 animate-in">
                <div className="w-20 h-20 mx-auto rounded-full bg-blue-50 border-4 border-blue-500/20 flex items-center justify-center text-blue-600 font-extrabold text-2xl animate-pulse">
                  {activeCall?.contactName?.[0]?.toUpperCase() || 'L'}
                </div>

                <div>
                  <h3 className="font-extrabold text-xl text-slate-900">
                    {activeCall?.contactName || 'Connected Call'}
                  </h3>
                  <p className="text-sm font-mono text-slate-500 mt-0.5">{activeCall?.phoneTo}</p>
                  <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{callState === 'in_call' ? formatDuration(duration) : callState}</span>
                  </div>
                </div>

                {/* Call Notes input */}
                <div className="text-left">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    In-Call Notes
                  </label>
                  <textarea
                    rows={2}
                    value={callNotes}
                    onChange={(e) => setCallNotes(e.target.value)}
                    placeholder="Type live notes during the call..."
                    className="input resize-none"
                  />
                </div>

                {/* Call Controls */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <button
                    onClick={toggleMute}
                    className={clsx(
                      'p-4 rounded-2xl border transition-all active:scale-95',
                      isMuted ? 'bg-red-50 border-red-300 text-red-600' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    )}
                    title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                  >
                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>

                  <button
                    onClick={hangup}
                    className="p-5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30 active:scale-95 transition-all"
                    title="End Call"
                  >
                    <PhoneOff className="w-7 h-7" />
                  </button>

                  <button
                    onClick={toggleHold}
                    className={clsx(
                      'p-4 rounded-2xl border transition-all active:scale-95',
                      isHeld ? 'bg-amber-50 border-amber-300 text-amber-600' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    )}
                    title={isHeld ? 'Resume call' : 'Hold call'}
                  >
                    {isHeld ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Info & Recent History Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Audio & Device Health */}
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-blue-600" /> WebRTC Audio & Gateway
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">Audio Gateway:</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">Latency:</span>
                <span className="font-mono font-semibold text-slate-700">18 ms</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Active Codec:</span>
                <span className="font-mono text-slate-700">Opus 48kHz</span>
              </div>
            </div>
          </Card>

          {/* Quick Redial List */}
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" /> Recent Direct Dials
            </h3>
            <div className="space-y-3">
              {RECENT_DIALS.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{r.name}</p>
                    <p className="text-[11px] font-mono text-slate-500">{r.phone}</p>
                    <span className="text-[10px] text-slate-400">{r.time} · {r.outcome}</span>
                  </div>
                  <button
                    onClick={() => {
                      setKeypadInput(r.phone);
                      startCall({ phone: r.phone, contactName: r.name });
                    }}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 shadow-sm"
                    title="Redial"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
