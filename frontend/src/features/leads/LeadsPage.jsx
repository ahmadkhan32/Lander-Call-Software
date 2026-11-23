import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/data-display/DataTable';
import { StatusBadge } from '../../components/data-display/StatusBadge';
import {
  Download,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Building,
  TrendingUp,
  FileSpreadsheet,
  Phone,
  MessageSquare,
  Eye,
  CheckCircle,
  Users,
} from 'lucide-react';

const mockLeads = [
  {
    id: 'lead_001',
    name: 'Sarah Khan',
    company: 'Apex Telephony Corp',
    phone: '+92 347 0838718',
    email: 'sarah.khan@apextelecom.pk',
    country: '🇵🇰 Pakistan',
    status: 'In Negotiation',
    assignedTo: 'Sarah Miller',
    score: 92,
    created_at: '2026-11-20',
  },
  {
    id: 'lead_002',
    name: 'Oliver Wright',
    company: 'NextGen Systems UK',
    phone: '+44 7911 123456',
    email: 'oliver.wright@nextgen.co.uk',
    country: '🇬🇧 United Kingdom',
    status: 'Demo Scheduled',
    assignedTo: 'Emily Chen',
    score: 88,
    created_at: '2026-11-21',
  },
  {
    id: 'lead_003',
    name: 'Liam O’Connor',
    company: 'Emerald Logistics',
    phone: '+353 87 1234567',
    email: 'liam@emeraldlogistics.ie',
    country: '🇮🇪 Ireland',
    status: 'Contacted',
    assignedTo: 'Mike Ross',
    score: 75,
    created_at: '2026-11-22',
  },
  {
    id: 'lead_004',
    name: 'Tariq Mehmood',
    company: 'Indus Logistics Hub',
    phone: '+92 321 8877665',
    email: 'tariq.m@indushub.pk',
    country: '🇵🇰 Pakistan',
    status: 'Qualified',
    assignedTo: 'Sarah Miller',
    score: 96,
    created_at: '2026-11-22',
  },
  {
    id: 'lead_005',
    name: 'Charlotte Davies',
    company: 'Manchester Support Services',
    phone: '+44 20 7946 0991',
    email: 'c.davies@manchesterservices.co.uk',
    country: '🇬🇧 United Kingdom',
    status: 'New',
    assignedTo: 'Jessica Day',
    score: 64,
    created_at: '2026-11-23',
  },
];

const mockCustomers = [
  {
    id: 'cust_01',
    name: 'Framer',
    domain: 'framer.com',
    status: 'Customer',
    about: 'Design Tools & Interactive Prototyping',
    subAbout: 'Make beautiful websites in minutes.',
    users: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    ],
    userCount: '+4',
    logoBg: 'bg-blue-600',
    logoLetter: 'F',
  },
  {
    id: 'cust_02',
    name: 'Intercom',
    domain: 'intercom.com',
    status: 'Customer',
    about: 'Customer Engagement & AI Support',
    subAbout: 'Build lasting customer relationships with Intercom.',
    users: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    ],
    userCount: '+2',
    logoBg: 'bg-indigo-600',
    logoLetter: 'I',
  },
  {
    id: 'cust_03',
    name: 'Figma',
    domain: 'figma.com',
    status: 'Customer',
    about: 'Design Tools & Collaboration',
    subAbout: 'The collaborative interface design tool.',
    users: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    ],
    userCount: '+6',
    logoBg: 'bg-rose-500',
    logoLetter: 'F',
  },
  {
    id: 'cust_04',
    name: 'Linear',
    domain: 'linear.app',
    status: 'Customer',
    about: 'Developer Tools & Project Tracking',
    subAbout: 'The issue tracking tool you will enjoy using.',
    users: [
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
    ],
    userCount: '+5',
    logoBg: 'bg-purple-600',
    logoLetter: 'L',
  },
];

export function LeadsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const isCustomersView = location.pathname.includes('customers');

  // Leads columns
  const leadsColumns = [
    {
      header: 'Prospect & Contact',
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
            {row.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-tight">{row.name}</p>
            <p className="text-xs text-slate-400">{row.company} &bull; <span className="text-slate-500">{row.country}</span></p>
          </div>
        </div>
      ),
    },
    {
      header: 'Phone Number',
      accessor: (row) => <span className="font-mono text-xs font-semibold text-slate-800">{row.phone}</span>,
    },
    {
      header: 'Lead Status',
      accessor: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Lead Score',
      accessor: (row) => (
        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {row.score}/100
        </span>
      ),
    },
    {
      header: 'Assigned Agent',
      accessor: (row) => <span className="text-xs font-medium text-slate-700">{row.assignedTo}</span>,
    },
    {
      header: 'Quick Telephony Actions',
      align: 'right',
      accessor: (row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            title="Call on Softphone"
            onClick={() => navigate(`/app/dialer?phone=${encodeURIComponent(row.phone)}&name=${encodeURIComponent(row.name)}&company=${encodeURIComponent(row.company)}`)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white text-xs font-semibold transition"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call</span>
          </button>

          <button
            type="button"
            title="Chat on WhatsApp"
            onClick={() => navigate(`/app/whatsapp?phone=${encodeURIComponent(row.phone)}&name=${encodeURIComponent(row.name)}`)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white text-xs font-semibold transition"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            title="View Details"
            onClick={() => navigate(`/app/leads/${row.id}`)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  // Customers columns
  const customersColumns = [
    {
      header: 'Company Account',
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${row.logoBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
            {row.logoLetter}
          </div>
          <div>
            <p className="font-semibold text-slate-900 leading-tight">{row.name}</p>
            <p className="text-xs text-slate-400 leading-tight">{row.domain}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'About / Segment',
      accessor: (row) => (
        <div>
          <p className="font-medium text-slate-800 text-xs">{row.about}</p>
          <p className="text-[11px] text-slate-400">{row.subAbout}</p>
        </div>
      ),
    },
    {
      header: 'Seats & Users',
      accessor: (row) => (
        <div className="flex items-center -space-x-2">
          {row.users.map((url, i) => (
            <img key={i} src={url} alt="user" className="w-7 h-7 rounded-full border-2 border-white object-cover" />
          ))}
          {row.userCount && (
            <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[10px] font-bold text-slate-600">
              {row.userCount}
            </span>
          )}
        </div>
      ),
    },
  ];

  const filteredLeads = mockLeads.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm)
  );

  const filteredCustomers = mockCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
            {isCustomersView ? 'Customer Accounts & Client Directory' : 'Leads CRM & Telephony Prospects'}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            {isCustomersView
              ? 'Manage subscribed enterprise companies, seat licenses, and active accounts.'
              : 'Direct integration with Twilio Voice dialer (+923470838718 caller ID) and WhatsApp Business messaging.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" icon={Download} size="sm">
            Export CSV
          </Button>
          {!isCustomersView ? (
            <Button
              variant="primary"
              icon={Plus}
              size="sm"
              onClick={() => navigate('/app/leads/new')}
            >
              Add New Lead
            </Button>
          ) : (
            <Button
              variant="primary"
              icon={Plus}
              size="sm"
              onClick={() => navigate('/app/leads/new')}
            >
              Add Customer
            </Button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <span className="text-xs font-semibold text-slate-500">
            {isCustomersView ? 'Total Active Accounts' : 'Total CRM Leads'}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-navy">
              {isCustomersView ? '8,468' : '1,420'}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              &uarr; 18% this month
            </span>
          </div>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-semibold text-slate-500">
            {isCustomersView ? 'Active Seats' : 'Contacted via Softphone'}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-600">
              {isCustomersView ? '1,210' : '942'}
            </span>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
              Twilio Voice Active
            </span>
          </div>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-semibold text-slate-500">
            {isCustomersView ? 'Monthly Recurring' : 'WhatsApp Engagement'}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">
              {isCustomersView ? '$248,500' : '82.4%'}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              WhatsApp Verified
            </span>
          </div>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder={isCustomersView ? 'Search customers... (⌘K)' : 'Search leads by name, company, or phone...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand shadow-sm"
          />
        </div>
      </div>

      {/* Table */}
      {isCustomersView ? (
        <DataTable
          columns={customersColumns}
          data={filteredCustomers}
          onRowClick={(row) => navigate(`/app/leads/${row.id}`)}
        />
      ) : (
        <DataTable
          columns={leadsColumns}
          data={filteredLeads}
          onRowClick={(row) => navigate(`/app/leads/${row.id}`)}
        />
      )}
    </div>
  );
}
