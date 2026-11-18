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
  ImageIcon,
  Maximize2,
  Crop,
} from 'lucide-react';
import { createProjectAction, updateProjectAction, deleteProjectAction } from './actions';
import {
  parseThumbnailSettings,
  buildThumbnailPath,
  getThumbnailUrl,
  type ImageFitMode,
  type ImagePositionMode,
  type ImageRatioMode,
} from '@/lib/portfolio-data';
import type { Project } from '@/types';

interface CoverSettingsProps {
  previewThumb: string;
  setPreviewThumb: (url: string) => void;
  imageFit: ImageFitMode;
  setImageFit: (fit: ImageFitMode) => void;
  imagePos: ImagePositionMode;
  setImagePos: (pos: ImagePositionMode) => void;
  imageRatio: ImageRatioMode;
  setImageRatio: (ratio: ImageRatioMode) => void;
  uploading: boolean;
  dragOver: boolean;
  setDragOver: (drag: boolean) => void;
  handleDrop: (e: React.DragEvent) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function ProjectCoverSettingsSection({
  previewThumb,
  setPreviewThumb,
  imageFit,
  setImageFit,
  imagePos,
  setImagePos,
  imageRatio,
  setImageRatio,
  uploading,
  dragOver,
  setDragOver,
  handleDrop,
  fileInputRef,
  handleFileUpload,
}: CoverSettingsProps) {
  const cleanUrl = getThumbnailUrl(previewThumb);

  return (
    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
      <label
        className="form-label"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <span style={{ fontWeight: 600 }}>Project Cover Image *</span>
        <span style={{ fontSize: '0.75rem', color: '#888' }}>Upload file or paste link</span>
      </label>

      {previewThumb ? (
        <div
          style={{
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #333',
            background: '#141414',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Live Preview Box with Selected Ratio & Fit */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio:
                imageRatio === '16/9'
                  ? '16/9'
                  : imageRatio === '4/3'
                  ? '4/3'
                  : imageRatio === '1/1'
                  ? '1/1'
                  : imageRatio === '4/5'
                  ? '4/5'
                  : '3/4',
              maxHeight: '280px',
              overflow: 'hidden',
              backgroundColor: '#09090b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Ambient Blurred Backdrop when Contain is selected */}
            {imageFit === 'contain' && cleanUrl && (
              <img
                src={cleanUrl}
                alt=""
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'blur(20px) brightness(0.45)',
                  transform: 'scale(1.15)',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />
            )}

            {/* Foreground Main Image */}
            <img
              src={cleanUrl || ''}
              alt="Project Cover Preview"
              style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                height: '100%',
                objectFit: imageFit,
                objectPosition: imagePos,
                transition: 'all 0.2s ease',
              }}
            />

            {/* Live Indicator Badge */}
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 2,
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(6px)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.725rem',
                color: imageFit === 'contain' ? '#60a5fa' : '#34d399',
                border: '1px solid rgba(255,255,255,0.1)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>{imageFit === 'contain' ? '🛡️ Pas Penuh (Utuh)' : '✂️ Cover (Penuh)'}</span>
              <span>•</span>
              <span>{imageRatio}</span>
            </div>
          </div>

          {/* Controls Panel */}
          <div style={{ padding: '14px', background: '#111', borderTop: '1px solid #222' }}>
            {/* Fit Mode Selector */}
            <div style={{ marginBottom: '12px' }}>
              <div
                style={{
                  fontSize: '0.775rem',
                  fontWeight: 600,
                  color: '#ccc',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>Mode Tampilan Foto:</span>
                <span style={{ fontSize: '0.7rem', color: '#888', fontWeight: 400 }}>
                  (Pilih 'Pas Penuh' agar poster tidak terpotong)
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setImageFit('contain')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: imageFit === 'contain' ? 600 : 400,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    border: imageFit === 'contain' ? '1px solid #3b82f6' : '1px solid #2a2a2a',
                    background: imageFit === 'contain' ? 'rgba(59, 130, 246, 0.15)' : '#181818',
                    color: imageFit === 'contain' ? '#60a5fa' : '#888',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Maximize2 size={14} />
                  <span>Pas Penuh (Contain)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageFit('cover')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: imageFit === 'cover' ? 600 : 400,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    border: imageFit === 'cover' ? '1px solid #3b82f6' : '1px solid #2a2a2a',
                    background: imageFit === 'cover' ? 'rgba(59, 130, 246, 0.15)' : '#181818',
                    color: imageFit === 'cover' ? '#60a5fa' : '#888',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Crop size={14} />
                  <span>Penuhi Kotak (Cover)</span>
                </button>
              </div>
            </div>

            {/* Aspect Ratio Selector */}
            <div style={{ marginBottom: '12px' }}>
              <div
                style={{
                  fontSize: '0.775rem',
                  fontWeight: 600,
                  color: '#ccc',
                  marginBottom: '6px',
                }}
              >
                Rasio Bingkai Kartu:
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {(['16/9', '4/3', '1/1', '4/5', '3/4'] as ImageRatioMode[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setImageRatio(r)}
                    style={{
                      flex: '1 1 auto',
                      padding: '5px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: imageRatio === r ? 600 : 400,
                      cursor: 'pointer',
                      border: imageRatio === r ? '1px solid #3b82f6' : '1px solid #282828',
                      background: imageRatio === r ? 'rgba(59, 130, 246, 0.2)' : '#161616',
                      color: imageRatio === r ? '#93c5fd' : '#888',
                      transition: 'all 0.15s ease',
                      textAlign: 'center',
                    }}
                  >
                    {r === '16/9'
                      ? '16:9'
                      : r === '4/3'
                      ? '4:3'
                      : r === '1/1'
                      ? '1:1'
                      : r === '4/5'
                      ? '4:5 (Flyer)'
                      : '3:4 (Poster)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Focal Position Selector */}
            <div style={{ marginBottom: '12px' }}>
              <div
                style={{
                  fontSize: '0.775rem',
                  fontWeight: 600,
                  color: '#ccc',
                  marginBottom: '6px',
                }}
              >
                Posisi Fokus Gambar:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {(['top', 'center', 'bottom'] as ImagePositionMode[]).map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setImagePos(pos)}
                    style={{
                      padding: '5px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: imagePos === pos ? 600 : 400,
                      cursor: 'pointer',
                      border: imagePos === pos ? '1px solid #3b82f6' : '1px solid #282828',
                      background: imagePos === pos ? 'rgba(59, 130, 246, 0.2)' : '#161616',
                      color: imagePos === pos ? '#93c5fd' : '#888',
                      transition: 'all 0.15s ease',
                      textAlign: 'center',
                    }}
                  >
                    {pos === 'top' ? '⬆️ Atas' : pos === 'center' ? '⏺️ Tengah' : '⬇️ Bawah'}
                  </button>
                ))}
              </div>
            </div>

            {/* Informational Help Note */}
            <div
              style={{
                fontSize: '0.725rem',
                color: '#60a5fa',
                background: 'rgba(59, 130, 246, 0.08)',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                marginBottom: '12px',
                lineHeight: 1.4,
              }}
            >
              💡 <strong>Tips Flyer & Poster:</strong> Gunakan <strong>Pas Penuh (Contain)</strong> agar foto flyer tidak terpotong bagian atas/bawahnya. Latar ambient blur otomatis aktif di kartu & modal!
            </div>

            {/* Action Bar (Ganti Foto & Hapus) */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                paddingTop: '8px',
                borderTop: '1px solid #222',
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#777',
                  maxWidth: '280px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={previewThumb}
              >
                {previewThumb}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="btn btn-secondary btn-small"
                  style={{ fontSize: '0.75rem', padding: '5px 12px' }}
                >
                  <Upload size={13} />
                  <span>Ganti File</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewThumb('')}
                  className="btn btn-danger btn-small"
                  style={{ fontSize: '0.75rem', padding: '5px 12px' }}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed',
            borderColor: dragOver ? '#3b82f6' : '#2c2c2c',
            background: dragOver ? 'rgba(59, 130, 246, 0.05)' : '#111111',
            borderRadius: '12px',
            padding: '28px 16px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#181818',
              border: '1px solid #333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 10px',
              color: '#60a5fa',
            }}
          >
            <Upload size={18} />
          </div>
          <p style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 600, margin: '0 0 4px 0' }}>
            {uploading ? 'Mengupload ke Supabase...' : 'Klik atau Drag & Drop Foto Proyek di Sini'}
          </p>
          <p style={{ color: '#888888', fontSize: '0.75rem', margin: 0 }}>
            Mendukung JPG, PNG, WebP, GIF, SVG, AVIF (Maksimal 10MB)
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      <div style={{ marginTop: '8px' }}>
        <input
          type="text"
          value={previewThumb}
          onChange={(e) => {
            const val = e.target.value;
            setPreviewThumb(val);
            if (val) {
              const parsed = parseThumbnailSettings(val);
              setImageFit(parsed.fit);
              setImagePos(parsed.position);
              setImageRatio(parsed.ratio);
            }
          }}
          placeholder="Atau paste link URL gambar langsung (https://...)"
          style={{
            width: '100%',
            background: '#0a0a0a',
            border: '1px solid #222',
            borderRadius: '6px',
            padding: '8px 12px',
            color: '#bbb',
            fontSize: '0.8rem',
            outline: 'none',
          }}
        />
      </div>
    </div>
  );
}

export default function ProjectsManager({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Modal State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Upload State
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [previewThumb, setPreviewThumb] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Image Display Settings State
  const [imageFit, setImageFit] = useState<ImageFitMode>('cover');
  const [imagePos, setImagePos] = useState<ImagePositionMode>('center');
  const [imageRatio, setImageRatio] = useState<ImageRatioMode>('16/9');

  const categories = Array.from(
    new Set(projects.map((p) => p.category?.trim()).filter(Boolean) as string[])
  );

  const filtered = projects.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase())) ||
      (p.tags && p.tags.toLowerCase().includes(search.toLowerCase()));
    const matchCat = selectedCat === 'all' || p.category?.trim() === selectedCat;
    return matchSearch && matchCat;
  });

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
        setPreviewThumb(data.path);
      } else {
        setErrorMsg(data.error || 'Failed to upload image.');
      }
    } catch {
      setErrorMsg('Error uploading image.');
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
    if (previewThumb) {
      const finalThumb = buildThumbnailPath(previewThumb, {
        fit: imageFit,
        position: imagePos,
        ratio: imageRatio,
      });
      formData.set('thumbnail_path', finalThumb);
    }

    try {
      const res = await createProjectAction({}, formData);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setIsCreating(false);
        setPreviewThumb('');
        window.location.reload();
      }
    } catch {
      setErrorMsg('Failed to create project.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProject) return;

    setLoading(true);
    setErrorMsg('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const finalThumb = previewThumb
      ? buildThumbnailPath(previewThumb, {
          fit: imageFit,
          position: imagePos,
          ratio: imageRatio,
        })
      : '';
    formData.set('thumbnail_path', finalThumb);

    try {
      const res = await updateProjectAction(editingProject.id, {}, formData);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setEditingProject(null);
        setPreviewThumb('');
        window.location.reload();
      }
    } catch {
      setErrorMsg('Failed to update project.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await deleteProjectAction(id);
      if (res.error) {
        alert(res.error);
      } else {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      alert('Failed to delete project.');
    }
  };

  return (
    <div>
      {/* Section Header */}
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h2 className="section-title">Manage Projects</h2>
          <p className="section-subtitle">View, edit, and delete your portfolio projects</p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsCreating(true);
            setPreviewThumb('');
            setImageFit('cover');
            setImagePos('center');
            setImageRatio('16/9');
            setErrorMsg('');
          }}
          className="btn btn-primary"
        >
          <Plus size={18} />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', width: '280px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#888888',
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="form-input"
            style={{ paddingLeft: '38px', height: '42px' }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setSelectedCat('all')}
            className={`btn btn-small ${selectedCat === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All ({projects.length})
          </button>
          {categories.map((cat) => {
            const count = projects.filter((p) => p.category?.trim() === cat).length;
            const active = selectedCat === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCat(cat)}
                className={`btn btn-small ${active ? 'btn-primary' : 'btn-secondary'}`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Grid or Empty State */}
      {filtered.length === 0 ? (
        <div className="empty-state visible" style={{ background: '#111111', border: '1px solid #222222', borderRadius: '12px' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 17h6M9 13h6M9 9h6" />
          </svg>
          <h3 className="empty-state-title">No Projects Found</h3>
          <p className="empty-state-text">
            {search || selectedCat !== 'all'
              ? 'No projects match your filter criteria.'
              : 'Get started by creating your first project.'}
          </p>
          <button
            type="button"
            onClick={() => {
              if (search || selectedCat !== 'all') {
                setSearch('');
                setSelectedCat('all');
              } else {
                setIsCreating(true);
                setPreviewThumb('');
                setImageFit('cover');
                setImagePos('center');
                setImageRatio('16/9');
                setErrorMsg('');
              }
            }}
            className="btn btn-primary"
          >
            {search || selectedCat !== 'all' ? 'Clear Filters' : 'Create Project'}
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {filtered.map((project) => {
            const { cleanUrl, fit: cardFit, position: cardPos, ratio: cardRatio } = parseThumbnailSettings(project.thumbnail_path);
            const thumbUrl = getThumbnailUrl(cleanUrl);
            return (
              <div key={project.id} className="project-card">
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '200px',
                    background: '#141414',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
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
                      <ImageIcon size={48} />
                    </div>
                  )}
                  {project.category && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        zIndex: 2,
                        background: 'rgba(0, 0, 0, 0.75)',
                        backdropFilter: 'blur(4px)',
                        color: '#3b82f6',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                      }}
                    >
                      {project.category}
                    </span>
                  )}
                  {thumbUrl && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        right: '10px',
                        zIndex: 2,
                        background: 'rgba(0, 0, 0, 0.75)',
                        backdropFilter: 'blur(4px)',
                        color: cardFit === 'contain' ? '#60a5fa' : '#a1a1aa',
                        fontSize: '0.675rem',
                        fontWeight: 600,
                        padding: '2px 7px',
                        borderRadius: '4px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      {cardFit === 'contain' ? 'Pas Penuh' : 'Cover'} • {cardRatio}
                    </span>
                  )}
                </div>

                <div className="project-content">
                  <div className="project-header">
                    <h3 className="project-title">{project.title}</h3>
                  </div>

                  {project.description && (
                    <p className="project-description">{project.description}</p>
                  )}

                  {project.tags && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      {project.tags.split(',').map((tag, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '0.7rem',
                            color: '#888888',
                            background: '#1a1a1a',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            border: '1px solid #282828',
                          }}
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="project-actions" style={{ display: 'flex', gap: '8px', paddingTop: '0.5rem', borderTop: '1px solid #222222' }}>
                    <button
                      type="button"
                      onClick={() => {
                        const parsed = parseThumbnailSettings(project.thumbnail_path);
                        setEditingProject(project);
                        setPreviewThumb(parsed.cleanUrl);
                        setImageFit(parsed.fit);
                        setImagePos(parsed.position);
                        setImageRatio(parsed.ratio);
                        setErrorMsg('');
                      }}
                      className="btn btn-secondary btn-small"
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(project.id)}
                      className="btn btn-danger btn-small"
                      style={{ justifyContent: 'center', padding: '0.5rem 0.75rem' }}
                      title="Delete Project"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE MODAL */}
      {isCreating && (
        <div className="modal active">
          <div className="modal-overlay" onClick={() => setIsCreating(false)} />
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Add New Project</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setIsCreating(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="project-form">
              {errorMsg && (
                <div className="error-message show" style={{ marginBottom: '1.25rem' }}>
                  <AlertCircle size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  {errorMsg}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="create-title" className="form-label">
                  Project Title *
                </label>
                <input
                  id="create-title"
                  name="title"
                  type="text"
                  required
                  placeholder="e.g. Modern Architecture Platform"
                  className="form-input"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="create-category" className="form-label">
                  Category *
                </label>
                <input
                  id="create-category"
                  name="category"
                  type="text"
                  required
                  placeholder="e.g. Web Development, UI/UX"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="create-description" className="form-label">
                  Description
                </label>
                <textarea
                  id="create-description"
                  name="description"
                  rows={3}
                  placeholder="Brief summary of the project..."
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label htmlFor="create-url" className="form-label">
                  Project URL
                </label>
                <input
                  id="create-url"
                  name="project_url"
                  type="url"
                  placeholder="https://example.com"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="create-tags" className="form-label">
                  Tags (comma-separated)
                </label>
                <input
                  id="create-tags"
                  name="tags"
                  type="text"
                  placeholder="React, Next.js, TypeScript"
                  className="form-input"
                />
              </div>

              {/* Modern Project Cover Uploader & Settings */}
              <ProjectCoverSettingsSection
                previewThumb={previewThumb}
                setPreviewThumb={setPreviewThumb}
                imageFit={imageFit}
                setImageFit={setImageFit}
                imagePos={imagePos}
                setImagePos={setImagePos}
                imageRatio={imageRatio}
                setImageRatio={setImageRatio}
                uploading={uploading}
                dragOver={dragOver}
                setDragOver={setDragOver}
                handleDrop={handleDrop}
                fileInputRef={fileInputRef}
                handleFileUpload={handleFileUpload}
              />

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingProject && (
        <div className="modal active">
          <div className="modal-overlay" onClick={() => setEditingProject(null)} />
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Edit Project</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setEditingProject(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="project-form">
              {errorMsg && (
                <div className="error-message show" style={{ marginBottom: '1.25rem' }}>
                  <AlertCircle size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  {errorMsg}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="edit-title" className="form-label">
                  Project Title *
                </label>
                <input
                  id="edit-title"
                  name="title"
                  type="text"
                  required
                  defaultValue={editingProject.title}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-category" className="form-label">
                  Category *
                </label>
                <input
                  id="edit-category"
                  name="category"
                  type="text"
                  required
                  defaultValue={editingProject.category || ''}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-description" className="form-label">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  rows={3}
                  defaultValue={editingProject.description || ''}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-url" className="form-label">
                  Project URL
                </label>
                <input
                  id="edit-url"
                  name="project_url"
                  type="url"
                  defaultValue={editingProject.project_url || ''}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-tags" className="form-label">
                  Tags (comma-separated)
                </label>
                <input
                  id="edit-tags"
                  name="tags"
                  type="text"
                  defaultValue={editingProject.tags || ''}
                  className="form-input"
                />
              </div>

              {/* Modern Project Cover Uploader & Settings */}
              <ProjectCoverSettingsSection
                previewThumb={previewThumb}
                setPreviewThumb={setPreviewThumb}
                imageFit={imageFit}
                setImageFit={setImageFit}
                imagePos={imagePos}
                setImagePos={setImagePos}
                imageRatio={imageRatio}
                setImageRatio={setImageRatio}
                uploading={uploading}
                dragOver={dragOver}
                setDragOver={setDragOver}
                handleDrop={handleDrop}
                fileInputRef={fileInputRef}
                handleFileUpload={handleFileUpload}
              />

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Updating...' : 'Update Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
