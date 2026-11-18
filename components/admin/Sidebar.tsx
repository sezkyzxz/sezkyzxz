'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Mail,
  Briefcase,
  Award,
  Star,
  MessageSquare,
  LogOut,
  X,
  Menu,
} from 'lucide-react';
import LogoutButton from '@/components/admin/LogoutButton';
import { createClient } from '@/lib/supabase/client';

interface SidebarProps {
  initialUnreadCount?: number;
  unreadCount?: number;
  userEmail?: string;
}

export default function Sidebar({ initialUnreadCount = 0, unreadCount: propUnread, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(propUnread ?? initialUnreadCount);

  // Sync if prop changes
  useEffect(() => {
    if (propUnread !== undefined) {
      setUnreadCount(propUnread);
    }
  }, [propUnread]);

  // Listen to message read/update events
  useEffect(() => {
    const handleMessagesUpdated = () => {
      try {
        const supabase = createClient();
        supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false)
          .then(({ count }) => {
            if (typeof count === 'number') {
              setUnreadCount(count);
            }
          });
      } catch {
        // Ignore background fetch failure
      }
    };

    window.addEventListener('messages-updated', handleMessagesUpdated);
    return () => {
      window.removeEventListener('messages-updated', handleMessagesUpdated);
    };
  }, []);

  const [prevPathname, setPrevPathname] = useState(pathname);
  const [optimisticPath, setOptimisticPath] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOptimisticPath(pathname);
    setIsOpen(false);
  }

  const handleNavClick = (targetPath: string) => {
    setOptimisticPath(targetPath);
    setIsOpen(false);
  };

  // Listen for trigger events from header hamburger button
  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    const handleClose = () => setIsOpen(false);

    window.addEventListener('toggle-admin-sidebar', handleToggle);
    window.addEventListener('close-admin-sidebar', handleClose);

    // Close on Escape key press
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('toggle-admin-sidebar', handleToggle);
      window.removeEventListener('close-admin-sidebar', handleClose);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const activePath = optimisticPath || pathname;
  const isDashboard = activePath === '/admin/dashboard';
  const isProjects = activePath === '/admin/projects';
  const isCertificates = activePath === '/admin/certificates';
  const isTestimonials = activePath === '/admin/testimonials';
  const isMessages = activePath === '/admin/messages';
  const isComments = activePath === '/admin/comments';

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Floating Mobile Toggle Button (Always accessible when scrolling) */}
      <button
        type="button"
        className="sidebar-mobile-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Tutup Menu' : 'Buka Menu Navigasi'}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
        <span>{isOpen ? 'Tutup' : 'Menu'}</span>
      </button>

      {/* Sidebar Drawer */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`} id="sidebar">
        {/* Sidebar Header */}
        <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 className="sidebar-logo">SEZKY Admin</h2>
            <span style={{ fontSize: '0.72rem', color: '#666666', display: 'block', marginTop: '2px' }}>
              Management Console
            </span>
          </div>

          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Tutup Menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <Link
            href="/admin/dashboard"
            prefetch={true}
            onClick={() => handleNavClick('/admin/dashboard')}
            className={`nav-item ${isDashboard ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} className="nav-icon" />
            <span style={{ flex: 1 }}>Dashboard</span>
          </Link>

          <Link
            href="/admin/messages"
            prefetch={true}
            onClick={() => handleNavClick('/admin/messages')}
            className={`nav-item ${isMessages ? 'active' : ''}`}
          >
            <Mail size={18} className="nav-icon" />
            <span style={{ flex: 1 }}>Inbox Kontak (Klien)</span>
            {unreadCount > 0 && (
              <span
                style={{
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                }}
              >
                {unreadCount}
              </span>
            )}
          </Link>

          <Link
            href="/admin/projects"
            prefetch={true}
            onClick={() => handleNavClick('/admin/projects')}
            className={`nav-item ${isProjects ? 'active' : ''}`}
          >
            <Briefcase size={18} className="nav-icon" />
            <span style={{ flex: 1 }}>Projects (Portofolio)</span>
          </Link>

          <Link
            href="/admin/certificates"
            prefetch={true}
            onClick={() => handleNavClick('/admin/certificates')}
            className={`nav-item ${isCertificates ? 'active' : ''}`}
          >
            <Award size={18} className="nav-icon" />
            <span style={{ flex: 1 }}>Certificates (Sertifikat)</span>
          </Link>

          <Link
            href="/admin/testimonials"
            prefetch={true}
            onClick={() => handleNavClick('/admin/testimonials')}
            className={`nav-item ${isTestimonials ? 'active' : ''}`}
          >
            <Star size={18} className="nav-icon" />
            <span style={{ flex: 1 }}>Testimonials (Ulasan)</span>
          </Link>

          <Link
            href="/admin/comments"
            prefetch={true}
            onClick={() => handleNavClick('/admin/comments')}
            className={`nav-item ${isComments ? 'active' : ''}`}
          >
            <MessageSquare size={18} className="nav-icon" />
            <span style={{ flex: 1 }}>Komentar Publik (Guestbook)</span>
          </Link>
        </nav>

        {/* Sidebar Footer with user info & logout */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid #1e1e1e',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginTop: 'auto',
          }}
        >
          {userEmail && (
            <div
              style={{
                fontSize: '0.8rem',
                color: '#888888',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={userEmail}
            >
              {userEmail}
            </div>
          )}

          <LogoutButton
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <LogOut size={16} />
            Logout
          </LogoutButton>
        </div>
      </aside>
    </>
  );
}