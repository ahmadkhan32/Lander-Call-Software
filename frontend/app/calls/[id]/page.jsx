'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Phone, ArrowLeft, Play, Pause, Download, Volume2, ShieldCheck, Clock, Calendar, User } from 'lucide-react';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';

export default function CallRecordDetailPage() {
  const params = useParams();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/calls"
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Call Recording &amp; Transcript
          </h1>
          <p className="text-xs text-slate-500">Call Reference: #{params.id || 'rec-901'}</p>
        </div>
      </div>

      {/* Call Summary Card */}
      <Card className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Contact</span>
            <h2 className="text-xl font-extrabold text-slate-900">Sarah Jenkins (+1 555-019-2831)</h2>
            <p className="text-xs text-slate-500">Handling Agent: John Smith · Campaign: Q4 Sales Boost</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="green">Converted / Sale</Badge>
            <span className="font-mono text-sm font-bold text-slate-700">04m 18s</span>
          </div>
        </div>

        {/* Audio Player waveform mock */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>01:12</span>
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Audio Recording Encrypted (Opus 48kHz)</span>
            </div>
            <span>04:18</span>
          </div>

          <div className="h-10 flex items-center gap-1">
            {[40, 60, 20, 80, 100, 45, 70, 90, 30, 85, 95, 60, 40, 50, 75, 80, 65, 90, 40, 25, 60, 70, 45, 90, 100, 80, 50, 30, 60, 80, 70, 50, 40, 65, 85, 30, 40, 50, 70].map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-full transition-all ${i < 12 ? 'bg-blue-500' : 'bg-slate-700'}`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <button className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 text-xs font-bold shadow-md">
              <Play className="w-4 h-4 fill-white" /> Play
            </button>
            <button className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white">
              <Download className="w-3.5 h-3.5" /> Download Audio WAV
            </button>
          </div>
        </div>

        {/* AI Call Transcription & Sentiment */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">Automated Call Transcription</h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Sentiment: 92% Positive
            </span>
          </div>

          <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <strong className="text-blue-600">Agent John (00:05):</strong> Hello Sarah, this is John with Lander Call Systems. Thank you for requesting information on our team seats.
            </div>
            <div>
              <strong className="text-slate-900">Sarah Jenkins (00:15):</strong> Hi John, yes, we currently have 15 agents and we are looking for a reliable WebRTC softphone with built-in CRM.
            </div>
            <div>
              <strong className="text-blue-600">Agent John (00:32):</strong> Fantastic! Lander offers native dialers, custom disposition forms, call recordings, and team queues right out of the box.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
