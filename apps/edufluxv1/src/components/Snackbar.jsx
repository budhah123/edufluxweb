import { useEffect, useState } from 'react';

/**
 * Snackbar – reusable top-right toast notification.
 *
 * Props:
 *   message   {string}  – Text to display. Pass empty string / null to hide.
 *   type      {string}  – 'success' | 'error' | 'warning' | 'info'  (default: 'info')
 *   duration  {number}  – Auto-dismiss delay in ms (default: 3500). Set 0 to disable.
 *   onClose   {fn}      – Called when the snackbar hides (so parent can reset state).
 */
export default function Snackbar({ message, type = 'info', duration = 3500, onClose }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  // Show whenever a new non-empty message arrives
  useEffect(() => {
    if (!message) return;
    setExiting(false);
    setVisible(true);

    if (!duration) return;
    const hideTimer = setTimeout(() => startExit(), duration);
    return () => clearTimeout(hideTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, duration]);

  const startExit = () => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 400); // matches snackbar-out duration
  };

  if (!visible || !message) return null;

  const variants = {
    success: {
      bar: 'bg-green-500',
      icon: 'check_circle',
      iconBg: 'bg-green-100 dark:bg-green-900/40',
      iconColor: 'text-green-600 dark:text-green-400',
      border: 'border-green-300 dark:border-green-700',
      shadow: 'shadow-green-100/50 dark:shadow-green-900/30',
    },
    error: {
      bar: 'bg-red-500',
      icon: 'error',
      iconBg: 'bg-red-100 dark:bg-red-900/40',
      iconColor: 'text-red-600 dark:text-red-400',
      border: 'border-red-300 dark:border-red-700',
      shadow: 'shadow-red-100/50 dark:shadow-red-900/30',
    },
    warning: {
      bar: 'bg-amber-500',
      icon: 'warning',
      iconBg: 'bg-amber-100 dark:bg-amber-900/40',
      iconColor: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-300 dark:border-amber-700',
      shadow: 'shadow-amber-100/50 dark:shadow-amber-900/30',
    },
    info: {
      bar: 'bg-blue-500',
      icon: 'info',
      iconBg: 'bg-blue-100 dark:bg-blue-900/40',
      iconColor: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-300 dark:border-blue-700',
      shadow: 'shadow-blue-100/50 dark:shadow-blue-900/30',
    },
  };

  const v = variants[type] ?? variants.info;
  const animClass = exiting ? 'snackbar-slide-out' : 'snackbar-slide-in';

  return (
    <>
      <style>{`
        @keyframes sb-in {
          from { opacity: 0; transform: translateX(110%); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes sb-out {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(110%); }
        }
        .snackbar-slide-in  { animation: sb-in  0.4s cubic-bezier(0.22,1,0.36,1) forwards; }
        .snackbar-slide-out { animation: sb-out 0.4s ease forwards; }
      `}</style>

      <div
        role="alert"
        aria-live="assertive"
        className={`
          ${animClass}
          fixed top-5 right-5 z-[9999]
          flex items-center gap-3
          bg-white dark:bg-[#1a1f2e]
          border ${v.border}
          shadow-xl ${v.shadow}
          rounded-xl px-5 py-4
          min-w-[280px] max-w-[380px]
          overflow-hidden
        `}
      >
        {/* Left accent bar */}
        <div className={`absolute left-0 top-0 h-full w-1 rounded-l-xl ${v.bar}`} />

        {/* Icon */}
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ml-1 ${v.iconBg} ${v.iconColor}`}>
          <span className="material-symbols-outlined text-[20px]">{v.icon}</span>
        </div>

        {/* Message */}
        <p className="flex-1 text-sm font-medium text-[#0f121a] dark:text-[#f9f9fb] leading-snug">
          {message}
        </p>

        {/* Close button */}
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={startExit}
          className="ml-1 shrink-0 text-[#556591] dark:text-[#a1accb] hover:text-[#0f121a] dark:hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </>
  );
}
