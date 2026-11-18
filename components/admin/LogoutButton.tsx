'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { logoutAction } from '@/app/admin/login/actions';

interface LogoutButtonProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function LogoutButton({ className = 'btn-logout', style, children }: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      // 1. Bersihkan session auth di browser client
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Abaikan bila ada error lokal
    }

    try {
      // 2. Jalankan server action untuk membersihkan cookies di server
      await logoutAction();
    } catch {
      // Next.js redirect internal error aman diabaikan
    }

    // 3. Pastikan browser berpindah penuh ke halaman login
    window.location.href = '/admin/login';
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={className}
      style={style}
      aria-label="Logout"
    >
      {loading ? 'Logging out...' : (children || 'Logout')}
    </button>
  );
}

export default LogoutButton;
