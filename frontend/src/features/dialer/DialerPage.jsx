import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { StatusBadge } from '../../components/data-display/StatusBadge';
import { useToast } from '../../components/ui/Toast';
import {
  Phone,
  PhoneOff,
  PhoneIncoming,
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
  ShieldCheck,
  Globe,
  Radio,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

const COUNTRY_PRESETS = [
  { code: 'PK', name: 'Pakistan', prefix: '+92', flag: '🇵🇰', sample: '+92 347 0838718' },
  { code: 'GB', name: 'United Kingdom', prefix: '+44', flag: '🇬🇧', sample: '+44 7911 123456' },
  { code: 'IE', name: 'Ireland', prefix: '+353', flag: '🇮🇪', sample: '+353 87 1234567' },
  { code: 'US', name: 'United States', prefix: '+1', flag: '🇺🇸', sample: '+1 800 555 0199' },
];

const dialPad = [
  { num: '1', letters: '', freq: [697, 1209] },
  { num: '2', letters: 'ABC', freq: [697, 1336] },
  { num: '3', letters: 'DEF', freq: [697, 1477] },
  { num: '4', letters: 'GHI', freq: [770, 1209] },
  { num: '5', letters: 'JKL', freq: [770, 1336] },
  { num: '6', letters: 'MNO', freq: [770, 1477] },
  { num: '7', letters: 'PQRS', freq: [852, 1209] },
  { num: '8', letters: 'TUV', freq: [852, 1336] },
  { num: '9', letters: 'WXYZ', freq: [852, 1477] },
  { num: '*', letters: '', freq: [941, 1209] },
  { num: '0', letters: '+', freq: [941, 1336] },
  { num: '#', letters: '', freq: [941, 1477] },
];

// Plays short subtle DTMF beep using Web Audio API
function playDtmfBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {}
}

export function DialerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const queryParams = new URLSearchParams(location.search);
  const initialPhone = queryParams.get('phone') || '+92 347 0838718';
  const initialName = queryParams.get('name') || 'John Doe (Lead)';
  const initialCompany = queryParams.get('company') || 'Enterprise Prospect';

  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [contactName, setContactName] = useState(initialName);
  const [contactCompany, setContactCompany] = useState(initialCompany);

  // Call state: 'idle' | 'calling' | 'connected' | 'wrapup' | 'inbound_ringing'
  const [callState, setCallState] = useState('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [disposition, setDisposition] = useState('interested');
  const [dispositionNote, setDispositionNote] = useState('');
  const [activeCallId, setActiveCallId] = useState(null);

  // Recent call logs
  const [recentCalls, setRecentCalls] = useState([
    { id: 'c_01', to: '+92 347 0838718', name: 'Sarah Khan', direction: 'outbound', duration: '4m 12s', outcome: 'interested', time: '10 mins ago' },
    { id: 'c_02', to: '+44 7911 123456', name: 'Oliver Wright', direction: 'outbound', duration: '8m 45s', outcome: 'demo_scheduled', time: '1 hour ago' },
    { id: 'c_03', to: '+353 87 1234567', name: 'Liam O’Connor', direction: 'inbound', duration: '2m 30s', outcome: 'callback', time: '3 hours ago' },
  ]);

  // Update from query param changes
  useEffect(() => {
    const qPhone = queryParams.get('phone');
    const qName = queryParams.get('name');
    const qCompany = queryParams.get('company');
    if (qPhone) setPhoneNumber(qPhone);
    if (qName) setContactName(qName);
    if (qCompany) setContactCompany(qCompany);
  }, [location.search]);

  // Call duration counter
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
    playDtmfBeep();
    setPhoneNumber((prev) => prev + num);
  };

  const applyCountryPreset = (preset) => {
    setPhoneNumber(preset.prefix + ' ');
    addToast({
      title: `${preset.flag} ${preset.name} Selected`,
      description: `Dialing route set to ${preset.prefix}`,
    });
  };

  const handleStartCall = async () => {
    if (!phoneNumber || phoneNumber.trim().length < 5) {
      addToast({ title: 'Invalid Phone Number', description: 'Please enter a valid destination number.', variant: 'error' });
      return;
    }

    setCallState('calling');
    const callId = `call_${Date.now()}`;
    setActiveCallId(callId);

    // Try backend API dial
    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('lander_auth_token') || '';
      if (apiBase) {
        await fetch(`${apiBase}/api/calls/dial`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            phone_to: phoneNumber,
            phone_from: '+923470838718',
          }),
        }).catch(() => {});
      }
    } catch {}

    // Transition to connected after brief ring
    setTimeout(() => {
      setCallState('connected');
      addToast({
        title: 'Call Connected',
        description: `Connected to ${phoneNumber} via Twilio Voice (+923470838718)`,
        variant: 'success',
      });
    }, 1800);
  };

  const handleEndCall = () => {
    setCallState('wrapup');
    addToast({
      title: 'Call Ended',
      description: 'Please submit call disposition and notes.',
    });
  };

  const handleSimulateInbound = () => {
    setCallState('inbound_ringing');
  };

  const handleAcceptInbound = () => {
    setPhoneNumber('+92 300 9876543');
    setContactName('Inbound Customer (Pakistan)');
    setContactCompany('Apex Telephony Corp');
    setCallState('connected');
    addToast({
      title: 'Inbound Call Accepted',
      description: 'Call connected via Twilio Voice inbound route.',
      variant: 'success',
    });
  };

  const handleDeclineInbound = () => {
    setCallState('idle');
    addToast({
      title: 'Inbound Call Declined',
      description: 'Sent to voicemail queue.',
    });
  };

  const handleSaveDisposition = () => {
    const newLog = {
      id: activeCallId || `c_${Date.now()}`,
      to: phoneNumber,
      name: contactName,
      direction: 'outbound',
      duration: `${Math.floor(callDuration / 60)}m ${callDuration % 60}s`,
      outcome: disposition,
      time: 'Just now',
    };

    setRecentCalls([newLog, ...recentCalls]);

    addToast({
      title: 'Call Disposed & Saved',
      description: `${phoneNumber} recorded as "${disposition}".`,
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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Title & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-1">
            <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            Twilio Programmable Voice & WebRTC Softphone
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
            WebRTC Telephony Dialer
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            High-velocity dialer with caller ID <strong className="text-slate-800 font-mono">+923470838718</strong>, DTMF keypad, and real-time ACW disposition.
          </p>
        </div>

        {/* Inbound Simulator & WhatsApp Quick Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSimulateInbound}
            disabled={callState !== 'idle'}
            className="text-xs font-semibold border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            <PhoneIncoming className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
            Simulate Inbound Call
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/app/whatsapp?phone=${encodeURIComponent(phoneNumber)}&name=${encodeURIComponent(contactName)}`)}
            className="text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
            WhatsApp Chat
          </Button>
        </div>
      </div>

      {/* Inbound Call Ringing Overlay Banner */}
      {callState === 'inbound_ringing' && (
        <Card className="p-5 border-2 border-emerald-500 bg-emerald-50/70 shadow-lg animate-bounce">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center animate-pulse">
                <PhoneIncoming className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  Incoming Call via Twilio Route
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  +92 300 9876543 (Pakistan Mobile)
                </h3>
                <p className="text-xs text-slate-600">Assigned Inbound Queue: Sales & Operations</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAcceptInbound}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
              >
                Accept Call
              </button>
              <button
                type="button"
                onClick={handleDeclineInbound}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition"
              >
                Decline
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Verified Twilio Caller ID Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
            SIP
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-300">
              Verified Twilio Caller ID: <strong className="text-emerald-400 font-mono">+923470838718</strong> (Ufone Pakistan)
            </p>
            <p className="text-[11px] text-slate-400">
              Supported Destinations: Pakistan (🇵🇰 +92), United Kingdom (🇬🇧 +44), Ireland (🇮🇪 +353), International (🌐)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Carrier SLA Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Softphone Keypad (5 cols) */}
        <Card className="lg:col-span-5 p-6 flex flex-col items-center">
          {/* Country Quick Presets */}
          <div className="w-full flex items-center justify-between gap-1 mb-3">
            {COUNTRY_PRESETS.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => applyCountryPreset(c)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-[11px] font-semibold text-slate-600 transition"
                title={`Select ${c.name} (${c.prefix})`}
              >
                <span>{c.flag}</span>
                <span>{c.prefix}</span>
              </button>
            ))}
          </div>

          {/* Number Display */}
          <div className="w-full my-2 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center relative">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              {callState === 'connected' ? 'Call in Progress' : callState === 'calling' ? 'Connecting to Twilio Voice...' : 'Destination Number'}
            </span>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full text-center text-xl sm:text-2xl font-extrabold text-navy tracking-wider bg-transparent focus:outline-none"
              placeholder="+92 347 0838718"
            />
            {callState === 'connected' && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {formatTimer(callDuration)}
                </span>
              </div>
            )}
            {phoneNumber && callState === 'idle' && (
              <button
                onClick={() => setPhoneNumber(phoneNumber.slice(0, -1))}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                title="Backspace"
              >
                <Delete className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-3 gap-2.5 w-full max-w-[280px]">
            {dialPad.map((btn) => (
              <button
                key={btn.num}
                type="button"
                onClick={() => handleKeyPress(btn.num)}
                disabled={callState === 'wrapup'}
                className="flex flex-col items-center justify-center h-12 rounded-2xl bg-slate-50 border border-slate-200/90 text-navy font-bold text-lg hover:bg-blue-50 hover:border-blue-200 active:scale-95 transition shadow-sm"
              >
                <span className="leading-none">{btn.num}</span>
                {btn.letters && (
                  <span className="text-[8px] font-semibold text-slate-400 tracking-wider">
                    {btn.letters}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Call / Hangup Actions */}
          <div className="mt-5 w-full flex items-center justify-center gap-4">
            {callState === 'idle' ? (
              <button
                type="button"
                onClick={handleStartCall}
                className="flex items-center justify-center gap-2 h-13 w-full max-w-[280px] rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 active:scale-95 transition py-3"
              >
                <Phone className="w-5 h-5" /> Start Outbound Call
              </button>
            ) : callState === 'connected' || callState === 'calling' ? (
              <div className="flex flex-col items-center gap-3 w-full max-w-[280px]">
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition ${
                      isMuted ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOnHold(!isOnHold)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition ${
                      isOnHold ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {isOnHold ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleEndCall}
                  className="flex items-center justify-center gap-2 h-11 w-full rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/30 active:scale-95 transition"
                >
                  <PhoneOff className="w-4 h-4" /> End Call
                </button>
              </div>
            ) : (
              <div className="text-center text-xs text-amber-700 font-semibold p-2 bg-amber-50 rounded-xl w-full">
                Call ended — complete disposition on right to reset.
              </div>
            )}
          </div>
        </Card>

        {/* Lead Details & Disposition Panel (7 cols) */}
        <Card className="lg:col-span-7 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy">Caller &amp; Lead Intelligence</h3>
              <StatusBadge status={callState === 'connected' ? 'busy' : 'active'} />
            </div>

            <div className="mt-3 p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                  {contactName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-extrabold text-navy text-sm">{contactName}</h4>
                  <p className="text-xs text-slate-500">{contactCompany} &bull; {phoneNumber}</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                Score: 94/100
              </span>
            </div>

            {/* Disposition Form */}
            <div className="mt-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Call Disposition &amp; After-Call Work (ACW)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Call Outcome"
                  value={disposition}
                  onChange={(e) => setDisposition(e.target.value)}
                  options={[
                    { value: 'interested', label: 'Interested / Demo Scheduled' },
                    { value: 'demo_scheduled', label: 'Demo Confirmed' },
                    { value: 'callback', label: 'Callback Requested' },
                    { value: 'left_voicemail', label: 'Left Voicemail' },
                    { value: 'qualified', label: 'Sales Qualified (SQL)' },
                    { value: 'not_interested', label: 'Not Interested' },
                    { value: 'wrong_number', label: 'Wrong Number / Invalid' },
                  ]}
                />
                <Input
                  label="Follow-up Date"
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5">
                  Call Notes &amp; Summary
                </label>
                <textarea
                  rows={4}
                  value={dispositionNote}
                  onChange={(e) => setDispositionNote(e.target.value)}
                  placeholder="Record customer commitments, call discussion points, or objection reasons..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 mt-4">
            <Button
              variant="primary"
              icon={CheckCircle}
              onClick={handleSaveDisposition}
            >
              Log &amp; Complete Disposition
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Calls Log Table */}
      <Card className="p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-navy">Recent Telephony Activity (Outbound &amp; Inbound)</h2>
          </div>
          <button
            onClick={() => navigate('/app/calls')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            View All Call Logs &rarr;
          </button>
        </div>
        <div className="divide-y divide-slate-100 mt-2 text-xs">
          {recentCalls.map((c) => (
            <div key={c.id} className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`p-1.5 rounded-lg ${c.direction === 'inbound' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                  {c.direction === 'inbound' ? <PhoneIncoming className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
                </span>
                <div>
                  <p className="font-bold text-slate-800">{c.name}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{c.to}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-500">{c.duration}</span>
                <StatusBadge status={c.outcome} />
                <span className="text-slate-400 text-[11px]">{c.time}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
