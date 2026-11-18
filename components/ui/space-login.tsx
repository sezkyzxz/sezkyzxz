'use client';

import React, { useEffect, useRef, useState, useActionState } from 'react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { Eye, EyeOff, X, Loader2, CheckCircle2, AlertCircle, Check } from 'lucide-react';
import { loginAction, type LoginState } from '@/app/admin/login/actions';
import { createClient } from '@/lib/supabase/client';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="space-submit-btn relative"
      tabIndex={0}
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-neutral-300" />
          <span>Signing In...</span>
        </span>
      ) : (
        <span>Sign In</span>
      )}
    </button>
  );
}

export function SpaceLogin() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const initialState: LoginState = { error: null };
  const [state, formAction] = useActionState(loginAction, initialState);

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Forgot Password modal state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');

  // Mouse parallax for astronaut
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Interactive Deep Space Starfield with Cross Stars
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Stars generation
    const starCount = Math.floor((width * height) / 4800);
    interface Star {
      x: number;
      y: number;
      size: number;
      alpha: number;
      twinkleSpeed: number;
      isCross: boolean;
      color: string;
    }

    const stars: Star[] = [];
    const colors = ['#ffffff', '#ffffff', '#e2e8f0', '#fce7f3', '#fbcfe8', '#a5f3fc'];

    for (let i = 0; i < starCount; i++) {
      const isCross = Math.random() < 0.15; // 15% are 4-pointed cross stars
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isCross ? Math.random() * 5.5 + 3.5 : Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        isCross,
        color: isCross && Math.random() < 0.35 ? '#f472b6' : colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Mouse parallax
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetX = mouseX;
    let targetY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      const relX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const relY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      setMouseOffset({ x: relX * 16, y: relY * 12 });
    };
    window.addEventListener('mousemove', handleMouseMove);

    const drawCrossStar = (x: number, y: number, size: number, color: string, alpha: number) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.fillStyle = color;

      // Center soft glow
      ctx.shadowBlur = size * 1.8;
      ctx.shadowColor = color;

      // 4-pointed diamond star
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.quadraticCurveTo(x, y, x + size, y);
      ctx.quadraticCurveTo(x, y, x, y + size);
      ctx.quadraticCurveTo(x, y, x - size, y);
      ctx.quadraticCurveTo(x, y, x, y - size);
      ctx.closePath();
      ctx.fill();

      // Soft center pin
      ctx.beginPath();
      ctx.arc(x, y, size * 0.18, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      mouseX += (targetX - mouseX) * 0.04;
      mouseY += (targetY - mouseY) * 0.04;
      const offsetX = ((mouseX - width / 2) / width) * 16;
      const offsetY = ((mouseY - height / 2) / height) * 16;

      for (const star of stars) {
        star.alpha += star.twinkleSpeed;
        if (star.alpha > 0.95 || star.alpha < 0.2) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        const drawX = (star.x + offsetX * (star.size * 0.4) + width) % width;
        const drawY = (star.y + offsetY * (star.size * 0.4) + height) % height;

        if (star.isCross) {
          drawCrossStar(drawX, drawY, star.size, star.color, star.alpha);
        } else {
          ctx.beginPath();
          ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = Math.max(0, Math.min(1, star.alpha));
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    setForgotError('');

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/admin/login`,
      });
      if (error) {
        setForgotError('Failed to send reset email. Make sure email is registered.');
      } else {
        setForgotSent(true);
      }
    } catch {
      setForgotError('An error occurred while processing your request.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#03060f] text-white flex flex-col items-center justify-center overflow-hidden px-4 select-none">
      {/* Custom Styles for Buttons, Animations, and Autofill */}
      <style jsx global>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-text-fill-color: #f5f5f5 !important;
          -webkit-box-shadow: 0 0 0px 1000px #0b0f19 inset !important;
          box-shadow: 0 0 0px 1000px #0b0f19 inset !important;
          transition: background-color 5000s ease-in-out 0s;
        }
        @keyframes astro-float {
          0%, 100% {
            transform: translateY(-8px) rotate(-1.5deg);
          }
          50% {
            transform: translateY(8px) rotate(1.5deg);
          }
        }
        @keyframes sparkle-pulse {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 10px #ff4bb8);
          }
          50% {
            transform: scale(1.22);
            filter: drop-shadow(0 0 18px #ff4bb8);
          }
        }

        /* Sign In Button UI */
        .space-submit-btn {
          width: 100%;
          height: 52px;
          margin-top: 8px;
          border-radius: 14px;
          background: #252831;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08);
          color: #f3f4f6;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.025em;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          user-select: none;
        }
        .space-submit-btn:hover {
          background: #2e323e;
          border-color: rgba(255, 255, 255, 0.25);
          color: #ffffff;
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transform: translateY(-1px);
        }
        .space-submit-btn:active {
          transform: scale(0.99) translateY(0);
        }
        .space-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Social Media Auth Buttons */
        .social-icon-btn {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: rgba(36, 39, 48, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
          color: #d1d5db;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
                      background 0.25s ease,
                      border-color 0.25s ease,
                      color 0.25s ease,
                      box-shadow 0.25s ease;
          cursor: pointer;
        }
        .social-icon-btn:hover {
          transform: scale(1.18) translateY(-2px);
          background: #343846;
          border-color: rgba(255, 255, 255, 0.35);
          color: #ffffff;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.65), 0 0 15px rgba(255, 255, 255, 0.12);
        }
        .social-icon-btn:active {
          transform: scale(0.95);
        }
      `}</style>

      {/* Interactive Canvas Starfield */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Atmospheric Horizon Glow at Bottom */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[350px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 65% 50% at 50% 100%, rgba(20, 75, 85, 0.45) 0%, rgba(9, 40, 48, 0.25) 45%, transparent 75%)',
          filter: 'blur(30px)',
        }}
      />

      {/* Main Container - Exact structure matching 21st.dev code */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-center">
        {/* Floating Astronaut (Desktop) */}
        <div
          className="hidden md:block absolute left-2 lg:left-12 xl:left-20 top-1/2 -translate-y-[65%] pointer-events-none z-20"
          style={{
            transform: `translateX(${mouseOffset.x}px) translateY(${mouseOffset.y}px)`,
            transition: 'transform 0.15s ease-out',
          }}
        >
          <div
            className="relative"
            style={{
              animation: 'astro-float 5s ease-in-out infinite',
            }}
          >
            <img
              alt="Floating Astronaut"
              className="w-40 sm:w-44 lg:w-52 h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)] filter contrast-125 select-none"
              draggable="false"
              src="/assets/images/astronaut.png"
            />
            {/* Sparkling Pink 4-Pointed Star */}
            <div
              className="absolute -right-3 top-1/2 -translate-y-1/2"
              style={{
                animation: 'sparkle-pulse 2.5s ease-in-out infinite',
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="pointer-events-none select-none w-6 h-6 text-[#ff4bb8]"
              >
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Center Form Card */}
        <div
          className="relative z-10 w-full max-w-[420px] mx-auto flex flex-col items-center"
          style={{ opacity: 1, transform: 'none' }}
        >
          {/* Mobile Astronaut Preview */}
          <div className="md:hidden flex justify-center mb-4">
            <div
              className="relative"
              style={{ animation: 'astro-float 5s ease-in-out infinite' }}
            >
              <img
                alt="Floating Astronaut"
                className="w-28 h-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)] filter contrast-125 select-none"
                draggable="false"
                src="/assets/images/astronaut.png"
              />
              <div className="absolute -right-2 top-1/2 -translate-y-1/2">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="pointer-events-none select-none w-5 h-5 text-[#ff4bb8] drop-shadow-[0_0_10px_#ff4bb8]"
                >
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-4xl sm:text-[42px] font-extrabold tracking-tight text-white mb-8 sm:mb-9 text-center drop-shadow-sm font-sans">
            Sign In
          </h1>

          {/* Error Message if any */}
          {state?.error && (
            <div className="w-full mb-4 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-950/60 p-3 text-xs text-red-200 backdrop-blur-md">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction} className="w-full flex flex-col gap-5">
            {/* Email Field - with pl-8 to shift text to the right */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="space-email"
                className="text-base font-semibold text-neutral-200 tracking-wide select-none"
              >
                Email
              </label>
              <div
                className="relative flex items-center justify-center overflow-hidden ease-out w-full h-[52px] min-h-[52px] transition-all duration-200"
                style={{
                  height: '52px',
                  borderRadius: '14px',
                  background: 'rgba(0, 0, 0, 0.35)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div className="w-full h-full flex items-center justify-center p-0 rounded-[inherit] relative z-10">
                  <div className="relative w-full h-[52px] min-h-[52px] flex items-center pl-8 pr-4">
                    <input
                      className="w-full h-full bg-transparent text-neutral-100 placeholder:text-neutral-400/70 border-none outline-none text-[15px] font-medium leading-none"
                      id="space-email"
                      name="email"
                      required
                      placeholder="name@example.com"
                      type="email"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Password Field - with pl-8 to shift text to the right */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="space-password"
                className="text-base font-semibold text-neutral-200 tracking-wide select-none"
              >
                Password
              </label>
              <div
                className="relative flex items-center justify-center overflow-hidden ease-out w-full h-[52px] min-h-[52px] transition-all duration-200"
                style={{
                  height: '52px',
                  borderRadius: '14px',
                  background: 'rgba(0, 0, 0, 0.35)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div className="w-full h-full flex items-center justify-center p-0 rounded-[inherit] relative z-10">
                  <div className="relative w-full h-[52px] min-h-[52px] flex items-center pl-8 pr-12">
                    <input
                      className="w-full h-full bg-transparent text-neutral-100 placeholder:text-neutral-400/70 border-none outline-none text-[15px] font-medium leading-none"
                      id="space-password"
                      name="password"
                      required
                      placeholder="••••••••••••"
                      type={showPassword ? 'text' : 'password'}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                      <button
                        type="button"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 text-neutral-400 hover:text-neutral-200 focus:outline-none transition-colors cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 transition-transform active:scale-90" />
                        ) : (
                          <Eye className="w-5 h-5 transition-transform active:scale-90" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Remember Me and Forget Password */}
            <div className="flex items-center justify-between text-xs sm:text-[13px] pt-1">
              <label className="flex items-center gap-2 cursor-pointer group select-none">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-4 h-4 rounded-[4px] border transition-all duration-150 flex items-center justify-center ${
                    rememberMe ? 'border-neutral-400 bg-white/10' : 'border-neutral-600 bg-white/5'
                  } group-hover:border-neutral-400`}
                >
                  {rememberMe && <Check className="w-3 h-3 text-white" />}
                </div>
                <input
                  type="checkbox"
                  name="rememberMe"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                />
                <span className="text-neutral-300 group-hover:text-white transition-colors">
                  Remember me
                </span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setShowForgot(true);
                  setForgotSent(false);
                  setForgotError('');
                }}
                className="text-neutral-300 hover:text-white font-medium transition-colors hover:underline underline-offset-4 select-none cursor-pointer"
              >
                Forget Password ?
              </button>
            </div>

            {/* Submit Button (Sign In) with distinct button UI */}
            <SubmitButton />

            {/* Don't Have an Account ? Sign Up */}
            <div className="text-center text-xs sm:text-[13px] text-neutral-400 mt-1">
              <span>Don’t Have an Account ? </span>
              <Link
                href="/"
                className="text-white font-bold hover:underline underline-offset-4 transition-colors"
              >
                Sign Up
              </Link>
            </div>

            {/* Thin Divider */}
            <div className="w-full flex items-center gap-3 my-1">
              <div className="flex-1 h-[1px] bg-white/[0.08]" />
            </div>

            {/* 5 Social Sign In Buttons with smooth scale and highlight hover animation */}
            <div className="flex items-center justify-center gap-2.5 sm:gap-3 w-full">
              {/* Google */}
              <button
                type="button"
                aria-label="Sign in with Google"
                className="social-icon-btn"
                tabIndex={0}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </button>

              {/* GitHub */}
              <button
                type="button"
                aria-label="Sign in with GitHub"
                className="social-icon-btn"
                tabIndex={0}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </button>

              {/* Facebook */}
              <button
                type="button"
                aria-label="Sign in with Facebook"
                className="social-icon-btn"
                tabIndex={0}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>

              {/* Windows */}
              <button
                type="button"
                aria-label="Sign in with Windows"
                className="social-icon-btn"
                tabIndex={0}
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M0 3.449L9.75 2.1v9.451H0V3.449zm10.75-1.551L24 0v11.551h-13.25V1.898zM0 12.449h9.75v9.451L0 20.551v-8.102zm10.75 0H24V24l-13.25-1.898v-9.653z" />
                </svg>
              </button>

              {/* Passkey */}
              <button
                type="button"
                aria-label="Sign in with Passkey"
                className="social-icon-btn"
                tabIndex={0}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-key-round w-4 h-4 -rotate-45"
                  aria-hidden="true"
                >
                  <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                  <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setShowForgot(false)}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#090d18] p-6 sm:p-8 shadow-2xl backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">Reset Password</h3>
              <button
                type="button"
                onClick={() => setShowForgot(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!forgotSent ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter your email address and we will send you a password reset link.
                </p>

                <div className="space-y-1.5">
                  <label htmlFor="forgot-email" className="block text-xs font-medium text-slate-300">
                    Email Address
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoFocus
                    className="w-full h-11 rounded-xl border border-slate-800 bg-[#060a12] px-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-slate-500 transition-colors"
                  />
                </div>

                {forgotError && (
                  <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-950/30 p-2.5 text-xs text-red-200">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span>{forgotError}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgot(false)}
                    className="rounded-xl px-4 py-2 text-xs font-medium text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="rounded-xl bg-[#252831] hover:bg-[#2d313c] border border-white/10 px-4 py-2 text-xs font-medium text-white transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    {forgotLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Reset Link Sent</h4>
                  <p className="mt-1 text-xs text-slate-400">
                    Password reset link has been sent to <strong className="text-slate-200">{forgotEmail}</strong>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="w-full rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2.5 text-xs font-medium text-white transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
