import React from 'react';
import { Palette, Sparkles, Layers, Box, Code2, Award } from 'lucide-react';
import type { Project } from '@/types';
import type { Language } from '@/lib/translations';
import {
  HtmlIcon,
  CssIcon,
  JavaScriptIcon,
  TailwindIcon,
  ReactIcon,
  ViteIcon,
  NodeJsIcon,
  BootstrapIcon,
  SupabaseIcon,
  MaterialUiIcon,
  VercelIcon,
  FigmaIcon,
  AntigravityIcon,
  CanvaIcon,
  PhotoshopIcon,
} from '@/components/TechStackIcons';

export interface CertificateItem {
  id: number;
  title: string;
  issuer: string;
  year: string;
  image: string;
}

export const DEFAULT_CERTIFICATES: CertificateItem[] = [
  {
    id: 1,
    title: 'Adobe Certified Professional — Visual Design',
    issuer: 'Adobe / Certiport',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1589330694653-dad6ef0140be?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Google UX Design Professional Specialization',
    issuer: 'Google Career Certificates',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Brand Identity & Commercial System Architecture',
    issuer: 'Design Masterclass Guild',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    title: 'Advanced Packaging Typography & Die-Lines',
    issuer: 'International Packaging Arts',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
  },
];

export const TECH_STACK_REF = [
  { name: 'HTML', icon: HtmlIcon },
  { name: 'CSS', icon: CssIcon },
  { name: 'JavaScript', icon: JavaScriptIcon },
  { name: 'Tailwind CSS', icon: TailwindIcon },
  { name: 'React', icon: ReactIcon },
  { name: 'Vite', icon: ViteIcon },
  { name: 'Node JS', icon: NodeJsIcon },
  { name: 'Bootstrap', icon: BootstrapIcon },
  { name: 'Supabase', icon: SupabaseIcon },
  { name: 'Material UI', icon: MaterialUiIcon },
  { name: 'Vercel', icon: VercelIcon },
  { name: 'Figma', icon: FigmaIcon },
  { name: 'Antigravity', icon: AntigravityIcon },
  { name: 'Canva', icon: CanvaIcon },
  { name: 'Adobe Photoshop', icon: PhotoshopIcon },
];

export const CREATIVE_TOOLS = [
  { name: 'Figma', category: 'UI/UX & Prototyping', desc: 'Design systems, interface layouts & vector workflows', icon: Palette },
  { name: 'Adobe Illustrator', category: 'Vector & Branding', desc: 'Custom logos, brand marks & packaging die-lines', icon: Sparkles },
  { name: 'Adobe Photoshop', category: 'Packaging & Retouch', desc: 'High-res mockup rendering & visual composites', icon: Layers },
  { name: 'Blender 3D', category: '3D Mockup', desc: 'Photorealistic 3D product & packaging visualization', icon: Box },
  { name: 'Next.js 16', category: 'Frontend Architecture', desc: 'Modern high-performance web experiences', icon: Code2 },
  { name: 'Tailwind CSS', category: 'Styling & Layout', desc: 'Pixel-perfect responsive design systems', icon: Layers },
  { name: 'Supabase', category: 'Backend & Cloud', desc: 'Serverless database, real-time storage & authentication', icon: Box },
  { name: 'Brand Strategy', category: 'Creative Direction', desc: 'Naming, positioning & market visual architecture', icon: Award },
];

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 101,
    title: 'Lumora — Aura Lighting Identity',
    description: 'Comprehensive brand identity and packaging architecture for next-generation smart ambient light studio.',
    category: 'Brand Identity',
    thumbnail_path: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
    ],
    project_url: 'https://behance.net',
    tags: 'Branding, Identity, Typography',
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 102,
    title: 'Kopi Senja — Cold Brew Packaging',
    description: 'Sustainable minimalist glass bottles and foil-stamped carton boxes designed for artisanal coffee brew.',
    category: 'Package Design',
    thumbnail_path: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=1200&q=80',
    ],
    project_url: 'https://behance.net',
    tags: 'Packaging, Sustainable, Print',
    created_at: '2025-02-10T00:00:00Z',
    updated_at: '2025-02-10T00:00:00Z',
  },
  {
    id: 103,
    title: 'Finlyst — Global Fintech System',
    description: 'Visual language, design system, and editorial collateral for modern wealth management platform.',
    category: 'Brand Identity',
    thumbnail_path: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    ],
    project_url: 'https://behance.net',
    tags: 'Visual System, Fintech, UI/UX',
    created_at: '2025-03-05T00:00:00Z',
    updated_at: '2025-03-05T00:00:00Z',
  },
  {
    id: 104,
    title: 'Nusa Skincare — Botanical Care',
    description: 'Frosted matte jars and eco-friendly recyclable cosmetic packaging inspired by Indonesian flora.',
    category: 'Package Design',
    thumbnail_path: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
    ],
    project_url: 'https://behance.net',
    tags: 'Cosmetics, Eco-friendly, Foil',
    created_at: '2025-03-12T00:00:00Z',
    updated_at: '2025-03-12T00:00:00Z',
  },
];

export const MARQUEE_ITEMS = [
  'Brand Identity',
  'Packaging Design',
  'Visual Systems',
  '3D Mockup & Renders',
  'Adobe Photoshop',
  'Figma UI/UX',
  'Creative Direction',
  'Next.js & Frontend',
  'Editorial Design',
  'Logo Architecture',
];

export interface WaPromptItem {
  id: string;
  icon: string;
  label: { id: string; en: string };
  message: { id: string; en: string };
}

export const WA_CONCIERGE_PROMPTS: WaPromptItem[] = [
  {
    id: 'brand',
    icon: '🎨',
    label: { id: 'Brand Identity & Logo', en: 'Brand Identity & Logo' },
    message: {
      id: 'Halo SEZKY Studio! Saya tertarik untuk konsultasi pembuatan Brand Identity & Logo bisnis saya.',
      en: 'Hi SEZKY Studio! I would like to consult on Brand Identity & Logo design for my business.',
    },
  },
  {
    id: 'packaging',
    icon: '📦',
    label: { id: 'Desain Packaging & Label', en: 'Packaging & Label Design' },
    message: {
      id: 'Halo SEZKY Studio! Saya ingin membuat desain kemasan/packaging produk baru. Boleh info detail proses & portofolionya?',
      en: 'Hi SEZKY Studio! I am planning a new product packaging/label design. Could you share process details & portfolio?',
    },
  },
  {
    id: '3d',
    icon: '🧊',
    label: { id: '3D Mockup Produk', en: '3D Product Mockup' },
    message: {
      id: 'Halo SEZKY Studio! Saya butuh visualisasi 3D mockup photorealistic untuk kebutuhan presentasi produk.',
      en: 'Hi SEZKY Studio! I need photorealistic 3D mockup visualizations for my product presentation.',
    },
  },
  {
    id: 'urgent',
    icon: '⚡',
    label: { id: 'Proyek Urgent (Fast-Track)', en: 'Urgent Project (Fast-Track)' },
    message: {
      id: 'Halo SEZKY Studio! Saya punya kebutuhan proyek desain dengan deadline mendesak (1-2 minggu). Apakah saat ini ada slot kosong?',
      en: 'Hi SEZKY Studio! I have a design project with an urgent timeline (1-2 weeks). Do you currently have available slots?',
    },
  },
  {
    id: 'pricing',
    icon: '💰',
    label: { id: 'Tanya Pricelist & Estimasi', en: 'Pricing & Rate Card' },
    message: {
      id: 'Halo SEZKY Studio! Boleh minta info rate card atau perkiraan biaya untuk project desain grafis?',
      en: 'Hi SEZKY Studio! Could you please share the rate card or pricing estimate for graphic design projects?',
    },
  },
];

export function customStyle(vars: Record<string, string | number>): React.CSSProperties {
  return vars as unknown as React.CSSProperties;
}

export type ImageFitMode = 'cover' | 'contain';
export type ImagePositionMode = 'center' | 'top' | 'bottom';
export type ImageRatioMode = '16/9' | '4/3' | '1/1' | '3/4' | '4/5';

export interface ThumbnailSettings {
  raw: string;
  cleanUrl: string;
  displayUrl: string;
  fit: ImageFitMode;
  position: ImagePositionMode;
  ratio: ImageRatioMode;
}

export function parseThumbnailSettings(rawPath: string | null | undefined): ThumbnailSettings {
  if (!rawPath) {
    return {
      raw: '',
      cleanUrl: '',
      displayUrl: '',
      fit: 'cover',
      position: 'center',
      ratio: '16/9',
    };
  }

  const hashIndex = rawPath.indexOf('#');
  const cleanUrl = hashIndex !== -1 ? rawPath.substring(0, hashIndex).trim() : rawPath.trim();
  let fit: ImageFitMode = 'cover';
  let position: ImagePositionMode = 'center';
  let ratio: ImageRatioMode = '16/9';

  if (hashIndex !== -1) {
    const hashStr = rawPath.substring(hashIndex + 1);
    try {
      const params = new URLSearchParams(hashStr);
      const f = params.get('fit');
      if (f === 'contain' || f === 'cover') fit = f;
      const p = params.get('pos');
      if (p === 'center' || p === 'top' || p === 'bottom') position = p;
      const r = params.get('ratio');
      if (r === '16/9' || r === '4/3' || r === '1/1' || r === '3/4' || r === '4/5') ratio = r;
    } catch {
      // ignore
    }
  }

  return {
    raw: rawPath,
    cleanUrl,
    displayUrl: getThumbnailUrl(cleanUrl) || '',
    fit,
    position,
    ratio,
  };
}

export function buildThumbnailPath(
  cleanUrl: string,
  settings: {
    fit?: ImageFitMode;
    position?: ImagePositionMode;
    ratio?: ImageRatioMode;
  } = {}
): string {
  if (!cleanUrl) return '';
  const urlOnly = cleanUrl.split('#')[0].trim();
  if (!urlOnly) return '';

  const fit = settings.fit || 'cover';
  const position = settings.position || 'center';
  const ratio = settings.ratio || '16/9';

  return `${urlOnly}#fit=${fit}&pos=${position}&ratio=${encodeURIComponent(ratio)}`;
}

export function getThumbnailUrl(path: string | null) {
  if (!path) return null;
  const clean = path.split('#')[0].trim();
  if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
  if (clean.startsWith('uploads/')) return `/${clean}`;
  return `/uploads/${clean}`;
}

export function getDisplayUrl(title: string, rawUrl?: string | null): string {
  if (rawUrl) {
    try {
      const u = new URL(rawUrl);
      const host = u.hostname.replace(/^www\./, '');
      const path = u.pathname !== '/' ? u.pathname : '';
      return `${host}${path}`;
    } catch {
      // ignore
    }
  }
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `sezky.studio/${slug}`;
}

export function getAvatarGradient(name: string): string {
  const gradients = [
    'linear-gradient(135deg, #cf8047 0%, #9a3412 100%)',
    'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)',
    'linear-gradient(135deg, #8b5cf6 0%, #4338ca 100%)',
  ];
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return gradients[sum % gradients.length];
}

export function formatRelativeTime(dateString: string, lang: Language): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (isNaN(diffSec) || diffSec < 0) return lang === 'id' ? 'baru saja' : 'just now';
    if (diffSec < 60) return lang === 'id' ? 'baru saja' : 'just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}${lang === 'id' ? 'm yang lalu' : 'm ago'}`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}${lang === 'id' ? 'j yang lalu' : 'h ago'}`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}${lang === 'id' ? 'h yang lalu' : 'd ago'}`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths}${lang === 'id' ? 'bln yang lalu' : 'mo ago'}`;
    return `${Math.floor(diffMonths / 12)}${lang === 'id' ? 'thn yang lalu' : 'y ago'}`;
  } catch {
    return dateString;
  }
}

export function playUISound(type: 'click' | 'switch' | 'toggle' | 'success') {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.035);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      osc.start(now);
      osc.stop(now + 0.035);
    } else if (type === 'switch') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(720, now + 0.05);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'toggle') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.07);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.start(now);
      osc.stop(now + 0.07);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.07);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    }
  } catch {
    // audio context blocked by browser policy until gesture
  }
}

