import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { StatusBadge } from '../../components/data-display/StatusBadge';
import { useToast } from '../../components/ui/Toast';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  Delete,
  CheckCircle,
  Clock,
  User,
  History,
} from 'lucide-react';

const dialPad = [
  { num: '1', letters: '' },
  { num: '2', letters: 'ABC' },
  { num: '3', letters: 'DEF' },
  { num: '4', letters: 'GHI' },
  { num: '5', letters: 'JKL' },
  { num: '6', letters: 'MNO' },
  { num: '7', letters: 'PQRS' },
  { num: '8', letters: 'TUV' },
  { num: '9', letters: 'WXYZ' },
  { num: '*', letters: '' },
  { num: '0', letters: '+' },
  { num: '#', letters: '' },
];

export function DialerPage() {
  const [phoneNumber, setPhoneNumber] = useState('+1 (800) 966-6546');
  const [callState, setCallState] = useState('idle'); // idle, calling, connected, wrapup
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [disposition, setDisposition] = useState('interested');
  const [dispositionNote, setDispositionNote] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    let timer;
    if (callState === 'connected') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else if (callState === 'idle') {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callState]);

  const handleKeyPress = (num) => {
    setPhoneNumber((prev) => prev + num);
  };

  const handleStartCall = () => {
    if (!phoneNumber) return;
    setCallState('calling');
    setTimeout(() => {
      setCallState('connected');
    }, 1500);
  };

  const handleEndCall = () => {
    setCallState('wrapup');
  };

  const handleSaveDisposition = () => {
    addToast({
      title: 'Call Logged & Disposed',
      description: `Call with ${phoneNumber} recorded as ${disposition}.`,
      variant: 'success',
    });
    setCallState('idle');
    setDispositionNote('');
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
          WebRTC Softphone Dialer
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
          High-velocity predictive dialer with DTMF keypad, live SIP state, and immediate call disposition.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Softphone Keypad (5 cols) */}
        <Card className="lg:col-span-5 p-6 flex flex-col items-center">
          {/* Status Header */}
          <div className="w-full flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                SIP Provider: Connected
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              WebRTC v2.4
            </span>
          </div>

          {/* Number Display */}
          <div className="w-full my-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center relative">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              {callState === 'connected' ? 'Call in Progress' : callState === 'calling' ? 'Ringing...' : 'Enter Destination'}
            </span>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full text-center text-xl sm:text-2xl font-extrabold text-navy tracking-wider bg-transparent focus:outline-none"
              placeholder="+1 (800) 000-0000"
            />
            {callState === 'connected' && (
              <span className="inline-block mt-1 font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                {formatTimer(callDuration)}
              </span>
            )}
            {phoneNumber && callState === 'idle' && (
              <button
                onClick={() => setPhoneNumber(phoneNumber.slice(0, -1))}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                <Delete className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
            {dialPad.map((btn) => (
              <button
                key={btn.num}
                onClick={() => handleKeyPress(btn.num)}
                disabled={callState === 'wrapup'}
                className="flex flex-col items-center justify-center h-14 rounded-2xl bg-slate-50 border border-slate-200/90 text-navy font-bold text-lg hover:bg-slate-100 active:scale-95 transition shadow-sm"
              >
                <span>{btn.num}</span>
                {btn.letters && (
                  <span className="text-[9px] font-semibold text-slate-400 tracking-wider">
                    {btn.letters}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Call / Hangup Actions */}
          <div className="mt-6 w-full flex items-center justify-center gap-4">
            {callState === 'idle' ? (
              <button
                onClick={handleStartCall}
                className="flex items-center justify-center gap-2 h-14 w-full max-w-[280px] rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/30 active:scale-95 transition"
              >
                <Phone className="w-5 h-5" /> Start Call
              </button>
            ) : callState === 'connected' || callState === 'calling' ? (
              <div className="flex flex-col items-center gap-3 w-full max-w-[280px]">
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-3 rounded-xl border text-sm font-semibold transition ${
                      isMuted ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setIsOnHold(!isOnHold)}
                    className={`p-3 rounded-xl border text-sm font-semibold transition ${
                      isOnHold ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {isOnHold ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  </button>
                </div>
                <button
                  onClick={handleEndCall}
                  className="flex items-center justify-center gap-2 h-12 w-full rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-600/30 active:scale-95 transition"
                >
                  <PhoneOff className="w-5 h-5" /> End Call
                </button>
              </div>
            ) : null}
          </div>
        </Card>

        {/* Lead Details & Disposition Panel (7 cols) */}
        <Card className="lg:col-span-7 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy">Caller & Contact Intelligence</h3>
              <StatusBadge status={callState === 'connected' ? 'busy' : 'active'} />
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                  JD
                </div>
                <div>
                  <h4 className="font-extrabold text-navy text-base">John Doe (Acme Holdings)</h4>
                  <p className="text-xs text-slate-500">+1 (800) 966-6546 &bull; Assigned: Sarah Miller</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                Score: 94/100
              </span>
            </div>

            {/* Disposition Form */}
            <div className="mt-6 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Call Disposition & After-Call Work (ACW)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Call Outcome"
                  value={disposition}
                  onChange={(e) => setDisposition(e.target.value)}
                  options={[
                    { value: 'interested', label: 'Interested / Demo Scheduled' },
                    { value: 'callback', label: 'Callback Requested' },
                    { value: 'left_voicemail', label: 'Left Voicemail' },
                    { value: 'not_interested', label: 'Not Interested' },
                    { value: 'wrong_number', label: 'Wrong Number / Invalid' },
                  ]}
                />
                <Input
                  label="Follow-up Date"
                  type="date"
                  defaultValue="2024-10-30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5">
                  Call Notes & Summary
                </label>
                <textarea
                  rows={4}
                  value={dispositionNote}
                  onChange={(e) => setDispositionNote(e.target.value)}
                  placeholder="Record customer objections, commitments, or specific requirements discussed during the call..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button
              variant="primary"
              icon={CheckCircle}
              onClick={handleSaveDisposition}
            >
              Log & Complete Disposition
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
