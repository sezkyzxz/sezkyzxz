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
  Star,
  MessageSquareQuote,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import {
  createTestimonialAction,
  updateTestimonialAction,
  deleteTestimonialAction,
} from './actions';
import type { Project } from '@/types';

function parseProjectTagAndRating(raw: string | null | undefined): { projectTag: string; rating: number } {
  if (!raw) return { projectTag: '', rating: 5 };
  if (raw.includes(':::')) {
    const [tag, r] = raw.split(':::');
    const parsedRating = Number(r);
    return {
      projectTag: tag.trim(),
      rating: isNaN(parsedRating) ? 5 : parsedRating,
    };
  }
  return { projectTag: raw.trim(), rating: 5 };
}

export default function TestimonialsManager({
  initialTestimonials,
}: {
  initialTestimonials: Project[];
}) {
  const [testimonials, setTestimonials] = useState<Project[]>(initialTestimonials);
  const [search, setSearch] = useState('');

  // Modal State
  const [editingItem, setEditingItem] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingItem, setDeletingItem] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Upload State
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [ratingValue, setRatingValue] = useState<number>(5);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = testimonials.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      (t.tags && t.tags.toLowerCase().includes(q)) ||
      (t.project_url && t.project_url.toLowerCase().includes(q))
    );
  });

  const getThumbnailUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('uploads/')) return `/${path}`;
    return `/uploads/${path}`;
  };

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Harap pilih file gambar (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Ukuran file maksimal 5MB.');
      return;
    }

    setUploading(true);
    setErrorMsg('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.path) {
        setPreviewImage(data.path);
      } else {
        setErrorMsg(data.error || 'Gagal mengunggah foto klien.');
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
      formData.set('photo', previewImage);
    }
    formData.set('rating', String(ratingValue));

    try {
      const res = await createTestimonialAction({}, formData);
      if (res.success) {
        setIsCreating(false);
        setPreviewImage('');
        window.location.reload();
      } else {
        setErrorMsg(res.error || 'Gagal menambahkan ulasan klien.');
      }
    } catch {
      setErrorMsg('Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;
    setLoading(true);
    setErrorMsg('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    if (previewImage) {
      formData.set('photo', previewImage);
    }
    formData.set('rating', String(ratingValue));

    try {
      const res = await updateTestimonialAction(editingItem.id, {}, formData);
      if (res.success) {
        setEditingItem(null);
        setPreviewImage('');
        window.location.reload();
      } else {
        setErrorMsg(res.error || 'Gagal memperbarui ulasan klien.');
      }
    } catch {
      setErrorMsg('Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await deleteTestimonialAction(deletingItem.id);
      if (res.success) {
        setTestimonials((prev) => prev.filter((item) => item.id !== deletingItem.id));
        setDeletingItem(null);
      } else {
        setErrorMsg(res.error || 'Gagal menghapus ulasan.');
      }
    } catch {
      setErrorMsg('Terjadi kesalahan saat menghapus.');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setIsCreating(true);
    setPreviewImage('');
    setRatingValue(5);
    setErrorMsg('');
  };

  const openEditModal = (item: Project) => {
    setEditingItem(item);
    setPreviewImage(item.thumbnail_path || '');
    const { rating } = parseProjectTagAndRating(item.project_url);
    setRatingValue(rating);
    setErrorMsg('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner Actions & Search */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          background: '#161616',
          padding: '16px 20px',
          borderRadius: '12px',
          border: '1px solid #262626',
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '420px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#666',
            }}
          />
          <input
            type="text"
            placeholder="Cari nama klien, perusahaan, atau isi ulasan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              background: '#0d0d0d',
              border: '1px solid #2a2a2a',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          />
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#22c55e',
            color: '#000000',
            fontWeight: 700,
            fontSize: '0.875rem',
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          <Plus size={18} />
          <span>Tambah Testimoni Baru</span>
        </button>
      </div>

      {/* Testimonials Grid / List */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#141414',
            borderRadius: '12px',
            border: '1px dashed #2a2a2a',
          }}
        >
          <MessageSquareQuote size={48} color="#444" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '8px' }}>
            {search ? 'Tidak ada ulasan yang cocok dengan pencarian' : 'Belum ada testimoni klien di database'}
          </h3>
          <p style={{ color: '#777', fontSize: '0.875rem', maxWidth: '480px', margin: '0 auto 20px' }}>
            Saat ini portofolio di halaman utama menampilkan default sample testimoni. Tambahkan ulasan klien asli Anda di sini untuk langsung menggantikannya!
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#22c55e',
              color: '#000',
              fontWeight: 600,
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Plus size={16} />
            <span>Tambah Testimoni Pertama</span>
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '20px',
          }}
        >
          {filtered.map((item) => {
            const photoUrl = getThumbnailUrl(item.thumbnail_path);
            const initials = item.title
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            const { projectTag, rating } = parseProjectTagAndRating(item.project_url);

            return (
              <div
                key={item.id}
                style={{
                  background: '#161616',
                  borderRadius: '12px',
                  border: '1px solid #262626',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  position: 'relative',
                }}
              >
                {/* Header: Photo, Name, Role, Rating */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      background: '#222',
                      flexShrink: 0,
                      display: 'grid',
                      placeItems: 'center',
                      border: '1px solid #333',
                    }}
                  >
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#22c55e' }}>
                        {initials}
                      </span>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          fill={i < rating ? '#fbbf24' : 'none'}
                          color={i < rating ? '#fbbf24' : '#444'}
                        />
                      ))}
                      {projectTag && (
                        <span
                          style={{
                            marginLeft: '8px',
                            fontSize: '0.7rem',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            background: 'rgba(207, 128, 71, 0.15)',
                            color: '#f3a875',
                            fontWeight: 600,
                          }}
                        >
                          {projectTag}
                        </span>
                      )}
                    </div>
                    <h4 style={{ color: '#fff', fontSize: '1rem', margin: 0, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </h4>
                    <p style={{ color: '#888', fontSize: '0.8125rem', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.tags || 'Klien'}
                    </p>
                  </div>
                </div>

                {/* Quote Body */}
                <blockquote
                  style={{
                    color: '#ccc',
                    fontSize: '0.875rem',
                    lineHeight: '1.55',
                    margin: 0,
                    fontStyle: 'italic',
                    background: '#0e0e0e',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    borderLeft: '3px solid #22c55e',
                    flex: 1,
                  }}
                >
                  &ldquo;{item.description}&rdquo;
                </blockquote>

                {/* Card Footer Actions */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '12px',
                    borderTop: '1px solid #222',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: '#555' }}>
                    ID: #{item.id}
                  </span>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: '#222',
                        color: '#fff',
                        border: '1px solid #333',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.8125rem',
                        cursor: 'pointer',
                      }}
                    >
                      <Pencil size={13} />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingItem(item)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'rgba(239, 68, 68, 0.12)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '0.8125rem',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: CREATE / EDIT */}
      {(isCreating || editingItem) && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#161616',
              border: '1px solid #2a2a2a',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: '1px solid #242424',
              }}
            >
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.25rem' }}>
                {isCreating ? 'Tambah Testimoni Klien Baru' : 'Edit Testimoni Klien'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingItem(null);
                  setPreviewImage('');
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#888',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
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
                  padding: '10px 14px',
                  borderRadius: '8px',
                  color: '#f87171',
                  fontSize: '0.875rem',
                  marginBottom: '16px',
                }}
              >
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={isCreating ? handleCreateSubmit : handleEditSubmit}>
              {/* Client Name */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#ccc', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 600 }}>
                  Nama Lengkap Klien <span style={{ color: '#22c55e' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingItem?.title || ''}
                  placeholder="Contoh: Shula Aurellia"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#0d0d0d',
                    border: '1px solid #2a2a2a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Role & Company */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#ccc', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 600 }}>
                  Jabatan / Perusahaan <span style={{ color: '#22c55e' }}>*</span>
                </label>
                <input
                  type="text"
                  name="role"
                  defaultValue={editingItem?.tags || ''}
                  placeholder="Contoh: Shareholder, BOO Djimber (Djivar Oma)"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#0d0d0d',
                    border: '1px solid #2a2a2a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Project Tag */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#ccc', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 600 }}>
                  Kategori / Tag Proyek (Opsional)
                </label>
                <input
                  type="text"
                  name="projectTag"
                  defaultValue={parseProjectTagAndRating(editingItem?.project_url).projectTag}
                  placeholder="Contoh: Brand Identity & Visuals / Desain Kemasan"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#0d0d0d',
                    border: '1px solid #2a2a2a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Rating Stars Selector */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#ccc', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 600 }}>
                  Rating Bintang
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingValue(star)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                    >
                      <Star
                        size={22}
                        fill={star <= ratingValue ? '#fbbf24' : 'none'}
                        color={star <= ratingValue ? '#fbbf24' : '#444'}
                      />
                    </button>
                  ))}
                  <span style={{ fontSize: '0.85rem', color: '#aaa', marginLeft: '6px' }}>
                    {ratingValue} dari 5 Bintang
                  </span>
                </div>
              </div>

              {/* Photo Upload & Preview */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#ccc', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 600 }}>
                  Foto Klien
                </label>

                {previewImage && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        border: '2px solid #22c55e',
                      }}
                    >
                      <img
                        src={getThumbnailUrl(previewImage) || previewImage}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewImage('')}
                      style={{
                        fontSize: '0.8rem',
                        color: '#f87171',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Hapus Foto
                    </button>
                  </div>
                )}

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${dragOver ? '#22c55e' : '#333'}`,
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: dragOver ? 'rgba(34, 197, 94, 0.05)' : '#0d0d0d',
                    marginBottom: '8px',
                  }}
                >
                  <Upload size={24} color="#666" style={{ margin: '0 auto 8px' }} />
                  <p style={{ color: '#888', fontSize: '0.8125rem', margin: 0 }}>
                    {uploading
                      ? 'Sedang mengunggah...'
                      : 'Klik atau tarik foto ke sini (JPG, PNG, WebP)'}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </div>

                <input
                  type="text"
                  name="photo"
                  value={previewImage}
                  onChange={(e) => setPreviewImage(e.target.value)}
                  placeholder="Atau masukkan URL / path foto langsung..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#0d0d0d',
                    border: '1px solid #2a2a2a',
                    borderRadius: '6px',
                    color: '#888',
                    fontSize: '0.8rem',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Quote Text */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', color: '#ccc', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 600 }}>
                  Ulasan / Testimoni <span style={{ color: '#22c55e' }}>*</span>
                </label>
                <textarea
                  name="quote"
                  rows={4}
                  defaultValue={editingItem?.description || ''}
                  placeholder="Tuliskan pengalaman atau kutipan kepuasan klien..."
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#0d0d0d',
                    border: '1px solid #2a2a2a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingItem(null);
                    setPreviewImage('');
                  }}
                  style={{
                    padding: '10px 18px',
                    background: '#222',
                    color: '#ccc',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '10px 22px',
                    background: '#22c55e',
                    color: '#000',
                    fontWeight: 700,
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? 'Menyimpan...' : isCreating ? 'Tambah Testimoni' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deletingItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#161616',
              border: '1px solid #2a2a2a',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '440px',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <Trash2 size={40} color="#ef4444" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '8px' }}>
              Hapus Testimoni Ini?
            </h3>
            <p style={{ color: '#888', fontSize: '0.875rem', marginBottom: '24px' }}>
              Testimoni dari <strong style={{ color: '#fff' }}>{deletingItem.title}</strong> akan dihapus permanen dari portofolio Anda.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                style={{
                  padding: '10px 18px',
                  background: '#222',
                  color: '#ccc',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  background: '#ef4444',
                  color: '#fff',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
