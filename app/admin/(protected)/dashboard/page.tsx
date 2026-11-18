import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Briefcase,
  ImageIcon,
  CheckCircle2,
  Mail,
  ExternalLink,
  Plus,
  FolderKanban,
  ArrowRight,
  ShieldCheck,
  Database,
  Layers,
  Sparkles,
  Eye,
  Award,
  MessageSquare,
  Star,
} from 'lucide-react';
import SidebarTrigger from '@/components/admin/SidebarTrigger';
import { getCurrentUser } from '@/lib/supabase/server';
import LogoutButton from '@/components/admin/LogoutButton';
import { parseThumbnailSettings } from '@/lib/portfolio-data';
import type { Project, Message } from '@/types';

export default async function DashboardPage() {
  const { supabase, user } = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const [projectsRes, certsRes, testimonialsRes, unreadMessagesRes, totalMessagesRes, recentProjectsRes, recentMessagesRes] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }).neq('category', 'Certificate').neq('category', 'Testimonial'),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('category', 'Certificate'),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('category', 'Testimonial'),
    supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
    supabase.from('messages').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*').neq('category', 'Certificate').neq('category', 'Testimonial').order('id', { ascending: false }).limit(6),
    supabase.from('messages').select('*').order('id', { ascending: false }).limit(4),
  ]);

  let totalComments = 0;
  try {
    const commentsRes = await supabase.from('comments').select('*', { count: 'exact', head: true });
    totalComments = commentsRes.count ?? 0;
  } catch {
    // fallback
  }

  const totalProjects = projectsRes.count ?? 0;
  const totalCertificates = certsRes.count ?? 0;
  const totalTestimonials = testimonialsRes.count ?? 0;
  const unreadMessages = unreadMessagesRes.count ?? 0;
  const totalMessages = totalMessagesRes.count ?? 0;
  const recentProjects: Project[] = recentProjectsRes.data ?? [];
  const recentMessages: Message[] = recentMessagesRes.data ?? [];

  const categoryCounts = recentProjects.reduce<Record<string, number>>((acc, p) => {
    const cat = p.category?.trim() || 'General';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const activeCategoriesCount = Object.keys(categoryCounts).length;
  const publishedCount = totalProjects;

  const getThumbnailUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('uploads/')) return `/${path}`;
    return `/uploads/${path}`;
  };

  return (
    <>
      {/* Top Header */}
      <header className="dashboard-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <SidebarTrigger />
            <h1 className="header-title" style={{ margin: 0 }}>SEZKY Studio Admin</h1>
            <span style={{ fontSize: '0.75rem', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
              Live v4.0
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

        {/* Content Wrapper */}
        <div className="content-wrapper">
          {/* Welcome Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '24px 28px',
              marginBottom: '28px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Sparkles size={20} style={{ color: '#fbbf24' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.5px', margin: 0 }}>
                  Studio Command Center
                </h2>
              </div>
              <p style={{ color: '#8c8c8c', fontSize: '0.9rem', margin: 0 }}>
                Kelola proyek portfolio, perbarui konten showcase karya, dan tanggapi pesan klien dalam satu tempat.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#22c55e', padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
                Database Connected
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#3b82f6', padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                Storage Active
              </span>
            </div>
          </div>

          {/* 7 Stats Grid across the whole screen - All Clickable */}
          <div className="stats-grid">
            <Link href="/admin/projects" className="stat-card" style={{ textDecoration: 'none' }}>
              <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
                <Briefcase size={26} />
              </div>
              <div className="stat-info">
                <h3 className="stat-value">{totalProjects}</h3>
                <p className="stat-label">Total Projects</p>
              </div>
            </Link>

            <Link href="/admin/projects" className="stat-card" style={{ textDecoration: 'none' }}>
              <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.12)', color: '#22c55e' }}>
                <Layers size={26} />
              </div>
              <div className="stat-info">
                <h3 className="stat-value">{activeCategoriesCount}</h3>
                <p className="stat-label">Active Categories</p>
              </div>
            </Link>

            <Link href="/admin/projects" className="stat-card" style={{ textDecoration: 'none' }}>
              <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.12)', color: '#a855f7' }}>
                <CheckCircle2 size={26} />
              </div>
              <div className="stat-info">
                <h3 className="stat-value">{publishedCount}</h3>
                <p className="stat-label">Published</p>
              </div>
            </Link>

            <Link href="/admin/certificates" className="stat-card" style={{ textDecoration: 'none' }}>
              <div className="stat-icon" style={{ background: 'rgba(207, 128, 71, 0.15)', color: '#cf8047' }}>
                <Award size={26} />
              </div>
              <div className="stat-info">
                <h3 className="stat-value">{totalCertificates}</h3>
                <p className="stat-label">Certificates</p>
              </div>
            </Link>

            <Link href="/admin/testimonials" className="stat-card" style={{ textDecoration: 'none' }}>
              <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }}>
                <Star size={26} />
              </div>
              <div className="stat-info">
                <h3 className="stat-value">{totalTestimonials}</h3>
                <p className="stat-label">Client Testimonials</p>
              </div>
            </Link>

            <Link href="/admin/messages" className="stat-card" style={{ textDecoration: 'none' }}>
              <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' }}>
                <Mail size={26} />
              </div>
              <div className="stat-info">
                <h3 className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{totalMessages}</span>
                  {unreadMessages > 0 && (
                    <span style={{ fontSize: '0.75rem', background: '#ef4444', color: '#fff', padding: '2px 8px', borderRadius: '10px' }}>
                      {unreadMessages} baru
                    </span>
                  )}
                </h3>
                <p className="stat-label">Inbox Kontak (Klien)</p>
              </div>
            </Link>

            <Link href="/admin/comments" className="stat-card" style={{ textDecoration: 'none' }}>
              <div className="stat-icon" style={{ background: 'rgba(207, 128, 71, 0.15)', color: '#cf8047' }}>
                <MessageSquare size={26} />
              </div>
              <div className="stat-info">
                <h3 className="stat-value">{totalComments}</h3>
                <p className="stat-label">Komentar Publik (Guestbook)</p>
              </div>
            </Link>
          </div>

          {/* 2-Column Command Center Layout */}
          <div className="dashboard-columns">
            {/* Left Area: Recent Projects & Inquiries */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Recent Projects Section */}
              <div
                style={{
                  background: '#111111',
                  border: '1px solid #1f1f1f',
                  borderRadius: '16px',
                  padding: '24px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', margin: 0 }}>
                      Recent Projects
                    </h3>
                    <p style={{ color: '#888888', fontSize: '0.85rem', marginTop: '4px', margin: 0 }}>
                      Proyek desain yang tampil di showcase portofolio
                    </p>
                  </div>
                  <Link href="/admin/projects" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
                    <Plus size={16} />
                    <span>Manage Projects</span>
                  </Link>
                </div>

                {recentProjects.length === 0 ? (
                  <div className="empty-state visible" style={{ background: '#0d0d0d', border: '1px solid #1c1c1c', borderRadius: '12px', padding: '36px', textAlign: 'center' }}>
                    <FolderKanban size={40} style={{ color: '#444', margin: '0 auto 12px' }} />
                    <h4 className="empty-state-title" style={{ color: '#fff', fontSize: '1.1rem' }}>No Projects Found</h4>
                    <p className="empty-state-text" style={{ color: '#888', fontSize: '0.875rem' }}>Start building your portfolio by adding your first project.</p>
                    <Link href="/admin/projects" className="btn btn-primary" style={{ marginTop: '12px' }}>
                      Create Project
                    </Link>
                  </div>
                ) : (
                  <div className="projects-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                    {recentProjects.map((project) => {
                      const { cleanUrl, fit: cardFit, position: cardPos } = parseThumbnailSettings(project.thumbnail_path);
                      const thumbUrl = getThumbnailUrl(cleanUrl);
                      return (
                        <div key={project.id} className="project-card" style={{ background: '#0e0e0e', border: '1px solid #1f1f1f' }}>
                          <div style={{ position: 'relative', width: '100%', height: '170px', background: '#161616', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {thumbUrl && cardFit === 'contain' && (
                              <div
                                style={{
                                  position: 'absolute',
                                  inset: 0,
                                  backgroundImage: `url(${thumbUrl})`,
                                  backgroundPosition: 'center',
                                  backgroundSize: 'cover',
                                  filter: 'blur(16px)',
                                  opacity: 0.35,
                                  transform: 'scale(1.2)',
                                }}
                                aria-hidden="true"
                              />
                            )}
                            {thumbUrl ? (
                              <img
                                src={thumbUrl}
                                alt={project.title}
                                className="project-thumbnail"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: cardFit,
                                  objectPosition: cardPos,
                                  position: 'relative',
                                  zIndex: 1,
                                }}
                              />
                            ) : (
                              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444' }}>
                                <ImageIcon size={32} />
                              </div>
                            )}
                          </div>
                          <div className="project-content" style={{ padding: '16px' }}>
                            <div className="project-header" style={{ marginBottom: '8px' }}>
                              <h4 className="project-title" style={{ fontSize: '1rem', color: '#fff' }}>{project.title}</h4>
                              {project.category && (
                                <span className="project-category" style={{ fontSize: '0.75rem', background: '#1c1c1c', border: '1px solid #2c2c2c', color: '#aaa', padding: '2px 8px', borderRadius: '4px' }}>
                                  {project.category}
                                </span>
                              )}
                            </div>
                            {project.description && (
                              <p className="project-description" style={{ fontSize: '0.825rem', color: '#888', WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {project.description}
                              </p>
                            )}
                            <div className="project-actions" style={{ marginTop: '14px' }}>
                              <Link href="/admin/projects" className="btn btn-secondary btn-small" style={{ width: '100%', justifyContent: 'center', padding: '7px 12px', fontSize: '0.8rem' }}>
                                Edit in Projects
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recent Inquiries Section */}
              <div
                style={{
                  background: '#111111',
                  border: '1px solid #1f1f1f',
                  borderRadius: '16px',
                  padding: '24px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', margin: 0 }}>
                      Recent Inquiries & Leads
                    </h3>
                    <p style={{ color: '#888888', fontSize: '0.85rem', marginTop: '4px', margin: 0 }}>
                      Pesan masuk dari form kontak pengunjung website
                    </p>
                  </div>
                  <Link href="/admin/messages" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
                    View All Messages ({totalMessages})
                  </Link>
                </div>

                {recentMessages.length === 0 ? (
                  <div className="empty-state visible" style={{ background: '#0d0d0d', border: '1px solid #1c1c1c', borderRadius: '12px', padding: '36px', textAlign: 'center' }}>
                    <Mail size={40} style={{ color: '#444', margin: '0 auto 12px' }} />
                    <p className="empty-state-text" style={{ color: '#888888', margin: 0, fontSize: '0.9rem' }}>
                      Belum ada pesan masuk. Setiap form kontak yang dikirim pengunjung akan muncul di sini.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {recentMessages.map((msg) => (
                      <Link
                        key={msg.id}
                        href="/admin/messages"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '16px 20px',
                          background: msg.is_read ? '#0e0e0e' : '#161616',
                          border: '1px solid',
                          borderColor: msg.is_read ? '#1e1e1e' : 'rgba(239, 68, 68, 0.3)',
                          borderRadius: '12px',
                          textDecoration: 'none',
                          color: 'inherit',
                          transition: 'border-color 0.2s',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0, paddingRight: '12px' }}>
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: msg.is_read ? '#333' : '#ef4444',
                              flexShrink: 0,
                            }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3px' }}>
                              <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{msg.name}</strong>
                              <span style={{ color: '#888', fontSize: '0.8rem' }}>&lt;{msg.email}&gt;</span>
                            </div>
                            <p style={{ color: '#999', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                              {msg.message}
                            </p>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                          <span style={{ color: '#666', fontSize: '0.75rem' }}>
                            {new Date(msg.created_at).toLocaleDateString()}
                          </span>
                          <span style={{ color: '#3b82f6', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            Reply <ArrowRight size={13} />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar Widgets: Quick Palette, Categories, and Health */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Quick Actions Hub */}
              <div
                style={{
                  background: '#111111',
                  border: '1px solid #1f1f1f',
                  borderRadius: '16px',
                  padding: '24px',
                }}
              >
                <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '16px', margin: '0 0 16px 0' }}>
                  Quick Actions
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link
                    href="/admin/projects"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: 'rgba(37, 99, 235, 0.1)',
                      border: '1px solid rgba(37, 99, 235, 0.25)',
                      borderRadius: '10px',
                      color: '#60a5fa',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      transition: 'background 0.2s',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Plus size={16} />
                      Add New Project
                    </span>
                    <ArrowRight size={14} />
                  </Link>

                  <Link
                    href="/admin/projects"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: '#161616',
                      border: '1px solid #242424',
                      borderRadius: '10px',
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FolderKanban size={16} style={{ color: '#22c55e' }} />
                      Edit Portfolio Projects
                    </span>
                    <ArrowRight size={14} style={{ color: '#666' }} />
                  </Link>

                  <Link
                    href="/admin/messages"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: '#161616',
                      border: '1px solid #242424',
                      borderRadius: '10px',
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={16} style={{ color: '#ef4444' }} />
                      Client Messages
                    </span>
                    {unreadMessages > 0 ? (
                      <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.75rem', padding: '1px 7px', borderRadius: '10px' }}>
                        {unreadMessages}
                      </span>
                    ) : (
                      <ArrowRight size={14} style={{ color: '#666' }} />
                    )}
                  </Link>

                  <Link
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: '#161616',
                      border: '1px solid #242424',
                      borderRadius: '10px',
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ExternalLink size={16} style={{ color: '#a855f7' }} />
                      View Live Portfolio
                    </span>
                    <ArrowRight size={14} style={{ color: '#666' }} />
                  </Link>
                </div>
              </div>

              {/* Categories Breakdown */}
              <div
                style={{
                  background: '#111111',
                  border: '1px solid #1f1f1f',
                  borderRadius: '16px',
                  padding: '24px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Layers size={18} style={{ color: '#a855f7' }} />
                  <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, margin: 0 }}>
                    Category Breakdown
                  </h4>
                </div>

                {Object.keys(categoryCounts).length === 0 ? (
                  <p style={{ color: '#777', fontSize: '0.85rem', margin: 0 }}>No projects categorized yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {Object.entries(categoryCounts).map(([cat, count]) => {
                      const percentage = Math.round((count / (totalProjects || 1)) * 100);
                      return (
                        <div key={cat}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                            <span style={{ color: '#ddd' }}>{cat}</span>
                            <span style={{ color: '#888' }}>{count} ({percentage}%)</span>
                          </div>
                          <div style={{ height: '6px', background: '#202020', borderRadius: '4px', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${percentage}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                                borderRadius: '4px',
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Studio & Cloud Infrastructure Card */}
              <div
                style={{
                  background: '#111111',
                  border: '1px solid #1f1f1f',
                  borderRadius: '16px',
                  padding: '24px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <ShieldCheck size={18} style={{ color: '#22c55e' }} />
                  <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, margin: 0 }}>
                    System Status
                  </h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#888', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Database size={14} /> Database
                    </span>
                    <span style={{ color: '#22c55e', fontWeight: 600, fontSize: '0.8rem' }}>Supabase Cloud</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#888', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ImageIcon size={14} /> Storage Bucket
                    </span>
                    <span style={{ color: '#e4e4e7', fontSize: '0.8rem', background: '#1c1c1c', padding: '2px 6px', borderRadius: '4px' }}>
                      portfolio-assets
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#888' }}>Admin User</span>
                    <span style={{ color: '#e4e4e7', fontSize: '0.8rem', maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={user.email}>
                      {user.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}
