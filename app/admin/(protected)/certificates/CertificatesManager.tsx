'use client';

import React, { useState, useRef } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Upload,
  X,
  AlertCircle,
  Award,
  ExternalLink,
  Eye,
} from 'lucide-react';
import {
  createCertificateAction,
  updateCertificateAction,
  deleteCertificateAction,
} from './actions';
import type { Project } from '@/types';

export interface CertificateData {
  id: number;
  title: string;
  issuer: string;
  year: string;
  image: string;
  credential_url?: string;
}

export default function CertificatesManager({
  initialCertificates,
}: {
  initialCertificates: Project[];
}) {
  const [certificates, setCertificates] = useState<Project[]>(initialCertificates);
  const [search, setSearch] = useState('');

  // Modal State
  const [editingCert, setEditingCert] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingCert, setDeletingCert] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Upload State
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lightbox Preview
  const [previewLightbox, setPreviewLightbox] = useState<string | null>(null);

  const filtered = certificates.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q)) ||
      (c.tags && c.tags.toLowerCase().includes(q))
    );
  });

  const getThumbnailUrl = (path: string | null) => {
    if (!path) return '/assets/images/placeholder.svg';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('uploads/')) return `/${path}`;
    return `/uploads/${path}`;
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.path) {
        setPreviewImage(data.path);
      } else {
        setErrorMsg(data.error || 'Gagal mengunggah foto sertifikat.');
      }
    } catch {
      setErrorMsg('Terjadi kesalahan saat mengunggah foto.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    if (previewImage) {
      formData.set('image', previewImage);
    }

    try {
      const res = await createCertificateAction({}, formData);
      if (res.success) {
        setIsCreating(false);
        setPreviewImage('');
        window.location.reload();
      } else {
        setErrorMsg(res.error || 'Gagal menambahkan sertifikat.');
      }
    } catch {
      setErrorMsg('Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCert) return;
    setLoading(true);
    setErrorMsg('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    if (previewImage) {
      formData.set('image', previewImage);
    }

    try {
      const res = await updateCertificateAction(editingCert.id, {}, formData);
      if (res.success) {
        setEditingCert(null);
        setPreviewImage('');
        window.location.reload();
      } else {
        setErrorMsg(res.error || 'Gagal memperbarui sertifikat.');
      }
    } catch {
      setErrorMsg('Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCert) return;
    setLoading(true);
    try {
      const res = await deleteCertificateAction(deletingCert.id);
      if (res.success) {
        setCertificates((prev) => prev.filter((c) => c.id !== deletingCert.id));
        setDeletingCert(null);
      } else {
        setErrorMsg(res.error || 'Gagal menghapus sertifikat.');
      }
    } catch {
      setErrorMsg('Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(207, 128, 71, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#cf8047',
            }}
          >
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
              Daftar Sertifikat Profesional
            </h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#888888' }}>
              Kelola sertifikasi keahlian yang tampil di tab Certificates portofolio
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsCreating(true);
            setEditingCert(null);
            setPreviewImage('');
            setErrorMsg('');
          }}
          className="btn-create"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#cf8047',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(207, 128, 71, 0.35)',
            transition: 'all 0.2s ease',
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Sertifikat</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: '#141414',
          padding: '10px 16px',
          borderRadius: '10px',
          border: '1px solid #242424',
          marginBottom: '24px',
        }}
      >
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Cari berdasarkan judul, penerbit, atau tahun..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#ffffff',
            width: '100%',
            fontSize: '0.875rem',
          }}
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Table / Grid list */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 16px',
            background: '#121212',
            borderRadius: '12px',
            border: '1px dashed #282828',
          }}
        >
          <Award className="w-12 h-12 mx-auto mb-3" style={{ opacity: 0.3, color: '#cf8047' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
            Belum ada sertifikat tersimpan
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#888', maxWidth: '400px', margin: '0 auto 20px auto' }}>
            Klik tombol &quot;Tambah Sertifikat&quot; di atas untuk mengunggah sertifikat keahlian Anda ke web portofolio.
          </p>
          <button
            type="button"
            onClick={() => {
              setIsCreating(true);
              setPreviewImage('');
            }}
            style={{
              background: 'rgba(207, 128, 71, 0.15)',
              border: '1px solid rgba(207, 128, 71, 0.4)',
              color: '#f3a875',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            + Tambah Sertifikat Pertama
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {filtered.map((cert) => {
            const thumb = getThumbnailUrl(cert.thumbnail_path);
            return (
              <div
                key={cert.id}
                style={{
                  background: '#151515',
                  border: '1px solid #262626',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'border-color 0.2s ease',
                }}
              >
                {/* Image preview with hover view */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '4 / 3',
                    background: '#0d0d0d',
                    cursor: 'pointer',
                  }}
                  onClick={() => setPreviewLightbox(thumb)}
                >
                  <img
                    src={thumb}
                    alt={cert.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      opacity: 0,
                      transition: 'opacity 0.2s ease',
                      color: '#ffffff',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                  >
                    <Eye className="w-5 h-5 text-amber-400" />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Pratinjau</span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#f3a875',
                        background: 'rgba(207, 128, 71, 0.12)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {cert.tags || '2024'}
                    </span>
                    {cert.project_url && (
                      <a
                        href={cert.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#888', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', textDecoration: 'none' }}
                      >
                        <span>Verifikasi</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', margin: '0 0 4px 0', lineHeight: 1.4 }}>
                    {cert.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#aaaaaa', margin: '0 0 16px 0' }}>
                    {cert.description || 'Penerbit tidak ditentukan'}
                  </p>

                  {/* Actions */}
                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: '12px',
                      borderTop: '1px solid #222222',
                      display: 'flex',
                      gap: '8px',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCert(cert);
                        setIsCreating(false);
                        setPreviewImage(cert.thumbnail_path || '');
                        setErrorMsg('');
                      }}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        background: '#222222',
                        border: '1px solid #333333',
                        color: '#ffffff',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <Pencil className="w-3.5 h-3.5 text-blue-400" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingCert(cert)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        color: '#ef4444',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {(isCreating || editingCert) && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => {
            setIsCreating(false);
            setEditingCert(null);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#181818',
              border: '1px solid #2e2e2e',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                {isCreating ? 'Tambah Sertifikat Baru' : 'Edit Sertifikat'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingCert(null);
                }}
                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  marginBottom: '16px',
                }}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={isCreating ? handleCreateSubmit : handleEditSubmit}>
              {/* Judul Sertifikat */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ddd', marginBottom: '6px' }}>
                  Judul Sertifikat *
                </label>
                <input
                  name="title"
                  type="text"
                  required
                  defaultValue={editingCert?.title || ''}
                  placeholder="Contoh: Adobe Certified Professional — Visual Design"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: '#111111',
                    border: '1px solid #333333',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Penerbit / Lembaga */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ddd', marginBottom: '6px' }}>
                  Penerbit / Institusi *
                </label>
                <input
                  name="issuer"
                  type="text"
                  required
                  defaultValue={editingCert?.description || ''}
                  placeholder="Contoh: Adobe / Certiport, Google, Coursera, dll."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: '#111111',
                    border: '1px solid #333333',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Tahun & URL Kredensial Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ddd', marginBottom: '6px' }}>
                    Tahun *
                  </label>
                  <input
                    name="year"
                    type="text"
                    required
                    defaultValue={editingCert?.tags || '2024'}
                    placeholder="Contoh: 2024"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: '#111111',
                      border: '1px solid #333333',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ddd', marginBottom: '6px' }}>
                    URL Kredensial / Verifikasi (Opsional)
                  </label>
                  <input
                    name="credential_url"
                    type="url"
                    defaultValue={editingCert?.project_url || ''}
                    placeholder="https://credly.com/badges/..."
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: '#111111',
                      border: '1px solid #333333',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Upload Gambar Sertifikat */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ddd', marginBottom: '6px' }}>
                  Foto / Gambar Sertifikat *
                </label>

                <input type="hidden" name="image" value={previewImage} />

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${dragOver ? '#cf8047' : '#333333'}`,
                    borderRadius: '12px',
                    padding: '24px',
                    textAlign: 'center',
                    background: dragOver ? 'rgba(207, 128, 71, 0.05)' : '#111111',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                  />

                  {uploading ? (
                    <div style={{ color: '#cf8047', fontSize: '0.875rem', fontWeight: 600 }}>
                      Mengunggah gambar sertifikat...
                    </div>
                  ) : previewImage ? (
                    <div>
                      <img
                        src={getThumbnailUrl(previewImage)}
                        alt="Preview"
                        style={{
                          maxHeight: '140px',
                          borderRadius: '8px',
                          margin: '0 auto 8px auto',
                          objectFit: 'contain',
                        }}
                      />
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#888' }}>
                        Klik atau drag untuk mengganti gambar sertifikat
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: '#cf8047' }} />
                      <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>
                        Klik untuk upload foto sertifikat
                      </p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#777777' }}>
                        PNG, JPG, WEBP hingga 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingCert(null);
                  }}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    background: '#222222',
                    border: '1px solid #333333',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading || !previewImage}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '8px',
                    background: '#cf8047',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: loading || uploading || !previewImage ? 'not-allowed' : 'pointer',
                    opacity: loading || uploading || !previewImage ? 0.6 : 1,
                    boxShadow: '0 4px 14px rgba(207, 128, 71, 0.35)',
                  }}
                >
                  {loading ? 'Menyimpan...' : isCreating ? 'Simpan Sertifikat' : 'Perbarui Sertifikat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingCert && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setDeletingCert(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '14px',
              padding: '24px',
              maxWidth: '420px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', margin: '0 0 8px 0' }}>
              Hapus Sertifikat Ini?
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#888', margin: '0 0 24px 0', lineHeight: 1.5 }}>
              Apakah Anda yakin ingin menghapus &quot;{deletingCert.title}&quot;? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setDeletingCert(null)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  background: '#282828',
                  border: '1px solid #383838',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                Batal
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleDeleteConfirm}
                style={{
                  padding: '9px 20px',
                  borderRadius: '8px',
                  background: '#ef4444',
                  border: 'none',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL */}
      {previewLightbox && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setPreviewLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setPreviewLightbox(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={previewLightbox}
            alt="Preview Sertifikat"
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
