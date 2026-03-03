import { useState, useMemo } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Snackbar from './Snackbar';

// ── Password requirement rules ──────────────────────────────────────────────
const RULES = [
  { id: 'length',  label: 'At least 8 characters long',              test: (p) => p.length >= 8 },
  { id: 'case',    label: 'A mix of uppercase and lowercase letters', test: (p) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
  { id: 'numSym',  label: 'At least one number or symbol',           test: (p) => /[\d\W_]/.test(p) },
];

function PasswordInput({ id, label, icon, placeholder, value, onChange, show, onToggle, disabled }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <div className="relative flex items-center">
        <span className="material-symbols-outlined absolute left-3 text-slate-400 text-xl pointer-events-none">
          {icon}
        </span>
        <input
          id={id}
          type={show ? 'text' : 'password'}
          autoComplete={id === 'new-password' ? 'new-password' : 'new-password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none disabled:opacity-60 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          aria-label={show ? 'Hide password' : 'Show password'}
          onClick={onToggle}
          className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none transition-colors"
        >
          <span className="material-symbols-outlined text-xl">
            {show ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  const router = useRouter();
  const { token = '', email = '' } = router.query;

  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew]                 = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [isLoading, setIsLoading]             = useState(false);
  const [snackbar, setSnackbar]               = useState({ message: '', type: 'info' });

  const showSnackbar = (message, type = 'info') => setSnackbar({ message, type });

  // Live requirement checks
  const ruleResults = useMemo(
    () => RULES.map((r) => ({ ...r, passed: r.test(newPassword) })),
    [newPassword]
  );
  const allRulesPassed = ruleResults.every((r) => r.passed);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSnackbar({ message: '', type: 'info' });

    if (!newPassword || !confirmPassword) {
      showSnackbar('Please fill in both password fields.', 'error');
      return;
    }
    if (!allRulesPassed) {
      showSnackbar('Password does not meet the required criteria.', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      showSnackbar('Passwords do not match.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('https://eduflux-dev.onrender.com/auth/reset-password', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          token,
          password: newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || `Reset failed (${res.status})`);
      }

      showSnackbar('Password updated successfully! Redirecting to login…', 'success');
      setTimeout(() => router.push('/login'), 2500);
    } catch (err) {
      showSnackbar(err.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Set New Password - Eduflux</title>
        <meta
          name="description"
          content="Create a new password for your Eduflux account after OTP verification."
        />
      </Head>

      {/* Ambient background blobs */}
      <div className="fixed top-0 left-0 -z-10 w-full h-full overflow-hidden opacity-40 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[5%] right-[0%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 overflow-x-hidden">

        {/* Navigation Bar */}
        <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-6 md:px-20 py-4 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="text-primary">
              <svg className="size-8" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fillRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Eduflux</h1>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium">Assignments</Link>
            <Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium">Grades</Link>
            <Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium">Dashboard</Link>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md">

            {/* Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl shadow-primary/5 border border-slate-200 dark:border-slate-800 p-8 md:p-10 transition-all duration-300">

              {/* Card Header */}
              <div className="mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-3xl">lock_reset</span>
                </div>
                <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                  Set New Password
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-base">
                  Your OTP has been verified. Please create a new password for your Eduflux account.
                </p>
              </div>

              {/* Form */}
              <form className="space-y-6" onSubmit={handleSubmit} noValidate>

                {/* New Password */}
                <PasswordInput
                  id="new-password"
                  label="New Password"
                  icon="lock"
                  placeholder="Min. 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  show={showNew}
                  onToggle={() => setShowNew((v) => !v)}
                  disabled={isLoading}
                />

                {/* Confirm Password */}
                <PasswordInput
                  id="confirm-password"
                  label="Confirm New Password"
                  icon="verified_user"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  show={showConfirm}
                  onToggle={() => setShowConfirm((v) => !v)}
                  disabled={isLoading}
                />

                {/* Password Requirements */}
                <div className="bg-slate-50 dark:bg-slate-800/30 rounded-lg p-4 text-xs text-slate-500 dark:text-slate-400 space-y-2">
                  <p className="font-bold text-slate-600 dark:text-slate-300 mb-1">Password must contain:</p>
                  {ruleResults.map((rule) => (
                    <div key={rule.id} className="flex items-center gap-2">
                      <span
                        className={`material-symbols-outlined text-[14px] transition-colors ${
                          rule.passed ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'
                        }`}
                      >
                        {rule.passed ? 'check_circle' : 'circle'}
                      </span>
                      <span className={rule.passed ? 'text-slate-700 dark:text-slate-200' : ''}>{rule.label}</span>
                    </div>
                  ))}
                </div>

                {/* Passwords match indicator */}
                {confirmPassword && (
                  <div className={`flex items-center gap-2 text-xs font-medium ${
                    newPassword === confirmPassword ? 'text-emerald-500' : 'text-red-500'
                  }`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {newPassword === confirmPassword ? 'check_circle' : 'cancel'}
                    </span>
                    {newPassword === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  id="reset-password-submit"
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-6 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Updating Password…
                    </>
                  ) : (
                    <>
                      <span className="truncate">Update Password</span>
                      <span className="material-symbols-outlined text-xl">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>

              {/* Back to Login */}
              <div className="mt-8 text-center">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-primary hover:underline flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-base">keyboard_backspace</span>
                  Back to Login
                </Link>
              </div>
            </div>

            {/* Footer note */}
            <p className="mt-8 text-center text-sm text-slate-400 dark:text-slate-500">
              © 2024 Eduflux Systems. All rights reserved.
            </p>
          </div>
        </main>
      </div>

      {/* Snackbar */}
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar({ message: '', type: 'info' })}
      />
    </>
  );
}
