import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
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
} from 'lucide-react';

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
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
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
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
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
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80',
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
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    ],
    userCount: '+5',
    logoBg: 'bg-purple-600',
    logoLetter: 'L',
  },
  {
    id: 'cust_05',
    name: 'Basecamp',
    domain: 'basecamp.com',
    status: 'Churned',
    about: 'Project Management & Remote Work',
    subAbout: 'Project management and team communication software.',
    users: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    ],
    userCount: '+1',
    logoBg: 'bg-amber-500',
    logoLetter: 'B',
  },
  {
    id: 'cust_06',
    name: 'Stripe',
    domain: 'stripe.com',
    status: 'Churned',
    about: 'Financial Tools & Payments',
    subAbout: 'Payment processing platform for the Internet.',
    users: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    ],
    userCount: '+8',
    logoBg: 'bg-violet-600',
    logoLetter: 'S',
  },
  {
    id: 'cust_07',
    name: 'Webflow',
    domain: 'webflow.com',
    status: 'Customer',
    about: 'Web Development & Visual CMS',
    subAbout: 'Create a custom website + no-code builder.',
    users: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    ],
    userCount: '+2',
    logoBg: 'bg-blue-500',
    logoLetter: 'W',
  },
];

export function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const filtered = mockCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.about.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: (
        <div className="flex items-center gap-2">
          <input type="checkbox" className="rounded border-slate-300 text-brand" />
          <span>Company &darr;</span>
        </div>
      ),
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <input type="checkbox" className="rounded border-slate-300 text-brand" onClick={(e) => e.stopPropagation()} />
          <div className={`w-8 h-8 rounded-lg ${row.logoBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm`}>
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
      header: 'About',
      accessor: (row) => (
        <div>
          <p className="font-medium text-slate-800 text-xs">{row.about}</p>
          <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs truncate">{row.subAbout}</p>
        </div>
      ),
    },
    {
      header: 'Users',
      accessor: (row) => (
        <div className="flex items-center -space-x-2">
          {row.users.map((url, i) => (
            <img
              key={i}
              src={url}
              alt="user"
              className="w-7 h-7 rounded-full border-2 border-white object-cover"
            />
          ))}
          {row.userCount && (
            <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[10px] font-bold text-slate-600">
              {row.userCount}
            </span>
          )}
        </div>
      ),
    },
    {
      header: '',
      align: 'right',
      accessor: () => (
        <button
          onClick={(e) => { e.stopPropagation(); }}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header matching Image 2: "Total customers" */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
            Total customers
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Manage your subscribed companies, accounts, and contact representatives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={Download} size="sm">
            Export
          </Button>
          <Button
            variant="primary"
            icon={Plus}
            size="sm"
            onClick={() => navigate('/app/leads/new')}
          >
            Add customer
          </Button>
        </div>
      </div>

      {/* 3 Top Stat Cards matching Image 2 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total customers</span>
            <button className="text-slate-400 p-1"><MoreVertical className="w-4 h-4" /></button>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-navy">8,468</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              &uarr; 20%
            </span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Members</span>
            <button className="text-slate-400 p-1"><MoreVertical className="w-4 h-4" /></button>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-navy">1,210</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              &uarr; 15%
            </span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active now</span>
            <button className="text-slate-400 p-1"><MoreVertical className="w-4 h-4" /></button>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-3xl font-extrabold text-navy">316</span>
            <div className="flex items-center -space-x-2">
              {[
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
              ].map((url, i) => (
                <img key={i} src={url} alt="active user" className="w-7 h-7 rounded-full border-2 border-white object-cover" />
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Table Section matching Image 2 */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-navy">All customers ({filtered.length})</h2>
            <p className="text-xs text-slate-500">Companies that have purchased an active subscription.</p>
          </div>
          <Button variant="secondary" size="sm" icon={FileSpreadsheet}>
            Download all
          </Button>
        </div>

        {/* Search bar matching Image 2 */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search customers... (⌘K)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-12 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand shadow-sm"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
            ⌘K
          </span>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(row) => navigate(`/app/leads/${row.id}`)}
          pagination={{
            currentPage: page,
            totalPages: 184,
            totalItems: 8468,
            pageSize: 10,
            onPageChange: (newPage) => setPage(newPage),
          }}
        />
      </div>
    </div>
  );
}
