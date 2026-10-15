import React from 'react';
import { Badge } from '../ui/Badge';

export function StatusBadge({ status }) {
  const normalized = (status || '').toLowerCase();

  const statusMap = {
    customer: { label: 'Customer', variant: 'primary', dot: true },
    active: { label: 'Active', variant: 'success', dot: true },
    completed: { label: 'Completed', variant: 'success', dot: true },
    qualified: { label: 'Qualified', variant: 'success', dot: true },
    closed_won: { label: 'Closed-Won', variant: 'success', dot: true },
    contacted: { label: 'Contacted', variant: 'primary', dot: true },
    meeting: { label: 'Meeting', variant: 'primary', dot: true },
    proposal: { label: 'Proposal', variant: 'purple', dot: true },
    negotiation: { label: 'Negotiation', variant: 'warning', dot: true },
    new: { label: 'New', variant: 'primary', dot: true },
    pending: { label: 'Pending', variant: 'warning', dot: true },
    churned: { label: 'Churned', variant: 'default', dot: true },
    inactive: { label: 'Inactive', variant: 'default', dot: true },
    busy: { label: 'Busy / On Call', variant: 'warning', dot: true },
    failed: { label: 'Failed', variant: 'danger', dot: true },
    overdue: { label: 'Overdue', variant: 'danger', dot: true },
  };

  const config = statusMap[normalized] || { label: status, variant: 'default', dot: false };

  return (
    <Badge variant={config.variant} dot={config.dot}>
      {config.label}
    </Badge>
  );
}
