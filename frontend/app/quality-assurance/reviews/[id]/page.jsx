'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Star, ShieldCheck, CheckCircle2, MessageSquare, Award } from 'lucide-react';
import Card from '../../../../components/ui/Card.jsx';
import Badge from '../../../../components/ui/Badge.jsx';

export default function QAReviewDetailPage() {
  const params = useParams();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/quality-assurance"
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            QA Call Audit Review
          </h1>
          <p className="text-xs text-slate-500">Review Reference: #{params.id || 'qa-801'}</p>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Agent: Sarah Connor</h2>
            <p className="text-xs text-slate-500">Auditor: QA Supervisor Mark · Call: Sarah Jenkins (+1 555-019-2831)</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-600">98 / 100</span>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Grade: Grade A Exemplary</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm">Grading Rubric</h3>
          {[
            { criterion: 'Greeting & Mandatory Disclosure', score: '20/20', note: 'Agent clearly stated company name, recording disclosure, and purpose.' },
            { criterion: 'Need Discovery & Active Listening', score: '25/25', note: 'Asked open-ended questions about telephony team size and budget.' },
            { criterion: 'Objection Handling & Empathy', score: '28/30', note: 'Handled pricing concern well, slightly delayed mentioning annual discount.' },
            { criterion: 'Call Wrap-up & Accurate Disposition', score: '25/25', note: 'Accurately logged Converted disposition and booked follow-up.' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900">{item.criterion}</span>
                <span className="font-mono font-bold text-blue-600">{item.score}</span>
              </div>
              <p className="text-xs text-slate-600">{item.note}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
