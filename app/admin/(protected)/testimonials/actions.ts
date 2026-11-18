'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentUser, createAdminClient } from '@/lib/supabase/server';

export type ActionState = { error?: string; success?: boolean };

const testimonialSchema = z.object({
  name: z.string().trim().min(1, 'Nama klien wajib diisi').max(100),
  role: z.string().trim().min(1, 'Jabatan / perusahaan klien wajib diisi').max(150),
  quote: z.string().trim().min(5, 'Ulasan testimoni wajib diisi (minimal 5 karakter)'),
  photo: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() !== '' ? v.trim() : null),
    z.string().nullable().optional(),
  ),
  projectTag: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() !== '' ? v.trim() : null),
    z.string().nullable().optional(),
  ),
  rating: z.preprocess(
    (v) => (v ? Number(v) : 5),
    z.number().min(1).max(5).default(5),
  ),
});

function revalidateTestimonials() {
  revalidatePath('/');
  revalidatePath('/admin', 'layout');
  revalidatePath('/admin/testimonials');
  revalidatePath('/admin/dashboard');
}

export async function createTestimonialAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase, user } = await getCurrentUser();
  if (!user) return { error: 'Unauthorized. Harap login kembali.' };

  const raw = {
    name: formData.get('name'),
    role: formData.get('role'),
    quote: formData.get('quote'),
    photo: formData.get('photo'),
    projectTag: formData.get('projectTag'),
    rating: formData.get('rating'),
  };

  const validation = testimonialSchema.safeParse(raw);
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message ?? 'Data tidak valid' };
  }

  const { name, role, quote, photo, projectTag, rating } = validation.data;

  const adminClient = createAdminClient();
  const db = adminClient || supabase;

  // Insert into projects table with category 'Testimonial'
  // Note: projects table does not have 'gallery' column, so we encode rating in project_url as tag:::rating
  const encodedTag = `${projectTag || ''}:::${rating || 5}`;
  const payload = {
    title: name,
    description: quote,
    category: 'Testimonial',
    thumbnail_path: photo || null,
    project_url: encodedTag,
    tags: role,
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

  revalidateTestimonials();
  return { success: true };
}

export async function updateTestimonialAction(
  id: number,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase, user } = await getCurrentUser();
  if (!user) return { error: 'Unauthorized. Harap login kembali.' };

  const raw = {
    name: formData.get('name'),
    role: formData.get('role'),
    quote: formData.get('quote'),
    photo: formData.get('photo'),
    projectTag: formData.get('projectTag'),
    rating: formData.get('rating'),
  };

  const validation = testimonialSchema.safeParse(raw);
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message ?? 'Data tidak valid' };
  }

  const { name, role, quote, photo, projectTag, rating } = validation.data;
  const adminClient = createAdminClient();
  const db = adminClient || supabase;

  const encodedTag = `${projectTag || ''}:::${rating || 5}`;
  const { error } = await db
    .from('projects')
    .update({
      title: name,
      description: quote,
      category: 'Testimonial',
      thumbnail_path: photo || null,
      project_url: encodedTag,
      tags: role,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidateTestimonials();
  return { success: true };
}

export async function deleteTestimonialAction(id: number): Promise<ActionState> {
  const { supabase, user } = await getCurrentUser();
  if (!user) return { error: 'Unauthorized. Harap login kembali.' };

  const adminClient = createAdminClient();
  const db = adminClient || supabase;

  const { error } = await db.from('projects').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidateTestimonials();
  return { success: true };
}
