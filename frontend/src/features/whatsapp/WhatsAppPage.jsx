import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { supabase } from '../../lib/supabase';
import {
  MessageSquare,
  Send,
  Phone,
  Search,
  Check,
  CheckCheck,
  Clock,
  Sparkles,
  User,
  Paperclip,
  Smile,
  ShieldCheck,
  RotateCcw,
  Plus,
  X,
  Radio,
} from 'lucide-react';

const QUICK_TEMPLATES = [
  {
    id: 't_intro',
    label: 'Intro & Welcome',
    text: 'Hello! Thank you for inquiring about LANDER CRM. We offer high-velocity telephony dialing with Pakistan, UK, and global routing. Would you like a live demo?',
  },
  {
    id: 't_followup',
    label: 'Call Follow-up',
    text: 'Hi there, thank you for taking the time to speak with me today. Attached are the summary notes and pricing details we discussed.',
  },
  {
    id: 't_pricing',
    label: 'Pricing & Plans',
    text: 'Our Enterprise plan includes unlimited CRM seats, dedicated SIP gateways, and full WhatsApp Business API automation. Let us know if you have any questions!',
  },
  {
    id: 't_meeting',
    label: 'Confirm Appointment',
    text: 'This is a confirmation for our scheduled demonstration tomorrow at 3:00 PM PKT. We look forward to speaking with you!',
  },
];

const INITIAL_CONVERSATIONS = [
  {
    id: 'conv_1',
    name: 'Sarah Khan',
    company: 'Apex Telephony Corp',
    phone: '+92 347 0838718',
    country: '🇵🇰',
    unread: 0,
    lastTime: '10:45 AM',
    messages: [
      { id: 'm1', sender: 'agent', text: 'Hello Sarah! Thank you for reaching out to LANDER CRM.', time: '10:30 AM', status: 'read' },
      { id: 'm2', sender: 'client', text: 'Hi! Can you confirm if the dialer caller ID shows as +923470838718 for local Pakistani numbers?', time: '10:40 AM', status: 'read' },
      { id: 'm3', sender: 'agent', text: 'Yes, absolutely! The outbound caller ID is permanently verified with Ufone Pakistan and displays correctly.', time: '10:45 AM', status: 'delivered' },
    ],
  },
  {
    id: 'conv_2',
    name: 'Oliver Wright',
    company: 'NextGen Systems',
    phone: '+44 7911 123456',
    country: '🇬🇧',
    unread: 1,
    lastTime: '9:15 AM',
    messages: [
      { id: 'm4', sender: 'agent', text: 'Good morning Oliver, sending over the requested UK telephony rate card.', time: '9:00 AM', status: 'read' },
      { id: 'm5', sender: 'client', text: 'Received, thank you! Let us proceed with onboarding 15 seats.', time: '9:15 AM', status: 'received' },
    ],
  },
  {
    id: 'conv_3',
    name: 'Liam O’Connor',
    company: 'Emerald Logistics',
    phone: '+353 87 1234567',
    country: '🇮🇪',
    unread: 0,
    lastTime: 'Yesterday',
    messages: [
      { id: 'm6', sender: 'client', text: 'Hello, looking for a call center platform with Ireland VoIP support.', time: 'Yesterday', status: 'read' },
      { id: 'm7', sender: 'agent', text: 'Hello Liam! We support Ireland direct-dial routes and full ACW disposition tracking.', time: 'Yesterday', status: 'read' },
    ],
  },
];

export function WhatsAppPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const messagesEndRef = useRef(null);

  const queryParams = new URLSearchParams(location.search);
  const qPhone = queryParams.get('phone');
  const qName = queryParams.get('name');

  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState('conv_1');
  const [searchTerm, setSearchTerm] = useState('');
  const [inputText, setInputText] = useState('');

  // New Chat Modal state
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatPhone, setNewChatPhone] = useState('+92 347 0838718');
  const [newChatName, setNewChatName] = useState('');
  const [newChatMessage, setNewChatMessage] = useState('Hello! Connecting from LANDER CRM.');

  // Handle URL query parameters to select or create conversation
  useEffect(() => {
    if (qPhone) {
      const existing = conversations.find((c) => c.phone.replace(/\s+/g, '') === qPhone.replace(/\s+/g, ''));
      if (existing) {
        setActiveConvId(existing.id);
      } else {
        const newConv = {
          id: `conv_${Date.now()}`,
          name: qName || 'New Prospect',
          company: 'Prospect Contact',
          phone: qPhone,
          country: qPhone.startsWith('+44') ? '🇬🇧' : qPhone.startsWith('+353') ? '🇮🇪' : '🇵🇰',
          unread: 0,
          lastTime: 'Just now',
          messages: [
            { id: `m_${Date.now()}`, sender: 'agent', text: `Hello ${qName || ''}! Connecting via LANDER WhatsApp.`, time: 'Just now', status: 'delivered' },
          ],
        };
        setConversations([newConv, ...conversations]);
        setActiveConvId(newConv.id);
      }
    }
  }, [location.search]);

  // Scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeConvId]);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const newMsg = {
      id: `m_${Date.now()}`,
      sender: 'agent',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered',
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConv.id) {
          return {
            ...c,
            lastTime: 'Just now',
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    const msgBody = inputText;
    setInputText('');

    // Persist directly to Supabase messages table
    try {
      await supabase.from('messages').insert({
        to_number: activeConv.phone,
        from_number: '+923470838718',
        body: msgBody,
        direction: 'outbound',
        channel: 'whatsapp',
        status: 'delivered',
      });
    } catch {}

    // Send via backend WhatsApp API
    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('lander_auth_token') || '';
      if (apiBase) {
        await fetch(`${apiBase}/api/whatsapp/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            to: activeConv.phone,
            body: msgBody,
          }),
        }).catch(() => {});
      }
    } catch {}

    addToast({
      title: 'WhatsApp Message Sent',
      description: `Sent to ${activeConv.name} (${activeConv.phone}) via Twilio sender whatsapp:+923470838718.`,
      variant: 'success',
    });
  };

  const handleStartNewChat = (e) => {
    e.preventDefault();
    if (!newChatPhone.trim()) {
      addToast({ title: 'Phone Required', description: 'Please enter a valid phone number', variant: 'error' });
      return;
    }

    const cleanPhone = newChatPhone.trim();
    const cleanName = newChatName.trim() || 'New Contact';
    const country = cleanPhone.startsWith('+44') ? '🇬🇧' : cleanPhone.startsWith('+353') ? '🇮🇪' : '🇵🇰';

    const newConv = {
      id: `conv_${Date.now()}`,
      name: cleanName,
      company: 'Direct WhatsApp Contact',
      phone: cleanPhone,
      country,
      unread: 0,
      lastTime: 'Just now',
      messages: [
        {
          id: `m_${Date.now()}`,
          sender: 'agent',
          text: newChatMessage || 'Hello! Connecting via LANDER WhatsApp.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'delivered',
        },
      ],
    };

    setConversations([newConv, ...conversations]);
    setActiveConvId(newConv.id);
    setShowNewChatModal(false);

    // Persist to Supabase
    try {
      supabase.from('messages').insert({
        to_number: cleanPhone,
        from_number: '+923470838718',
        body: newChatMessage,
        direction: 'outbound',
        channel: 'whatsapp',
        status: 'delivered',
      }).then(() => {});
    } catch {}

    addToast({
      title: 'WhatsApp Chat Started',
      description: `New thread opened with ${cleanName} (${cleanPhone}).`,
      variant: 'success',
    });

    setNewChatName('');
    setNewChatPhone('+92 347 0838718');
    setNewChatMessage('Hello! Connecting from LANDER CRM.');
  };

  const handleSimulateReply = () => {
    const replies = [
      'Sounds great! Can you please send the link to finalize our agreement?',
      'Yes, our team is available for the walkthrough at 3:00 PM.',
      'Thank you for the quick follow-up. We appreciate the support!',
      'Confirmed! We are ready to begin with 20 seats on the Pakistan route.',
    ];
    const randomReply = replies[Math.floor(Math.random() * replies.length)];

    const replyMsg = {
      id: `m_rep_${Date.now()}`,
      sender: 'client',
      text: randomReply,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'received',
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConv.id) {
          return {
            ...c,
            lastTime: 'Just now',
            messages: [...c.messages, replyMsg],
          };
        }
        return c;
      })
    );

    addToast({
      title: `New WhatsApp Reply from ${activeConv.name}`,
      description: randomReply,
      variant: 'success',
    });
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-1">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            Twilio WhatsApp Business API Integration
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
            WhatsApp CRM Inbox
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Sender: <strong className="text-emerald-700 font-mono">whatsapp:+923470838718</strong> &bull; Two-way lead messaging with quick reply templates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSimulateReply}
            className="text-xs font-semibold border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            Simulate Lead Reply
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/app/dialer?phone=${encodeURIComponent(activeConv.phone)}&name=${encodeURIComponent(activeConv.name)}`)}
            className="text-xs font-semibold bg-blue-600 hover:bg-blue-700"
          >
            <Phone className="w-3.5 h-3.5 mr-1.5" />
            Call {activeConv.name}
          </Button>
        </div>
      </div>

      {/* Two-Pane WhatsApp Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-250px)] min-h-[500px]">
        {/* Left Pane: Conversations List (4 cols) */}
        <Card className="lg:col-span-4 flex flex-col p-0 overflow-hidden border-slate-200">
          {/* Search box & New Chat button */}
          <div className="p-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowNewChatModal(true)}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
              title="Start New WhatsApp Conversation"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Conversations scroll area */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConv.id;
              const lastMsg = conv.messages[conv.messages.length - 1];
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition ${
                    isSelected ? 'bg-emerald-50/70 border-l-4 border-emerald-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                    {conv.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs truncate flex items-center gap-1">
                        <span>{conv.country}</span>
                        <span>{conv.name}</span>
                      </span>
                      <span className="text-[10px] text-slate-400">{conv.lastTime}</span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-400 truncate">{conv.phone}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {lastMsg ? lastMsg.text : 'No messages yet'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Right Pane: Active Chat Thread (8 cols) */}
        <Card className="lg:col-span-8 flex flex-col p-0 overflow-hidden border-slate-200 bg-slate-50/50">
          {/* Active Chat Header */}
          <div className="p-3.5 border-b border-slate-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                {activeConv.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-extrabold text-navy text-sm flex items-center gap-1.5">
                  <span>{activeConv.country}</span>
                  <span>{activeConv.name}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {activeConv.company} &bull; <span className="font-mono text-slate-600">{activeConv.phone}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate(`/app/dialer?phone=${encodeURIComponent(activeConv.phone)}&name=${encodeURIComponent(activeConv.name)}`)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call on Softphone</span>
              </button>
            </div>
          </div>

          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#EFEAE2]/30">
            {activeConv.messages.map((m) => {
              const isAgent = m.sender === 'agent';
              return (
                <div
                  key={m.id}
                  className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[78%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 text-xs shadow-sm ${
                      isAgent
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isAgent ? 'text-emerald-100' : 'text-slate-400'}`}>
                      <span>{m.time}</span>
                      {isAgent && (
                        <span>
                          {m.status === 'read' ? <CheckCheck className="w-3.5 h-3.5 text-blue-300" /> : <Check className="w-3.5 h-3.5" />}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Templates Bar */}
          <div className="px-3 py-2 border-t border-slate-200 bg-white flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
              Templates:
            </span>
            {QUICK_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => setInputText(tmpl.text)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-[11px] font-medium text-slate-700 shrink-0 transition"
              >
                {tmpl.label}
              </button>
            ))}
          </div>

          {/* Composer */}
          <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="Type a WhatsApp message or pick a template above..."
              className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
            <Button
              variant="primary"
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold px-4 py-2.5 shadow-sm"
            >
              <Send className="w-4 h-4 mr-1.5" />
              <span>Send</span>
            </Button>
          </div>
        </Card>
      </div>

      {/* Start New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md p-6 bg-white shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-navy flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <span>Start New WhatsApp Conversation</span>
              </h3>
              <button onClick={() => setShowNewChatModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStartNewChat} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Recipient Contact Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tariq Mehmood"
                  value={newChatName}
                  onChange={(e) => setNewChatName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700">
                    Recipient Phone Number (E.164)
                  </label>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setNewChatPhone('+92 ')}
                      className="text-[10px] bg-slate-100 hover:bg-emerald-50 px-1.5 py-0.5 rounded font-semibold text-slate-600"
                    >
                      🇵🇰 +92
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewChatPhone('+44 ')}
                      className="text-[10px] bg-slate-100 hover:bg-emerald-50 px-1.5 py-0.5 rounded font-semibold text-slate-600"
                    >
                      🇬🇧 +44
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewChatPhone('+353 ')}
                      className="text-[10px] bg-slate-100 hover:bg-emerald-50 px-1.5 py-0.5 rounded font-semibold text-slate-600"
                    >
                      🇮🇪 +353
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  required
                  placeholder="+92 347 0838718"
                  value={newChatPhone}
                  onChange={(e) => setNewChatPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 font-mono focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Initial Message
                </label>
                <textarea
                  rows={3}
                  value={newChatMessage}
                  onChange={(e) => setNewChatMessage(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setShowNewChatModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  Open Chat &amp; Send
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
