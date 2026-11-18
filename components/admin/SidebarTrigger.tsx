'use client';

import React from 'react';
import { Menu } from 'lucide-react';

export default function SidebarTrigger() {
  return (
    <button
      type="button"
      className="admin-hamburger-btn"
      onClick={() => window.dispatchEvent(new CustomEvent('toggle-admin-sidebar'))}
      aria-label="Buka Menu Admin"
      title="Buka Menu Navigasi"
    >
      <Menu size={20} />
      <span>Menu</span>
    </button>
  );
}
