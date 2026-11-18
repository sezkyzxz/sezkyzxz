import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import SidebarTrigger from '@/components/admin/SidebarTrigger';
import { getCurrentUser } from '@/lib/supabase/server';
import LogoutButton from '@/components/admin/LogoutButton';
import MessagesManager from './MessagesManager';
import type { Message } from '@/types';

export default async function AdminMessagesPage() {
  const { supabase, user } = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const [messagesRes, unreadMessagesRes] = await Promise.all([
    supabase.from('messages').select('*').order('id', { ascending: false }),
    supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
  ]);

  const messages: Message[] = messagesRes.data ?? [];
  const unreadMessages = unreadMessagesRes.count ?? 0;

  return (
    <>
      <header className="dashboard-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <SidebarTrigger />
            <h1 className="header-title" style={{ margin: 0 }}>Inbox Kontak (Klien)</h1>
            {unreadMessages > 0 && (
              <span style={{ fontSize: '0.75rem', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                {unreadMessages} Unread
              </span>
            )}
          </div>
          <div className="header-actions">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#a0a0a0',
                fontSize: '0.85rem',
                textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #222222',
                background: '#111111',
              }}
            >
              <Eye size={14} />
              <span>Preview Website</span>
            </Link>

            <LogoutButton />
          </div>
        </header>

        <div className="content-wrapper">
          <div className="section-header" style={{ marginBottom: '20px' }}>
            <h2 className="section-title">Pesan Masuk dari Calon Klien</h2>
            <p className="section-subtitle">
              Pesan privat & penawaran proyek yang dikirim oleh pengunjung melalui formulir kontak
            </p>
          </div>
          <MessagesManager initialMessages={messages} />
        </div>
    </>
  );
}
