import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// ── Derive initials from email ─────────────────────────────────────────────
function getInitials(email) {
  if (!email) return '?';
  const local = email.split('@')[0];
  const parts = local.split(/[._-]/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return local.slice(0, 2).toUpperCase();
}

// ── Hue from email (deterministic avatar colour) ───────────────────────────
function emailToHue(email) {
  if (!email) return 210; // default blue hue for empty/null
  let hash = 0;
  for (let i = 0; i < email.length; i++) hash = email.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
}

export default function Navbar() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(''); // '' = guest; string = logged in
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Check auth token on mount & route change
  useEffect(() => {
    const token =
      sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
    if (!token) { setUserEmail(''); return; }

    // Try to decode email from JWT payload
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserEmail(payload.email || payload.sub || '');
    } catch {
      setUserEmail(''); // token exists but can't decode — treat as guest
    }
  }, [router.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    setUserEmail('');
    setDropdownOpen(false);
    router.push('/login');
  }, [router]);

  const isLoggedIn = !!userEmail;
  const safeEmail = userEmail || '';
  const initials = getInitials(safeEmail);
  const hue = emailToHue(safeEmail);
  const avatarBg = `hsl(${hue}, 65%, 52%)`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md py-4">
      <div className="flex w-full items-center justify-between px-6 md:px-10">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
            <span className="material-symbols-outlined text-2xl">grid_view</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-primary dark:text-white">Eduflux</h2>
        </Link>

        {/* ── Desktop nav links ── */}
        <nav className="hidden md:flex flex-1 justify-center gap-10">
          <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">About</a>
        </nav>

        {/* ── Right side ── */}
        <div className="flex items-center gap-3">

          {/* Guest buttons */}
          {userEmail === '' && (
            <>
              <Link
                href="/login"
                className="hidden sm:flex h-10 items-center justify-center rounded-lg px-5 text-sm font-bold text-primary hover:bg-primary/5 transition-all"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Authenticated — profile avatar + dropdown */}
          {isLoggedIn && (
            <div className="relative" ref={dropdownRef}>
              <button
                id="profile-menu-btn"
                type="button"
                aria-label="Open profile menu"
                aria-expanded={dropdownOpen}
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full ring-2 ring-primary/20 hover:ring-primary/50 transition-all focus:outline-none focus:ring-primary"
              >
                {/* Avatar circle */}
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white text-sm font-bold select-none shadow-md"
                  style={{ background: avatarBg }}
                  aria-hidden="true"
                >
                  {initials}
                </div>
              </button>

              {/* ── Dropdown ── */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-xl bg-white dark:bg-[#1a1f2e] border border-[#e9ebf2] dark:border-[#2d3244] shadow-xl shadow-black/10 dark:shadow-black/40 overflow-hidden z-50">

                  {/* Email header */}
                  <div className="flex items-center gap-3 px-4 py-4 border-b border-[#e9ebf2] dark:border-[#2d3244]">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white text-sm font-bold shadow"
                      style={{ background: avatarBg }}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#556591] dark:text-[#a1accb] mb-0.5">Signed in as</p>
                      <p className="text-sm font-semibold text-[#0f121a] dark:text-white truncate">{userEmail}</p>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-[#0f121a] dark:text-[#f9f9fb] hover:bg-[#f4f6fb] dark:hover:bg-[#252b3b] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px] text-[#556591] dark:text-[#a1accb]">account_circle</span>
                      My Profile
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-[#0f121a] dark:text-[#f9f9fb] hover:bg-[#f4f6fb] dark:hover:bg-[#252b3b] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px] text-[#556591] dark:text-[#a1accb]">settings</span>
                      Settings
                    </Link>

                    <div className="my-1 h-px bg-[#e9ebf2] dark:bg-[#2d3244]" />

                    <button
                      type="button"
                      id="logout-btn"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">logout</span>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Toggle mobile menu"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="flex md:hidden h-10 w-10 items-center justify-center rounded-lg text-[#556591] hover:bg-primary/5 transition-colors ml-1"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-primary/10 bg-background-light/95 dark:bg-background-dark/95 px-6 py-4 flex flex-col gap-1 backdrop-blur-md">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-3 text-sm font-medium hover:text-primary transition-colors border-b border-[#e9ebf2] dark:border-[#2d3244]"
          >
            Features
          </a>
          <a
            href="#"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-3 text-sm font-medium hover:text-primary transition-colors border-b border-[#e9ebf2] dark:border-[#2d3244]"
          >
            Pricing
          </a>
          <a
            href="#"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-3 text-sm font-medium hover:text-primary transition-colors border-b border-[#e9ebf2] dark:border-[#2d3244]"
          >
            About
          </a>

          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-3 py-3 border-b border-[#e9ebf2] dark:border-[#2d3244]">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white text-sm font-bold"
                  style={{ background: avatarBg }}
                >
                  {initials}
                </div>
                <span className="text-sm font-medium truncate">{userEmail}</span>
              </div>
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-3 text-sm font-medium hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">account_circle</span> My Profile
              </Link>
              <Link href="/settings" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-3 text-sm font-medium hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">settings</span> Settings
              </Link>
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="flex items-center gap-2 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:opacity-80 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span> Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3 pt-3">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex h-10 items-center justify-center rounded-lg border border-primary text-primary text-sm font-bold hover:bg-primary/5 transition-all">
                Login
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="flex h-10 items-center justify-center rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
