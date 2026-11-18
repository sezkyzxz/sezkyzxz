'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface PageLoaderProps {
  onComplete?: () => void;
}

export default function PageLoader({ onComplete }: PageLoaderProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [visible, setVisible] = useState(() => !pathname?.startsWith('/admin'));
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (isAdmin) {
      return;
    }

    let isDone = false;
    const finish = () => {
      if (isDone) return;
      isDone = true;
      setProgress(100);
      setExiting(true);
      setTimeout(() => {
        setVisible(false);
        onCompleteRef.current?.();
      }, 600);
    };

    const startTime = performance.now();
    const DURATION = 900;

    function easeInOutCubic(t: number): number {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    let animationFrameId: number;

    function step(now: number) {
      if (isDone) return;
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / DURATION);
      const eased = easeInOutCubic(t);
      const currentProgress = Math.min(100, Math.round(eased * 100));

      setProgress(currentProgress);

      if (t < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setTimeout(finish, 80);
      }
    }

    animationFrameId = requestAnimationFrame(step);

    // Fail-safe: loader will auto-dismiss in 1.8 seconds max even on slow mobile networks
    const failSafeTimeout = setTimeout(finish, 1800);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(failSafeTimeout);
    };
  }, [isAdmin]);

  if (isAdmin || !visible) return null;

  const dismiss = () => {
    setProgress(100);
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      onCompleteRef.current?.();
    }, 400);
  };

  return (
    <div
      onClick={dismiss}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2.5rem',
        background: '#0a0a0a',
        color: '#ffffff',
        borderRadius: '0 0 2rem 2rem',
        transform: exiting ? 'translateY(-100%)' : 'translateY(0%)',
        transition: 'transform 0.75s cubic-bezier(0.22, 1, 0.36, 1)',
        pointerEvents: exiting ? 'none' : 'auto',
        cursor: 'pointer',
      }}
    >
      {/* Center content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          textAlign: 'center',
          opacity: exiting ? 0 : 1,
          transform: exiting ? 'translateY(-14px)' : 'translateY(0)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.875rem',
            textAlign: 'center',
          }}
        >
          <svg
            width="72"
            height="72"
            viewBox="0 0 270 270"
            style={{ color: '#ffffff', flexShrink: 0, display: 'block' }}
            aria-hidden="true"
          >
            <use href="#logo" />
          </svg>
          <span
            style={{
              fontWeight: 800,
              fontSize: '2rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#ffffff',
              lineHeight: 1,
            }}
          >
            SEZKY
          </span>
        </div>
        <p style={{ maxWidth: '26ch', fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, marginTop: '0.25rem' }}>
          Bold ideas, shipped with quiet precision.
        </p>
      </div>

      {/* Progress track & counter */}
      <div
        style={{
          width: 'min(22rem, 75vw)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          opacity: exiting ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
      >
        <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              background: '#ffffff',
              width: `${progress}%`,
              transition: 'width 0.1s ease-out',
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.45)',
          }}
        >
          <span>Loading</span>
          <span style={{ color: 'rgba(255,255,255,0.85)', fontVariantNumeric: 'tabular-nums' }}>
            {String(progress).padStart(3, '0')}
          </span>
        </div>
      </div>
    </div>
  );
}