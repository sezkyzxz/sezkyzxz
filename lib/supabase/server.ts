import { cache } from 'react';
import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * Supabase client untuk Server Components, Server Actions, dan Route Handlers.
 * `cookies()` di Next.js 16 bersifat async, jadi fungsi ini juga async.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Dipanggil dari Server Component (tidak boleh set cookie).
            // Aman diabaikan karena proxy.ts sudah me-refresh sesi.
          }
        },
      },
    },
  );
}

/**
 * Ambil user yang sedang login (divalidasi ke server Supabase, bukan sekadar
 * membaca cookie). Mengembalikan `null` jika belum login.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
});

/**
 * Supabase admin client menggunakan Service Role Key jika tersedia di .env.local.
 * Melewati RLS dan sequence permissions sepenuhnya untuk operasi admin yang aman.
 */
export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return null;

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

