'use client';

import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/$/, '');
      const res = await fetch(
        `${baseUrl}/admin/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || `Login failed (${res.status})`);
      }

      // Store tokens — API returns accessToken + refreshToken
      const storage = rememberMe ? localStorage : sessionStorage;
      if (data?.accessToken) {
        storage.setItem('auth_token', data.accessToken);
      }
      if (data?.refreshToken) {
        storage.setItem('refresh_token', data.refreshToken);
      }

      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - Eduflux</title>
        <meta
          name="description"
          content="Login to the Eduflux admin portal to manage users, courses, and platform settings."
        />
      </Head>

      <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
        {/* Top Navigation Bar */}
        <header className="w-full bg-white dark:bg-background-dark border-b border-solid border-[#e9ebf2] dark:border-gray-800">
          <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-8 text-primary flex items-center justify-center">
                <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path
                    clipRule="evenodd"
                    d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-[#0f121a] dark:text-white text-xl font-bold leading-tight tracking-tight">
                Eduflux
              </h2>
            </div>
            <Link href="#" className="text-sm font-semibold text-primary hover:underline">
              Help Center
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="w-full max-w-[480px]">
            {/* Login Card */}
            <div className="bg-white dark:bg-background-dark/50 shadow-xl rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
              {/* Card Header */}
              <div className="pt-10 pb-6 px-10 text-center">
                <div className="inline-flex items-center justify-center size-16 bg-primary/10 rounded-full mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">person</span>
                </div>
                <h1 className="text-[#0f121a] dark:text-white text-3xl font-bold tracking-tight">
                  Welcome Back
                </h1>
                <p className="text-[#556591] dark:text-gray-400 mt-2">
                  Enter your credentials to access the admin portal
                </p>
              </div>

              {/* Login Form */}
              <form className="px-10 pb-10 space-y-5" onSubmit={handleSubmit} noValidate>

                {/* Error Banner */}
                {error && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg px-4 py-3 text-sm"
                  >
                    <span className="material-symbols-outlined text-[18px] mt-0.5 shrink-0">error</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-[#0f121a] dark:text-gray-200 text-sm font-medium">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="e.g. admin@eduflux.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full rounded-lg border border-[#d2d7e5] dark:border-gray-700 bg-[#f9f9fb] dark:bg-gray-800 px-4 py-3.5 text-[#0f121a] dark:text-white placeholder:text-[#556591] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="text-[#0f121a] dark:text-gray-200 text-sm font-medium">
                      Password
                    </label>
                    <Link href="#" className="text-xs font-semibold text-gray-500 hover:text-primary transition-colors">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full rounded-lg border border-[#d2d7e5] dark:border-gray-700 bg-[#f9f9fb] dark:bg-gray-800 px-4 py-3.5 pr-12 text-[#0f121a] dark:text-white placeholder:text-[#556591] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#556591] hover:text-primary"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2 py-1">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                    className="rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-60"
                  />
                  <label htmlFor="remember" className="text-sm text-[#556591] dark:text-gray-400">
                    Keep me logged in
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  id="login-submit"
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
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
                      Logging in…
                    </>
                  ) : (
                    'Login to Portal'
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-background-dark px-2 text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* SSO Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    id="sso-google"
                    type="button"
                    className="flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Google</span>
                  </button>

                  <button
                    id="sso-microsoft"
                    type="button"
                    className="flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.4 2H2v9.4h9.4V2z" fill="#F25022" />
                      <path d="M22 2h-9.4v9.4H22V2z" fill="#7FBA00" />
                      <path d="M11.4 12.6H2V22h9.4v-9.4z" fill="#00A4EF" />
                      <path d="M22 12.6h-9.4V22H22v-9.4z" fill="#FFB900" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Microsoft</span>
                  </button>
                </div>
              </form>

              {/* Card Footer */}
              <div className="bg-gray-50 dark:bg-gray-800/50 px-10 py-5 text-center border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don&apos;t have an account?{' '}
                  <Link href="#" className="text-primary font-bold hover:underline">
                    Create an account
                  </Link>
                </p>
              </div>
            </div>

            {/* Footer Links */}
            <div className="mt-8 flex justify-center gap-6">
              <Link href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                Contact Support
              </Link>
            </div>
          </div>
        </main>

        {/* Bottom accent bar */}
        <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
      </div>
    </>
  );
}
