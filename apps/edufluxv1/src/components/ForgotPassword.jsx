import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Snackbar from './Snackbar';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ message: '', type: 'info' });

  const showSnackbar = (message, type = 'info') => setSnackbar({ message, type });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSnackbar({ message: '', type: 'info' });

    if (!email.trim()) {
      showSnackbar('Please enter your email address.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('https://eduflux-dev.onrender.com/auth/forgot-password', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || `Request failed (${res.status})`);
      }

      showSnackbar('OTP sent! Check your inbox.', 'success');
      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (err) {
      showSnackbar(err.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Forgot Password - Eduflux</title>
        <meta
          name="description"
          content="Reset your Eduflux account password. Enter your email to receive a password reset link."
        />
      </Head>

      <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display transition-colors duration-300">

        {/* Top Navigation Bar */}
        <header className="w-full px-6 md:px-10 lg:px-40 py-5 bg-background-light dark:bg-background-dark border-b border-[#e7ebf3] dark:border-gray-800">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 text-primary">
              <div className="size-8">
                <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path
                    clipRule="evenodd"
                    d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-[#0d121b] dark:text-white text-xl font-bold tracking-tight">
                Eduflux
              </h2>
            </div>

            {/* Login button */}
            <Link
              href="/login"
              className="hidden md:flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold tracking-wide transition-opacity hover:opacity-90"
            >
              Login
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-[480px]">

            {/* Card */}
            <div className="bg-white dark:bg-[#1a2133] rounded-xl shadow-sm border border-[#e7ebf3] dark:border-gray-800 p-8 md:p-10">

              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-4xl">lock_reset</span>
                </div>
              </div>

              {/* Headline */}
              <div className="mb-2 text-center">
                <h1 className="text-[#0d121b] dark:text-white text-3xl font-bold tracking-tight">
                  Forgot Password?
                </h1>
              </div>

              {/* Sub-text */}
              <div className="mb-8 text-center">
                <p className="text-[#4c669a] dark:text-gray-400 text-base font-normal leading-relaxed">
                  Enter your registered email address below. We&apos;ll send you a link to reset
                  your password and get you back to your assignments.
                </p>
              </div>

              {/* Form */}
              <form className="space-y-6" onSubmit={handleSubmit} noValidate>

                {/* Email field */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="forgot-email"
                    className="text-[#0d121b] dark:text-gray-200 text-sm font-semibold tracking-wide"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] text-xl pointer-events-none">
                      mail
                    </span>
                    <input
                      id="forgot-email"
                      type="email"
                      autoComplete="email"
                      placeholder="student@eduflux.edu"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="w-full pl-11 pr-4 rounded-lg border border-[#cfd7e7] dark:border-gray-700 bg-white dark:bg-[#101622] text-[#0d121b] dark:text-white h-14 placeholder:text-[#94a3b8] text-base font-normal focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    id="forgot-password-submit"
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-5 bg-primary text-white text-base font-bold tracking-wide transition-all hover:bg-primary/90 shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <span className="truncate">Send Verification</span>
                    )}
                  </button>
                </div>
              </form>

              {/* Back to login */}
              <div className="mt-8 pt-6 border-t border-[#f0f2f5] dark:border-gray-800 flex justify-center">
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  Back to Login
                </Link>
              </div>
            </div>

            {/* Help text below card */}
            <p className="mt-6 text-center text-[#4c669a] dark:text-gray-500 text-sm">
              Need more help?{' '}
              <Link href="#" className="text-primary font-medium hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 text-center text-[#94a3b8] text-xs">
          <p>© 2024 Eduflux Assignment Management System. All rights reserved.</p>
        </footer>

        {/* Bottom accent bar */}
        <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
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
