import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { getCurrentUser } from '@/lib/supabase/server';
import type { Comment } from '@/types';
import fs from 'fs';
import path from 'path';

import { DEFAULT_COMMENTS } from '@/lib/default-comments';

const LOCAL_STORE_FILE = path.join(process.cwd(), '.next', 'cache', 'local_comments.json');

function sortComments(list: Comment[]): Comment[] {
  return [...list].sort((a, b) => {
    const aPinned = Boolean(a.is_pinned);
    const bPinned = Boolean(b.is_pinned);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

function getLocalComments(): Comment[] {
  try {
    if (fs.existsSync(LOCAL_STORE_FILE)) {
      const raw = fs.readFileSync(LOCAL_STORE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return sortComments(parsed);
    }
  } catch {
    // ignore
  }
  return sortComments(DEFAULT_COMMENTS);
}

function saveLocalComments(comments: Comment[]) {
  try {
    const dir = path.dirname(LOCAL_STORE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify(sortComments(comments), null, 2), 'utf-8');
  } catch {
    // ignore
  }
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createSupabaseClient(url, key);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedAll = searchParams.get('all') === 'true';
  let includeAll = false;
  if (requestedAll) {
    const { user } = await getCurrentUser();
    includeAll = Boolean(user);
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase.from('comments').select('*');
      if (!includeAll) {
        query = query.eq('is_approved', true);
      }

      // Try ordering by is_pinned first if column exists, then created_at
      const { data, error } = await query
        .order('is_pinned', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        return NextResponse.json({ success: true, data: sortComments(data) });
      }

      // If is_pinned column not in database yet, fallback to ordering by created_at
      const fallbackQuery = await (includeAll
        ? supabase.from('comments').select('*').order('created_at', { ascending: false })
        : supabase.from('comments').select('*').eq('is_approved', true).order('created_at', { ascending: false }));

      if (!fallbackQuery.error && Array.isArray(fallbackQuery.data) && fallbackQuery.data.length > 0) {
        return NextResponse.json({ success: true, data: sortComments(fallbackQuery.data) });
      }
    } catch {
      // fallback
    }
  }

  // Fallback to local stored comments
  const localList = getLocalComments();
  const filtered = includeAll ? localList : localList.filter((c) => c.is_approved !== false);
  return NextResponse.json({ success: true, data: sortComments(filtered) });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, comment, avatar_url, website } = body;

    // Honeypot check for bots
    if (website) {
      return NextResponse.json({ success: true, message: 'Comment submitted' });
    }

    if (!name || !comment) {
      return NextResponse.json(
        { error: 'Nama dan komentar wajib diisi.' },
        { status: 400 }
      );
    }

    const cleanName = String(name).trim().slice(0, 60);
    const cleanComment = String(comment).trim().slice(0, 600);
    let cleanAvatar: string | null = null;
    if (typeof avatar_url === 'string' && avatar_url.trim()) {
      const trimmed = avatar_url.trim();
      if (trimmed.startsWith('data:image/') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        cleanAvatar = trimmed.length <= 2500000 ? trimmed : null;
      }
    }

    if (cleanName.length < 2) {
      return NextResponse.json(
        { error: 'Nama minimal 2 karakter.' },
        { status: 400 }
      );
    }

    if (cleanComment.length < 3) {
      return NextResponse.json(
        { error: 'Komentar minimal 3 karakter.' },
        { status: 400 }
      );
    }

    const newComment: Comment = {
      id: Date.now(),
      name: cleanName,
      comment: cleanComment,
      avatar_url: cleanAvatar,
      created_at: new Date().toISOString(),
      is_approved: true,
      is_pinned: false,
      admin_reply: null,
      replied_at: null,
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('comments')
          .insert({
            name: cleanName,
            comment: cleanComment,
            avatar_url: cleanAvatar,
            is_approved: true,
            is_pinned: false,
          })
          .select()
          .single();

        if (!error && data) {
          return NextResponse.json({ success: true, data });
        }
      } catch {
        // fallback
      }
    }

    // Save to local comments storage
    const current = getLocalComments();
    const updated = [newComment, ...current];
    saveLocalComments(updated);

    return NextResponse.json({ success: true, data: newComment });
  } catch (err) {
    console.error('Comments POST error:', err);
    return NextResponse.json(
      { error: 'Gagal mengirim komentar. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { user } = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, is_approved, is_pinned, admin_reply } = body;

    if (id === undefined || id === null) {
      return NextResponse.json({ error: 'ID komentar diperlukan.' }, { status: 400 });
    }

    const numId = Number(id);
    const updateFields: Partial<Comment> = {};

    if (typeof is_approved === 'boolean') {
      updateFields.is_approved = is_approved;
    }
    if (typeof is_pinned === 'boolean') {
      updateFields.is_pinned = is_pinned;
    }
    if (admin_reply !== undefined) {
      updateFields.admin_reply = admin_reply ? String(admin_reply).trim() : null;
      updateFields.replied_at = admin_reply ? new Date().toISOString() : null;
    }

    // Update in Supabase
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase
          .from('comments')
          .update(updateFields)
          .eq('id', numId);
      } catch {
        // fallback to local update
      }
    }

    // Update in local cache
    const current = getLocalComments();
    const updated = current.map((c) => {
      if (c.id === numId) {
        return { ...c, ...updateFields };
      }
      return c;
    });
    saveLocalComments(updated);

    return NextResponse.json({ success: true, data: updateFields });
  } catch (err) {
    console.error('Comments PATCH error:', err);
    return NextResponse.json({ error: 'Gagal memperbarui komentar.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { user } = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID komentar diperlukan.' }, { status: 400 });
    }

    const numId = Number(id);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('comments').delete().eq('id', numId);
      } catch {
        // ignore
      }
    }

    // Also remove from local comments cache
    const current = getLocalComments();
    const updated = current.filter((c) => c.id !== numId);
    saveLocalComments(updated);

    return NextResponse.json({ success: true, message: 'Komentar berhasil dihapus.' });
  } catch (err) {
    console.error('Comments DELETE error:', err);
    return NextResponse.json({ error: 'Gagal menghapus komentar.' }, { status: 500 });
  }
}
