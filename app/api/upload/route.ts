import { NextResponse } from 'next/server';
import { getCurrentUser, createAdminClient } from '@/lib/supabase/server';

const BUCKET = 'portfolio-images';
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB (lebih lega untuk desainer)

const EXTENSION_MIME_MAP: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  jfif: 'image/jpeg',
  pjpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  avif: 'image/avif',
  bmp: 'image/bmp',
};

export async function GET() {
  const { supabase, user } = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = createAdminClient() || supabase;

  const { data, error } = await client.storage.from(BUCKET).list('', {
    limit: 100,
    sortBy: { column: 'created_at', order: 'desc' },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const filesWithUrl = (data || [])
    .filter((f) => f.name && !f.name.startsWith('.'))
    .map((f) => {
      const { data: urlData } = client.storage.from(BUCKET).getPublicUrl(f.name);
      return {
        id: f.id,
        name: f.name,
        created_at: f.created_at,
        metadata: f.metadata,
        publicUrl: urlData.publicUrl,
      };
    });

  return NextResponse.json({ success: true, files: filesWithUrl });
}

export async function POST(request: Request) {
  // 1. Cek login
  const { supabase, user } = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Ambil form data
  const formData = await request.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Ekstrak ekstensi file
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const detectedMime = EXTENSION_MIME_MAP[ext] || (file.type?.startsWith('image/') ? file.type : null);

  // 3. Validasi tipe gambar & ukuran
  if (!detectedMime) {
    return NextResponse.json(
      { error: `Format file (.${ext || 'unknown'}) tidak didukung. Harap upload gambar: JPG, PNG, GIF, WebP, SVG, atau AVIF.` },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Ukuran file terlalu besar (Maksimal 10 MB).' }, { status: 400 });
  }

  // 4. Upload ke Supabase Storage (gunakan adminClient jika ada agar bypass RLS storage)
  const client = createAdminClient() || supabase;
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  const { error } = await client.storage
    .from(BUCKET)
    .upload(filename, file, { contentType: detectedMime, upsert: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 5. Ambil public URL
  const { data: urlData } = client.storage.from(BUCKET).getPublicUrl(filename);

  return NextResponse.json({ success: true, path: urlData.publicUrl, filename });
}

export async function DELETE(request: Request) {
  const { supabase, user } = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { filename } = await request.json();
    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    const { error } = await supabase.storage.from(BUCKET).remove([filename]);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
