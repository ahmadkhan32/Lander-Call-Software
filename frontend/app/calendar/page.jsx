'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus, Phone } from 'lucide-react';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';

const SCHEDULED_ITEMS = [
  { time: '09:30 AM', title: 'Callback: Sarah Jenkins', contact: '+1 (555) 019-2831', agent: 'John Smith', type: 'Callback' },
  { time: '11:00 AM', title: 'Product Demo: Acme Holdings', contact: '+1 (555) 012-3991', agent: 'Sarah Connor', type: 'Demo' },
  { time: '02:00 PM', title: 'Follow-up: Starlight Retail', contact: '+1 (555) 018-4920', agent: 'John Smith', type: 'Sales' },
  { time: '04:30 PM', title: 'Contract Review: Apex Global', contact: '+1 (555) 017-8812', agent: 'Michael Brown', type: 'VIP' },
];

export default function CalendarPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Callback &amp; Outreach Calendar
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Scheduled outbound appointments, demos, and promised follow-ups.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-slate-800 px-2">October 2026</span>
          <button className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => alert('New Scheduled Event')}
            className="inline-flex items-center gap-1.5 ml-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Callback</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Day Schedule List */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6 space-y-4 border-slate-200 shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" /> Today&apos;s Appointments (Thursday, Oct 15)
            </h3>
            <div className="space-y-3">
              {SCHEDULED_ITEMS.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4 hover:border-blue-200 transition-all">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {item.time}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm">{item.title}</h4>
                      <Badge variant="blue">{item.type}</Badge>
                    </div>
                    <p className="text-xs text-slate-500">Contact: {item.contact} · Assigned: {item.agent}</p>
                  </div>
                  <button className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1 text-xs font-bold">
                    <Phone className="w-3.5 h-3.5" /> Call
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Mini Calendar Card */}
        <div className="space-y-4">
          <Card className="p-5 space-y-4 border-slate-200">
            <h3 className="font-extrabold text-slate-900 text-sm">Monthly Overview</h3>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <span key={i} className="font-bold text-slate-400 py-1">{d}</span>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <div
                  key={day}
                  className={`py-2 rounded-lg text-xs font-semibold cursor-pointer ${day === 15 ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-100 text-slate-700'}`}
                >
                  {day}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
