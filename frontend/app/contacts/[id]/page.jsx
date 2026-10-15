'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Phone, Mail, Building, MapPin, Calendar, Clock, ArrowLeft, Edit3, MessageSquare } from 'lucide-react';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';

export default function ContactDetailPage() {
  const params = useParams();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/contacts"
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Lincoln Donin
          </h1>
          <p className="text-xs text-slate-500">Contact ID: #{params.id || 'c-101'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4">
          <div className="text-center pb-4 border-b border-slate-100">
            <div className="w-20 h-20 mx-auto rounded-full bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-lg">
              LD
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 mt-3">Lincoln Donin</h2>
            <p className="text-xs text-slate-500">CEO at Acme Inc</p>
            <div className="mt-2">
              <Badge variant="green">Key Decision Maker</Badge>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="w-4 h-4 text-slate-400" />
              <span className="font-mono font-medium">+1 (555) 019-2831</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>lincoln@acme.com</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Building className="w-4 h-4 text-slate-400" />
              <span>Acme Holdings, LLC</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>San Francisco, CA</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/dialer"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Call Contact</span>
            </Link>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">Interaction History</h3>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">Outbound Call (4m 12s)</span>
                  <span className="text-slate-400">2 hours ago</span>
                </div>
                <p className="text-xs text-slate-600">
                  Discussed 50-seat telephony rollout for Q4. Requested PDF proposal with volume discount.
                </p>
                <span className="inline-block text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  Outcome: Interested
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">Email Campaign Received</span>
                  <span className="text-slate-400">3 days ago</span>
                </div>
                <p className="text-xs text-slate-600">
                  Opened Lander CRM Feature Update newsletter and clicked pricing calculator link.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
