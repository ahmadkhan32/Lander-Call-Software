'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { reportsApi } from '../../lib/api.js';
import {
  Users, Phone, Target, Calendar, TrendingUp,
  AlertTriangle, CheckCircle, Clock, Plus, PhoneCall
} from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard.jsx';
import LeadSourceDonut from '../../components/dashboard/LeadSourceDonut.jsx';
import PipelineStageProgress from '../../components/dashboard/PipelineStageProgress.jsx';
import UserTrafficSpline from '../../components/dashboard/UserTrafficSpline.jsx';
import CallChart from '../../components/dashboard/CallChart.jsx';
import RecentActivity from '../../components/dashboard/RecentActivity.jsx';

export default function DashboardPage() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportsApi.overview()
      .then((res) => setOverview(res.overview))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sales & Telephony Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time lead distribution, conversion pipeline, and agent performance.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/leads/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </Link>
          <Link
            href="/dialer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Open Softphone</span>
          </Link>
        </div>
      </div>

      {/* Top Row: 3 Wave Sparkline KPI Cards matching CRMHUB Image 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          label="Product Pipeline"
          value="$546,087"
          trend="+25.40%"
          trendUp={true}
          sparklineColor="#F97316"
          sparklineData={[
            { v: 30 }, { v: 50 }, { v: 40 }, { v: 75 }, { v: 55 }, { v: 90 }, { v: 65 }, { v: 95 }
          ]}
          isLoading={loading}
        />
        <StatCard
          label="Total Revenue"
          value="$243,450"
          trend="-8.55%"
          trendUp={false}
          sparklineColor="#A855F7"
          sparklineData={[
            { v: 70 }, { v: 60 }, { v: 75 }, { v: 50 }, { v: 65 }, { v: 45 }, { v: 55 }, { v: 40 }
          ]}
          isLoading={loading}
        />
        <StatCard
          label="Closed Volume"
          value="$873,464"
          trend="+28.50%"
          trendUp={true}
          sparklineColor="#0284C7"
          sparklineData={[
            { v: 40 }, { v: 65 }, { v: 55 }, { v: 85 }, { v: 70 }, { v: 95 }, { v: 80 }, { v: 110 }
          ]}
          isLoading={loading}
        />
      </div>

      {/* Middle Row: Lead Source Donut + Stage Horizontal Progress Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadSourceDonut />
        <PipelineStageProgress />
      </div>

      {/* Bottom Row: Traffic Spline Wave Chart + Call Volume / Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <UserTrafficSpline />
        </div>
        <div className="lg:col-span-5">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
