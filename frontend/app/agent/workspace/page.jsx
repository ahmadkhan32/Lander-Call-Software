'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Phone, PhoneOff, Mic, MicOff, Pause, Play, UserPlus, Users,
  FileText, Tag, Hash, Clock, CheckCircle2, AlertCircle, Volume2,
  Mail, MessageSquare, ChevronRight, Send, ArrowRight
} from 'lucide-react';
import clsx from 'clsx';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';

const ACTIVE_QUEUES = [
  { id: 'q1', name: 'John Doe', queue: 'Queue 1', time: '2m | Ongoing', type: 'call', phone: '(800) 966-6546' },
  { id: 'q2', name: 'John Doe', queue: 'Queue 1', time: '3m | Queue wait', type: 'call', phone: '(800) 555-0199' },
  { id: 'q3', name: 'John Doe', queue: 'Queue 1', time: '4m | Email wait', type: 'email', email: 'agent@mail.com' },
  { id: 'q4', name: 'John Doe', queue: 'Queue 1', time: '5m | Chat wait', type: 'chat', phone: '(800) 555-0144' },
];

export default function AgentWorkspacePage() {
  const [activeTab, setActiveTab] = useState('crm'); // 'crm' | 'notes' | 'history'
  const [callDuration, setCallDuration] = useState(24);
  const [isCalling, setIsCalling] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isHeld, setIsHeld] = useState(false);
  const [disposition, setDisposition] = useState('');
  const [householdName, setHouseholdName] = useState('');
  const [reminderSummary, setReminderSummary] = useState('');
  const [callNotes, setCallNotes] = useState('');
  const [statusSubmitted, setStatusSubmitted] = useState(false);

  useEffect(() => {
    let timer;
    if (isCalling && !isHeld) {
      timer = setInterval(() => setCallDuration((d) => d + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isCalling, isHeld]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSubmitDisposition = (e) => {
    e.preventDefault();
    setStatusSubmitted(true);
    setTimeout(() => setStatusSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Top Banner Alert Strip */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span className="px-3 py-1.5 rounded-lg bg-rose-600 text-white flex items-center gap-1.5 shadow-sm">
          <AlertCircle className="w-3.5 h-3.5" /> High priority: Call queue wait &gt; 3 mins
        </span>
        <span className="px-3 py-1.5 rounded-lg bg-sky-600 text-white flex items-center gap-1.5 shadow-sm">
          Campaign Script: Lander Solar Q4 Rebate Active
        </span>
        <span className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white flex items-center gap-1.5 shadow-sm">
          Agent Status: On Active Call
        </span>
      </div>

      {/* Main 3-Column Layout Matching Agent Workspace Spec */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Active Queue & Incoming Interactions */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Active Queue (4)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                Inbound
              </span>
            </div>

            <div className="space-y-2">
              {ACTIVE_QUEUES.map((item, i) => (
                <div
                  key={item.id}
                  className={clsx(
                    'p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3',
                    i === 0
                      ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  )}
                >
                  <div className={clsx(
                    'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs',
                    item.type === 'call' ? 'bg-emerald-600' : 'bg-blue-600'
                  )}>
                    {item.type === 'call' ? <Phone className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-500">{item.queue} · {item.time}</p>
                  </div>
                  {i === 0 && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Incoming Waiting Card */}
          <Card className="p-4 text-center space-y-3 bg-gradient-to-br from-blue-50 to-slate-50 border-blue-200">
            <p className="text-xs font-bold text-slate-700">Next Inbound Lead</p>
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">jahndoe@mail.com</p>
              <p className="text-[11px] text-slate-500">Auto-allocated to Queue 1</p>
            </div>
            <div className="text-2xl font-black font-mono text-slate-800">
              14s
            </div>
            <div className="flex gap-2 pt-1">
              <button className="flex-1 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all">
                Reject
              </button>
              <button className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm">
                Accept
              </button>
            </div>
          </Card>
        </div>

        {/* Center Column: Live Ongoing Call Centerpiece & Controls */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-6 sm:p-8 text-center space-y-6 shadow-md border-slate-200">
            {/* Header / Line status */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Basic Queue</span>
              <span className="font-mono font-bold text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {formatTimer(callDuration)}
              </span>
            </div>

            {/* Caller Profile Avatar & Details */}
            <div className="space-y-3">
              <div className="w-24 h-24 mx-auto rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-3xl shadow-xl ring-4 ring-blue-500/20">
                JD
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">John Doe</h2>
                <p className="text-sm font-mono font-bold text-slate-500 mt-0.5">(800) 966-6546</p>
                <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Ongoing Call · {formatTimer(callDuration)}
                </div>
              </div>
            </div>

            {/* 8 Softphone Circular Function Buttons */}
            <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto pt-2">
              <button
                onClick={() => setIsHeld(!isHeld)}
                className={clsx(
                  'p-3.5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95',
                  isHeld ? 'bg-amber-500 text-white border-amber-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                )}
                title="Hold / Resume"
              >
                {isHeld ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </button>

              <button
                className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95"
                title="Transfer Call"
              >
                <UserPlus className="w-5 h-5" />
              </button>

              <button
                className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95"
                title="Conference Call"
              >
                <Users className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className={clsx(
                  'p-3.5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95',
                  isMuted ? 'bg-rose-500 text-white border-rose-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                )}
                title="Mute Mic"
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95"
                title="Keypad DTMF"
              >
                <Hash className="w-5 h-5" />
              </button>

              <button
                className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95"
                title="Call Notes"
              >
                <FileText className="w-5 h-5" />
              </button>

              <button
                className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95"
                title="Tag Call"
              >
                <Tag className="w-5 h-5" />
              </button>

              <button
                className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95"
                title="Voice Gateway Status"
              >
                <Volume2 className="w-5 h-5 text-emerald-600" />
              </button>
            </div>

            {/* Big Hangup Call Button */}
            <div className="pt-2">
              <button
                onClick={() => setIsCalling(false)}
                className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all active:scale-[0.98]"
              >
                <PhoneOff className="w-6 h-6" />
                <span>Hang Up &amp; Complete Call</span>
              </button>
            </div>
          </Card>
        </div>

        {/* Right Column: CRM (FACES) Form & Call Disposition Panel */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-5 space-y-4">
            {/* Tabs */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveTab('crm')}
                className={clsx(
                  'pb-2.5 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all',
                  activeTab === 'crm'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                )}
              >
                CRM (FACES)
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={clsx(
                  'pb-2.5 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all',
                  activeTab === 'notes'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                )}
              >
                Notes
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={clsx(
                  'pb-2.5 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all',
                  activeTab === 'history'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                )}
              >
                History
              </button>
            </div>

            {activeTab === 'crm' && (
              <form onSubmit={handleSubmitDisposition} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Call Disposition <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={disposition}
                    onChange={(e) => setDisposition(e.target.value)}
                    required
                    className="w-full text-xs font-semibold rounded-xl border border-slate-300 bg-white p-2.5 focus:border-blue-600 focus:outline-none"
                  >
                    <option value="">Select disposition outcome...</option>
                    <option value="Interested">Interested / Qualified</option>
                    <option value="Callback">Scheduled Callback</option>
                    <option value="Voicemail">Left Voicemail</option>
                    <option value="Not Interested">Not Interested</option>
                    <option value="Sale Closed">Sale Closed / Converted</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Household Name
                  </label>
                  <input
                    type="text"
                    value={householdName}
                    onChange={(e) => setHouseholdName(e.target.value)}
                    placeholder="Enter household / company name"
                    className="w-full text-xs rounded-xl border border-slate-300 bg-white p-2.5 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Reminder Summary
                  </label>
                  <textarea
                    rows={3}
                    value={reminderSummary}
                    onChange={(e) => setReminderSummary(e.target.value)}
                    placeholder="Write action items, agreed price, or follow-up notes..."
                    className="w-full text-xs rounded-xl border border-slate-300 bg-white p-2.5 focus:border-blue-600 focus:outline-none resize-none"
                  />
                </div>

                {statusSubmitted && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Disposition recorded to CRM successfully!</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-sm"
                >
                  Submit Call Disposition
                </button>
              </form>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-3">
                <textarea
                  rows={6}
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="Comprehensive agent notes taken during conversation..."
                  className="w-full text-xs rounded-xl border border-slate-300 bg-white p-3 focus:border-blue-600 focus:outline-none resize-none"
                />
                <button
                  onClick={() => alert('Notes saved.')}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                >
                  Save Notes
                </button>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-800">Yesterday, 3:45 PM</span>
                  <p className="text-slate-500 mt-0.5">Outbound call: Left Voicemail (Agent Sarah)</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-800">Oct 12, 11:20 AM</span>
                  <p className="text-slate-500 mt-0.5">Form Lead Ingest: Facebook Solar Campaign</p>
                </div>
              </div>
            )}
          </Card>

          {/* General Info & Announcements Bottom Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <Card className="p-4 space-y-2 text-xs">
              <span className="font-bold text-slate-900 uppercase tracking-wider block border-b border-slate-100 pb-1">
                General Lead Info
              </span>
              <div className="space-y-1 text-slate-600">
                <p><strong className="text-slate-800">Contact ID:</strong> 123456</p>
                <p><strong className="text-slate-800">Channel:</strong> Voice Inbound</p>
                <p><strong className="text-slate-800">Queue:</strong> Basic Queue</p>
                <p><strong className="text-slate-800">Timestamp:</strong> 2026-10-15 15:00:00</p>
              </div>
            </Card>

            <Card className="p-4 space-y-2 text-xs bg-amber-50/50 border-amber-200">
              <span className="font-bold text-amber-900 uppercase tracking-wider block border-b border-amber-200/60 pb-1">
                Announcements
              </span>
              <p className="text-amber-800 font-medium">
                🎯 Bonus target: 15 qualified conversions today gets team lunch voucher.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
