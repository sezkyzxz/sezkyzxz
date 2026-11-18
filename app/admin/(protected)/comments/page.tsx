import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import SidebarTrigger from '@/components/admin/SidebarTrigger';
import { getCurrentUser, createAdminClient } from '@/lib/supabase/server';
import LogoutButton from '@/components/admin/LogoutButton';
import CommentsManager from './CommentsManager';
import type { Comment } from '@/types';
import { DEFAULT_COMMENTS } from '@/lib/default-comments';
import fs from 'fs';
import path from 'path';

const LOCAL_STORE_FILE = path.join(process.cwd(), '.next', 'cache', 'local_comments.json');

export default async function AdminCommentsPage() {
  const { supabase, user } = await getCurrentUser();
  if (!user) redirect('/admin/login');

  let comments: Comment[] = [];
  const adminClient = createAdminClient() || supabase;

  // Try fetching from Supabase
  try {
    const { data, error } = await adminClient
      .from('comments')
      .select('*')
      .order('is_pinned', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      comments = data;
    } else {
      const fallbackRes = await adminClient
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });
      if (!fallbackRes.error && Array.isArray(fallbackRes.data) && fallbackRes.data.length > 0) {
        comments = fallbackRes.data;
      }
    }
  } catch {
    // fallback
  }

  // Fallback to local store if Supabase returned empty
  if (comments.length === 0) {
    try {
      if (fs.existsSync(LOCAL_STORE_FILE)) {
        const raw = fs.readFileSync(LOCAL_STORE_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          comments = parsed;
        }
      }
    } catch {
      // ignore
    }
  }

  // Fallback to default comments so admin never sees a broken 0 comments state
  if (comments.length === 0) {
    comments = DEFAULT_COMMENTS;
  }

  return (
    <>
      <header className="dashboard-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <SidebarTrigger />
            <h1 className="header-title" style={{ margin: 0 }}>Komentar Publik (Guestbook)</h1>
            <span
              style={{
                fontSize: '0.75rem',
                background: 'rgba(207, 128, 71, 0.15)',
                color: '#f3a875',
                padding: '3px 8px',
                borderRadius: '6px',
                fontWeight: 600,
              }}
            >
              {comments.length} Comments
            </span>
          </div>
          <div className="header-actions">
            <Link
              href="/#contact"
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
            <h2 className="section-title">Moderasi Komentar / Buku Tamu</h2>
            <p className="section-subtitle">
              Kelola dan moderasi komentar publik yang dikirim oleh pengunjung di halaman website
            </p>
          </div>
          <CommentsManager initialComments={comments} />
        </div>
    </>
  );
}
