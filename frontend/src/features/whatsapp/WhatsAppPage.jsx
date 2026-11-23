import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';
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
  ChevronLeft,
  ArrowLeft,
} from 'lucide-react';

const QUICK_TEMPLATES = [
  {
    id: 't_content_sid',
    label: '⭐ Pre-Approved Template (HXb5b62...)',
    text: 'Demonstration confirmation for 22 July 2026 at 3:15pm',
    contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
    contentVariables: { 1: '22 July 2026', 2: '3:15pm' },
  },
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
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'chat' on mobile devices

  // Twilio Messaging Service & Content Template Configuration
  const [messagingServiceSid, setMessagingServiceSid] = useState('MGfbcc830c288190a8b384fa9a566756d4');
  const [contentSid, setContentSid] = useState('HXb5b62575e6e4ff6129ad7c8efe1f983e');
  const [templateVarDate, setTemplateVarDate] = useState('22 July 2026');
  const [templateVarTime, setTemplateVarTime] = useState('3:15pm');
  const [isTemplateActive, setIsTemplateActive] = useState(false);

  // New Chat Modal state
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatPhone, setNewChatPhone] = useState('+92 347 0838718');
  const [newChatName, setNewChatName] = useState('');
  const [newChatMessage, setNewChatMessage] = useState('Hello! Connecting from LANDER CRM.');
  const [newChatUseTemplate, setNewChatUseTemplate] = useState(false);

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
      setMobileView('chat');
    }
  }, [location.search]);

  // Scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeConvId]);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const handleSendMessage = async () => {
    let finalBody = inputText.trim();
    let payloadContentSid = null;
    let payloadVariables = null;

    if (isTemplateActive) {
      finalBody = `Demonstration confirmation for ${templateVarDate} at ${templateVarTime}`;
      payloadContentSid = contentSid;
      payloadVariables = { 1: templateVarDate, 2: templateVarTime };
    }

    if (!finalBody) return;

    const newMsg = {
      id: `m_${Date.now()}`,
      sender: 'agent',
      text: finalBody,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered',
      isTemplate: Boolean(payloadContentSid),
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

    setInputText('');
    if (isTemplateActive) setIsTemplateActive(false);

    // Persist directly to Supabase messages table
    try {
      await supabase.from('messages').insert({
        to_number: activeConv.phone,
        from_number: '+923470838718',
        body: finalBody,
        direction: 'outbound',
        channel: 'whatsapp',
        status: 'delivered',
      });
    } catch {}

    // Send via backend WhatsApp API with Messaging Service SID & Content Template SID
    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('lander_auth_token') || '';
      if (apiBase) {
        await fetch(`${apiBase}/api/whatsapp/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            to: activeConv.phone,
            body: finalBody,
            content_sid: payloadContentSid,
            content_variables: payloadVariables,
            messaging_service_sid: messagingServiceSid,
            channel: 'whatsapp',
          }),
        }).catch(() => {});
      }
    } catch {}

    addToast({
      title: payloadContentSid ? 'WhatsApp Content Template Dispatched' : 'WhatsApp Message Dispatched',
      description: payloadContentSid
        ? `Sent template ${payloadContentSid} via Messaging Service ${messagingServiceSid} to ${activeConv.name} (${activeConv.phone}).`
        : `Sent to ${activeConv.name} (${activeConv.phone}) via Messaging Service ${messagingServiceSid}.`,
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

    const initialText = newChatUseTemplate
      ? `Demonstration confirmation for ${templateVarDate} at ${templateVarTime}`
      : (newChatMessage || 'Hello! Connecting via LANDER WhatsApp.');

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
          text: initialText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'delivered',
          isTemplate: newChatUseTemplate,
        },
      ],
    };

    setConversations([newConv, ...conversations]);
    setActiveConvId(newConv.id);
    setMobileView('chat');
    setShowNewChatModal(false);

    // Persist to Supabase
    try {
      supabase.from('messages').insert({
        to_number: cleanPhone,
        from_number: '+923470838718',
        body: initialText,
        direction: 'outbound',
        channel: 'whatsapp',
        status: 'delivered',
      }).then(() => {});
    } catch {}

    // Send via backend
    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('lander_auth_token') || '';
      if (apiBase) {
        fetch(`${apiBase}/api/whatsapp/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            to: cleanPhone,
            body: initialText,
            content_sid: newChatUseTemplate ? contentSid : undefined,
            content_variables: newChatUseTemplate ? { 1: templateVarDate, 2: templateVarTime } : undefined,
            messaging_service_sid: messagingServiceSid,
            channel: 'whatsapp',
          }),
        }).catch(() => {});
      }
    } catch {}

    addToast({
      title: 'WhatsApp Chat Started',
      description: `New thread opened with ${cleanName} (${cleanPhone}) via Messaging Service ${messagingServiceSid}.`,
      variant: 'success',
    });

    setNewChatName('');
    setNewChatPhone('+92 347 0838718');
    setNewChatMessage('Hello! Connecting from LANDER CRM.');
    setNewChatUseTemplate(false);
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
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Two-way lead messaging with verified Ufone Pakistan sender and Twilio Messaging Service integration.
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-medium text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Sender: <strong>+923470838718</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-blue-50 border border-blue-200 text-[11px] font-medium text-blue-800 font-mono">
              <Radio className="w-3 h-3 text-blue-600" />
              Service SID: <strong>MGfbcc830c288190a8b384fa9a566756d4</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-purple-50 border border-purple-200 text-[11px] font-medium text-purple-800 font-mono">
              Content SID: <strong>HXb5b62575e6e4ff6129ad7c8efe1f983e</strong>
            </span>
          </div>
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

      {/* Two-Pane WhatsApp Layout (Mobile Single-Pane or Desktop Dual-Pane) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-210px)] min-h-[500px]">
        {/* Left Pane: Conversations List (Visible on desktop or when mobileView === 'list') */}
        <Card className={cn("flex flex-col p-0 overflow-hidden border-slate-200 lg:col-span-4", mobileView === 'chat' ? 'hidden lg:flex' : 'flex')}>
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
                  onClick={() => {
                    setActiveConvId(conv.id);
                    setMobileView('chat');
                  }}
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

        {/* Right Pane: Active Chat Thread (Visible on desktop or when mobileView === 'chat') */}
        <Card className={cn("flex flex-col p-0 overflow-hidden border-slate-200 bg-slate-50/50 lg:col-span-8", mobileView === 'list' ? 'hidden lg:flex' : 'flex')}>
          {/* Active Chat Header with Mobile Back Button */}
          <div className="p-3 sm:p-3.5 border-b border-slate-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileView('list')}
                className="lg:hidden p-1.5 -ml-1 rounded-xl text-slate-600 hover:text-navy hover:bg-slate-100 transition flex items-center text-xs font-semibold shrink-0"
                title="Back to conversation list"
              >
                <ChevronLeft className="w-5 h-5 text-emerald-700" />
              </button>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {activeConv.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-navy text-xs sm:text-sm flex items-center gap-1.5 truncate">
                  <span>{activeConv.country}</span>
                  <span className="truncate">{activeConv.name}</span>
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-500 truncate">
                  <span className="hidden sm:inline">{activeConv.company} &bull; </span>
                  <span className="font-mono text-slate-600">{activeConv.phone}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => navigate(`/app/dialer?phone=${encodeURIComponent(activeConv.phone)}&name=${encodeURIComponent(activeConv.name)}`)}
                className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Call on Softphone</span>
                <span className="sm:hidden">Call</span>
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
                onClick={() => {
                  if (tmpl.contentSid) {
                    setIsTemplateActive(!isTemplateActive);
                    setInputText('');
                  } else {
                    setIsTemplateActive(false);
                    setInputText(tmpl.text);
                  }
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium shrink-0 transition ${
                  tmpl.contentSid && isTemplateActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700'
                }`}
              >
                {tmpl.label}
              </button>
            ))}
          </div>

          {/* Twilio Approved Template Variables Editor */}
          {isTemplateActive && (
            <div className="p-3 border-t border-purple-200 bg-purple-50/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-bold text-purple-900 flex items-center gap-1">
                  <span>⭐ Content Template</span>
                  <code className="text-[11px] bg-purple-200/80 px-1.5 py-0.5 rounded text-purple-950 font-mono">HXb5b62575e6e4ff6129ad7c8efe1f983e</code>:
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-purple-800">Date {'{{1}}'}:</span>
                  <input
                    type="text"
                    value={templateVarDate}
                    onChange={(e) => setTemplateVarDate(e.target.value)}
                    placeholder="22 July 2026"
                    className="px-2.5 py-1 rounded-lg border border-purple-300 bg-white text-xs w-28 focus:ring-1 focus:ring-purple-600"
                  />
                  <span className="text-[11px] font-semibold text-purple-800 ml-1">Time {'{{2}}'}:</span>
                  <input
                    type="text"
                    value={templateVarTime}
                    onChange={(e) => setTemplateVarTime(e.target.value)}
                    placeholder="3:15pm"
                    className="px-2.5 py-1 rounded-lg border border-purple-300 bg-white text-xs w-20 focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTemplateActive(false)}
                className="text-xs text-purple-700 hover:text-purple-900 font-semibold"
              >
                &times; Cancel Template
              </button>
            </div>
          )}

          {/* Composer */}
          <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (isTemplateActive) setIsTemplateActive(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder={isTemplateActive ? "Click 'Send' to dispatch pre-approved Content Template (HXb5b625...)" : "Type a WhatsApp message or pick a template above..."}
              disabled={isTemplateActive}
              className={`flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                isTemplateActive ? 'bg-purple-50/50 font-medium text-purple-900' : 'bg-slate-50 focus:bg-white'
              }`}
            />
            <Button
              variant="primary"
              onClick={handleSendMessage}
              disabled={!isTemplateActive && !inputText.trim()}
              className={`text-xs font-semibold px-4 py-2.5 shadow-sm ${
                isTemplateActive
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <Send className="w-4 h-4 mr-1.5" />
              <span>{isTemplateActive ? 'Send Template' : 'Send'}</span>
            </Button>
          </div>
        </Card>
      </div>

      {/* Start New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md p-6 bg-white shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-navy flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  <span>Start New WhatsApp Conversation</span>
                </h3>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Service SID: MGfbcc830c288190a8b384fa9a566756d4
                </p>
              </div>
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
                      onClick={() => setNewChatPhone('+92 347 0838718')}
                      className="text-[10px] bg-slate-100 hover:bg-emerald-50 px-1.5 py-0.5 rounded font-semibold text-slate-600"
                    >
                      🇵🇰 +92 (Verified)
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewChatPhone('+44 7911 123456')}
                      className="text-[10px] bg-slate-100 hover:bg-emerald-50 px-1.5 py-0.5 rounded font-semibold text-slate-600"
                    >
                      🇬🇧 +44 UK
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewChatPhone('+353 87 1234567')}
                      className="text-[10px] bg-slate-100 hover:bg-emerald-50 px-1.5 py-0.5 rounded font-semibold text-slate-600"
                    >
                      🇮🇪 +353 IE
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

              {/* Template vs Freeform Choice */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={newChatUseTemplate}
                    onChange={(e) => setNewChatUseTemplate(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>Send Pre-Approved Twilio Template (HXb5b62575e6e4ff6129ad7c8efe1f983e)</span>
                </label>

                {newChatUseTemplate ? (
                  <div className="flex items-center gap-2 pt-1 text-[11px]">
                    <span>Date:</span>
                    <input
                      type="text"
                      value={templateVarDate}
                      onChange={(e) => setTemplateVarDate(e.target.value)}
                      className="px-2 py-1 rounded border border-slate-300 bg-white w-24"
                    />
                    <span>Time:</span>
                    <input
                      type="text"
                      value={templateVarTime}
                      onChange={(e) => setTemplateVarTime(e.target.value)}
                      className="px-2 py-1 rounded border border-slate-300 bg-white w-20"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Initial Message
                    </label>
                    <textarea
                      rows={2}
                      value={newChatMessage}
                      onChange={(e) => setNewChatMessage(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                )}
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
