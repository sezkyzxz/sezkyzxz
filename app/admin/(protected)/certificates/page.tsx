import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import SidebarTrigger from '@/components/admin/SidebarTrigger';
import { getCurrentUser } from '@/lib/supabase/server';
import LogoutButton from '@/components/admin/LogoutButton';
import CertificatesManager from './CertificatesManager';
import type { Project } from '@/types';

export default async function AdminCertificatesPage() {
  const { supabase, user } = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const certsRes = await supabase
    .from('projects')
    .select('*')
    .eq('category', 'Certificate')
    .order('id', { ascending: false });

  const certificates: Project[] = certsRes.data ?? [];

  return (
    <>
      <header className="dashboard-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <SidebarTrigger />
            <h1 className="header-title" style={{ margin: 0 }}>Certificates Editor</h1>
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
              Sertifikasi Profesional
            </span>
          </div>
          <div className="header-actions">
            <Link
              href="/"
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

        <CertificatesManager initialCertificates={certificates} />
    </>
  );
}
