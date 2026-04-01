import React from 'react';

const iconClass = 'h-5 w-5';

const Footer = () => {
  return (
    <footer className="mt-12 border-t border-cyan-100 bg-white/85 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-5">
        <div className="flex items-center justify-center gap-7 text-slate-500">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-cyan-600 transition">
            <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden="true">
              <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.6-1.6h1.7V3.8c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9V10H8v3h2.7v8h2.8z" />
            </svg>
          </a>

          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-fuchsia-600 transition">
            <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden="true">
              <path d="M7.8 3h8.4A4.8 4.8 0 0 1 21 7.8v8.4a4.8 4.8 0 0 1-4.8 4.8H7.8A4.8 4.8 0 0 1 3 16.2V7.8A4.8 4.8 0 0 1 7.8 3zm0 1.8A3 3 0 0 0 4.8 7.8v8.4a3 3 0 0 0 3 3h8.4a3 3 0 0 0 3-3V7.8a3 3 0 0 0-3-3H7.8zm9.3 1.35a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1zM12 7.8A4.2 4.2 0 1 1 7.8 12 4.2 4.2 0 0 1 12 7.8zm0 1.8A2.4 2.4 0 1 0 14.4 12 2.4 2.4 0 0 0 12 9.6z" />
            </svg>
          </a>

          <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:text-slate-800 transition">
            <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden="true">
              <path d="M18.9 3H22l-6.8 7.8L23 21h-6.1l-4.8-6.3L6.6 21H3.5l7.3-8.3L3 3h6.2l4.3 5.7L18.9 3zm-1.1 16.2h1.7L8.2 4.7H6.4l11.4 14.5z" />
            </svg>
          </a>

          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-rose-600 transition">
            <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden="true">
              <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 4.8 12 4.8 12 4.8s-6 0-7.7.5A2.7 2.7 0 0 0 2.4 7.2 28.2 28.2 0 0 0 2 12a28.2 28.2 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9A28.2 28.2 0 0 0 22 12a28.2 28.2 0 0 0-.4-4.8zM10.1 15.4V8.6L15.8 12l-5.7 3.4z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
