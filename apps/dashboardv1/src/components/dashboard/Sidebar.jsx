import Link from 'next/link';
import { useRouter } from 'next/router';

const navLinks = [
  { href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/dashboard/users', icon: 'group', label: 'User Management' },
  { href: '/dashboard/courses', icon: 'school', label: 'Course Management' },
  { href: '/dashboard/reports', icon: 'analytics', label: 'System Reports' },
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-solid border-[#ebe9f2] dark:border-white/10 bg-white dark:bg-background-dark hidden md:flex flex-col">
      <div className="flex flex-col h-full p-4">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="bg-primary flex items-center justify-center rounded-lg size-10 text-white">
            <span className="material-symbols-outlined">school</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-[#120f1a] dark:text-white text-lg font-bold leading-none">Eduflux</h1>
            <p className="text-[#655591] dark:text-[#a397c5] text-xs font-normal">Admin Portal</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 flex-grow">
          {navLinks.map(({ href, icon, label }) => {
            const isActive = router.pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-[#120f1a] dark:text-[#ebe9f2] hover:bg-background-light dark:hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">{icon}</span>
                <p className="text-sm font-medium">{label}</p>
              </Link>
            );
          })}

          <div className="my-4 border-t border-[#ebe9f2] dark:border-white/10" />

          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#120f1a] dark:text-[#ebe9f2] hover:bg-background-light dark:hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">settings</span>
            <p className="text-sm font-medium">Settings</p>
          </Link>
        </nav>

        {/* Help Button */}
        <button className="flex w-full items-center justify-center gap-2 rounded-lg h-11 px-4 bg-primary/10 text-primary dark:bg-primary dark:text-white text-sm font-bold mt-auto transition-opacity hover:opacity-90">
          <span className="material-symbols-outlined text-base">help_outline</span>
          <span>Help Center</span>
        </button>

      </div>
    </aside>
  );
}
