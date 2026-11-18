import { describe, it, expect } from 'vitest';
import {
  getThumbnailUrl,
  getDisplayUrl,
  getAvatarGradient,
  formatRelativeTime,
  parseThumbnailSettings,
  buildThumbnailPath,
  DEFAULT_PROJECTS,
  DEFAULT_CERTIFICATES,
} from '@/lib/portfolio-data';
import { SITE_CONFIG } from '@/lib/site-config';

describe('portfolio-data utilities & defaults', () => {
  it('resolves thumbnail URLs properly', () => {
    expect(getThumbnailUrl(null)).toBeNull();
    expect(getThumbnailUrl('https://example.com/img.png')).toBe('https://example.com/img.png');
    expect(getThumbnailUrl('uploads/banner.jpg')).toBe('/uploads/banner.jpg');
    expect(getThumbnailUrl('banner.jpg')).toBe('/uploads/banner.jpg');
    expect(getThumbnailUrl('https://example.com/img.png#fit=contain')).toBe('https://example.com/img.png');
  });

  it('parses and builds thumbnail display settings with hash parameters', () => {
    const raw = buildThumbnailPath('https://example.com/flyer.png', {
      fit: 'contain',
      position: 'top',
      ratio: '4/5',
    });
    expect(raw).toBe('https://example.com/flyer.png#fit=contain&pos=top&ratio=4%2F5');

    const parsed = parseThumbnailSettings(raw);
    expect(parsed.cleanUrl).toBe('https://example.com/flyer.png');
    expect(parsed.fit).toBe('contain');
    expect(parsed.position).toBe('top');
    expect(parsed.ratio).toBe('4/5');

    const fallback = parseThumbnailSettings('https://example.com/legacy.png');
    expect(fallback.fit).toBe('cover');
    expect(fallback.position).toBe('center');
    expect(fallback.ratio).toBe('16/9');
  });

  it('formats display URLs cleanly from raw URLs or project titles', () => {
    expect(getDisplayUrl('Lumora Brand', 'https://www.behance.net/sezkyzxz')).toBe('behance.net/sezkyzxz');
    expect(getDisplayUrl('Kopi Senja — Packaging', null)).toBe('sezky.studio/kopi-senja-packaging');
  });

  it('returns deterministic avatar gradients for guestbook names', () => {
    const g1 = getAvatarGradient('Xenn');
    const g2 = getAvatarGradient('Xenn');
    expect(g1).toContain('linear-gradient');
    expect(g1).toBe(g2);
  });

  it('formats relative time in both Indonesian and English', () => {
    const justNow = new Date(Date.now() - 10 * 1000).toISOString();
    expect(formatRelativeTime(justNow, 'id')).toBe('baru saja');
    expect(formatRelativeTime(justNow, 'en')).toBe('just now');
  });

  it('contains valid default projects, certificates, and site config', () => {
    expect(DEFAULT_PROJECTS.length).toBeGreaterThan(0);
    expect(DEFAULT_CERTIFICATES.length).toBeGreaterThan(0);
    expect(SITE_CONFIG.email).toContain('@');
  });
});

