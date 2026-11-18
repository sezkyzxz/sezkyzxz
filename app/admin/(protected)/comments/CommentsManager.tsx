'use client';

import React, { useState } from 'react';
import {
  Trash2,
  Search,
  MessageSquare,
  Clock,
  User,
  Eye,
  EyeOff,
  Pin,
  PinOff,
  Reply,
  Check,
  X,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import type { Comment } from '@/types';

interface CommentsManagerProps {
  initialComments: Comment[];
}

export default function CommentsManager({ initialComments }: CommentsManagerProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'approved' | 'hidden' | 'pinned'>('all');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Active reply editor state: comment id -> text
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [replySubmitting, setReplySubmitting] = useState(false);

  // Status notification banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  const handleToggleVisibility = async (comment: Comment) => {
    const nextApproved = comment.is_approved === false ? true : false;
    setUpdatingId(comment.id);
    try {
      const res = await fetch('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: comment.id, is_approved: nextApproved }),
      });
      if (res.ok) {
        setComments((prev) =>
          prev.map((c) => (c.id === comment.id ? { ...c, is_approved: nextApproved } : c))
        );
        showToast(nextApproved ? 'Komentar sekarang ditampilkan ke publik.' : 'Komentar disembunyikan dari publik.');
      } else {
        alert('Gagal mengubah status visibilitas komentar.');
      }
    } catch {
      alert('Terjadi kesalahan saat mengubah visibilitas.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleTogglePin = async (comment: Comment) => {
    const nextPinned = !comment.is_pinned;
    setUpdatingId(comment.id);
    try {
      const res = await fetch('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: comment.id, is_pinned: nextPinned }),
      });
      if (res.ok) {
        setComments((prev) => {
          const updated = prev.map((c) => (c.id === comment.id ? { ...c, is_pinned: nextPinned } : c));
          return updated.sort((a, b) => {
            const aPinned = Boolean(a.is_pinned);
            const bPinned = Boolean(b.is_pinned);
            if (aPinned && !bPinned) return -1;
            if (!aPinned && bPinned) return 1;
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          });
        });
        showToast(nextPinned ? 'Komentar berhasil disematkan di paling atas.' : 'Sematan komentar dilepas.');
      } else {
        alert('Gagal mengubah status sematan komentar.');
      }
    } catch {
      alert('Terjadi kesalahan saat menyematkan komentar.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenReply = (comment: Comment) => {
    if (activeReplyId === comment.id) {
      setActiveReplyId(null);
      setReplyText('');
    } else {
      setActiveReplyId(comment.id);
      setReplyText(comment.admin_reply || '');
    }
  };

  const handleSaveReply = async (commentId: number) => {
    setReplySubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: commentId,
          admin_reply: replyText.trim() ? replyText.trim() : null,
        }),
      });
      if (res.ok) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? {
                  ...c,
                  admin_reply: replyText.trim() ? replyText.trim() : null,
                  replied_at: replyText.trim() ? new Date().toISOString() : null,
                }
              : c
          )
        );
        setActiveReplyId(null);
        setReplyText('');
        showToast('Balasan admin berhasil diperbarui.');
      } else {
        alert('Gagal menyimpan balasan.');
      }
    } catch {
      alert('Terjadi kesalahan saat menyimpan balasan.');
    } finally {
      setReplySubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus komentar ini secara permanen?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/comments?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== id));
        showToast('Komentar berhasil dihapus permanen.');
      } else {
        alert('Gagal menghapus komentar.');
      }
    } catch {
      alert('Terjadi kesalahan saat menghapus komentar.');
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered comments
  const filteredComments = comments.filter((c) => {
    // Search matching
    const term = searchTerm.toLowerCase();
    const matchSearch =
      c.name.toLowerCase().includes(term) ||
      c.comment.toLowerCase().includes(term) ||
      (c.admin_reply && c.admin_reply.toLowerCase().includes(term));

    if (!matchSearch) return false;

    if (filterTab === 'approved') return c.is_approved !== false;
    if (filterTab === 'hidden') return c.is_approved === false;
    if (filterTab === 'pinned') return Boolean(c.is_pinned);
    return true;
  });

  const countApproved = comments.filter((c) => c.is_approved !== false).length;
  const countHidden = comments.filter((c) => c.is_approved === false).length;
  const countPinned = comments.filter((c) => c.is_pinned).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#1b1b1b',
            border: '1px solid #cf8047',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.875rem',
            zIndex: 9999,
            animation: 'fadeIn 0.25s ease',
          }}
        >
          <Sparkles size={16} color="#cf8047" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
        }}
      >
        {/* Filter Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#121212',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid #242424',
          }}
        >
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            style={{
              background: filterTab === 'all' ? '#222222' : 'transparent',
              color: filterTab === 'all' ? '#ffffff' : '#888888',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '7px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Semua ({comments.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('approved')}
            style={{
              background: filterTab === 'approved' ? '#222222' : 'transparent',
              color: filterTab === 'approved' ? '#34d399' : '#888888',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '7px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Tampil ({countApproved})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('hidden')}
            style={{
              background: filterTab === 'hidden' ? '#222222' : 'transparent',
              color: filterTab === 'hidden' ? '#fbbf24' : '#888888',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '7px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Disembunyikan ({countHidden})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('pinned')}
            style={{
              background: filterTab === 'pinned' ? '#222222' : 'transparent',
              color: filterTab === 'pinned' ? '#f3a875' : '#888888',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '7px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Disematkan ({countPinned})
          </button>
        </div>

        {/* Search Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#161616',
            border: '1px solid #2a2a2a',
            borderRadius: '10px',
            padding: '8px 14px',
            width: '100%',
            maxWidth: '360px',
          }}
        >
          <Search size={16} color="#888888" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama atau pesan..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '0.85rem',
              width: '100%',
            }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#888888',
                cursor: 'pointer',
                padding: 0,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Comments List Table */}
      <div
        style={{
          background: '#161616',
          border: '1px solid #2a2a2a',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        {filteredComments.length === 0 ? (
          <div style={{ padding: '56px 24px', textAlign: 'center', color: '#888888' }}>
            <MessageSquare size={36} color="#cf8047" style={{ margin: '0 auto 12px', opacity: 0.6 }} />
            <p style={{ margin: 0, fontSize: '0.925rem' }}>Tidak ada komentar yang cocok dengan filter ini.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredComments.map((item) => {
              const isApproved = item.is_approved !== false;
              const isPinned = Boolean(item.is_pinned);
              const isReplying = activeReplyId === item.id;
              const isBusy = updatingId === item.id || deletingId === item.id;

              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '18px 20px',
                    borderBottom: '1px solid #222222',
                    background: isPinned
                      ? 'rgba(207, 128, 71, 0.04)'
                      : !isApproved
                      ? 'rgba(0, 0, 0, 0.25)'
                      : 'transparent',
                    opacity: !isApproved ? 0.75 : 1,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '16px',
                      flexWrap: 'wrap',
                    }}
                  >
                    {/* User and Comment Info */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1, minWidth: '280px' }}>
                      {/* Avatar */}
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          background: item.avatar_url ? 'transparent' : 'linear-gradient(135deg, #cf8047, #9a3412)',
                          display: 'grid',
                          placeItems: 'center',
                          overflow: 'hidden',
                          flexShrink: 0,
                          border: isPinned ? '2px solid #cf8047' : '1px solid rgba(255,255,255,0.15)',
                        }}
                      >
                        {item.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.avatar_url}
                            alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent && !parent.querySelector('span')) {
                                parent.style.background = 'linear-gradient(135deg, #cf8047, #9a3412)';
                                const span = document.createElement('span');
                                span.style.fontWeight = '700';
                                span.style.color = '#ffffff';
                                span.style.fontSize = '1.1rem';
                                span.textContent = item.name ? item.name.charAt(0).toUpperCase() : 'U';
                                parent.appendChild(span);
                              }
                            }}
                          />
                        ) : (
                          <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '1.1rem' }}>
                            {item.name ? item.name.charAt(0).toUpperCase() : <User size={18} />}
                          </span>
                        )}
                      </div>

                      {/* Comment Details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '8px',
                            marginBottom: '6px',
                          }}
                        >
                          <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                            {item.name}
                          </span>

                          {/* Time */}
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: '#888888',
                              fontSize: '0.75rem',
                            }}
                          >
                            <Clock size={12} />
                            {new Date(item.created_at).toLocaleString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>

                          {/* Pinned Badge */}
                          {isPinned && (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: 'rgba(207, 128, 71, 0.2)',
                                color: '#f3a875',
                                border: '1px solid rgba(207, 128, 71, 0.35)',
                                padding: '2px 7px',
                                borderRadius: '6px',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                              }}
                            >
                              <Pin size={10} /> Disematkan
                            </span>
                          )}

                          {/* Approval Status Badge */}
                          {isApproved ? (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: 'rgba(16, 185, 129, 0.12)',
                                color: '#34d399',
                                border: '1px solid rgba(16, 185, 129, 0.25)',
                                padding: '2px 7px',
                                borderRadius: '6px',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                              }}
                            >
                              <Check size={10} /> Tampil
                            </span>
                          ) : (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: 'rgba(251, 191, 36, 0.12)',
                                color: '#fbbf24',
                                border: '1px solid rgba(251, 191, 36, 0.25)',
                                padding: '2px 7px',
                                borderRadius: '6px',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                              }}
                            >
                              <EyeOff size={10} /> Disembunyikan
                            </span>
                          )}
                        </div>

                        {/* Comment Message */}
                        <p
                          style={{
                            margin: 0,
                            color: 'rgba(255, 255, 255, 0.88)',
                            fontSize: '0.88rem',
                            lineHeight: 1.55,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                          }}
                        >
                          {item.comment}
                        </p>

                        {/* Admin Reply Existing Preview */}
                        {item.admin_reply && !isReplying && (
                          <div
                            style={{
                              marginTop: '10px',
                              padding: '10px 14px',
                              background: 'rgba(207, 128, 71, 0.08)',
                              borderLeft: '3px solid #cf8047',
                              borderRadius: '0 8px 8px 0',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                marginBottom: '4px',
                              }}
                            >
                              <ShieldCheck size={13} color="#f3a875" />
                              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f3a875' }}>
                                Balasan Kamu (SEZKY)
                              </span>
                              {item.replied_at && (
                                <span style={{ fontSize: '0.7rem', color: '#888888' }}>
                                  •{' '}
                                  {new Date(item.replied_at).toLocaleString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              )}
                            </div>
                            <p style={{ margin: 0, fontSize: '0.835rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.45 }}>
                              {item.admin_reply}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons Toolbar */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flexWrap: 'wrap',
                      }}
                    >
                      {/* Pin Button */}
                      <button
                        type="button"
                        onClick={() => handleTogglePin(item)}
                        disabled={isBusy}
                        style={{
                          background: isPinned ? 'rgba(207, 128, 71, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                          border: isPinned ? '1px solid rgba(207, 128, 71, 0.45)' : '1px solid #333333',
                          color: isPinned ? '#f3a875' : '#aaaaaa',
                          padding: '7px 11px',
                          borderRadius: '8px',
                          cursor: isBusy ? 'not-allowed' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          transition: 'all 0.15s ease',
                        }}
                        title={isPinned ? 'Lepas Sematan (Unpin)' : 'Sematkan ke Paling Atas (Pin)'}
                      >
                        {isPinned ? <PinOff size={13} /> : <Pin size={13} />}
                        <span>{isPinned ? 'Lepas Sematan' : 'Sematkan'}</span>
                      </button>

                      {/* Visibility Toggle Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleVisibility(item)}
                        disabled={isBusy}
                        style={{
                          background: isApproved ? 'rgba(255, 255, 255, 0.05)' : 'rgba(16, 185, 129, 0.12)',
                          border: isApproved ? '1px solid #333333' : '1px solid rgba(16, 185, 129, 0.3)',
                          color: isApproved ? '#aaaaaa' : '#34d399',
                          padding: '7px 11px',
                          borderRadius: '8px',
                          cursor: isBusy ? 'not-allowed' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          transition: 'all 0.15s ease',
                        }}
                        title={isApproved ? 'Sembunyikan dari Publik' : 'Tampilkan ke Publik'}
                      >
                        {isApproved ? <EyeOff size={13} /> : <Eye size={13} />}
                        <span>{isApproved ? 'Sembunyikan' : 'Tampilkan'}</span>
                      </button>

                      {/* Reply Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenReply(item)}
                        disabled={isBusy}
                        style={{
                          background: isReplying ? '#cf8047' : 'rgba(255, 255, 255, 0.05)',
                          border: isReplying ? '1px solid #cf8047' : '1px solid #333333',
                          color: isReplying ? '#ffffff' : '#aaaaaa',
                          padding: '7px 11px',
                          borderRadius: '8px',
                          cursor: isBusy ? 'not-allowed' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          transition: 'all 0.15s ease',
                        }}
                        title="Balas Komentar Pengunjung"
                      >
                        <Reply size={13} />
                        <span>{item.admin_reply ? 'Edit Balasan' : 'Balas'}</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        disabled={isBusy}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          color: '#ef4444',
                          padding: '7px 11px',
                          borderRadius: '8px',
                          cursor: isBusy ? 'not-allowed' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          transition: 'all 0.15s ease',
                        }}
                        title="Hapus Komentar Permanen"
                      >
                        <Trash2 size={13} />
                        <span>{deletingId === item.id ? '...' : 'Hapus'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Inline Reply Composer Box */}
                  {isReplying && (
                    <div
                      style={{
                        marginTop: '14px',
                        padding: '14px',
                        background: '#1a1a1a',
                        border: '1px solid #333333',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f3a875', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ShieldCheck size={14} /> Balas sebagai SEZKY (Owner)
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveReplyId(null)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#888888',
                            cursor: 'pointer',
                            padding: '2px',
                          }}
                        >
                          <X size={15} />
                        </button>
                      </div>

                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Tulis balasan untuk ${item.name}...`}
                        rows={3}
                        style={{
                          width: '100%',
                          background: '#111111',
                          border: '1px solid #333333',
                          borderRadius: '8px',
                          padding: '10px',
                          color: '#ffffff',
                          fontSize: '0.85rem',
                          fontFamily: 'inherit',
                          outline: 'none',
                          resize: 'vertical',
                          boxSizing: 'border-box',
                        }}
                      />

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        {item.admin_reply && (
                          <button
                            type="button"
                            onClick={() => {
                              setReplyText('');
                              handleSaveReply(item.id);
                            }}
                            disabled={replySubmitting}
                            style={{
                              background: 'rgba(239, 68, 68, 0.12)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: '#ef4444',
                              padding: '6px 12px',
                              borderRadius: '7px',
                              fontSize: '0.775rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Hapus Balasan
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setActiveReplyId(null)}
                          disabled={replySubmitting}
                          style={{
                            background: 'transparent',
                            border: '1px solid #333333',
                            color: '#aaaaaa',
                            padding: '6px 12px',
                            borderRadius: '7px',
                            fontSize: '0.775rem',
                            cursor: 'pointer',
                          }}
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveReply(item.id)}
                          disabled={replySubmitting || !replyText.trim()}
                          style={{
                            background: '#cf8047',
                            border: 'none',
                            color: '#ffffff',
                            padding: '6px 16px',
                            borderRadius: '7px',
                            fontSize: '0.775rem',
                            fontWeight: 600,
                            cursor: replySubmitting || !replyText.trim() ? 'not-allowed' : 'pointer',
                            opacity: replySubmitting || !replyText.trim() ? 0.6 : 1,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                        >
                          <Check size={13} />
                          <span>{replySubmitting ? 'Menyimpan...' : 'Kirim Balasan'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
