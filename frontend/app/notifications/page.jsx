'use client';

import { useState } from 'react';
import { Bell, CheckCheck, Clock, Phone, AlertCircle, Calendar, Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'call',
    title: 'Missed Inbound Call',
    message: 'Inbound caller from +1 (555) 019-4822 left a voicemail in queue.',
    time: '12m ago',
    read: false,
  },
  {
    id: 2,
    type: 'followup',
    title: 'Scheduled Callback Due',
    message: 'Follow-up with Marcus Vance (Apex Dynamics) is scheduled for today.',
    time: '45m ago',
    read: false,
  },
  {
    id: 3,
    type: 'system',
    title: 'New Lead Auto-Routed',
    message: 'Lead "Elena Rostova" was auto-assigned to your queue via Least-Loaded routing.',
    time: '2h ago',
    read: true,
  },
  {
    id: 4,
    type: 'qa',
    title: 'QA Evaluation Completed',
    message: 'Your call with David Miller received a 98/100 QA score.',
    time: 'Yesterday',
    read: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'call': return Phone;
      case 'followup': return Calendar;
      default: return Bell;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Notifications & Alerts
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time updates on incoming calls, scheduled callbacks, and lead assignments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={CheckCheck} onClick={markAllRead}>
            Mark All as Read
          </Button>
          <Button variant="ghost" size="sm" icon={Trash2} onClick={clearAll}>
            Clear
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card className="text-center py-16 text-slate-500">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No new notifications</p>
            <p className="text-xs text-slate-400 mt-1">You are all caught up on alerts and call activities.</p>
          </Card>
        ) : (
          notifications.map((n) => {
            const Icon = getIcon(n.type);
            return (
              <Card
                key={n.id}
                className={`flex items-start gap-4 p-4 transition-colors ${
                  !n.read ? 'bg-blue-50/30 border-blue-200' : 'bg-white'
                }`}
              >
                <div className={`p-2.5 rounded-xl flex-shrink-0 ${!n.read ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{n.title}</h3>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 flex-shrink-0">
                      <Clock className="w-3 h-3" /> {n.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{n.message}</p>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
