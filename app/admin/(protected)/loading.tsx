import React from 'react';

export default function ProtectedAdminLoading() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '55vh',
        width: '100%',
        gap: '16px',
        color: '#888888',
        animation: 'adminContentFadeIn 0.2s ease-in-out',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          border: '3px solid rgba(255, 255, 255, 0.08)',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'adminSpin 0.65s linear infinite',
        }}
      />
      <div style={{ fontSize: '0.85rem', color: '#777777', letterSpacing: '0.02em' }}>
        Memuat data...
      </div>
      <style>{`
        @keyframes adminSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes adminContentFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

