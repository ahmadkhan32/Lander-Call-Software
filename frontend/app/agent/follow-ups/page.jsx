'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Phone, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';

const TASKS = [
  { id: 1, contact: 'Lincoln Donin', company: 'Acme Inc', time: 'Today at 2:00 PM', status: 'Pending', notes: 'Call back regarding enterprise tier pricing quotation', phone: '+1 (555) 019-2831' },
  { id: 2, contact: 'Elena Rostova', company: 'Starlight Retail', time: 'Today at 4:30 PM', status: 'Pending', notes: 'Demo scheduled for CRM VoIP integration', phone: '+1 (555) 012-3991' },
  { id: 3, contact: 'David Vance', company: 'Nova Builders', time: 'Tomorrow at 10:00 AM', status: 'Scheduled', notes: 'Check if CFO reviewed the service level agreement', phone: '+1 (555) 019-8822' },
  { id: 4, contact: 'Sarah Jenkins', company: 'Summit Energy', time: 'Completed', status: 'Done', notes: 'Contract signed for 20 seats', phone: '+1 (555) 019-2834' },
];

export default function AgentFollowUpsPage() {
  const [tasks, setTasks] = useState(TASKS);

  const markComplete = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: 'Done' } : t));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Callback Agenda &amp; Follow-ups
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Scheduled callbacks, promised follow-up deadlines, and urgent client tasks.
          </p>
        </div>
        <Link
          href="/calendar"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-sm"
        >
          <Calendar className="w-4 h-4" />
          <span>Calendar View</span>
        </Link>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-300 transition-all">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-sm sm:text-base">{task.contact}</span>
                <span className="text-xs text-slate-500 font-medium">({task.company})</span>
                <Badge variant={task.status === 'Done' ? 'green' : task.status === 'Pending' ? 'yellow' : 'blue'}>
                  {task.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-600">{task.notes}</p>
              <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium pt-1">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-blue-500" /> {task.time}</span>
                <span className="font-mono">{task.phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {task.status !== 'Done' ? (
                <>
                  <button
                    onClick={() => markComplete(task.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-bold transition-all"
                  >
                    Mark Done
                  </button>
                  <Link
                    href={`/dialer`}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Now
                  </Link>
                </>
              ) : (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Completed
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
