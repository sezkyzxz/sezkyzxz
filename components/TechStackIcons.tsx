import React from 'react';

interface TechIconProps {
  className?: string;
}

export function HtmlIcon({ className = 'w-12 h-12' }: TechIconProps) {
  return (
    <img
      src="/assets/images/tech-stack/html.png"
      alt="HTML"
      className={className}
      loading="lazy"
    />
  );
}

export function CssIcon({ className = 'w-12 h-12' }: TechIconProps) {
  return (
    <img
      src="/assets/images/tech-stack/css.png"
      alt="CSS"
      className={className}
      loading="lazy"
    />
  );
}

export function JavaScriptIcon({ className = 'w-12 h-12' }: TechIconProps) {
  return (
    <img
      src="/assets/images/tech-stack/javascript.png"
      alt="JavaScript"
      className={className}
      loading="lazy"
    />
  );
}

export function TailwindIcon({ className = 'w-12 h-12' }: TechIconProps) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none">
      <path
        fill="#38BDF8"
        d="M64.004 25.6c-17.067 0-27.733 8.533-32 25.6 6.4-8.533 13.867-11.733 22.4-9.6 4.87 1.218 8.347 4.747 12.203 8.662C72.887 56.63 80.144 64 96.004 64c17.067 0 27.733-8.533 32-25.6-6.4 8.533-13.867 11.733-22.4 9.6-4.87-1.218-8.347-4.747-12.203-8.662C87.12 32.97 79.864 25.6 64.004 25.6zm-32 38.4c-17.067 0-27.733 8.533-32 25.6 6.4-8.533 13.867-11.733 22.4-9.6 4.87 1.218 8.347 4.747 12.203 8.662C40.887 95.03 48.144 102.4 64.004 102.4c17.067 0 27.733-8.533 32-25.6-6.4 8.533-13.867 11.733-22.4 9.6-4.87-1.218-8.347-4.747-12.203-8.662-6.275-6.368-13.531-13.738-29.397-13.738z"
      />
    </svg>
  );
}

export function ReactIcon({ className = 'w-12 h-12' }: TechIconProps) {
  return (
    <svg viewBox="-11.5 -10.23174 23 20.46348" className={className}>
      <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

export function ViteIcon({ className = 'w-12 h-12' }: TechIconProps) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none">
      <defs>
        <linearGradient id="viteGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#41D1FF" />
          <stop offset="100%" stopColor="#BD34FE" />
        </linearGradient>
        <linearGradient id="viteGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFEA83" />
          <stop offset="8%" stopColor="#FFDD35" />
          <stop offset="100%" stopColor="#FFA800" />
        </linearGradient>
      </defs>
      <path
        fill="url(#viteGrad1)"
        d="M119.2 22.4L67.2 115.6c-1.2 2.4-4.8 2.4-6 0L8.8 22.4c-1.6-2.8.4-6.4 3.6-6.4h26c2 0 3.6 1.2 4.4 2.8l21.2 44.8 21.2-44.8c.8-1.6 2.4-2.8 4.4-2.8h26c3.2 0 5.2 3.6 3.6 6.4z"
      />
      <path
        fill="url(#viteGrad2)"
        d="M79.2 14L46 63.2c-1.2 1.6 0 4 2 4h17.6l-9.6 34.8c-.8 2.8 2.8 4.4 4.4 2.4l35.2-50.8c1.2-1.6 0-4-2-4H76l11.2-31.6c.8-2.8-2.8-4.8-4.8-2z"
      />
    </svg>
  );
}

export function NodeJsIcon({ className = 'w-12 h-12' }: TechIconProps) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none">
      <path
        fill="none"
        stroke="#68A063"
        strokeWidth="9"
        strokeLinejoin="round"
        strokeLinecap="round"
        d="M64 12l48 27.7v56.6L64 124 16 96.3V39.7L64 12z"
      />
      <text
        x="64"
        y="78"
        textAnchor="middle"
        fill="#68A063"
        fontSize="44"
        fontWeight="800"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        JS
      </text>
    </svg>
  );
}

export function BootstrapIcon({ className = 'w-12 h-12' }: TechIconProps) {
  return (
    <svg viewBox="0 0 612 612" className={className} fill="none">
      <path
        fill="#7952B3"
        d="M612 510c0 56.1-45.9 102-102 102H102C45.9 612 0 566.1 0 510V102C0 45.9 45.9 0 102 0h408c56.1 0 102 45.9 102 102v408z"
      />
      <path
        fill="#FFFFFF"
        d="M166.3 133h173.5c32 0 57.7 7.3 77 22s29 36.8 29 66.5c0 18-4.4 33.4-13.2 46.2-8.8 12.8-21.4 22.8-37.8 29.8v1c22 4.7 38.7 15.1 50 31.2 11.3 16.2 17 36.4 17 60.8 0 14-2.5 27.1-7.5 39.2-5 12.2-12.8 22.7-23.5 31.5s-24.3 15.8-41 21-36.5 7.8-59.5 7.8h-164V133zm62.5 149.5h102c15 0 27.5-4.2 37.5-12.8s15-20.8 15-36.8c0-18-4.5-30.7-13.5-38s-22-11-39-11h-102v98.6zm0 156.5h110.5c19 0 33.8-4.9 44.2-14.8 10.5-9.8 15.8-23.8 15.8-41.8 0-17.7-5.2-31.2-15.8-40.8s-25.2-14.2-44.2-14.2H228.8V439z"
      />
    </svg>
  );
}

export function SupabaseIcon({ className = 'w-12 h-12' }: TechIconProps) {
  return (
    <svg viewBox="0 0 109 113" className={className} fill="none">
      <path
        fill="#3ECF8E"
        d="M63.7 110.3c-2.4 3.1-7.4 1.6-7.7-2.3l-3.8-49.8 44.8-1.5c4.7-.2 7.3 5.3 4.2 8.8l-37.5 44.8z"
      />
      <path
        fill="#249361"
        d="M45.3 2.7c2.4-3.1 7.4-1.6 7.7 2.3l3.8 49.8-44.8 1.5c-4.7.2-7.3-5.3-4.2-8.8L45.3 2.7z"
      />
    </svg>
  );
}

export function MaterialUiIcon({ className = 'w-12 h-12' }: TechIconProps) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none">
      <path fill="#0081CB" d="M0 13.2l40 23.1v23.1L0 36.3V13.2zm88 50.8l40-23.1v23.1l-40 23.1V64z" />
      <path fill="#007FFF" d="M40 36.3L80 59.4v23.1L40 59.4V36.3zm48 27.7l40-23.1v23.1l-40 23.1V64z" opacity="0.85" />
      <path fill="#00B0FF" d="M0 36.3l40 23.1v23.1L0 59.4V36.3zm45.3 26.1l40 23.1v23.1l-40-23.1V62.4z" />
      <path fill="#007FFF" d="M45.3 85.5l40 23.1 42.7-24.6V60.9l-42.7 24.6-40-23v23z" />
    </svg>
  );
}

export function VercelIcon({ className = 'w-12 h-12' }: TechIconProps) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none">
      <circle cx="64" cy="64" r="58" fill="#111827" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="3" />
      <path fill="#FFFFFF" d="M64 34L98 88H30L64 34z" />
    </svg>
  );
}

export function FigmaIcon({ className = 'w-12 h-12' }: TechIconProps) {
  return (
    <svg viewBox="0 0 38 57" className={className} fill="none">
      <path fill="#1ABCFE" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
      <path fill="#0ACF83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" />
      <path fill="#FF7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
      <path fill="#F24E1E" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
      <path fill="#A259FF" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
    </svg>
  );
}

export function AntigravityIcon({ className = 'w-12 h-12' }: TechIconProps) {
  return (
    <img
      src="/assets/images/tech-stack/antigravity.png"
      alt="Antigravity"
      className={className}
      loading="lazy"
    />
  );
}

export function CanvaIcon({ className = 'w-12 h-12' }: TechIconProps) {
  return (
    <img
      src="/assets/images/tech-stack/canva.png"
      alt="Canva"
      className={className}
      loading="lazy"
    />
  );
}

export function PhotoshopIcon({ className = 'w-12 h-12' }: TechIconProps) {
  return (
    <img
      src="/assets/images/tech-stack/photoshop.png"
      alt="Adobe Photoshop"
      className={className}
      loading="lazy"
    />
  );
}
