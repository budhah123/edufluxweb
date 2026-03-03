import { useState } from 'react';
import { useRouter } from 'next/router';

export default function TopNav({ userName = 'Alex Johnson', studentId = '2024883' }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    router.push('/');
  };

  return (
    <header className="flex items-center justify-between sticky top-0 z-10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-solid border-[#ebe9f2] dark:border-white/10 px-6 py-3">

      {/* Left: Menu + Search */}
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile menu hamburger */}
        <button className="md:hidden text-primary" aria-label="Open menu">
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* Search */}
        <div className="flex min-w-40 h-10 max-w-md w-full">
          <div className="flex w-full flex-1 items-stretch rounded-lg bg-[#ebe9f2] dark:bg-white/5 h-full border border-transparent focus-within:border-primary/30">
            <div className="text-[#655591] dark:text-[#a397c5] flex items-center justify-center pl-3">
              <span className="material-symbols-outlined text-xl">search</span>
            </div>
            <input
              type="text"
              className="flex w-full min-w-0 flex-1 bg-transparent border-none focus:ring-0 text-[#120f1a] dark:text-white placeholder:text-[#655591] px-3 text-sm font-normal"
              placeholder="Search for assignments or courses..."
            />
          </div>
        </div>
      </div>

      {/* Right: Actions + Profile */}
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          {/* Notifications */}
          <button
            className="relative flex items-center justify-center rounded-lg size-10 bg-[#ebe9f2] dark:bg-white/5 text-[#120f1a] dark:text-white hover:bg-primary/10 transition-colors"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></span>
          </button>

          {/* Messages */}
          <button
            className="flex items-center justify-center rounded-lg size-10 bg-[#ebe9f2] dark:bg-white/5 text-[#120f1a] dark:text-white hover:bg-primary/10 transition-colors"
            aria-label="Messages"
          >
            <span className="material-symbols-outlined">chat_bubble_outline</span>
          </button>
        </div>

        <div className="h-8 w-px bg-[#ebe9f2] dark:border-white/10" />

        {/* Profile + Logout dropdown */}
        <div className="relative flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold dark:text-white">{userName}</p>
            <p className="text-xs text-[#655591] dark:text-[#a397c5]">ID: {studentId}</p>
          </div>

          {/* Avatar — clicking toggles logout menu */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="size-10 rounded-full ring-2 ring-primary/20 bg-primary/10 flex items-center justify-center text-primary font-bold text-sm focus:outline-none"
            aria-label="Profile menu"
          >
            {userName.charAt(0)}
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 top-12 w-40 bg-white dark:bg-[#1e1830] border border-[#ebe9f2] dark:border-white/10 rounded-xl shadow-lg py-1 z-50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
