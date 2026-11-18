'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getCurrentUser, createAdminClient } from '@/lib/supabase/server';

export type ActionState = { error?: string; success?: boolean };

// Field opsional: string kosong / null dari FormData dianggap undefined / null.
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
}, z.string().url({ message: 'Project URL must be a valid URL' }).optional());

const projectSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: z.preprocess(
    (v) => (typeof v === 'string' ? v.trim() : ''),
    z.string().optional(),
  ),
  category: z.string().trim().min(1, 'Category is required'),
  thumbnail_path: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() !== '' ? v.trim() : null),
    z.string().nullable().optional(),
  ),
  project_url: optionalUrl,
  tags: optionalText,
});

function readProjectForm(formData: FormData) {
  return {
    title: formData.get('title') ?? undefined,
    description: formData.get('description') ?? undefined,
    category: formData.get('category') ?? undefined,
    thumbnail_path: formData.get('thumbnail_path'),
    project_url: formData.get('project_url'),
    tags: formData.get('tags'),
  };
}

function revalidateProjects() {
  revalidatePath('/');
  revalidatePath('/admin', 'layout');
  revalidatePath('/admin/projects');
  revalidatePath('/admin/dashboard');
}

// Server Action adalah endpoint publik, jadi setiap action wajib cek login sendiri.
export async function createProjectAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase, user } = await getCurrentUser();
  if (!user) return { error: 'Unauthorized. Please login again.' };

  const validation = projectSchema.safeParse(readProjectForm(formData));
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message ?? 'Invalid input' };
  }

  // Gunakan adminClient jika Service Role Key dikonfigurasi, atau gunakan supabase client pengguna
  const adminClient = createAdminClient();
  const db = adminClient || supabase;

  // 1. Coba insert standar
  let { error } = await db.from('projects').insert(validation.data);

  // 2. Jika gagal karena permission denied pada sequence PostgreSQL (projects_id_seq):
  // Fallback: hitung ID terbesar yang ada di tabel projects dan masukkan ID manual!
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
      ...validation.data,
    });
    error = retry.error;
  }

  if (error) return { error: error.message };

  revalidateProjects();
  return { success: true };
}

export async function updateProjectAction(
  id: number,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase, user } = await getCurrentUser();
  if (!user) return { error: 'Unauthorized. Please login again.' };

  // Validasi field yang dikirim
  const validation = projectSchema.partial().safeParse(readProjectForm(formData));
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message ?? 'Invalid input' };
  }

  const adminClient = createAdminClient();
  const db = adminClient || supabase;

  const updateData: Record<string, unknown> = {
    ...validation.data,
    updated_at: new Date().toISOString(),
  };

  const { error } = await db
    .from('projects')
    .update(updateData)
    .eq('id', id);

  if (error) return { error: error.message };

  revalidateProjects();
  return { success: true };
}

export async function deleteProjectAction(id: number): Promise<ActionState> {
  const { supabase, user } = await getCurrentUser();
  if (!user) return { error: 'Unauthorized. Please login again.' };

  const adminClient = createAdminClient();
  const db = adminClient || supabase;

  const { error } = await db.from('projects').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidateProjects();
  return { success: true };
}
