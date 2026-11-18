'use client';

import React, { useEffect, useRef, useState } from 'react';
import AOS from 'aos';
import SvgSprite from './SvgSprite';
import PageLoader from './PageLoader';
import type { Project, Comment } from '@/types';
import {
  ArrowUpRight,
  FileText,
  Code2,
  Briefcase,
  GraduationCap,
  Mail,
  MessageSquare,
  MessageCircle,
  Send,
  CheckCircle2,
  Sparkles,
  Phone,
  Compass,
  User,
  Layers,
  Palette,
  Package2,
  Box,
  Boxes,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Award,
  Maximize2,
  X,
  Globe,
  Volume2,
  VolumeX,
  Camera,
  Trash2,
  Image as ImageIcon,
  Pin,
  ShieldCheck,
  Search,
  ChevronLeft,
  ChevronRight,
  Star,
  Copy,
  Check,
} from 'lucide-react';
import { SITE_CONFIG, type SiteConfig } from '@/lib/site-config';
import { translations, type Language } from '@/lib/translations';
import {
  type CertificateItem,
  DEFAULT_CERTIFICATES,
  TECH_STACK_REF,
  CREATIVE_TOOLS,
  DEFAULT_PROJECTS,
  MARQUEE_ITEMS,
  WA_CONCIERGE_PROMPTS,
  customStyle,
  getThumbnailUrl,
  parseThumbnailSettings,
  getDisplayUrl,
  getAvatarGradient,
  formatRelativeTime,
  playUISound,
} from '@/lib/portfolio-data';
import {
  WhatsAppIcon,
  DiscordIcon,
  InstagramIcon,
  BehanceIcon,
  LinkedInIcon,
  GitHubIcon,
  GmailIcon,
  PdfIcon,
} from './SocialIcons';

const DEFAULT_CONFIG: SiteConfig = SITE_CONFIG;
export type { CertificateItem };

export default function PortfolioExperience() {
  // Clock state
  const [timeStr, setTimeStr] = useState('9:41am');
  const [dateStr, setDateStr] = useState('12 March, 2025');

  // Language Switcher state (Bilingual EN / ID)
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedLang = (localStorage.getItem('sezkyzxz_lang') || localStorage.getItem('sezky_lang')) as Language;
        if (savedLang === 'en' || savedLang === 'id') return savedLang;
      } catch {}
    }
    return 'en';
  });

  // Sound FX State
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedSound = localStorage.getItem('sezkyzxz_sound_fx') || localStorage.getItem('sezky_sound_fx');
        return savedSound === 'true';
      } catch {}
    }
    return false;
  });

  // Global Ambient Spotlight cursor coordinates
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [mouseActive, setMouseActive] = useState(false);

  // Floating WhatsApp Concierge state
  const [waTooltipOpen, setWaTooltipOpen] = useState(true);
  const [waConciergeOpen, setWaConciergeOpen] = useState(false);
  const [waConciergeMsg, setWaConciergeMsg] = useState('');
  const [waHasInteracted, setWaHasInteracted] = useState(false);
  const waConciergeRef = useRef<HTMLDivElement>(null);
  const waTriggerRef = useRef<HTMLButtonElement>(null);
  const waBodyRef = useRef<HTMLDivElement>(null);

  // Focus card when opened so it immediately receives keyboard/scroll focus without needing a click
  useEffect(() => {
    if (waConciergeOpen) {
      waConciergeRef.current?.focus({ preventScroll: true });
    }
  }, [waConciergeOpen]);

  // Close WhatsApp concierge on outside click or Escape key
  useEffect(() => {
    if (!waConciergeOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        waConciergeRef.current &&
        !waConciergeRef.current.contains(e.target as Node) &&
        waTriggerRef.current &&
        !waTriggerRef.current.contains(e.target as Node)
      ) {
        setWaConciergeOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setWaConciergeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [waConciergeOpen]);

  const handleSendWhatsAppConcierge = (presetMsg?: string) => {
    const raw = (presetMsg !== undefined ? presetMsg : waConciergeMsg).trim();
    const textToSend = raw || (lang === 'id'
      ? 'Halo SEZKY Studio, saya tertarik untuk diskusi proyek desain.'
      : 'Hello SEZKY Studio, I would like to discuss a design project.');

    if (soundEnabled) playUISound('click');
    const waUrl = `https://wa.me/${DEFAULT_CONFIG.whatsapp}?text=${encodeURIComponent(textToSend)}`;
    window.open(waUrl, '_blank');
  };


  // Ambient mouse spotlight listener
  useEffect(() => {
    let frameId: number;
    const handleMove = (e: MouseEvent) => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
        if (!mouseActive) setMouseActive(true);
      });
    };
    const handleLeave = () => setMouseActive(false);

    window.addEventListener('mousemove', handleMove, { passive: true });
    document.body.addEventListener('mouseleave', handleLeave);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.body.removeEventListener('mouseleave', handleLeave);
      cancelAnimationFrame(frameId);
    };
  }, [mouseActive]);

  const switchLanguage = (newLang: Language) => {
    if (soundEnabled) playUISound('switch');
    setLang(newLang);
    try {
      localStorage.setItem('sezky_lang', newLang);
    } catch {
      // ignore
    }
  };

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (nextState) {
      playUISound('toggle');
    }
    try {
      localStorage.setItem('sezky_sound_fx', String(nextState));
    } catch {
      // ignore
    }
  };

  const t = translations[lang];

  // Carousel in hero card
  const [cardIdx, setCardIdx] = useState(0);
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapDir, setSwapDir] = useState<number>(1);

  // Modals & Nav
  const [navOpen, setNavOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formSending, setFormSending] = useState(false);
  const [formError, setFormError] = useState('');

  // Active Nav Pill State (matching Image 2)
  const [activeNav, setActiveNav] = useState<'home' | 'about' | 'portfolio' | 'contact'>('home');

  // Projects & Filter
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectsFailed, setProjectsFailed] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  // Reference Tabs: 'projects' | 'certificates' | 'tech-stack'
  const [portfolioTab, setPortfolioTab] = useState<'projects' | 'certificates' | 'tech-stack'>('projects');
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateItem | null>(null);
  const [showAllCerts, setShowAllCerts] = useState(false);

  // Command Palette State (Ctrl + K)
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [cmdSearchQuery, setCmdSearchQuery] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Project Brief Estimator States
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string>('');
  const [selectedTimeline, setSelectedTimeline] = useState<string>('');

  const toggleService = (srv: string) => {
    if (soundEnabled) playUISound('click');
    setSelectedServices((prev) =>
      prev.includes(srv) ? prev.filter((s) => s !== srv) : [...prev, srv]
    );
  };

  // Dynamic Testimonials (from Supabase Database or fallback to default sample reviews)
  const dbTestimonials = projects.filter((p) => p.category?.trim() === 'Testimonial');
  const activeTestimonialsList =
    dbTestimonials.length > 0
      ? dbTestimonials.map((item) => {
        let projectTag: string | undefined = undefined;
        let rating = 5;
        if (item.project_url) {
          if (item.project_url.includes(':::')) {
            const [t, r] = item.project_url.split(':::');
            projectTag = t.trim() || undefined;
            const parsedRating = Number(r);
            rating = isNaN(parsedRating) ? 5 : parsedRating;
          } else {
            projectTag = item.project_url.trim() || undefined;
          }
        }
        return {
          name: item.title,
          role: item.tags || 'Client',
          quote: item.description || '',
          photo: getThumbnailUrl(item.thumbnail_path) || undefined,
          projectTag,
          rating,
          initials:
            item.title
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase() || 'CL',
        };
      })
      : t.testimonials.items;

  // Testimonials Interactive Carousel Slider State & Gestures (matching Figma Image 2)
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [testimonialDragStart, setTestimonialDragStart] = useState<number | null>(null);
  const [testimonialDragOffset, setTestimonialDragOffset] = useState<number>(0);
  const [isTestimonialDragging, setIsTestimonialDragging] = useState(false);
  const [isTestimonialHovered, setIsTestimonialHovered] = useState(false);

  const handlePrevTestimonial = () => {
    if (soundEnabled) playUISound('click');
    setActiveTestimonial((prev) => (prev > 0 ? prev - 1 : activeTestimonialsList.length - 1));
  };

  const handleNextTestimonial = () => {
    if (soundEnabled) playUISound('click');
    setActiveTestimonial((prev) => (prev < activeTestimonialsList.length - 1 ? prev + 1 : 0));
  };

  const handleSelectTestimonial = (index: number) => {
    if (soundEnabled) playUISound('click');
    setActiveTestimonial(index);
  };

  const handleTestimonialTouchStart = (e: React.TouchEvent) => {
    setTestimonialDragStart(e.touches[0].clientX);
    setIsTestimonialDragging(true);
    setTestimonialDragOffset(0);
  };

  const handleTestimonialTouchMove = (e: React.TouchEvent) => {
    if (testimonialDragStart === null) return;
    const diff = e.touches[0].clientX - testimonialDragStart;
    setTestimonialDragOffset(diff);
  };

  const handleTestimonialTouchEnd = () => {
    if (testimonialDragStart !== null) {
      if (testimonialDragOffset < -40) {
        handleNextTestimonial();
      } else if (testimonialDragOffset > 40) {
        handlePrevTestimonial();
      }
    }
    setTestimonialDragStart(null);
    setTestimonialDragOffset(0);
    setIsTestimonialDragging(false);
  };

  const handleTestimonialMouseDown = (e: React.MouseEvent) => {
    setTestimonialDragStart(e.clientX);
    setIsTestimonialDragging(true);
    setTestimonialDragOffset(0);
  };

  const handleTestimonialMouseMove = (e: React.MouseEvent) => {
    if (!isTestimonialDragging || testimonialDragStart === null) return;
    const diff = e.clientX - testimonialDragStart;
    setTestimonialDragOffset(diff);
  };

  const handleTestimonialMouseUp = () => {
    if (isTestimonialDragging && testimonialDragStart !== null) {
      if (testimonialDragOffset < -40) {
        handleNextTestimonial();
      } else if (testimonialDragOffset > 40) {
        handlePrevTestimonial();
      }
    }
    setTestimonialDragStart(null);
    setTestimonialDragOffset(0);
    setIsTestimonialDragging(false);
  };

  const handleTestimonialMouseLeave = () => {
    if (isTestimonialDragging) {
      handleTestimonialMouseUp();
    }
  };

  useEffect(() => {
    if (isTestimonialHovered || isTestimonialDragging || activeTestimonialsList.length <= 1) return;
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % activeTestimonialsList.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [isTestimonialHovered, isTestimonialDragging, activeTestimonialsList.length]);

  // In-page Contact Form states (connected to /api/contact)
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSending, setContactSending] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactError, setContactError] = useState('');

  const handleDirectContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      setContactError(lang === 'id' ? 'Harap lengkapi semua bidang.' : 'Please fill in all required fields.');
      return;
    }
    setContactSending(true);
    setContactError('');
    try {
      const briefSummary = [
        selectedServices.length > 0 ? `[LAYANAN]: ${selectedServices.join(', ')}` : '',
        selectedBudget ? `[BUDGET]: ${selectedBudget}` : '',
        selectedTimeline ? `[TIMELINE]: ${selectedTimeline}` : '',
        '',
        contactMessage.trim(),
      ].filter(Boolean).join('\n');

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: briefSummary,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (lang === 'id' ? 'Gagal mengirim pesan.' : 'Failed to send message.'));
      }
      if (soundEnabled) playUISound('success');
      setContactSent(true);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setSelectedServices([]);
      setSelectedBudget('');
      setSelectedTimeline('');
    } catch (err: unknown) {
      setContactError(err instanceof Error ? err.message : (lang === 'id' ? 'Terjadi kesalahan saat mengirim pesan.' : 'An error occurred while sending the message.'));
    } finally {
      setContactSending(false);
    }
  };

  const getWhatsAppBriefUrl = () => {
    const parts = [
      lang === 'id' ? 'Halo SEZKY Studio, saya ingin konsultasi proyek desain:' : 'Hello SEZKY Studio, I would like to discuss a design project:',
      contactName ? `• Nama: ${contactName}` : '',
      contactEmail ? `• Email: ${contactEmail}` : '',
      selectedServices.length > 0 ? `• Layanan: ${selectedServices.join(', ')}` : '',
      selectedBudget ? `• Budget: ${selectedBudget}` : '',
      selectedTimeline ? `• Timeline: ${selectedTimeline}` : '',
      contactMessage ? `• Keterangan: ${contactMessage}` : '',
    ].filter(Boolean).join('\n');
    return `https://wa.me/${DEFAULT_CONFIG.whatsapp}?text=${encodeURIComponent(parts)}`;
  };

  // Public Comments (Guestbook) States
  const [comments, setComments] = useState<Comment[]>([]);
  const [, setLoadingComments] = useState(true);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentAvatar, setCommentAvatar] = useState<string | null>(null);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [commentError, setCommentError] = useState('');
  const commentFileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch comments on mount
  useEffect(() => {
    let isMounted = true;
    const fetchComments = async () => {
      try {
        const res = await fetch('/api/comments');
        if (!res.ok) return;
        const json = await res.json();
        if (isMounted && Array.isArray(json.data)) {
          setComments(json.data);
        }
      } catch {
        // ignore
      } finally {
        if (isMounted) setLoadingComments(false);
      }
    };
    fetchComments();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setCommentError(lang === 'id' ? 'Ukuran file foto maksimal 10MB' : 'Photo size must be under 10MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const rawDataUrl = reader.result;
        const img = new Image();
        img.onload = () => {
          try {
            // Compress and center-crop to 256x256 square for optimal quality & tiny payload (~25KB)
            const canvas = document.createElement('canvas');
            const maxDim = 256;
            const width = img.width;
            const height = img.height;
            const minSide = Math.min(width, height);
            const startX = (width - minSide) / 2;
            const startY = (height - minSide) / 2;

            canvas.width = maxDim;
            canvas.height = maxDim;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              ctx.drawImage(img, startX, startY, minSide, minSide, 0, 0, maxDim, maxDim);
              const compressed = canvas.toDataURL('image/jpeg', 0.85);
              setCommentAvatar(compressed);
              setCommentError('');
            } else {
              setCommentAvatar(rawDataUrl);
              setCommentError('');
            }
          } catch {
            setCommentAvatar(rawDataUrl);
            setCommentError('');
          }
        };
        img.onerror = () => {
          setCommentError(lang === 'id' ? 'Format gambar tidak valid' : 'Invalid image format');
        };
        img.src = rawDataUrl;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) {
      setCommentError(lang === 'id' ? 'Nama dan komentar wajib diisi.' : 'Name and comment are required.');
      return;
    }
    setCommentSubmitting(true);
    setCommentError('');
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: commentName.trim(),
          comment: commentText.trim(),
          avatar_url: commentAvatar || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t.comments.error);
      }
      if (data.data) {
        setComments((prev) => [data.data, ...prev]);
      }
      setCommentSuccess(true);
      setCommentName('');
      setCommentText('');
      setCommentAvatar(null);
      if (commentFileInputRef.current) {
        commentFileInputRef.current.value = '';
      }
      if (soundEnabled) playUISound('success');
      setTimeout(() => setCommentSuccess(false), 5000);
    } catch (err: unknown) {
      setCommentError(err instanceof Error ? err.message : t.comments.error);
    } finally {
      setCommentSubmitting(false);
    }
  };

  const [, setIntroReady] = useState(false);

  const lenisRef = useRef<{ scrollTo: (top: number, opts: { duration: number }) => void; destroy: () => void; raf: (time: number) => void } | null>(null);
  const heroBoxRef = useRef<HTMLDivElement | null>(null);
  const revealRef = useRef<HTMLDivElement | null>(null);
  const haloRef = useRef<HTMLDivElement | null>(null);
  const projectsSliderRef = useRef<HTMLDivElement | null>(null);
  const certsSliderRef = useRef<HTMLDivElement | null>(null);

  const scrollProjectsSlider = (dir: 'left' | 'right') => {
    if (projectsSliderRef.current) {
      const scrollAmount = projectsSliderRef.current.clientWidth * 0.85;
      projectsSliderRef.current.scrollBy({
        left: dir === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollCertsSlider = (dir: 'left' | 'right') => {
    if (certsSliderRef.current) {
      const scrollAmount = certsSliderRef.current.clientWidth * 0.85;
      certsSliderRef.current.scrollBy({
        left: dir === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // 0. Adaptive Grid scale-up above 1920px (from Lumora spec)
  useEffect(() => {
    function applyAdaptiveGrid() {
      const FONT_BASE = 16;
      const baseWidth = 1920;
      const coef = 0.6666;
      const w = window.innerWidth;
      const widthReduction = ((baseWidth - w) / baseWidth) * 100;
      const size = FONT_BASE - (FONT_BASE * (widthReduction * coef)) / 100;
      if (size > FONT_BASE) {
        document.documentElement.style.fontSize = `${size}px`;
      } else {
        document.documentElement.style.removeProperty('font-size');
      }
    }
    applyAdaptiveGrid();
    window.addEventListener('resize', applyAdaptiveGrid);
    return () => window.removeEventListener('resize', applyAdaptiveGrid);
  }, []);

  // Global Shortcut for Command Palette (Ctrl + K / Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 0.0. Global Escape key handler & Body scroll locking for modals
  useEffect(() => {
    const isAnyModalOpen = Boolean(selectedProject || selectedCertificate || modalOpen || navOpen || cmdPaletteOpen);
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (cmdPaletteOpen) setCmdPaletteOpen(false);
        else if (selectedCertificate) setSelectedCertificate(null);
        else if (selectedProject) setSelectedProject(null);
        else if (modalOpen) setModalOpen(false);
        else if (navOpen) setNavOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedProject, selectedCertificate, modalOpen, navOpen, cmdPaletteOpen]);


  // 1. Clock
  useEffect(() => {
    const MONTHS = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    function updateClock() {
      const d = new Date();
      const h = d.getHours();
      const m = String(d.getMinutes()).padStart(2, '0');
      const tm = `${h % 12 || 12}:${m}${h < 12 ? 'am' : 'pm'}`;
      setTimeStr(tm);
      setDateStr(`${d.getDate()} ${MONTHS[d.getMonth()]}, ${d.getFullYear()}`);
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // 1.1 Scroll-spy for Navbar Active Pill (matching Image 2)
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 280;
      const contactEl = document.getElementById('contact');
      const worksEl = document.getElementById('works');
      const aboutEl = document.getElementById('about');

      if (contactEl && scrollPos >= contactEl.offsetTop) {
        setActiveNav('contact');
      } else if (worksEl && scrollPos >= worksEl.offsetTop) {
        setActiveNav('portfolio');
      } else if (aboutEl && scrollPos >= aboutEl.offsetTop) {
        setActiveNav('about');
      } else {
        setActiveNav('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Lenis smooth scroll & scroll to section
  useEffect(() => {
    let active = true;
    import('lenis').then(({ default: Lenis }) => {
      if (!active) return;
      const lenis = new Lenis({ smoothWheel: true });
      lenisRef.current = lenis;

      lenis.on('scroll', () => {
        AOS.refresh();
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }).catch(() => {
      // Native scrolling fallback
    });

    return () => {
      active = false;
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);

  const scrollTo = (id: string) => {
    if (navOpen) setNavOpen(false);
    const el = document.getElementById(id);
    if (!el && id !== 'home') return;
    const top = id === 'home' || !el ? 0 : el.getBoundingClientRect().top + window.pageYOffset;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(top, { duration: 1.1 });
    } else {
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  // 3. AOS Animation on Scroll (fade-up scroll reveal matching reference site)
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      offset: 60,
      easing: 'ease-out-cubic',
      mirror: true,
      delay: 50,
    });

    const timer = setTimeout(() => {
      AOS.refresh();
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      AOS.refresh();
    }, 100);
    return () => clearTimeout(timer);
  }, [portfolioTab, projects, showAllProjects, showAllCerts, activeCategory]);

  // 4. Hero card carousel controls
  const nextCard = (step: number) => {
    if (isSwapping) return;
    setIsSwapping(true);
    setSwapDir(step);
    setTimeout(() => {
      setCardIdx((prev) => (prev + step + t.hero.carousel.length) % t.hero.carousel.length);
      setTimeout(() => setIsSwapping(false), 200);
    }, 200);
  };

  // 5. Interactive liquid spotlight reveal & ambient lens halo (100% pixel-perfect precision)
  useEffect(() => {
    const box = heroBoxRef.current;
    const reveal = revealRef.current;
    const halo = haloRef.current;
    if (!box || !reveal) return;

    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;
    let isHovering = false;
    let animFrame: number;

    const onPointerMove = (e: PointerEvent | MouseEvent) => {
      const rect = box.getBoundingClientRect();
      const inBox =
        e.clientX >= rect.left - 40 &&
        e.clientX <= rect.right + 40 &&
        e.clientY >= rect.top - 40 &&
        e.clientY <= rect.bottom + 40;

      if (inBox) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (!isHovering) {
          isHovering = true;
          currentX = x;
          currentY = y;
          reveal.style.opacity = '1';
          if (halo) halo.style.opacity = '1';
        }
        targetX = x;
        targetY = y;
      } else if (isHovering) {
        isHovering = false;
        reveal.style.opacity = '0';
        if (halo) halo.style.opacity = '0';
      }
    };

    const onPointerLeave = () => {
      isHovering = false;
      reveal.style.opacity = '0';
      if (halo) halo.style.opacity = '0';
    };

    // Smooth render tick (spring / lerp)
    const SPOTLIGHT_RADIUS = 280; // 280px radius (560px diameter) smooth feathered reveal
    function tick() {
      if (isHovering) {
        currentX += (targetX - currentX) * 0.16;
        currentY += (targetY - currentY) * 0.16;

        if (reveal) {
          const mask = `radial-gradient(circle ${SPOTLIGHT_RADIUS}px at ${currentX}px ${currentY}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.2) 68%, transparent 100%)`;
          reveal.style.webkitMaskImage = mask;
          reveal.style.maskImage = mask;
        }

        if (halo) {
          halo.style.left = `${currentX}px`;
          halo.style.top = `${currentY}px`;
        }
      }

      animFrame = requestAnimationFrame(tick);
    }

    animFrame = requestAnimationFrame(tick);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    box.addEventListener('mouseleave', onPointerLeave);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('mousemove', onPointerMove);
      box.removeEventListener('mouseleave', onPointerLeave);
    };
  }, []);

  // 6. Fetch Projects from /api/projects
  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch('/api/projects');
        const json = await res.json();
        if (json.success && Array.isArray(json.data?.projects) && json.data.projects.length > 0) {
          setProjects(json.data.projects);
          setProjectsFailed(false);
        } else {
          // Fallback to sample projects so the showcase is never blank
          setProjects(DEFAULT_PROJECTS);
          setProjectsFailed(false);
        }
      } catch (err) {
        console.error('Failed to load projects, using fallback samples:', err);
        setProjects(DEFAULT_PROJECTS);
        setProjectsFailed(false);
      } finally {
        setLoadingProjects(false);
      }
    }
    loadProjects();
  }, []);

  const portfolioProjects = projects.filter((p) => p.category?.trim() !== 'Certificate' && p.category?.trim() !== 'Testimonial');
  const dbCertificates = projects.filter((p) => p.category?.trim() === 'Certificate');

  const categories = Array.from(
    new Set(portfolioProjects.map((p) => p.category?.trim()).filter(Boolean) as string[])
  );

  const filteredProjects =
    activeCategory === 'all'
      ? portfolioProjects
      : portfolioProjects.filter((p) => p.category?.trim() === activeCategory);

  const activeCertificates: CertificateItem[] =
    dbCertificates.length > 0
      ? dbCertificates.map((c) => ({
        id: c.id,
        title: c.title,
        issuer: c.description || 'Lembaga Terverifikasi',
        year: c.tags || '2024',
        image: getThumbnailUrl(c.thumbnail_path) || '/assets/images/placeholder.svg',
      }))
      : DEFAULT_CERTIFICATES;


  // 8. Contact form submission
  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const website = String(formData.get('website') || '');

    setFormError('');
    if (!name || !email || !message) {
      setFormError('Please fill in all fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (message.length < 10) {
      setFormError('Please write a message with at least 10 characters.');
      return;
    }

    setFormSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, website }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFormSent(true);
      } else {
        setFormError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setFormError("Couldn't send your message right now. Please try again later.");
    } finally {
      setFormSending(false);
    }
  };

  return (
    <>
      <SvgSprite />
      <PageLoader onComplete={() => setIntroReady(true)} />
      {/* AMBIENT MOUSE SPOTLIGHT FOLLOWER */}
      {mouseActive && (
        <div
          className="ambient-spotlight-pointer"
          aria-hidden="true"
          style={{
            transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
          }}
        />
      )}
      <a className="skip" href="#main">
        {t.nav.skip}
      </a>

      {/* HEADER */}
      <header className="hd rv in" style={customStyle({ '--y': '-14px', '--d': '150ms' })}>
        <div className="shell hd-in">
          <button className="brand" type="button" onClick={() => scrollTo('home')} aria-label="SEZKY home">
            <svg className="i">
              <use href="#logo" />
            </svg>
            <span className="brand-text">SEZKY</span>
          </button>

          <nav className="nav-capsule" aria-label="Primary">
            <ul className="nav-pill-list">
              <li>
                <button
                  type="button"
                  className={`nav-pill-btn ${activeNav === 'home' ? 'active' : ''}`}
                  onClick={() => {
                    if (soundEnabled) playUISound('click');
                    setActiveNav('home');
                    scrollTo('home');
                  }}
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`nav-pill-btn ${activeNav === 'about' ? 'active' : ''}`}
                  onClick={() => {
                    if (soundEnabled) playUISound('click');
                    setActiveNav('about');
                    scrollTo('about');
                  }}
                >
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`nav-pill-btn ${activeNav === 'portfolio' ? 'active' : ''}`}
                  onClick={() => {
                    if (soundEnabled) playUISound('click');
                    setActiveNav('portfolio');
                    scrollTo('works');
                  }}
                >
                  {t.nav.portfolio}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`nav-pill-btn ${activeNav === 'contact' ? 'active' : ''}`}
                  onClick={() => {
                    if (soundEnabled) playUISound('click');
                    setActiveNav('contact');
                    scrollTo('contact');
                  }}
                >
                  {t.nav.contact}
                </button>
              </li>
            </ul>
          </nav>

          <div className="hd-r">
            {/* Quick Command Menu Trigger (Ctrl + K) */}
            <button
              type="button"
              className="nav-cmd-btn"
              onClick={() => {
                if (soundEnabled) playUISound('click');
                setCmdPaletteOpen(true);
              }}
              title={lang === 'id' ? 'Menu Cepat (Ctrl + K)' : 'Quick Search (Ctrl + K)'}
              aria-label="Open Command Menu"
            >
              <Search className="w-3.5 h-3.5 text-[#f3a875]" />
              <span className="nav-cmd-text">{lang === 'id' ? 'Cari' : 'Search'}</span>
            </button>

            {/* Studio Local Time Badge */}
            <div className="nav-time-badge" aria-label="Studio Local Time">
              <span className="nav-time-dot" />
              <span>Jakarta, ID</span>
              <span className="nav-time-sep">•</span>
              <span className="nav-time-clock">{timeStr}</span>
              <span className="nav-time-sep">•</span>
              <span>{dateStr}</span>
            </div>

            <button
              className="menu-btn"
              type="button"
              onClick={() => setNavOpen(true)}
              aria-haspopup="dialog"
            >
              <span>
                <svg className="i">
                  <use href="#menu" />
                </svg>
                <span className="mt">{t.nav.menu}</span>
                <span className="sr-only">Open menu</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <main id="main">
        {/* HERO SECTION */}
        <section id="home">
          <style>{`
            @media (max-width: 640px) {
              #home .lr img {
                object-fit: cover !important;
                object-position: 50% -260px !important;
                transform: scale(1.08) !important;
                transform-origin: center top !important;
              }
              #home .vig {
                background: linear-gradient(
                  to bottom,
                  rgba(10, 10, 10, 0.55) 0%,
                  rgba(10, 10, 10, 0.2) 28%,
                  rgba(10, 10, 10, 0.15) 50%,
                  rgba(14, 14, 14, 0.65) 82%,
                  #282828 100%
                ) !important;
              }
            }
            @media (min-width: 641px) and (max-width: 1023px) {
              #home .lr img {
                object-fit: cover !important;
                object-position: 50% -160px !important;
              }
            }
          `}</style>
          <div className="lr" id="lr" ref={heroBoxRef}>
            {/* Base Image (after.jpg - Warm Studio Light) */}
            <img
              id="lrImg"
              src="/assets/images/hero/after.jpg"
              alt="Portrait of the SEZKY designer in warm studio light"
              fetchPriority="high"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />

            {/* Interactive Spotlight Reveal Layer (before.jpg - B&W Look) */}
            <div
              id="lrReveal"
              ref={revealRef}
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                opacity: 0,
                transition: 'opacity 0.25s ease-out',
                willChange: 'mask-image, -webkit-mask-image',
                zIndex: 2,
              }}
            >
              <img
                src="/assets/images/hero/before.jpg"
                alt="Alternate portrait reveal"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>

            {/* Glowing Lens Halo around Cursor */}
            <div
              id="lrHalo"
              ref={haloRef}
              style={{
                position: 'absolute',
                width: '540px',
                height: '540px',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(251, 146, 60, 0.22) 0%, rgba(251, 146, 60, 0.08) 45%, transparent 70%)',
                mixBlendMode: 'screen',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                zIndex: 3,
              }}
            />

          </div>

          <div className="vig" />
          <div className="wm rv in" style={customStyle({ '--y': '20px', '--o': '0.4', '--d': '300ms' })} aria-hidden="true">
            SEZKY
          </div>

          <div className="shell hero-g">
            <div className="h-l">
              <p className="eyebrow rv in" style={customStyle({ '--y': '10px', '--d': '200ms' })}>
                {t.hero.eyebrow}
              </p>
              <h1 className="h1 in" style={customStyle({ '--d0': '250ms' })}>
                <span className="ln"><span style={customStyle({ '--d': '250ms' })}>{t.hero.titleLine1}</span></span>
                <span className="ln"><span style={customStyle({ '--d': '370ms' })}>{t.hero.titleLine2}</span></span>
                <span className="ln"><span style={customStyle({ '--d': '490ms' })}>{t.hero.titleLine3}</span></span>
              </h1>
              <p className="lead rv in" style={customStyle({ '--y': '10px', '--d': '550ms' })}>
                {t.hero.lead}
              </p>
              <div className="rating rv in" style={customStyle({ '--y': '10px', '--d': '650ms' })}>
                <span className="stars" aria-hidden="true">
                  <svg className="i"><use href="#star" /></svg>
                  <svg className="i"><use href="#star" /></svg>
                  <svg className="i"><use href="#star" /></svg>
                  <svg className="i"><use href="#star" /></svg>
                  <svg className="i"><use href="#star" /></svg>
                </span>
                <span className="t">{t.hero.rating}</span>
              </div>
              <div className="ctas rv in" style={customStyle({ '--y': '10px', '--d': '750ms' })}>
                <button className="pill dark arrow r" type="button" onClick={() => setModalOpen(true)}>
                  <span>
                    {t.hero.letsTalk}
                    <span className="bd">
                      <svg className="i"><use href="#arr" /></svg>
                    </span>
                  </span>
                </button>
                <button className="pill outline" type="button" onClick={() => scrollTo('works')}>
                  <span>{t.hero.viewWork}</span>
                </button>
              </div>
            </div>

            <div className="h-r">
              <div className="hcard rv in" style={customStyle({ '--y': '16px', '--s': '.96', '--d': '400ms' })}>
                <div className="hc-row" onClick={() => nextCard(1)} style={{ cursor: 'pointer' }}>
                  <div className="hc-t">
                    <svg className="i"><use href="#logo" /></svg>
                  </div>
                  <div className="hc-p">
                    <div
                      className={`hc-s ${isSwapping ? 'sw' : ''}`}
                      style={customStyle({ '--sy': `${swapDir > 0 ? -14 : 14}px` })}
                    >
                      <div className="hc-c">{t.hero.carousel[cardIdx]?.c || t.hero.carousel[0].c}</div>
                      <div className="hc-h">{t.hero.carousel[cardIdx]?.h || t.hero.carousel[0].h}</div>
                    </div>
                    <div className="hc-b">
                      <div className="dots">
                        {t.hero.carousel.map((_, i) => (
                          <i key={i} className={i === cardIdx ? 'on' : ''} />
                        ))}
                      </div>
                      <div className="arrs">
                        <button
                          className="pv"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            nextCard(-1);
                          }}
                          aria-label="Previous"
                        >
                          <svg className="i"><use href="#arr" /></svg>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            nextCard(1);
                          }}
                          aria-label="Next"
                        >
                          <svg className="i"><use href="#arr" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Spotify Daily Rotation Card */}
              <div className="spotify-card rv in" style={customStyle({ '--y': '16px', '--d': '550ms' })}>
                <div className="sp-header">
                  <div className="sp-header-top">
                    <div className="sp-title-wrap">
                      <span className="sp-eq-bars" aria-hidden="true">
                        <span className="bar" />
                        <span className="bar" />
                        <span className="bar" />
                      </span>
                      <h3 className="sp-title">{t.spotify.title}</h3>
                    </div>
                    <a
                      href="https://open.spotify.com/playlist/0tZXWBRGw1CaZirVnpLtsD?si=37526d3406d0448a"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sp-badge"
                      title="Open playlist on Spotify"
                      aria-label="Open playlist on Spotify"
                    >
                      <svg className="i" style={{ width: '1.15rem', height: '1.15rem', color: '#1db954' }}>
                        <use href="#spotify" />
                      </svg>
                      <span>{t.spotify.badge}</span>
                    </a>
                  </div>
                  <p className="sp-sub">
                    {t.spotify.sub}
                  </p>
                </div>

                <div className="sp-embed-wrap">
                  <iframe
                    suppressHydrationWarning
                    style={{ borderRadius: '14px', border: 'none', display: 'block', width: '100%' }}
                    src="https://open.spotify.com/embed/playlist/0tZXWBRGw1CaZirVnpLtsD?utm_source=generator&theme=0"
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title="SEZKY Daily Rotation Spotify Playlist"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="sbar rv in" style={customStyle({ '--y': '0px', '--d': '900ms' })}>
            <div className="shell sbar-in">
              <span>{t.hero.sbarDesign}</span>
              <span className="mid">{t.hero.sbarLocation}</span>
              <span className="rt">
                {t.hero.sbarScroll} <span aria-hidden="true">↓</span>
              </span>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION (Refined Ref Style) */}
        <section id="about">
          <div className="about-ref-container">
            {/* Center Pill Badge */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }} data-aos="fade-up">
              <span className="sec-pill-badge">
                <span className="dot" /> {t.about.badge}
              </span>
            </div>

            {/* Top 3-Col Layout */}
            <div className="about-top-grid">
              {/* Left Column: Hi, I'm ... */}
              <div className="about-hi-box" data-aos="fade-up" data-aos-delay="100">
                <h3 className="about-hi-lead">
                  <span className="grad-text">{t.about.hiPrefix}</span>
                  {t.about.hiName}
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                  {t.about.hiDesc}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '0.5rem' }}>
                  {DEFAULT_CONFIG.cvUrl && (
                    <a
                      href={DEFAULT_CONFIG.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="about-btn-primary"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{t.about.viewCv}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Center Column: Portrait frame */}
              <div className="about-center-photo" data-aos="fade-up" data-aos-delay="200">
                <div className="about-photo-frame">
                  <img
                    src={DEFAULT_CONFIG.photoUrl || '/assets/images/about-portrait.png'}
                    alt="SEZKY Designer"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Right Column: Bio & CTA */}
              <div className="about-bio-box" data-aos="fade-up" data-aos-delay="300">
                <p className="about-bio-text">
                  {t.about.bioText}
                </p>
                <a
                  href="#works"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('works');
                  }}
                  className="about-btn-secondary"
                >
                  <Code2 className="w-4 h-4" />
                  <span>{t.about.viewPortfolio}</span>
                </a>
              </div>
            </div>

            {/* Middle 2-Column: Education & Experience */}
            <div className="about-middle-grid">
              {/* Education */}
              <div className="timeline-column" data-aos="fade-up" data-aos-delay="100">
                <h4>
                  <GraduationCap className="w-5 h-5" />
                  <span>{t.about.eduTitle}</span>
                </h4>
                <div className="timeline-card-list">
                  {t.about.education.map((edu, idx) => (
                    <div key={idx} className="timeline-glass-card">
                      <div className="timeline-card-icon">
                        {idx === 0 ? <GraduationCap className="w-6 h-6" /> : <Code2 className="w-6 h-6" />}
                      </div>
                      <div className="timeline-card-info">
                        <h5>{edu.institution}</h5>
                        <p>{edu.degree}</p>
                        <span className="period-badge">{edu.period}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="timeline-column" data-aos="fade-up" data-aos-delay="200">
                <h4>
                  <Briefcase className="w-5 h-5" />
                  <span>{t.about.expTitle}</span>
                </h4>
                <div className="timeline-card-list">
                  {t.about.experience.map((exp, idx) => (
                    <div key={idx} className="timeline-glass-card">
                      <div className="timeline-card-icon">
                        {idx === 0 ? <Briefcase className="w-6 h-6" /> : <Box className="w-6 h-6" />}
                      </div>
                      <div className="timeline-card-info">
                        <h5>{exp.company}</h5>
                        <p>{exp.role}</p>
                        <span className="period-badge">{exp.period}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom 3 Metric Highlight Cards */}
            <div className="about-metric-grid">
              <div className="metric-glass-card" data-aos="fade-up" data-aos-delay="100">
                <div className="metric-card-top">
                  <div className="metric-icon-box">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="metric-number">{t.about.metric1Number}</span>
                </div>
                <div className="metric-card-bottom">
                  <h6>{t.about.metric1Title}</h6>
                  <p>{t.about.metric1Desc}</p>
                </div>
              </div>

              <div className="metric-glass-card" data-aos="fade-up" data-aos-delay="200">
                <div className="metric-card-top">
                  <div className="metric-icon-box">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="metric-number">{t.about.metric2Number}</span>
                </div>
                <div className="metric-card-bottom">
                  <h6>{t.about.metric2Title}</h6>
                  <p>{t.about.metric2Desc}</p>
                </div>
              </div>

              <div className="metric-glass-card" data-aos="fade-up" data-aos-delay="300">
                <div className="metric-card-top">
                  <div className="metric-icon-box">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="metric-number">{t.about.metric3Number}</span>
                </div>
                <div className="metric-card-bottom">
                  <h6>{t.about.metric3Title}</h6>
                  <p>{t.about.metric3Desc}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SZKYYZXZ WORDMARK STATEMENT (Inspired by 0x5zen) */}
        <section aria-label="SZKYYZXZ" className="wordmark-section">
          <div className="wordmark-wrap rv in" style={customStyle({ '--y': '24px', '--d': '100ms' })}>
            <span className="wordmark-text" aria-label="SEZKY">
              <span className="wm-letter wm-s">S</span>
              <span className="wm-letter wm-e">E</span>
              <span className="wm-letter wm-z">Z</span>
              <span className="wm-letter wm-k">K</span>
              <span className="wm-letter wm-y">Y</span>
            </span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="wordmark-corner-icon"
            >
              <path d="M6 4h14v14" />
            </svg>
          </div>
        </section>

        {/* RUNNING MARQUEE TICKER (Inspired by 0x5zen) */}
        <section aria-label="Expertise Ticker" className="marquee-ticker-section">
          <div className="marquee-ticker-track" aria-hidden="true">
            <div className="marquee-ticker-group">
              {MARQUEE_ITEMS.map((item, idx) => (
                <span key={`m1-${idx}`} className="marquee-ticker-item">
                  <span>{item}</span>
                  <svg className="marquee-star-icon" viewBox="0 0 24 24">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </span>
              ))}
            </div>
            <div className="marquee-ticker-group">
              {MARQUEE_ITEMS.map((item, idx) => (
                <span key={`m2-${idx}`} className="marquee-ticker-item">
                  <span>{item}</span>
                  <svg className="marquee-star-icon" viewBox="0 0 24 24">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* WORKS (PORTFOLIO) */}
        <section id="works">
          <div className="shell w">
            <div className="portfolio-ref-header" data-aos="fade-up">
              <h2 className="portfolio-ref-title">
                {t.portfolio.title}
              </h2>
            </div>

            {/* Tab Bar */}
            <div className="portfolio-ref-tab-bar" role="tablist" aria-label="Portofolio Tabs" data-aos="fade-up" data-aos-delay="100">
              <button
                type="button"
                role="tab"
                aria-selected={portfolioTab === 'projects'}
                className={`portfolio-ref-tab-item ${portfolioTab === 'projects' ? 'active' : ''}`}
                onClick={() => {
                  if (soundEnabled) playUISound('click');
                  setPortfolioTab('projects');
                }}
              >
                <Code2 className="portfolio-ref-tab-icon" />
                <span>{t.portfolio.tabProjects}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={portfolioTab === 'certificates'}
                className={`portfolio-ref-tab-item ${portfolioTab === 'certificates' ? 'active' : ''}`}
                onClick={() => {
                  if (soundEnabled) playUISound('click');
                  setPortfolioTab('certificates');
                }}
              >
                <Award className="portfolio-ref-tab-icon" />
                <span>{t.portfolio.tabCertificates}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={portfolioTab === 'tech-stack'}
                className={`portfolio-ref-tab-item ${portfolioTab === 'tech-stack' ? 'active' : ''}`}
                onClick={() => {
                  if (soundEnabled) playUISound('click');
                  setPortfolioTab('tech-stack');
                }}
              >
                <Boxes className="portfolio-ref-tab-icon" />
                <span>{t.portfolio.tabTechStack}</span>
              </button>
            </div>

            {/* TAB 1: PROJECTS */}
            {portfolioTab === 'projects' && (
              <>
                {/* Category sub-filter chips */}
                {categories.length > 0 && (
                  <div className="portfolio-cat-filter-wrapper" data-aos="fade-up" data-aos-delay="120">
                    <span className="portfolio-cat-label">
                      {lang === 'id' ? 'Kategori Desain:' : 'Filter Category:'}
                    </span>
                    <div className="portfolio-cat-filter" role="group" aria-label="Filter projects">
                      <button
                        type="button"
                        className={`portfolio-cat-btn ${activeCategory === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveCategory('all')}
                      >
                        {t.portfolio.filterAll}
                      </button>
                      {categories.map((c) => (
                        <button
                          key={c}
                          type="button"
                          className={`portfolio-cat-btn ${activeCategory === c ? 'active' : ''}`}
                          onClick={() => setActiveCategory(c)}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cards List */}
                {loadingProjects ? (
                  <ul className="cards">
                    <li className="skel" aria-hidden="true" />
                    <li className="skel" aria-hidden="true" />
                  </ul>
                ) : filteredProjects.length === 0 ? (
                  <div className="empty">
                    <p>
                      {projectsFailed
                        ? t.portfolio.loadError
                        : t.portfolio.noProjects}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="portfolio-cards-grid" ref={projectsSliderRef}>
                      {(showAllProjects ? filteredProjects : filteredProjects.slice(0, 6)).map((p, idx) => {
                        const { cleanUrl, fit: thumbFit, position: thumbPos, ratio: thumbRatio } = parseThumbnailSettings(p.thumbnail_path);
                        const thumb = getThumbnailUrl(cleanUrl);
                        const tags = (p.tags || '').split(',').map((t) => t.trim()).filter(Boolean).slice(0, 3);

                        return (
                          <article key={p.id} className="project-glass-card" data-aos="fade-up" data-aos-delay={(idx % 3) * 120}>
                            {/* Browser Window Mockup Frame (Inspired by 0x5zen) */}
                            <div className="browser-window-header" aria-hidden="true">
                              <div className="browser-window-dots">
                                <span className="b-dot b-dot-red" />
                                <span className="b-dot b-dot-yellow" />
                                <span className="b-dot b-dot-green" />
                              </div>
                              <div className="browser-window-url">
                                <span className="browser-url-text">{getDisplayUrl(p.title, p.project_url)}</span>
                              </div>
                              <div className="browser-window-status">
                                <span className="b-status-pulse" />
                                <span className="b-status-text">LIVE</span>
                              </div>
                            </div>

                            <div
                              className="project-thumb-wrap"
                              style={{
                                aspectRatio:
                                  thumbRatio === '4/5'
                                    ? '4 / 5'
                                    : thumbRatio === '3/4'
                                    ? '3 / 4'
                                    : thumbRatio === '1/1'
                                    ? '1 / 1'
                                    : thumbRatio === '4/3'
                                    ? '4 / 3'
                                    : '16 / 9',
                              }}
                            >
                              {/* Ambient glowing backdrop when contain */}
                              {thumb && thumbFit === 'contain' && (
                                <div
                                  className="project-thumb-backdrop"
                                  style={{
                                    position: 'absolute',
                                    inset: 0,
                                    backgroundImage: `url(${thumb})`,
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    filter: 'blur(20px)',
                                    opacity: 0.35,
                                    transform: 'scale(1.2)',
                                  }}
                                  aria-hidden="true"
                                />
                              )}

                              {thumb ? (
                                <img
                                  className="project-thumb-img"
                                  src={thumb}
                                  alt={p.title}
                                  loading="lazy"
                                  style={{
                                    objectFit: thumbFit,
                                    objectPosition: thumbPos,
                                    position: 'relative',
                                    zIndex: 1,
                                  }}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/assets/images/placeholder.svg';
                                  }}
                                />
                              ) : (
                                <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', background: '#1c1c1c' }}>
                                  <svg className="i" style={{ fontSize: '3rem', color: '#cf8047' }}><use href="#logo" /></svg>
                                </div>
                              )}
                              <span className="project-category-badge" style={{ zIndex: 2 }}>
                                {p.category || 'Creative'}
                              </span>
                            </div>

                            <div className="project-card-body">
                              <h3 className="project-card-title">{p.title}</h3>
                              {p.description && <p className="project-card-desc">{p.description}</p>}

                              {tags.length > 0 && (
                                <div className="project-tags-list">
                                  {tags.map((t, idx) => (
                                    <span key={idx} className="project-tag-pill">{t}</span>
                                  ))}
                                </div>
                              )}

                              <div className="project-card-actions">
                                {p.project_url ? (
                                  <a
                                    href={p.project_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="project-link-demo"
                                  >
                                    <span>{t.portfolio.liveDemo}</span>
                                    <ArrowUpRight className="w-4 h-4" />
                                  </a>
                                ) : (
                                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                                    {t.portfolio.viewCaseStudy}
                                  </span>
                                )}

                                <button
                                  type="button"
                                  className="project-btn-details"
                                  onClick={() => setSelectedProject(p)}
                                >
                                  <span>{t.portfolio.viewCaseStudy}</span>
                                </button>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>

                    {/* Mobile Slider Controls for Projects (matching Client Words style) */}
                    {filteredProjects.length > 1 && (
                      <div className="portfolio-mobile-slider-controls">
                        <div className="portfolio-mobile-swipe-hint">
                          <span className="portfolio-swipe-pill">
                            <span className="portfolio-swipe-icon" aria-hidden="true">⇄</span>
                            <span>{lang === 'id' ? 'Geser ke samping' : 'Swipe sideways'}</span>
                          </span>
                        </div>
                        <div className="portfolio-mobile-slider-arrows">
                          <button
                            type="button"
                            className="portfolio-mobile-arrow-btn"
                            onClick={() => scrollProjectsSlider('left')}
                            aria-label="Previous project"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="portfolio-mobile-arrow-btn"
                            onClick={() => scrollProjectsSlider('right')}
                            aria-label="Next project"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {filteredProjects.length > 6 && (
                      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                        <button
                          type="button"
                          className="about-btn-secondary"
                          onClick={() => setShowAllProjects(!showAllProjects)}
                          style={{ margin: '0 auto' }}
                        >
                          {showAllProjects ? (
                            <>
                              <span>{t.portfolio.showLess}</span>
                              <ChevronUp className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              <span>{t.portfolio.showMore}</span>
                              <ChevronDown className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* TAB 2: CERTIFICATES */}
            {portfolioTab === 'certificates' && (
              <div>
                <div className="cert-grid" ref={certsSliderRef}>
                  {(showAllCerts ? activeCertificates : activeCertificates.slice(0, 6)).map((cert, idx) => (
                    <article
                      key={cert.id}
                      className="cert-card"
                      data-aos="fade-up"
                      data-aos-delay={(idx % 3) * 120}
                      onClick={() => setSelectedCertificate(cert)}
                    >
                      {/* Browser Window Mockup Frame (Matching Project Card) */}
                      <div className="browser-window-header" aria-hidden="true">
                        <div className="browser-window-dots">
                          <span className="b-dot b-dot-red" />
                          <span className="b-dot b-dot-yellow" />
                          <span className="b-dot b-dot-green" />
                        </div>
                        <div className="browser-window-url">
                          <span className="browser-url-text">
                            {`${(cert.issuer || 'credential').toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 14) || 'cert'}.org/verify`}
                          </span>
                        </div>
                        <div className="browser-window-status">
                          <span className="b-status-pulse" />
                          <span className="b-status-text">LIVE</span>
                        </div>
                      </div>

                      <div className="cert-thumb-wrap">
                        <img
                          src={cert.image}
                          alt={cert.title}
                          className="cert-thumb-img"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/images/placeholder.svg';
                          }}
                        />
                        <div className="cert-hover-overlay">
                          <Maximize2 className="w-8 h-8" style={{ color: '#f3a875' }} />
                          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{t.portfolio.certPreview}</span>
                        </div>
                      </div>
                      <div className="cert-info-bar">
                        <h4 className="cert-title">{cert.title}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="cert-issuer">{cert.issuer}</span>
                          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{cert.year}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Mobile Slider Controls for Certificates (matching Client Words style) */}
                {activeCertificates.length > 1 && (
                  <div className="portfolio-mobile-slider-controls">
                    <div className="portfolio-mobile-swipe-hint">
                      <span className="portfolio-swipe-pill">
                        <span className="portfolio-swipe-icon" aria-hidden="true">⇄</span>
                        <span>{lang === 'id' ? 'Geser ke samping' : 'Swipe sideways'}</span>
                      </span>
                    </div>
                    <div className="portfolio-mobile-slider-arrows">
                      <button
                        type="button"
                        className="portfolio-mobile-arrow-btn"
                        onClick={() => scrollCertsSlider('left')}
                        aria-label="Previous certificate"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="portfolio-mobile-arrow-btn"
                        onClick={() => scrollCertsSlider('right')}
                        aria-label="Next certificate"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {activeCertificates.length > 6 && (
                  <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <button
                      type="button"
                      className="about-btn-secondary"
                      onClick={() => setShowAllCerts(!showAllCerts)}
                      style={{ margin: '0 auto' }}
                    >
                      {showAllCerts ? (
                        <>
                          <span>{t.portfolio.showLess}</span>
                          <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <span>{t.portfolio.showMore}</span>
                          <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: TECH STACK */}
            {portfolioTab === 'tech-stack' && (
              <div className="tech-stack-tab-container">
                <div className="tech-stack-intro-box" data-aos="fade-up">
                  <div className="tech-stack-intro-badge">
                    <Sparkles className="w-3.5 h-3.5 text-[#f3a875]" />
                    <span>{lang === 'id' ? 'Keahlian Desain & Web Modern' : 'Design & Modern Web Stack'}</span>
                  </div>
                  <p className="tech-stack-intro-text">
                    {lang === 'id'
                      ? 'Selain merancang identitas visual dan kemasan fisik produk, saya juga menguasai ekosistem front-end modern untuk membangun website landing page interaktif, responsif, dan berkinerja tinggi.'
                      : 'Beyond brand identities and tangible packaging design, I also craft modern interactive web interfaces, translating visual concepts into high-performance digital experiences.'}
                  </p>
                </div>

                <div className="tech-stack-grid-ref">
                  {TECH_STACK_REF.map((item, idx) => {
                    const ItemIcon = item.icon;
                    return (
                      <div key={idx} className="tech-stack-card-ref" data-aos="fade-up" data-aos-delay={(idx % 4) * 80}>
                        <div className="tech-stack-icon-box">
                          <ItemIcon className="tech-stack-logo-svg tech-stack-logo-img" />
                        </div>
                        <span className="tech-stack-label">{item.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SERVICES */}
        <section id="services">
          <div className="shell s">
            <div data-aos="fade-up">
              <p className="eyebrow">{t.services.eyebrow}</p>
              <h2>
                <span className="ln"><span>{t.services.titleLine1}</span></span>
                <span className="ln"><span>{t.services.titleLine2}</span></span>
              </h2>
            </div>
            <ul className="sv">
              {t.services.items.map((srv, idx) => (
                <li key={srv.number} data-aos="fade-up" data-aos-delay={(idx % 3) * 100}>
                  <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>
                    <span className="n">{srv.number}</span>
                    <h3>{srv.title}</h3>
                    <p className="d">{srv.desc}</p>
                    <span className="ar"><svg className="i"><use href="#aur" /></svg></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* PROCESS */}
        <section id="process">
          <div className="shell sec">
            <div data-aos="fade-up">
              <p className="eyebrow">{t.process.eyebrow}</p>
              <h2 className="t2">
                <span className="ln"><span>{t.process.titleLine1}</span></span>
                <span className="ln"><span>{t.process.titleLine2}</span></span>
              </h2>
            </div>
            <ul className="pr">
              {t.process.steps.map((st, idx) => (
                <li key={st.number} data-aos="fade-up" data-aos-delay={(idx % 4) * 100}>
                  <span className="n">{st.number}</span>
                  <div>
                    <h3>{st.title}</h3>
                    <p>{st.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* WHY WORK WITH SEZKY (Replaces redundant stats) */}
        <section id="whySezky" aria-label="Why Work With SEZKY">
          <div className="shell stp">
            <div className="st why-sezky-box" data-aos="fade-up">
              <div className="why-sezky-header">
                <p className="eyebrow light">{t.whySezky.eyebrow}</p>
                <h2>{t.whySezky.title}</h2>
                <p className="why-sezky-sub">{t.whySezky.subtitle}</p>
              </div>
              <div className="why-sezky-grid">
                {t.whySezky.items.map((feat, idx) => {
                  const icons = [
                    <Clock key="0" className="w-5 h-5 text-[#cf8047]" />,
                    <Boxes key="1" className="w-5 h-5 text-[#cf8047]" />,
                    <Sparkles key="2" className="w-5 h-5 text-[#cf8047]" />,
                    <ShieldCheck key="3" className="w-5 h-5 text-[#cf8047]" />,
                  ];
                  return (
                    <div key={idx} className="why-sezky-card" data-aos="fade-up" data-aos-delay={(idx % 4) * 80}>
                      <div className="why-card-top">
                        <div className="why-card-icon-wrap">
                          {icons[idx % icons.length]}
                        </div>
                        <span className="why-card-tag">{feat.tag}</span>
                      </div>
                      <h3 className="why-card-title">{feat.title}</h3>
                      <p className="why-card-desc">{feat.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS (Interactive Sliding Carousel matching Figma Image 2) */}
        <section id="testimonials" aria-label="Client Testimonials">
          <div className="shell sec" style={{ paddingTop: 0 }}>
            <div data-aos="fade-up">
              <p className="eyebrow">
                {t.testimonials.eyebrow}
              </p>
              <h2 className="t2">
                <span className="ln"><span>{t.testimonials.title}</span></span>
              </h2>
            </div>

            {/* Testimonials Carousel Wrap */}
            <div
              className="testimonial-carousel-wrap"
              data-aos="fade-up"
              data-aos-delay="100"
              onMouseEnter={() => setIsTestimonialHovered(true)}
              onMouseLeave={() => {
                setIsTestimonialHovered(false);
                handleTestimonialMouseLeave();
              }}
              onMouseDown={handleTestimonialMouseDown}
              onMouseMove={handleTestimonialMouseMove}
              onMouseUp={handleTestimonialMouseUp}
              onTouchStart={handleTestimonialTouchStart}
              onTouchMove={handleTestimonialTouchMove}
              onTouchEnd={handleTestimonialTouchEnd}
            >
              {/* Left Nav Arrow Button */}
              <button
                type="button"
                className="testimonial-nav-arrow prev"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevTestimonial();
                }}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Slider Viewport */}
              <div className="testimonial-slider-viewport">
                <div
                  className="testimonial-slider-track"
                  style={{
                    transform: `translateX(calc(-${activeTestimonial * 100}% + ${testimonialDragOffset}px))`,
                    transition: isTestimonialDragging ? 'none' : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {activeTestimonialsList.map((item, idx) => (
                    <div key={idx} className="testimonial-slide-item">
                      <div className="testimonial-card-figma">
                        {/* Left Side: Client Portrait Frame & Geometric Accents */}
                        <div className="testimonial-left-col">
                          <div className="testimonial-portrait-frame">
                            {/* Decorative green square outline accent */}
                            <div className="deco-square-accent" />
                            {/* Decorative green soundwave curve accents */}
                            <div className="deco-wave-accent">
                              <span />
                              <span />
                              <span />
                              <span />
                            </div>

                            {item.photo ? (
                              <img
                                src={item.photo}
                                alt={item.name}
                                className="testimonial-portrait-img"
                                draggable={false}
                              />
                            ) : (
                              <div className="testimonial-portrait-fallback">
                                {item.initials}
                              </div>
                            )}
                          </div>

                          {/* Pagination Dots (Matching Figma: placed below the portrait) */}
                          <div className="testimonial-dots-row">
                            {activeTestimonialsList.map((_, dotIdx) => (
                              <button
                                key={dotIdx}
                                type="button"
                                className={`testimonial-dot-btn ${dotIdx === activeTestimonial ? 'active' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectTestimonial(dotIdx);
                                }}
                                aria-label={`Go to slide ${dotIdx + 1}`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Right Side: Stars, Quote, Name, Role, Tag */}
                        <div className="testimonial-right-col">
                          <div className="testimonial-stars-row" aria-label="5 out of 5 stars">
                            <div className="testimonial-stars-icons">
                              {[0, 1, 2, 3, 4].map((starIdx) => {
                                const isFilled = starIdx < ((item as { rating?: number }).rating ?? 5);
                                return (
                                  <Star
                                    key={starIdx}
                                    className={`w-4 h-4 ${isFilled ? 'fill-[#fbbf24] text-[#fbbf24]' : 'fill-none text-[#555]'}`}
                                  />
                                );
                              })}
                            </div>
                            {item.projectTag && (
                              <span className="testimonial-project-tag">{item.projectTag}</span>
                            )}
                          </div>

                          <blockquote className="testimonial-quote-text">
                            &ldquo;{item.quote}&rdquo;
                          </blockquote>

                          <div className="testimonial-author-row">
                            <div className="testimonial-author-info">
                              <h4 className="testimonial-author-name">{item.name}</h4>
                              <p className="testimonial-author-role">{item.role}</p>
                            </div>
                            <div className="testimonial-counter-badge">
                              <span className="counter-curr">0{idx + 1}</span>
                              <span className="counter-sep">/</span>
                              <span className="counter-total">0{activeTestimonialsList.length}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Nav Arrow Button */}
              <button
                type="button"
                className="testimonial-nav-arrow next"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextTestimonial();
                }}
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq">
          <div className="shell sec" style={{ paddingTop: 0 }}>
            <div data-aos="fade-up">
              <p className="eyebrow">{t.faq.eyebrow}</p>
              <h2 className="t2">
                <span className="ln"><span>{t.faq.titleLine1}</span></span>
                <span className="ln"><span>{t.faq.titleLine2}</span></span>
              </h2>
            </div>
            <div className="fq" data-aos="fade-up" data-aos-delay="100">
              {t.faq.items.map((item, idx) => (
                <details key={idx}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* CONTACT SECTION (Refined Ref Style) */}
      <section id="contact">
        <div className="contact-ref-container">
          {/* Center Pill Badge */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }} data-aos="fade-up">
            <span className="sec-pill-badge">
              <span className="dot" /> {t.contact.badge}
            </span>
          </div>

          <div className="contact-layout-grid">
            {/* Left Column: Direct Glassmorphism Contact Form & FIND ME */}
            <div className="contact-left-col" data-aos="fade-up" data-aos-delay="100">
              <div className="contact-form-glass">
                <div className="contact-card-top-bar">
                  <span className="contact-type-pill private">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{lang === 'id' ? 'Pesan Privat (Klien)' : 'Private Inquiry'}</span>
                  </span>
                </div>
                <div className="contact-form-header">
                  <h3>{t.contact.formTitle}</h3>
                  <p>{t.contact.formSub}</p>
                </div>

                {contactSent ? (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', background: 'rgba(207, 128, 71, 0.08)', borderRadius: '1rem', border: '1px solid rgba(207, 128, 71, 0.3)' }}>
                    <CheckCircle2 className="w-12 h-12 text-[#cf8047]" style={{ margin: '0 auto 1rem' }} />
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>{t.contact.successTitle}</h4>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>
                      {t.contact.successDesc}
                    </p>
                    <button
                      type="button"
                      className="about-btn-secondary"
                      onClick={() => setContactSent(false)}
                      style={{ margin: '0 auto' }}
                    >
                      {t.contact.btnSendAnother}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleDirectContactSubmit} suppressHydrationWarning>
                    {/* Project Brief Estimator Selector */}
                    <div className="brief-estimator-section">
                      <div className="brief-estimator-title">
                        <span>
                          <Sparkles className="w-4 h-4 text-[#cf8047]" />
                          {lang === 'id' ? 'Project Brief & Estimator' : 'Project Scope & Brief'}
                        </span>
                        <span className="brief-estimator-hint">
                          {lang === 'id' ? 'Opsional • Kebutuhan Proyek' : 'Optional • Project Spec'}
                        </span>
                      </div>

                      {/* Services Picker */}
                      <div className="brief-chips-group">
                        <label>{lang === 'id' ? 'Layanan yang Anda butuhkan:' : 'Services you need:'}</label>
                        <div className="brief-chips-list">
                          {[
                            'Brand Identity',
                            'Package Design',
                            '3D Product Mockup',
                            'UI/UX & Web Design',
                            lang === 'id' ? 'Konsultasi Kreatif' : 'Creative Direction',
                          ].map((srv) => {
                            const isSelected = selectedServices.includes(srv);
                            return (
                              <button
                                key={srv}
                                type="button"
                                onClick={() => toggleService(srv)}
                                className={`brief-chip ${isSelected ? 'active' : ''}`}
                              >
                                {isSelected ? '✓ ' : '+ '}
                                {srv}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Budget Picker */}
                      <div className="brief-chips-group">
                        <label>{lang === 'id' ? 'Estimasi Alokasi Anggaran:' : 'Estimated Budget Range:'}</label>
                        <div className="brief-chips-list">
                          {(lang === 'id'
                            ? ['< Rp 5 Jt', 'Rp 5 - 15 Jt', 'Rp 15 - 30 Jt', '> Rp 30 Jt', 'Fleksibel']
                            : ['< $500', '$500 - $1.5k', '$1.5k - $3k', '> $3k', 'Flexible']
                          ).map((bgt) => {
                            const isSelected = selectedBudget === bgt;
                            return (
                              <button
                                key={bgt}
                                type="button"
                                onClick={() => {
                                  if (soundEnabled) playUISound('click');
                                  setSelectedBudget(isSelected ? '' : bgt);
                                }}
                                className={`brief-chip ${isSelected ? 'active' : ''}`}
                              >
                                {bgt}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Timeline Picker */}
                      <div className="brief-chips-group">
                        <label>{lang === 'id' ? 'Target Waktu Pengerjaan:' : 'Target Timeline:'}</label>
                        <div className="brief-chips-list">
                          {(lang === 'id'
                            ? ['⚡ Urgent (1-2 minggu)', '📅 Standar (3-4 minggu)', '⏳ Fleksibel']
                            : ['⚡ Urgent (1-2 wks)', '📅 Standard (3-4 wks)', '⏳ Flexible']
                          ).map((tml) => {
                            const isSelected = selectedTimeline === tml;
                            return (
                              <button
                                key={tml}
                                type="button"
                                onClick={() => {
                                  if (soundEnabled) playUISound('click');
                                  setSelectedTimeline(isSelected ? '' : tml);
                                }}
                                className={`brief-chip ${isSelected ? 'active' : ''}`}
                              >
                                {tml}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="contact-input-group">
                      <label htmlFor="ref-contact-name">{t.contact.nameLabel}</label>
                      <div className="contact-input-wrapper">
                        <User className="w-4 h-4 contact-input-icon" />
                        <input
                          id="ref-contact-name"
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder={t.contact.namePlaceholder}
                          className="contact-input-field"
                        />
                      </div>
                    </div>

                    <div className="contact-input-group">
                      <label htmlFor="ref-contact-email">{t.contact.emailLabel}</label>
                      <div className="contact-input-wrapper">
                        <Mail className="w-4 h-4 contact-input-icon" />
                        <input
                          id="ref-contact-email"
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder={t.contact.emailPlaceholder}
                          className="contact-input-field"
                        />
                      </div>
                    </div>

                    <div className="contact-input-group">
                      <label htmlFor="ref-contact-msg">{t.contact.messageLabel}</label>
                      <textarea
                        id="ref-contact-msg"
                        required
                        rows={4}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder={t.contact.messagePlaceholder}
                        className="contact-textarea-field"
                      />
                    </div>

                    {contactError && (
                      <p style={{ color: '#ef4444', fontSize: '0.8125rem', marginBottom: '1rem' }}>
                        {contactError}
                      </p>
                    )}

                    <div className="contact-dual-buttons">
                      <button
                        type="submit"
                        disabled={contactSending}
                        className="contact-btn-submit"
                      >
                        {contactSending ? (
                          <span>{t.contact.btnSending}</span>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>{t.contact.btnSubmit}</span>
                          </>
                        )}
                      </button>

                      {DEFAULT_CONFIG.whatsapp && (
                        <a
                          href={getWhatsAppBriefUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="contact-btn-wa"
                          onClick={() => { if (soundEnabled) playUISound('click'); }}
                          title={lang === 'id' ? 'Buka format brief ini langsung di WhatsApp' : 'Open this brief directly on WhatsApp'}
                        >
                          <WhatsAppIcon className="w-4 h-4" />
                          <span>{lang === 'id' ? 'Kirim via WhatsApp' : 'Send via WhatsApp'}</span>
                        </a>
                      )}
                    </div>
                  </form>
                )}
              </div>

              {/* Underneath: FIND ME & Social Cards */}
              <div className="find-me-box">
                <h4 className="find-me-header">
                  <Compass className="w-5 h-5" />
                  <span>{t.contact.findMeTitle}</span>
                </h4>

                {/* CV / Resume Direct Card */}
                {DEFAULT_CONFIG.cvUrl && (
                  <a
                    href={DEFAULT_CONFIG.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-connect-card"
                  >
                    <div className="social-card-left">
                      <div className="social-card-icon" style={{ background: 'rgba(239, 68, 68, 0.12)', borderColor: 'rgba(239, 68, 68, 0.28)', color: '#ef4444' }}>
                        <PdfIcon className="w-5 h-5" />
                      </div>
                      <div className="social-card-info">
                        <h5>{t.contact.cvCardTitle}</h5>
                        <p>{t.contact.cvCardDesc}</p>
                      </div>
                    </div>
                    <div className="social-card-right">
                      <span className="social-card-badge" style={{ background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.35)', color: '#ef4444' }}>PDF</span>
                      <ArrowUpRight className="w-4 h-4 social-card-arrow" />
                    </div>
                  </a>
                )}

                {/* WhatsApp Direct Card */}
                {DEFAULT_CONFIG.whatsapp && (
                  <a
                    href={`https://wa.me/${DEFAULT_CONFIG.whatsapp}?text=Halo%20SEZKY%20Studio%2C%20saya%20tertarik%20untuk%20diskusi%20proyek`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-connect-card"
                  >
                    <div className="social-card-left">
                      <div className="social-card-icon" style={{ background: 'rgba(37, 211, 102, 0.12)', borderColor: 'rgba(37, 211, 102, 0.28)', color: '#25D366' }}>
                        <WhatsAppIcon className="w-5 h-5" />
                      </div>
                      <div className="social-card-info">
                        <h5>WhatsApp</h5>
                        <p>+{DEFAULT_CONFIG.whatsapp}</p>
                      </div>
                    </div>
                    <div className="social-card-right">
                      <span className="social-card-badge" style={{ background: 'rgba(37, 211, 102, 0.15)', borderColor: 'rgba(37, 211, 102, 0.35)', color: '#25D366' }}>{t.contact.whatsappCardDesc}</span>
                      <ArrowUpRight className="w-4 h-4 social-card-arrow" />
                    </div>
                  </a>
                )}

                {/* Email Direct Card */}
                {DEFAULT_CONFIG.email && (
                  <a
                    href={`mailto:${DEFAULT_CONFIG.email}`}
                    className="social-connect-card"
                  >
                    <div className="social-card-left">
                      <div className="social-card-icon" style={{ background: 'rgba(234, 67, 53, 0.12)', borderColor: 'rgba(234, 67, 53, 0.28)', color: '#EA4335' }}>
                        <GmailIcon className="w-5 h-5" />
                      </div>
                      <div className="social-card-info">
                        <h5>Email Studio</h5>
                        <p>{DEFAULT_CONFIG.email}</p>
                      </div>
                    </div>
                    <div className="social-card-right">
                      <span className="social-card-badge" style={{ background: 'rgba(234, 67, 53, 0.15)', borderColor: 'rgba(234, 67, 53, 0.35)', color: '#EA4335' }}>{t.contact.emailCardDesc}</span>
                      <ArrowUpRight className="w-4 h-4 social-card-arrow" />
                    </div>
                  </a>
                )}

                {/* Instagram Card */}
                {DEFAULT_CONFIG.instagram && (
                  <a
                    href={`https://www.instagram.com/${DEFAULT_CONFIG.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-connect-card"
                  >
                    <div className="social-card-left">
                      <div className="social-card-icon" style={{ background: 'rgba(225, 48, 108, 0.12)', borderColor: 'rgba(225, 48, 108, 0.28)', color: '#E1306C' }}>
                        <InstagramIcon className="w-5 h-5" />
                      </div>
                      <div className="social-card-info">
                        <h5>Instagram</h5>
                        <p>@{DEFAULT_CONFIG.instagram}</p>
                      </div>
                    </div>
                    <div className="social-card-right">
                      <ArrowUpRight className="w-4 h-4 social-card-arrow" />
                    </div>
                  </a>
                )}

                {/* Behance Card */}
                {DEFAULT_CONFIG.behance && (
                  <a
                    href={DEFAULT_CONFIG.behance}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-connect-card"
                  >
                    <div className="social-card-left">
                      <div className="social-card-icon" style={{ background: 'rgba(0, 87, 255, 0.12)', borderColor: 'rgba(0, 87, 255, 0.28)', color: '#0057FF' }}>
                        <BehanceIcon className="w-6 h-6" />
                      </div>
                      <div className="social-card-info">
                        <h5>Behance</h5>
                        <p>{DEFAULT_CONFIG.behance.replace(/^https?:\/\/(www\.)?/, '')}</p>
                      </div>
                    </div>
                    <div className="social-card-right">
                      <ArrowUpRight className="w-4 h-4 social-card-arrow" />
                    </div>
                  </a>
                )}

                {/* LinkedIn Card */}
                {DEFAULT_CONFIG.linkedin && (
                  <a
                    href={DEFAULT_CONFIG.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-connect-card"
                  >
                    <div className="social-card-left">
                      <div className="social-card-icon" style={{ background: 'rgba(10, 102, 194, 0.12)', borderColor: 'rgba(10, 102, 194, 0.28)', color: '#0A66C2' }}>
                        <LinkedInIcon className="w-5 h-5" />
                      </div>
                      <div className="social-card-info">
                        <h5>LinkedIn</h5>
                        <p>{DEFAULT_CONFIG.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</p>
                      </div>
                    </div>
                    <div className="social-card-right">
                      <ArrowUpRight className="w-4 h-4 social-card-arrow" />
                    </div>
                  </a>
                )}

                {/* GitHub Card */}
                {DEFAULT_CONFIG.github && (
                  <a
                    href={DEFAULT_CONFIG.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-connect-card"
                  >
                    <div className="social-card-left">
                      <div className="social-card-icon" style={{ background: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff' }}>
                        <GitHubIcon className="w-5 h-5" />
                      </div>
                      <div className="social-card-info">
                        <h5>GitHub</h5>
                        <p>{DEFAULT_CONFIG.github.replace(/^https?:\/\/(www\.)?/, '')}</p>
                      </div>
                    </div>
                    <div className="social-card-right">
                      <ArrowUpRight className="w-4 h-4 social-card-arrow" />
                    </div>
                  </a>
                )}

                {/* Discord Card */}
                {DEFAULT_CONFIG.discord && (
                  <a
                    href={DEFAULT_CONFIG.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-connect-card"
                  >
                    <div className="social-card-left">
                      <div className="social-card-icon" style={{ background: 'rgba(88, 101, 242, 0.12)', borderColor: 'rgba(88, 101, 242, 0.28)', color: '#5865F2' }}>
                        <DiscordIcon className="w-5 h-5" />
                      </div>
                      <div className="social-card-info">
                        <h5>Discord</h5>
                        <p>{DEFAULT_CONFIG.discordUsername || 'szkyy.zxz'}</p>
                      </div>
                    </div>
                    <div className="social-card-right">
                      <ArrowUpRight className="w-4 h-4 social-card-arrow" />
                    </div>
                  </a>
                )}

                {/* Availability Notice Card */}
                <div className="availability-card">
                  <span className="pulse-indicator" aria-hidden="true" />
                  <p>
                    <strong style={{ color: '#ffffff', display: 'block', marginBottom: '2px' }}>
                      {lang === 'id' ? 'Tersedia untuk Proyek Baru' : 'Available for New Projects'}
                    </strong>
                    {lang === 'id'
                      ? 'Berdomisili di Jakarta, melayani pembuatan brand identity, kemasan produk, dan konsultasi desain untuk klien di seluruh Indonesia & dunia.'
                      : 'Based in Jakarta, crafting brand identity, packaging design, and creative consultation for clients worldwide.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Public Comments / Guestbook (Inspired by Eka Wahyu & 0x5zen) */}
            <div className="comments-card-glass" data-aos="fade-up" data-aos-delay="200">
              <div className="contact-card-top-bar">
                <span className="contact-type-pill public">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{lang === 'id' ? 'Buku Tamu Publik' : 'Public Guestbook'}</span>
                </span>
              </div>
              <div className="comments-card-header">
                <div className="comments-header-title-wrap">
                  <div className="comments-header-icon-box">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="comments-header-title">
                      {t.comments.title}
                      <span className="comments-count-badge">
                        <span className="comments-count-dot" />
                        {comments.length}
                      </span>
                    </h3>
                    <p className="comments-header-sub">{t.comments.sub}</p>
                  </div>
                </div>
              </div>

              {/* Comment Input Form */}
              <form onSubmit={handleCommentSubmit} className="comment-compose-form" suppressHydrationWarning>
                {/* Optional Profile Photo Selector */}
                <div className="comment-avatar-picker-row">
                  <div
                    className="comment-avatar-preview-box"
                    style={{
                      background: commentAvatar ? 'transparent' : getAvatarGradient(commentName || 'Visitor'),
                    }}
                    onClick={() => commentFileInputRef.current?.click()}
                    title={t.comments.photoLabel}
                    role="button"
                    tabIndex={0}
                  >
                    {commentAvatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={commentAvatar} alt="Avatar preview" className="comment-avatar-img" />
                    ) : (
                      <span className="comment-avatar-initial">
                        {commentName.trim() ? commentName.trim().charAt(0).toUpperCase() : <Camera className="w-5 h-5 opacity-75" />}
                      </span>
                    )}
                    <div className="comment-avatar-overlay">
                      <Camera className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="comment-avatar-picker-actions">
                    <label className="comment-avatar-picker-label">
                      {t.comments.photoLabel}
                    </label>
                    <div className="comment-avatar-btn-group">
                      <button
                        type="button"
                        className="comment-photo-btn"
                        onClick={() => commentFileInputRef.current?.click()}
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>{commentAvatar ? t.comments.photoChange : (lang === 'id' ? 'Pilih Foto' : 'Choose Photo')}</span>
                      </button>
                      {commentAvatar && (
                        <button
                          type="button"
                          className="comment-photo-remove-btn"
                          onClick={() => {
                            setCommentAvatar(null);
                            if (commentFileInputRef.current) commentFileInputRef.current.value = '';
                          }}
                          title={t.comments.photoRemove}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <input
                      ref={commentFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>

                {/* Input Name */}
                <div className="contact-input-group" style={{ marginBottom: '1rem' }}>
                  <label htmlFor="comment-author-name">{t.comments.nameLabel}</label>
                  <div className="contact-input-wrapper">
                    <User className="w-4 h-4 contact-input-icon" />
                    <input
                      id="comment-author-name"
                      type="text"
                      required
                      maxLength={60}
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      placeholder={t.comments.namePlaceholder}
                      className="contact-input-field"
                    />
                  </div>
                </div>

                {/* Textarea Comment */}
                <div className="contact-input-group" style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label htmlFor="comment-body-text">{t.comments.commentLabel}</label>
                    <span className="comment-char-counter">
                      {commentText.length}/500
                    </span>
                  </div>
                  <textarea
                    id="comment-body-text"
                    required
                    rows={3}
                    maxLength={500}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={t.comments.commentPlaceholder}
                    className="contact-textarea-field"
                    style={{ minHeight: '90px' }}
                  />
                </div>

                {/* Honeypot hidden input */}
                <div style={{ display: 'none' }} aria-hidden="true">
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                {commentError && (
                  <div className="comment-alert-error">
                    <span>{commentError}</span>
                  </div>
                )}

                {commentSuccess && (
                  <div className="comment-alert-success">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.comments.success}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={commentSubmitting}
                  className="comment-submit-btn"
                >
                  {commentSubmitting ? (
                    <span>{t.comments.btnSubmitting}</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t.comments.btnSubmit}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Comments Feed List */}
              <div className="comments-feed-section" data-lenis-prevent="true">
                <div className="comments-feed-header">
                  <span className="comments-feed-live-indicator">
                    <span className="feed-live-dot" />
                    <span>{lang === 'id' ? 'Aktivitas Terbaru' : 'Recent Feed'}</span>
                  </span>
                  <span className="comments-feed-count">
                    {comments.length} {lang === 'id' ? 'komentar' : 'messages'}
                  </span>
                </div>

                <div
                  className="comments-feed-scroll"
                  data-lenis-prevent="true"
                  data-lenis-prevent-wheel="true"
                  data-lenis-prevent-touch="true"
                  onWheel={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {comments.length === 0 ? (
                    <div className="comments-empty-box">
                      <MessageCircle className="w-8 h-8 text-[#cf8047] opacity-60" />
                      <p>{t.comments.empty}</p>
                    </div>
                  ) : (
                    comments.map((item) => (
                      <div
                        key={item.id}
                        className={`comment-item-card ${item.is_pinned ? 'comment-item-pinned' : ''}`}
                      >
                        {/* Avatar */}
                        <div
                          className="comment-item-avatar"
                          style={{
                            background: item.avatar_url ? 'transparent' : getAvatarGradient(item.name),
                          }}
                        >
                          {item.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.avatar_url}
                              alt={item.name}
                              className="comment-item-avatar-img"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="comment-item-avatar-letter">
                              {item.name ? item.name.charAt(0).toUpperCase() : '?'}
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="comment-item-main">
                          <div className="comment-item-top">
                            <div className="comment-author-wrap">
                              <span className="comment-item-author">{item.name}</span>
                              {item.is_pinned && (
                                <span className="comment-pinned-badge" title={t.comments.pinnedBadge}>
                                  <Pin className="w-2.5 h-2.5" />
                                  <span>{t.comments.pinnedBadge}</span>
                                </span>
                              )}
                            </div>
                            <span className="comment-item-time">
                              <Clock className="w-3 h-3" />
                              {formatRelativeTime(item.created_at, lang)}
                            </span>
                          </div>
                          <p className="comment-item-message">{item.comment}</p>

                          {/* Admin Reply Box */}
                          {item.admin_reply && (
                            <div className="comment-admin-reply-box">
                              <div className="comment-admin-reply-top">
                                <div className="comment-admin-reply-tag">
                                  <ShieldCheck className="w-3.5 h-3.5 text-[#f3a875]" />
                                  <span>{t.comments.adminReplyLabel}</span>
                                </div>
                                {item.replied_at && (
                                  <span className="comment-admin-reply-time">
                                    {formatRelativeTime(item.replied_at, lang)}
                                  </span>
                                )}
                              </div>
                              <p className="comment-admin-reply-text">{item.admin_reply}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="ft">
        <div className="shell ft-in">
          <div className="ft-cta" data-aos="fade-up">
            <div>
              <h2 className="in">
                <span className="ln"><span>{lang === 'id' ? 'Punya ide proyek?' : 'Have a project'}</span></span>
                <span className="ln"><span>{lang === 'id' ? 'Mari diskusikan dan' : "in mind? Let's"}</span></span>
                <span className="ln"><span>{lang === 'id' ? 'wujudkan bersama.' : 'get to work.'}</span></span>
              </h2>
              <div className="ft-contact" data-aos="fade-up" data-aos-delay="100">
                {DEFAULT_CONFIG.email && (
                  <a href={`mailto:${DEFAULT_CONFIG.email}`}>{DEFAULT_CONFIG.email}</a>
                )}
                {DEFAULT_CONFIG.whatsapp && (
                  <a href={`https://wa.me/${DEFAULT_CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
            <div data-aos="fade-up" data-aos-delay="150">
              <button className="pill light arrow ur" type="button" onClick={() => setModalOpen(true)}>
                <span>
                  {lang === 'id' ? 'Mulai Proyek' : 'Start a project'}
                  <span className="bd"><svg className="i"><use href="#aur" /></svg></span>
                </span>
              </button>
            </div>
          </div>

          <div className="ft-cols">
            <div data-aos="fade-up" data-aos-delay="100">
              <div className="bn">
                <svg className="i"><use href="#logo" /></svg><span className="brand-text">SEZKY</span>
              </div>
              <p className="tg">
                {t.about.hiDesc}
              </p>
            </div>

            <div data-aos="fade-up" data-aos-delay="200">
              <h4>{lang === 'id' ? 'Navigasi' : 'Company'}</h4>
              <ul>
                <li><a className="alink" href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }}><span>{t.nav.about}</span></a></li>
                <li><a className="alink" href="#works" onClick={(e) => { e.preventDefault(); scrollTo('works'); }}><span>{t.nav.portfolio}</span></a></li>
                <li><a className="alink" href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services'); }}><span>{t.services.eyebrow}</span></a></li>
                <li><a className="alink" href="#faq" onClick={(e) => { e.preventDefault(); scrollTo('faq'); }}><span>{t.faq.eyebrow}</span></a></li>
                <li><a className="alink" href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}><span>{t.nav.contact}</span></a></li>
              </ul>
            </div>

            <div data-aos="fade-up" data-aos-delay="300">
              <h4>{t.services.eyebrow}</h4>
              <ul>
                {t.services.items.map((s, idx) => (
                  <li key={idx}>
                    <a className="alink" href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services'); }}>
                      <span>{s.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div data-aos="fade-up" data-aos-delay="400">
              <h4>Social</h4>
              <ul>
                {DEFAULT_CONFIG.instagram && (
                  <li>
                    <a className="alink" href={`https://instagram.com/${DEFAULT_CONFIG.instagram}`} target="_blank" rel="noopener noreferrer">
                      <span>Instagram</span>
                    </a>
                  </li>
                )}
                {DEFAULT_CONFIG.behance && (
                  <li>
                    <a className="alink" href={DEFAULT_CONFIG.behance} target="_blank" rel="noopener noreferrer">
                      <span>Behance</span>
                    </a>
                  </li>
                )}
                {DEFAULT_CONFIG.linkedin && (
                  <li>
                    <a className="alink" href={DEFAULT_CONFIG.linkedin} target="_blank" rel="noopener noreferrer">
                      <span>LinkedIn</span>
                    </a>
                  </li>
                )}
                {DEFAULT_CONFIG.dribbble && (
                  <li>
                    <a className="alink" href={DEFAULT_CONFIG.dribbble} target="_blank" rel="noopener noreferrer">
                      <span>Dribbble</span>
                    </a>
                  </li>
                )}
                {DEFAULT_CONFIG.github && (
                  <li>
                    <a className="alink" href={DEFAULT_CONFIG.github} target="_blank" rel="noopener noreferrer">
                      <span>GitHub</span>
                    </a>
                  </li>
                )}
                {DEFAULT_CONFIG.discord && (
                  <li>
                    <a className="alink" href={DEFAULT_CONFIG.discord} target="_blank" rel="noopener noreferrer">
                      <span>Discord</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="legal" data-aos="fade-up" data-aos-delay="150" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <span>© {new Date().getFullYear()} SEZKY Studio. {t.footer.allRights}</span>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {/* Language Switcher Pill (Bilingual EN / ID) in Footer */}
              <div className="lang-switcher-pill" role="group" aria-label="Language Switcher">
                <Globe className="w-3.5 h-3.5 text-white/70" />
                <button
                  type="button"
                  className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                  onClick={() => switchLanguage('en')}
                  title="Switch to English"
                >
                  EN
                </button>
                <span className="lang-divider">/</span>
                <button
                  type="button"
                  className={`lang-btn ${lang === 'id' ? 'active' : ''}`}
                  onClick={() => switchLanguage('id')}
                  title="Terjemahkan ke Bahasa Indonesia"
                >
                  ID
                </button>
              </div>

              {/* Sound FX Toggle Pill in Footer */}
              <button
                type="button"
                className={`sound-fx-toggle-pill ${soundEnabled ? 'active' : ''}`}
                onClick={toggleSound}
                title={
                  soundEnabled
                    ? lang === 'id'
                      ? 'Suara UI: Aktif (Klik untuk mematikan)'
                      : 'UI Sound FX: ON (Click to mute)'
                    : lang === 'id'
                      ? 'Suara UI: Mati (Klik untuk mengaktifkan)'
                      : 'UI Sound FX: OFF (Click to unmute)'
                }
                aria-label="Toggle UI Sound Effects"
              >
                {soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-[#f3a875]" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-white/40" />
                )}
                <span className="sound-fx-label">{soundEnabled ? 'SFX ON' : 'SFX OFF'}</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => scrollTo('home')}
              className="alink"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.65)',
                cursor: 'pointer',
                fontSize: '0.875rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#f3a875')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)')}
            >
              <span>{t.footer.backToTop}</span>
            </button>
          </div>
        </div>

        <div className="ft-wm" aria-hidden="true">
          SEZKY
        </div>
      </footer>

      {/* FULLSCREEN NAV OVERLAY */}
      <div
        id="navm"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={navOpen ? 'open' : ''}
        aria-hidden={!navOpen}
      >
        <div className="shell nm-top" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="b">
            <svg className="i"><use href="#logo" /></svg><span className="brand-text">SEZKY</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Mobile Language Switcher */}
            <div className="lang-switcher-pill" role="group" aria-label="Language selector">
              <Globe className="w-3.5 h-3.5 text-[#cf8047]" style={{ opacity: 0.85 }} />
              <button
                type="button"
                className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                onClick={() => switchLanguage('en')}
                aria-pressed={lang === 'en'}
              >
                EN
              </button>
              <span className="lang-divider" aria-hidden="true">/</span>
              <button
                type="button"
                className={`lang-btn ${lang === 'id' ? 'active' : ''}`}
                onClick={() => switchLanguage('id')}
                aria-pressed={lang === 'id'}
              >
                ID
              </button>
            </div>
            <button className="nm-x" type="button" onClick={() => setNavOpen(false)}>
              <svg className="i"><use href="#x" /></svg>{lang === 'id' ? 'Tutup' : 'Close'}
            </button>
          </div>
        </div>

        <nav className="shell nm-mid" aria-label="Menu">
          <ul id="nmList">
            {[
              [t.nav.home, 'home'],
              [t.nav.about, 'about'],
              [t.nav.portfolio, 'works'],
              [t.nav.contact, 'contact'],
            ].map(([label, id], idx) => (
              <li key={label}>
                <button
                  type="button"
                  style={customStyle({ '--d': `${idx * 45 + 80}ms` })}
                  onClick={() => {
                    setNavOpen(false);
                    if (id) {
                      setTimeout(() => scrollTo(id), 60);
                    } else {
                      setModalOpen(true);
                    }
                  }}
                >
                  <span className="ix">0{idx + 1}</span>
                  <span className="lb">{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="shell nm-bot" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <span>{t.nav.localTime} — {timeStr}</span>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            {DEFAULT_CONFIG.cvUrl && (
              <a
                href={DEFAULT_CONFIG.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#f3a875',
                  textDecoration: 'none',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <FileText className="w-4 h-4" />
                <span>{t.nav.resume} ↗</span>
              </a>
            )}
            <button
              type="button"
              onClick={() => {
                setNavOpen(false);
                setModalOpen(true);
              }}
            >
              {lang === 'id' ? 'Mulai proyek →' : 'Start a project →'}
            </button>
          </div>
        </div>
      </div>

      {/* REQUEST (CONTACT) MODAL */}
      <div
        id="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mTitle"
        className={modalOpen ? 'open' : ''}
        aria-hidden={!modalOpen}
        onClick={() => setModalOpen(false)}
      >
        <div className={`mp ${formSent ? 'done' : ''}`} onClick={(e) => e.stopPropagation()}>
          <button
            className="mx"
            type="button"
            onClick={() => {
              setModalOpen(false);
              setTimeout(() => {
                setFormSent(false);
                setFormError('');
              }, 300);
            }}
            aria-label="Close"
          >
            <svg className="i"><use href="#x" /></svg>
          </button>

          <div className="mh">
            <span className="e">{t.modal.title}</span>
            <h2 id="mTitle">{t.modal.sub}</h2>
          </div>

          <form onSubmit={handleContactSubmit} suppressHydrationWarning>
            <label>
              {t.modal.name}
              <input name="name" type="text" required maxLength={100} placeholder={t.contact.namePlaceholder} autoComplete="name" />
            </label>
            <label>
              {t.modal.email}
              <input name="email" type="email" required maxLength={255} placeholder={t.contact.emailPlaceholder} autoComplete="email" />
            </label>
            <label>
              {t.modal.message}
              <textarea
                name="message"
                rows={4}
                required
                minLength={10}
                maxLength={3000}
                placeholder={t.contact.messagePlaceholder}
              />
            </label>
            <div className="hp" aria-hidden="true" style={{ display: 'none' }}>
              <label>
                Website
                <input name="website" type="text" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            {formError && <p className="err show" role="alert">{formError}</p>}
            <div className="mf">
              <small>{lang === 'id' ? 'Respon cepat dalam 24 jam kerja.' : 'We reply within one business day.'}</small>
              <button className="pill dark arrow ur" type="submit" disabled={formSending}>
                <span>
                  <span>{formSending ? t.modal.sending : t.modal.send}</span>
                  <span className="bd"><svg className="i"><use href="#aur" /></svg></span>
                </span>
              </button>
            </div>
          </form>

          <div className="ok">
            <div className="lg"><svg className="i"><use href="#logo" /></svg></div>
            <h2>{t.modal.successTitle}</h2>
            <p>{t.modal.successDesc}</p>
            <button
              className="pill dark"
              type="button"
              onClick={() => {
                setModalOpen(false);
                setTimeout(() => {
                  setFormSent(false);
                  setFormError('');
                }, 300);
              }}
            >
              <span>{t.modal.close}</span>
            </button>
          </div>
        </div>
      </div>

      {/* PROJECT DETAIL MODAL */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pdT"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 140,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            padding: '1.5rem',
          }}
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="pdp"
            style={{
              position: 'relative',
              maxWidth: '48rem',
              width: '100%',
              background: '#0a0a0a',
              color: '#fff',
              borderRadius: '1.5rem',
              overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="pdx"
              type="button"
              onClick={() => setSelectedProject(null)}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                zIndex: 10,
                width: '2.5rem',
                height: '2.5rem',
                display: 'grid',
                placeItems: 'center',
                borderRadius: '9999px',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '1rem',
              }}
            >
              <svg className="i"><use href="#x" /></svg>
            </button>

            {(() => {
              const galleryList = (selectedProject.gallery && selectedProject.gallery.length > 0)
                ? selectedProject.gallery
                : [selectedProject.thumbnail_path].filter(Boolean);
              const currentImg = galleryList[activeGalleryIndex] || selectedProject.thumbnail_path;
              const { cleanUrl, fit: modalFit, position: modalPos } = parseThumbnailSettings(currentImg);
              const imgUrl = getThumbnailUrl(cleanUrl);

              return imgUrl ? (
                <div style={{ position: 'relative', maxHeight: '34rem', minHeight: '18rem', overflow: 'hidden', background: '#101010', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Ambient glowing backdrop */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `url(${imgUrl})`,
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                      filter: 'blur(24px)',
                      opacity: 0.35,
                      transform: 'scale(1.2)',
                    }}
                    aria-hidden="true"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    key={activeGalleryIndex}
                    src={imgUrl}
                    alt={`${selectedProject.title} preview ${activeGalleryIndex + 1}`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '34rem',
                      objectFit: 'contain',
                      objectPosition: modalPos,
                      position: 'relative',
                      zIndex: 1,
                      transition: 'opacity 0.25s ease',
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/images/placeholder.svg';
                    }}
                  />

                  {/* Left / Right Carousel Controls */}
                  {galleryList.length > 1 && (
                    <>
                      <button
                        type="button"
                        aria-label="Previous image"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (soundEnabled) playUISound('click');
                          setActiveGalleryIndex((prev) => (prev > 0 ? prev - 1 : galleryList.length - 1));
                        }}
                        style={{
                          position: 'absolute',
                          left: '1rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '2.5rem',
                          height: '2.5rem',
                          borderRadius: '50%',
                          background: 'rgba(0,0,0,0.65)',
                          backdropFilter: 'blur(6px)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          color: '#ffffff',
                          display: 'grid',
                          placeItems: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          zIndex: 5,
                        }}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <button
                        type="button"
                        aria-label="Next image"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (soundEnabled) playUISound('click');
                          setActiveGalleryIndex((prev) => (prev < galleryList.length - 1 ? prev + 1 : 0));
                        }}
                        style={{
                          position: 'absolute',
                          right: '1rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '2.5rem',
                          height: '2.5rem',
                          borderRadius: '50%',
                          background: 'rgba(0,0,0,0.65)',
                          backdropFilter: 'blur(6px)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          color: '#ffffff',
                          display: 'grid',
                          placeItems: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          zIndex: 5,
                        }}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>

                      {/* Image Counter Badge & Thumbnail Dots */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '0.875rem',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          background: 'rgba(0,0,0,0.65)',
                          backdropFilter: 'blur(6px)',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '9999px',
                          border: '1px solid rgba(255,255,255,0.15)',
                          zIndex: 5,
                        }}
                      >
                        {galleryList.map((_, gIdx) => (
                          <button
                            key={gIdx}
                            type="button"
                            aria-label={`Slide ${gIdx + 1}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (soundEnabled) playUISound('click');
                              setActiveGalleryIndex(gIdx);
                            }}
                            style={{
                              width: gIdx === activeGalleryIndex ? '1.5rem' : '0.5rem',
                              height: '0.5rem',
                              borderRadius: '9999px',
                              background: gIdx === activeGalleryIndex ? '#cf8047' : 'rgba(255,255,255,0.4)',
                              border: 'none',
                              cursor: 'pointer',
                              padding: 0,
                              transition: 'all 0.25s ease',
                            }}
                          />
                        ))}
                        <span style={{ fontSize: '0.75rem', color: '#ffffff', fontWeight: 600, marginLeft: '0.35rem' }}>
                          {activeGalleryIndex + 1}/{galleryList.length}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ) : null;
            })()}

            <div style={{ padding: '2rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#cf8047', fontWeight: 500, marginBottom: '0.5rem' }}>
                {selectedProject.category || 'General'}
              </p>
              <h3 id="pdT" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: '#fff' }}>
                {selectedProject.title}
              </h3>
              {selectedProject.description && (
                <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '1rem' }}>
                  {selectedProject.description}
                </p>
              )}

              {selectedProject.tags && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                  {selectedProject.tags.split(',').map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        background: 'rgba(255,255,255,0.08)',
                        fontSize: '0.75rem',
                        color: 'rgba(255,255,255,0.7)',
                      }}
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              {selectedProject.project_url && (
                <div style={{ marginTop: '1.75rem' }}>
                  <a
                    href={selectedProject.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      background: '#ffffff',
                      color: '#0a0a0a',
                      padding: '0.625rem 1.25rem',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'all 0.25s ease',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,255,255,0.18)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.25)';
                    }}
                  >
                    <span>{t.portfolio.liveDemo}</span>
                    <span
                      style={{
                        width: '1.75rem',
                        height: '1.75rem',
                        borderRadius: '9999px',
                        background: '#0a0a0a',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CERTIFICATE FULL VIEW LIGHTBOX (matching reference site) */}
      {selectedCertificate && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setSelectedCertificate(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedCertificate(null)}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              zIndex: 10,
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              borderRadius: '50%',
              width: '2.75rem',
              height: '2.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            aria-label="Close Certificate Preview"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '900px',
              width: '100%',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img
              src={selectedCertificate.image}
              alt={selectedCertificate.title}
              style={{
                maxWidth: '100%',
                maxHeight: '72vh',
                objectFit: 'contain',
                borderRadius: '0.75rem',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 35px rgba(207, 128, 71, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            />
            <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
              <h4 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 700 }}>
                {selectedCertificate.title}
              </h4>
              <p style={{ color: '#f3a875', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
                {selectedCertificate.issuer} • {selectedCertificate.year}
              </p>
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <a
                  href={selectedCertificate.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-btn-secondary"
                  style={{
                    fontSize: '0.8125rem',
                    padding: '0.45rem 1rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{lang === 'id' ? 'Buka Gambar Asli' : 'Open Original'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING WHATSAPP CONCIERGE CHAT WIDGET */}
      {DEFAULT_CONFIG.whatsapp && (
        <div className="floating-wa-wrap" role="complementary" aria-label="Quick WhatsApp Contact">
          {/* Tooltip bubble when closed and not dismissed */}
          {waTooltipOpen && !waConciergeOpen && (
            <div
              className="floating-wa-tooltip"
              onClick={() => {
                if (soundEnabled) playUISound('click');
                setWaConciergeOpen(true);
                setWaTooltipOpen(false);
                setWaHasInteracted(true);
              }}
              style={{ cursor: 'pointer' }}
              title={lang === 'id' ? 'Klik untuk membuka chat assistant' : 'Click to open chat assistant'}
            >
              <p className="floating-wa-tooltip-text">
                {lang === 'id'
                  ? 'Halo! Ada rencana proyek desain? Konsultasi langsung yuk 👋'
                  : "Hi! Have a design project in mind? Let's chat directly 👋"}
              </p>
              <button
                type="button"
                className="floating-wa-tooltip-close"
                onClick={(e) => {
                  e.stopPropagation();
                  setWaTooltipOpen(false);
                }}
                aria-label="Dismiss WhatsApp tooltip"
                title={lang === 'id' ? 'Tutup pesan' : 'Close tip'}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Interactive Concierge Popup Card */}
          {waConciergeOpen && (
            <div
              ref={waConciergeRef}
              tabIndex={-1}
              className="wa-concierge-card"
              role="dialog"
              aria-modal="false"
              aria-label="WhatsApp Concierge"
              onWheel={(e) => {
                if (waBodyRef.current) {
                  waBodyRef.current.scrollTop += e.deltaY;
                  e.stopPropagation();
                }
              }}
            >
              {/* Header */}
              <div className="wa-concierge-header">
                <div className="wa-concierge-profile">
                  <div className="wa-concierge-avatar-wrap">
                    <img
                      src={DEFAULT_CONFIG.photoUrl || '/assets/images/about-portrait.png'}
                      alt="SEZKY Studio"
                      className="wa-concierge-avatar"
                    />
                    <span className="wa-concierge-online-badge" title="Online" />
                  </div>
                  <div className="wa-concierge-info">
                    <div className="wa-concierge-title-row">
                      <h4 className="wa-concierge-name">SEZKY Studio</h4>
                      <span className="wa-concierge-verified-check">✓</span>
                    </div>
                    <p className="wa-concierge-status">
                      <span className="wa-status-dot" />
                      {lang === 'id' ? 'Online • Balas cepat (< 15 mnt)' : 'Online • Replies in minutes'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playUISound('click');
                    setWaConciergeOpen(false);
                  }}
                  className="wa-concierge-close"
                  aria-label="Tutup Concierge"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Body */}
              <div ref={waBodyRef} className="wa-concierge-body">
                <div className="wa-concierge-time">
                  <span>{lang === 'id' ? 'Hari ini' : 'Today'}</span>
                </div>

                {/* Incoming studio message */}
                <div className="wa-bubble-incoming">
                  <div className="wa-bubble-avatar-mini">
                    <img
                      src={DEFAULT_CONFIG.photoUrl || '/assets/images/about-portrait.png'}
                      alt="SEZKY"
                    />
                  </div>
                  <div className="wa-bubble-content">
                    <div className="wa-bubble-sender-row">
                      <span className="wa-bubble-sender">SEZKY Studio</span>
                      <span className="wa-bubble-timestamp">Just now</span>
                    </div>
                    <p className="wa-bubble-text">
                      {lang === 'id'
                        ? 'Halo! Selamat datang di SEZKY Studio 👋 Ada rencana proyek visual branding, kemasan, atau 3D? Pilih topik di bawah atau ketik langsung pesanmu:'
                        : 'Hi! Welcome to SEZKY Studio 👋 Planning a brand identity, packaging, or 3D visual? Pick a quick topic below or type your message:'}
                    </p>
                  </div>
                </div>

                {/* Quick discussion prompts */}
                <div className="wa-prompts-label">
                  <Sparkles className="w-3 h-3 text-[#cf8047]" />
                  <span>{lang === 'id' ? 'Topik Diskusi Cepat:' : 'Quick Discussion Topics:'}</span>
                </div>
                <div className="wa-prompts-list">
                  {WA_CONCIERGE_PROMPTS.map((prompt) => (
                    <button
                      key={prompt.id}
                      type="button"
                      className="wa-prompt-pill"
                      onClick={() => {
                        if (soundEnabled) playUISound('click');
                        setWaConciergeMsg(prompt.message[lang]);
                      }}
                    >
                      <span className="wa-prompt-pill-icon">{prompt.icon}</span>
                      <span className="wa-prompt-pill-text">{prompt.label[lang]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Composer */}
              <div className="wa-concierge-footer">
                <div className="wa-composer-input-row">
                  <input
                    type="text"
                    value={waConciergeMsg}
                    onChange={(e) => setWaConciergeMsg(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendWhatsAppConcierge();
                      }
                    }}
                    placeholder={
                      lang === 'id'
                        ? 'Ketik pesan atau pilih topik...'
                        : 'Type message or pick topic...'
                    }
                    className="wa-composer-input"
                  />
                  <button
                    type="button"
                    onClick={() => handleSendWhatsAppConcierge()}
                    className="wa-composer-send-btn"
                    title={lang === 'id' ? 'Buka pesan di WhatsApp' : 'Open in WhatsApp'}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <div className="wa-concierge-footnote">
                  <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>
                    {lang === 'id'
                      ? 'Tersambung langsung ke WhatsApp Official Studio'
                      : 'Direct connection to Official Studio WhatsApp'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Trigger Button */}
          <button
            ref={waTriggerRef}
            type="button"
            onClick={() => {
              if (soundEnabled) playUISound('click');
              setWaConciergeOpen((prev) => !prev);
              setWaTooltipOpen(false);
              setWaHasInteracted(true);
            }}
            className={`floating-wa-btn ${waConciergeOpen ? 'active' : ''}`}
            aria-label={waConciergeOpen ? 'Close WhatsApp Concierge' : 'Open WhatsApp Concierge'}
          >
            <div className="floating-wa-icon-box">
              {!waConciergeOpen && (
                <span className="floating-wa-pulse-dot" aria-hidden="true" />
              )}
              {waConciergeOpen ? (
                <X className="w-4 h-4 text-white" />
              ) : (
                <WhatsAppIcon className="w-4 h-4 text-white" />
              )}
            </div>
            <span className="floating-wa-label">
              {waConciergeOpen
                ? (lang === 'id' ? 'Tutup Chat' : 'Close Chat')
                : (lang === 'id' ? 'Tanya SEZKY' : 'Chat Studio')}
            </span>
            {!waHasInteracted && !waConciergeOpen && (
              <span className="floating-wa-unread-badge">1</span>
            )}
          </button>
        </div>
      )}

      {/* GLOBAL COMMAND PALETTE (CTRL + K) */}
      {cmdPaletteOpen && (
        <div
          className="command-palette-backdrop"
          onClick={() => setCmdPaletteOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Command Menu"
        >
          <div className="command-palette-modal" onClick={(e) => e.stopPropagation()}>
            <div className="command-palette-input-wrap">
              <Search className="w-5 h-5 text-[#f3a875]" />
              <input
                type="text"
                autoFocus
                value={cmdSearchQuery}
                onChange={(e) => setCmdSearchQuery(e.target.value)}
                placeholder={lang === 'id' ? 'Cari proyek, navigasi, atau tindakan cepat...' : 'Search projects, sections, quick actions...'}
                className="command-palette-input"
              />
              <kbd className="command-palette-kbd">ESC</kbd>
            </div>

            <div className="command-palette-results">
              {/* Quick Navigation Group */}
              <div className="command-palette-group-title">
                {lang === 'id' ? 'Navigasi Cepat' : 'Navigation'}
              </div>

              {[
                { label: lang === 'id' ? 'Beranda' : 'Home', sub: '#home', icon: Compass, target: 'home' },
                { label: lang === 'id' ? 'Tentang Studio' : 'About SEZKY', sub: '#about', icon: User, target: 'about' },
                { label: lang === 'id' ? 'Galeri Portofolio' : 'Portfolio Showcase', sub: '#works', icon: Boxes, target: 'works' },
                { label: lang === 'id' ? 'Testimoni Klien' : 'Client Testimonials', sub: '#testimonials', icon: Star, target: 'testimonials' },
                { label: lang === 'id' ? 'Hubungi Studio & Brief' : 'Contact & Brief Estimator', sub: '#contact', icon: Send, target: 'contact' },
              ]
                .filter((item) => !cmdSearchQuery || item.label.toLowerCase().includes(cmdSearchQuery.toLowerCase()))
                .map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      className="command-palette-item"
                      onClick={() => {
                        if (soundEnabled) playUISound('click');
                        scrollTo(item.target);
                        setCmdPaletteOpen(false);
                      }}
                    >
                      <div className="command-palette-item-left">
                        <div className="command-palette-item-icon">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <strong style={{ display: 'block', color: '#fff', fontSize: '0.875rem' }}>{item.label}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>{item.sub}</span>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-white/30" />
                    </button>
                  );
                })}

              {/* Projects Group */}
              <div className="command-palette-group-title" style={{ marginTop: '0.5rem' }}>
                {lang === 'id' ? 'Proyek & Desain' : 'Projects & Works'}
              </div>
              {filteredProjects
                .filter((p) => !cmdSearchQuery || p.title.toLowerCase().includes(cmdSearchQuery.toLowerCase()) || (p.tags && p.tags.toLowerCase().includes(cmdSearchQuery.toLowerCase())))
                .slice(0, 5)
                .map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="command-palette-item"
                    onClick={() => {
                      if (soundEnabled) playUISound('click');
                      setSelectedProject(p);
                      setActiveGalleryIndex(0);
                      setCmdPaletteOpen(false);
                    }}
                  >
                    <div className="command-palette-item-left">
                      <div className="command-palette-item-icon" style={{ background: 'rgba(207, 128, 71, 0.15)' }}>
                        <Package2 className="w-4 h-4 text-[#cf8047]" />
                      </div>
                      <div>
                        <strong style={{ display: 'block', color: '#fff', fontSize: '0.875rem' }}>{p.title}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#f3a875' }}>{p.category || 'Portfolio'}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.6875rem', padding: '0.2rem 0.5rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}>
                      {lang === 'id' ? 'Buka Detail' : 'Open'}
                    </span>
                  </button>
                ))}

              {/* Quick Actions Group */}
              <div className="command-palette-group-title" style={{ marginTop: '0.5rem' }}>
                {lang === 'id' ? 'Tindakan Langsung' : 'Direct Actions'}
              </div>

              {DEFAULT_CONFIG.whatsapp && (
                <button
                  type="button"
                  className="command-palette-item"
                  onClick={() => {
                    if (soundEnabled) playUISound('click');
                    window.open(`https://wa.me/${DEFAULT_CONFIG.whatsapp}?text=Halo%20SEZKY%20Studio%2C%20saya%20tertarik%20untuk%20diskusi%20proyek`, '_blank');
                    setCmdPaletteOpen(false);
                  }}
                >
                  <div className="command-palette-item-left">
                    <div className="command-palette-item-icon" style={{ background: 'rgba(37, 211, 102, 0.12)', color: '#25D366' }}>
                      <WhatsAppIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: '#fff', fontSize: '0.875rem' }}>WhatsApp Chat</strong>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>+{DEFAULT_CONFIG.whatsapp}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-white/30" />
                </button>
              )}

              {DEFAULT_CONFIG.cvUrl && (
                <button
                  type="button"
                  className="command-palette-item"
                  onClick={() => {
                    if (soundEnabled) playUISound('click');
                    window.open(DEFAULT_CONFIG.cvUrl!, '_blank');
                    setCmdPaletteOpen(false);
                  }}
                >
                  <div className="command-palette-item-left">
                    <div className="command-palette-item-icon" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' }}>
                      <PdfIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: '#fff', fontSize: '0.875rem' }}>{t.contact.cvCardTitle}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>PDF Resume / CV</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-white/30" />
                </button>
              )}

              {DEFAULT_CONFIG.email && (
                <button
                  type="button"
                  className="command-palette-item"
                  onClick={() => {
                    if (soundEnabled) playUISound('click');
                    navigator.clipboard.writeText(DEFAULT_CONFIG.email);
                    setCopiedField('email');
                    setTimeout(() => setCopiedField(null), 2000);
                  }}
                >
                  <div className="command-palette-item-left">
                    <div className="command-palette-item-icon" style={{ background: 'rgba(234, 67, 53, 0.12)', color: '#EA4335' }}>
                      <GmailIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: '#fff', fontSize: '0.875rem' }}>{lang === 'id' ? 'Salin Email Studio' : 'Copy Studio Email'}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>{DEFAULT_CONFIG.email}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: copiedField === 'email' ? '#25D366' : 'rgba(255,255,255,0.4)' }}>
                    {copiedField === 'email' ? '✓ Copied' : <Copy className="w-4 h-4" />}
                  </span>
                </button>
              )}

              <button
                type="button"
                className="command-palette-item"
                onClick={() => {
                  toggleSound();
                  setCmdPaletteOpen(false);
                }}
              >
                <div className="command-palette-item-left">
                  <div className="command-palette-item-icon">
                    {soundEnabled ? <Volume2 className="w-4 h-4 text-[#f3a875]" /> : <VolumeX className="w-4 h-4" />}
                  </div>
                  <div>
                    <strong style={{ display: 'block', color: '#fff', fontSize: '0.875rem' }}>
                      {soundEnabled ? (lang === 'id' ? 'Matikan Suara SFX' : 'Mute UI Sounds') : (lang === 'id' ? 'Aktifkan Suara SFX' : 'Enable UI Sounds')}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>Web Audio API SFX</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.6875rem', color: soundEnabled ? '#25D366' : 'rgba(255,255,255,0.4)' }}>
                  {soundEnabled ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>

            <div className="command-palette-footer">
              <span>{lang === 'id' ? 'Tekan ESC untuk keluar' : 'Press ESC to close'}</span>
              <span style={{ color: '#f3a875', fontWeight: 600 }}>SEZKY Studio</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
