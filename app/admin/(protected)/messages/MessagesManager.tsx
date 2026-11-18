'use client';

import React, { useState } from 'react';
import {
  Mail,
  MailOpen,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  X,
  AlertCircle,
  Inbox,
  Copy,
  Check,
  Send,
} from 'lucide-react';
import { toggleMessageReadAction, deleteMessageAction } from './actions';
import type { Message } from '@/types';

type TemplateKey = 'onboarding' | 'brief' | 'whatsapp';

const TEMPLATES: Record<TemplateKey, { label: string; desc: string; getBody: (msg: Message) => string }> = {
  onboarding: {
    label: '🚀 Onboarding, Budget & Timeline',
    desc: 'Menjelaskan alur kerja 3 tahap, estimasi waktu, dan cara penentuan harga',
    getBody: (msg) =>
`Halo ${msg.name},

Terima kasih banyak sudah menghubungi SEZKY Studio! Kami sangat senang bisa berkesempatan membantu pengembangan visual brand Anda.

Menanggapi pesan Anda: "${msg.message}", berikut gambaran alur kerja, durasi pengerjaan, dan estimasi budget di SEZKY Studio:

1. Alur Pengerjaan (Workflow):
- Discovery & Brief: Diskusi konsep, kebutuhan desain (Brand Identity / Packaging / Mockup), dan referensi style yang Anda sukai.
- Concept & Iteration: Pembuatan 2–3 alternatif konsep desain awal, dilanjutkan dengan revisi terarah hingga hasil maksimal.
- Final Delivery: Penyerahan seluruh file master siap cetak & digital (AI, EPS, PDF, SVG, PNG resolusi tinggi) serta panduan brand.

2. Estimasi Waktu (Timeline):
- Package / Label Design: 5 – 10 hari kerja.
- Full Brand Identity (Logo + Visual Guidelines): 2 – 3 minggu kerja.

3. Estimasi Investasi & Penawaran Budget:
Investasi project disesuaikan dengan skala kebutuhan bisnis Anda (tersedia paket fleksibel dari UMKM hingga scale-up brand). Agar kami bisa memberikan rincian harga yang tepat, boleh ceritakan sedikit:
a. Produk atau bisnis apa yang sedang Anda kembangkan?
b. Layanan desain apa yang paling Anda prioritaskan saat ini?
c. Apakah ada target tanggal peluncuran (deadline) tertentu?

Jika Anda lebih nyaman berdiskusi via WhatsApp atau discovery call santai (15 menit), silakan kabari kami ya.

Salam hangat,
SEZKY Studio
halo@sezky.studio | https://sezky.studio`,
  },
  brief: {
    label: '📋 Tanya Kebutuhan & Brief',
    desc: 'Langsung menanyakan detail kebutuhan desain & aset yang sudah ada',
    getBody: (msg) =>
`Halo ${msg.name},

Terima kasih telah menghubungi SEZKY Studio!

Terkait pesan Anda: "${msg.message}", kami siap membantu mewujudkan desain visual terbaik untuk Anda.

Agar kami dapat menyiapkan estimasi biaya dan jadwal pengerjaan yang tepat, boleh informasikan beberapa hal berikut:
1. Jenis layanan apa yang Anda butuhkan (contoh: Desain Kemasan / Logo & Brand Identity / Mockup 3D)?
2. Apakah sudah memiliki aset brand yang ada atau memulai dari awal (fresh design)?
3. Target peluncuran atau deadline yang diinginkan?

Kami tunggu detail informasinya agar bisa segera kami buatkan proposal penawarannya.

Salam hangat,
SEZKY Studio
halo@sezky.studio`,
  },
  whatsapp: {
    label: '💬 Fast-track WhatsApp',
    desc: 'Ajak diskusi santai dan kirim referensi via WhatsApp',
    getBody: (msg) =>
`Halo ${msg.name},

Terima kasih sudah menghubungi SEZKY Studio!

Terkait pesan Anda: "${msg.message}", kami siap berkolaborasi untuk mewujudkan project ini.

Untuk respon yang lebih cepat dan memudahkan saling kirim referensi visual, Anda juga bisa langsung chat kami melalui WhatsApp:
👉 WhatsApp: [Masukkan Nomor WhatsApp Anda di sini]

Atau Anda cukup membalas email ini dengan nomor WhatsApp Anda agar tim kami yang langsung menghubungi Anda.

Terima kasih dan sukses selalu untuk bisnis Anda!

Salam hangat,
SEZKY Studio`,
  },
};

export default function MessagesManager({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [activeMessage, setActiveMessage] = useState<Message | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedReply, setCopiedReply] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>('onboarding');
  const [replyText, setReplyText] = useState<string>('');

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyReplyText = () => {
    navigator.clipboard.writeText(replyText);
    setCopiedReply(true);
    setTimeout(() => setCopiedReply(false), 2000);
  };

  const handleSelectTemplate = (key: TemplateKey) => {
    setSelectedTemplate(key);
    if (activeMessage) {
      setReplyText(TEMPLATES[key].getBody(activeMessage));
    }
  };

  const getGmailComposeUrl = () => {
    if (!activeMessage) return '#';
    const subject = encodeURIComponent(`Re: Inquiry — SEZKY Studio`);
    const body = encodeURIComponent(replyText);
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(activeMessage.email)}&su=${subject}&body=${body}`;
  };

  // Filter & Search
  const filteredMessages = messages.filter((msg) => {
    const query = search.toLowerCase();
    const matchSearch =
      msg.name.toLowerCase().includes(query) ||
      msg.email.toLowerCase().includes(query) ||
      msg.message.toLowerCase().includes(query);

    if (!matchSearch) return false;
    if (filter === 'unread') return !msg.is_read;
    if (filter === 'read') return msg.is_read;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.is_read).length;

  const handleToggleRead = async (msg: Message, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLoadingId(msg.id);
    setActionError('');

    try {
      const res = await toggleMessageReadAction(msg.id, msg.is_read);
      if (res.error) {
        setActionError(res.error);
      } else {
        const updated = messages.map((m) =>
          m.id === msg.id ? { ...m, is_read: !m.is_read } : m
        );
        setMessages(updated);
        if (activeMessage && activeMessage.id === msg.id) {
          setActiveMessage({ ...activeMessage, is_read: !msg.is_read });
        }
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('messages-updated'));
        }
      }
    } catch {
      setActionError('Failed to change message status.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to permanently delete this message?')) return;

    setLoadingId(id);
    setActionError('');

    try {
      const res = await deleteMessageAction(id);
      if (res.error) {
        setActionError(res.error);
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (activeMessage?.id === id) {
          setActiveMessage(null);
        }
      }
    } catch {
      setActionError('Failed to delete message.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleOpenDetail = (msg: Message) => {
    setActiveMessage(msg);
    setSelectedTemplate('onboarding');
    setReplyText(TEMPLATES.onboarding.getBody(msg));
    setCopiedReply(false);
    // Auto mark as read when opened if it was unread
    if (!msg.is_read) {
      handleToggleRead(msg);
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      {/* Top Controls: Search & Filters */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setFilter('all')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: filter === 'all' ? '#ffffff' : '#222222',
              background: filter === 'all' ? '#ffffff' : '#111111',
              color: filter === 'all' ? '#000000' : '#888888',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            All ({messages.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: filter === 'unread' ? '#ef4444' : '#222222',
              background: filter === 'unread' ? 'rgba(239, 68, 68, 0.15)' : '#111111',
              color: filter === 'unread' ? '#ef4444' : '#888888',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span
                style={{
                  background: '#ef4444',
                  color: '#fff',
                  borderRadius: '10px',
                  padding: '1px 6px',
                  fontSize: '0.75rem',
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setFilter('read')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: filter === 'read' ? '#22c55e' : '#222222',
              background: filter === 'read' ? 'rgba(34, 197, 94, 0.15)' : '#111111',
              color: filter === 'read' ? '#22c55e' : '#888888',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Read ({messages.length - unreadCount})
          </button>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#666',
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, keyword..."
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              background: '#111111',
              border: '1px solid #222222',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {actionError && (
        <div
          style={{
            padding: '12px 16px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            color: '#ef4444',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={18} />
          <span>{actionError}</span>
        </div>
      )}

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#111111',
            border: '1px solid #222222',
            borderRadius: '16px',
            color: '#888888',
          }}
        >
          <Inbox size={48} style={{ margin: '0 auto 16px', color: '#444' }} />
          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '8px' }}>
            No Messages Found
          </h3>
          <p style={{ fontSize: '0.9rem' }}>
            {search
              ? 'Try adjusting your search criteria.'
              : filter === 'unread'
              ? 'You are all caught up! No unread inquiries.'
              : 'Client contact submissions will appear here.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredMessages.map((msg) => {
            const isUnread = !msg.is_read;
            return (
              <div
                key={msg.id}
                onClick={() => handleOpenDetail(msg)}
                style={{
                  background: isUnread ? '#161616' : '#101010',
                  border: '1px solid',
                  borderColor: isUnread ? 'rgba(255, 255, 255, 0.18)' : '#202020',
                  borderRadius: '12px',
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, background 0.2s',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isUnread
                    ? 'rgba(255, 255, 255, 0.18)'
                    : '#202020';
                }}
              >
                {/* Left: Indicator & Content */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flex: 1, minWidth: 0, paddingRight: '16px' }}>
                  <div style={{ marginTop: '2px' }}>
                    {isUnread ? (
                      <span
                        title="Unread"
                        style={{
                          display: 'inline-block',
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: '#ef4444',
                          boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)',
                        }}
                      />
                    ) : (
                      <CheckCircle2 size={16} style={{ color: '#22c55e', opacity: 0.8 }} />
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: isUnread ? 700 : 500, color: '#ffffff', fontSize: '1rem' }}>
                        {msg.name}
                      </span>
                      <span style={{ color: '#888888', fontSize: '0.85rem' }}>
                        &lt;{msg.email}&gt;
                      </span>
                      <span style={{ color: '#555555', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
                        <Clock size={12} />
                        {formatDate(msg.created_at)}
                      </span>
                    </div>

                    <p
                      style={{
                        color: isUnread ? '#d4d4d4' : '#888888',
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {msg.message}
                    </p>
                  </div>
                </div>

                {/* Right: Quick Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={(e) => handleToggleRead(msg, e)}
                    disabled={loadingId === msg.id}
                    title={isUnread ? 'Mark as read' : 'Mark as unread'}
                    style={{
                      background: '#1a1a1a',
                      border: '1px solid #333333',
                      borderRadius: '8px',
                      padding: '8px',
                      color: isUnread ? '#22c55e' : '#888888',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isUnread ? <MailOpen size={16} /> : <Mail size={16} />}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(msg.id, e)}
                    disabled={loadingId === msg.id}
                    title="Delete message"
                    style={{
                      background: '#1a1a1a',
                      border: '1px solid #333333',
                      borderRadius: '8px',
                      padding: '8px',
                      color: '#ef4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Message Detail Modal */}
      {activeMessage && (
        <div className="modal-overlay" onClick={() => setActiveMessage(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '650px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={20} style={{ color: '#ffffff' }} />
                <h3 className="modal-title">Client Message</h3>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setActiveMessage(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Meta Info Card */}
              <div
                style={{
                  background: '#111111',
                  border: '1px solid #222222',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px' }}>
                      {activeMessage.name}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ color: '#a0a0a0', fontSize: '0.9rem' }}>
                        {activeMessage.email}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyEmail(activeMessage.email)}
                        style={{
                          background: '#1e1e1e',
                          border: '1px solid #333',
                          borderRadius: '6px',
                          padding: '3px 8px',
                          color: copiedEmail ? '#22c55e' : '#aaa',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {copiedEmail ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#888888',
                      background: '#1a1a1a',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid #333333',
                    }}
                  >
                    {formatDate(activeMessage.created_at)}
                  </span>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <label style={{ fontSize: '0.8rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'block' }}>
                  Message Content
                </label>
                <div
                  style={{
                    background: '#111111',
                    border: '1px solid #222222',
                    borderRadius: '10px',
                    padding: '18px',
                    color: '#e0e0e0',
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-wrap',
                    minHeight: '120px',
                  }}
                >
                  {activeMessage.message}
                </div>
              </div>

              {/* Quick Reply Composer Section */}
              <div
                style={{
                  background: '#121212',
                  border: '1px solid #282828',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h5 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>
                      Template Balasan Cepat
                    </h5>
                    <p style={{ color: '#888', fontSize: '0.75rem', marginTop: '2px' }}>
                      {TEMPLATES[selectedTemplate].desc}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyReplyText}
                    style={{
                      background: '#1f1f1f',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      padding: '5px 12px',
                      color: copiedReply ? '#22c55e' : '#ccc',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    {copiedReply ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedReply ? 'Draf Disalin!' : 'Salin Draf'}</span>
                  </button>
                </div>

                {/* Template Selection Pills */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {(Object.keys(TEMPLATES) as TemplateKey[]).map((key) => {
                    const isSelected = selectedTemplate === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSelectTemplate(key)}
                        style={{
                          background: isSelected ? 'rgba(37, 99, 235, 0.2)' : '#181818',
                          border: '1px solid',
                          borderColor: isSelected ? '#2563eb' : '#2c2c2c',
                          color: isSelected ? '#60a5fa' : '#999',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          fontSize: '0.8rem',
                          fontWeight: isSelected ? 600 : 500,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {TEMPLATES[key].label}
                      </button>
                    );
                  })}
                </div>

                {/* Editable Reply Body Preview */}
                <div style={{ position: 'relative' }}>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={8}
                    placeholder="Tulis balasan untuk client..."
                    style={{
                      width: '100%',
                      background: '#090909',
                      border: '1px solid #262626',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      color: '#e4e4e7',
                      fontSize: '0.85rem',
                      lineHeight: 1.6,
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      outline: 'none',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      right: '12px',
                      bottom: '10px',
                      fontSize: '0.7rem',
                      color: '#666',
                      pointerEvents: 'none',
                      background: 'rgba(9, 9, 9, 0.8)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    Bisa diedit sebelum dikirim
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <button
                type="button"
                onClick={() => handleDelete(activeMessage.id)}
                style={{
                  background: 'transparent',
                  border: '1px solid #ef4444',
                  borderRadius: '8px',
                  color: '#ef4444',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Trash2 size={16} />
                Delete
              </button>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => handleToggleRead(activeMessage)}
                  style={{
                    background: '#222222',
                    border: '1px solid #333333',
                    borderRadius: '8px',
                    color: '#ffffff',
                    padding: '8px 14px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                  }}
                >
                  {activeMessage.is_read ? 'Mark as Unread' : 'Mark as Read'}
                </button>

                {/* Reply with Gmail Web button (Opens Gmail directly with pre-filled content) */}
                <a
                  href={getGmailComposeUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    textDecoration: 'none',
                    padding: '8px 18px',
                    fontSize: '0.875rem',
                    background: '#2563eb',
                    color: '#ffffff',
                    fontWeight: 600,
                  }}
                >
                  <Send size={15} />
                  Reply via Gmail
                </a>

                {/* Alternative Default Mail App without creating a blank tab */}
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = `mailto:${activeMessage.email}?subject=Re:%20SEZKY%20Inquiry`;
                  }}
                  title="Open in your computer default email application"
                  style={{
                    background: '#181818',
                    border: '1px solid #333333',
                    borderRadius: '8px',
                    color: '#a0a0a0',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Mail size={15} />
                  <span>Other App</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
