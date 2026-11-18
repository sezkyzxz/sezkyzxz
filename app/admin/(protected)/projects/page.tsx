import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import SidebarTrigger from '@/components/admin/SidebarTrigger';
import { getCurrentUser } from '@/lib/supabase/server';
import LogoutButton from '@/components/admin/LogoutButton';
import ProjectsManager from './ProjectsManager';
import type { Project } from '@/types';

export default async function AdminProjectsPage() {
  const { supabase, user } = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const projectsRes = await supabase
    .from('projects')
    .select('*')
    .neq('category', 'Certificate')
    .order('id', { ascending: false });

  const projects: Project[] = projectsRes.data ?? [];

  return (
    <>
      <header className="dashboard-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <SidebarTrigger />
            <h1 className="header-title" style={{ margin: 0 }}>Portfolio Editor</h1>
            <span style={{ fontSize: '0.75rem', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
              Showcase Manager
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

        <div className="content-wrapper">
          <ProjectsManager initialProjects={projects} />
        </div>
    </>
  );
}
