'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentUser, createAdminClient } from '@/lib/supabase/server';

export type ActionState = { error?: string; success?: boolean };

const optionalText = z.preprocess(
  (v) => (typeof v === 'string' && v.trim() !== '' ? v.trim() : undefined),
  z.string().optional(),
);

const optionalUrl = z.preprocess((v) => {
  if (typeof v !== 'string' || v.trim() === '') return undefined;
  let val = v.trim();
  if (!/^https?:\/\//i.test(val)) {
    val = 'https://' + val;
  }
  return val;
}, z.string().url({ message: 'URL sertifikat / verifikasi harus valid' }).optional());

const certificateSchema = z.object({
  title: z.string().trim().min(1, 'Judul sertifikat wajib diisi').max(200),
  issuer: z.string().trim().min(1, 'Penerbit / lembaga wajib diisi'),
  year: z.string().trim().min(1, 'Tahun / tanggal wajib diisi'),
  image: z.string().trim().min(1, 'Foto / gambar sertifikat wajib diunggah'),
  credential_url: optionalUrl,
});

function revalidateCertificates() {
  revalidatePath('/');
  revalidatePath('/admin', 'layout');
  revalidatePath('/admin/certificates');
  revalidatePath('/admin/dashboard');
}

export async function createCertificateAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase, user } = await getCurrentUser();
  if (!user) return { error: 'Unauthorized. Harap login kembali.' };

  const raw = {
    title: formData.get('title'),
    issuer: formData.get('issuer'),
    year: formData.get('year'),
    image: formData.get('image'),
    credential_url: formData.get('credential_url'),
  };

  const validation = certificateSchema.safeParse(raw);
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message ?? 'Data tidak valid' };
  }

  const { title, issuer, year, image, credential_url } = validation.data;

  const adminClient = createAdminClient();
  const db = adminClient || supabase;

  // Insert into projects table with category 'Certificate'
  const payload = {
    title,
    description: issuer,
    category: 'Certificate',
    thumbnail_path: image,
    project_url: credential_url || null,
    tags: year,
  };

  let { error } = await db.from('projects').insert(payload);

  // Sequence fallback
  if (error && (error.message.toLowerCase().includes('sequence') || error.message.toLowerCase().includes('projects_id_seq'))) {
    const { data: maxRow } = await db
      .from('projects')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextId = (maxRow?.id ? Number(maxRow.id) : 0) + 1;
    const retry = await db.from('projects').insert({
      id: nextId,
      ...payload,
    });
    error = retry.error;
  }

  if (error) return { error: error.message };

  revalidateCertificates();
  return { success: true };
}

export async function updateCertificateAction(
  id: number,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase, user } = await getCurrentUser();
  if (!user) return { error: 'Unauthorized. Harap login kembali.' };

  const raw = {
    title: formData.get('title'),
    issuer: formData.get('issuer'),
    year: formData.get('year'),
    image: formData.get('image'),
    credential_url: formData.get('credential_url'),
  };

  const validation = certificateSchema.safeParse(raw);
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message ?? 'Data tidak valid' };
  }

  const { title, issuer, year, image, credential_url } = validation.data;
  const adminClient = createAdminClient();
  const db = adminClient || supabase;

  const { error } = await db
    .from('projects')
    .update({
      title,
      description: issuer,
      category: 'Certificate',
      thumbnail_path: image,
      project_url: credential_url || null,
      tags: year,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidateCertificates();
  return { success: true };
}

export async function deleteCertificateAction(id: number): Promise<ActionState> {
  const { supabase, user } = await getCurrentUser();
  if (!user) return { error: 'Unauthorized. Harap login kembali.' };

  const adminClient = createAdminClient();
  const db = adminClient || supabase;

  const { error } = await db.from('projects').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidateCertificates();
  return { success: true };
}
