'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Phone, Globe, Shield, Save, CheckCircle2 } from 'lucide-react';
import Card from '../../../components/ui/Card.jsx';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';

export default function ProfileSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    fullName: 'Super Administrator',
    email: 'superadmin@lander.crm',
    phone: '+1 (555) 019-2834',
    timezone: 'America/New_York (UTC-5)',
    role: 'Super Admin',
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/settings" className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Agent Profile & Account</h1>
          <p className="text-xs text-slate-500">Manage your user profile credentials and contact preferences</p>
        </div>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Profile changes saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="space-y-5">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-blue-500/20">
              S
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{profile.fullName}</h2>
              <p className="text-xs text-blue-600 font-semibold">{profile.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              required
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
            />
            <Input
              label="Email Address"
              readOnly
              disabled
              value={profile.email}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Direct Agent Phone"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
            <Select
              label="Timezone"
              value={profile.timezone}
              onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
              options={[
                { label: 'America/New_York (UTC-5)', value: 'America/New_York (UTC-5)' },
                { label: 'America/Chicago (UTC-6)', value: 'America/Chicago (UTC-6)' },
                { label: 'America/Los_Angeles (UTC-8)', value: 'America/Los_Angeles (UTC-8)' },
                { label: 'Europe/London (UTC+0)', value: 'Europe/London (UTC+0)' },
              ]}
            />
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <Button variant="primary" type="submit" icon={Save}>
              Save Profile Changes
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
