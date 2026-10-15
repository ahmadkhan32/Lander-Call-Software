'use client';

import { useState, useEffect } from 'react';
import { leadsApi } from '../../lib/api.js';
import { useCall } from '../../lib/context/CallContext.jsx';
import {
  Contact, Search, Plus, Phone, Mail, Building2,
  ChevronLeft, ChevronRight, Loader2, UserCheck
} from 'lucide-react';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Input from '../../components/ui/Input.jsx';

export default function ContactsPage() {
  const { openDialer } = useCall();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({ full_name: '', phone: '', email: '', company: '' });

  useEffect(() => {
    fetchContacts();
  }, [search]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await leadsApi.list({ search, limit: 25 });
      setContacts(res.leads || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContact = async (e) => {
    e.preventDefault();
    try {
      await leadsApi.create({ ...newContact, status: 'qualified', priority: 'medium' });
      setIsModalOpen(false);
      setNewContact({ full_name: '', phone: '', email: '', company: '' });
      fetchContacts();
    } catch (err) {
      alert(err.message || 'Failed to create contact');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Contacts Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Global directory of customer accounts, key decision-makers, and business contacts.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Add Contact
        </Button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search contacts by name, company, email, or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Contacts Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Contact Name</th>
              <th>Company</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Status</th>
              <th>Assigned Rep</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
                  <p className="text-xs text-slate-500 mt-2 font-medium">Loading contacts...</p>
                </td>
              </tr>
            ) : contacts.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-slate-500 text-sm">
                  No contacts found matching your query.
                </td>
              </tr>
            ) : (
              contacts.map((contact) => (
                <tr key={contact.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {contact.full_name?.[0]?.toUpperCase() || 'C'}
                      </div>
                      <span className="font-semibold text-slate-900 text-sm">
                        {contact.full_name}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{contact.company || '—'}</span>
                    </div>
                  </td>
                  <td>
                    <span className="font-mono text-xs text-slate-700">{contact.phone}</span>
                  </td>
                  <td>
                    <span className="text-xs text-slate-600">{contact.email || '—'}</span>
                  </td>
                  <td>
                    <Badge variant={contact.status === 'converted' ? 'green' : 'blue'}>
                      {contact.status}
                    </Badge>
                  </td>
                  <td className="text-xs text-slate-600">
                    {contact.profiles?.full_name || 'Unassigned'}
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => openDialer(contact.phone, contact)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs transition-colors"
                      title="Direct Softphone Dial"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Contact Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Contact"
        description="Add a verified business contact directly into the CRM database."
      >
        <form onSubmit={handleCreateContact} className="space-y-4">
          <Input
            label="Full Name"
            required
            value={newContact.full_name}
            onChange={(e) => setNewContact({ ...newContact, full_name: e.target.value })}
            placeholder="Michael Scott"
          />
          <Input
            label="Company"
            value={newContact.company}
            onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
            placeholder="Dunder Mifflin Paper"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              required
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              placeholder="+1 555 019 2834"
            />
            <Input
              label="Email Address"
              type="email"
              value={newContact.email}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              placeholder="mscott@dundermifflin.com"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Contact
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
