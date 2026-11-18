import React from 'react';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import { getCurrentUser } from '@/lib/supabase/server';

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { supabase, user } = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const { count: unreadCount } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false);

  return (
    <div className="dashboard-container">
      <Sidebar initialUnreadCount={unreadCount ?? 0} userEmail={user.email} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

