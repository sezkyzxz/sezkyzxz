'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient, createClient } from '@/lib/supabase/server';

export async function toggleMessageReadAction(id: number, currentReadStatus: boolean) {
  try {
    const adminSupabase = createAdminClient();
    const supabase = adminSupabase || (await createClient());

    const { error } = await supabase
      .from('messages')
      .update({ is_read: !currentReadStatus })
      .eq('id', id);

    if (error) {
      console.error('Failed to update message status:', error);
      return { error: error.message };
    }

    revalidatePath('/admin/messages');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (err: unknown) {
    console.error('Action error toggleMessageReadAction:', err);
    return { error: 'Failed to update message read status.' };
  }
}

export async function deleteMessageAction(id: number) {
  try {
    const adminSupabase = createAdminClient();
    const supabase = adminSupabase || (await createClient());

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete message:', error);
      return { error: error.message };
    }

    revalidatePath('/admin/messages');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (err: unknown) {
    console.error('Action error deleteMessageAction:', err);
    return { error: 'Failed to delete message.' };
  }
}
