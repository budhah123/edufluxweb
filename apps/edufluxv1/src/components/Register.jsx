import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Snackbar from './Snackbar';

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ message: '', type: 'info' });

  const showSnackbar = (message, type = 'info') => setSnackbar({ message, type });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSnackbar({ message: '', type: 'info' });

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.password.trim()) {
      showSnackbar('Please fill in all required fields.', 'error');
      return;
    }
    if (form.password !== form.confirmPassword) {
      showSnackbar('Passwords do not match.', 'error');
      return;
    }
    if (!form.agreedToTerms) {
      showSnackbar('You must agree to the Terms of Service and Privacy Policy.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/$/, '');
      const res = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || `Registration failed (${res.status})`);
      }

      // Store tokens if returned immediately after registration
      if (data?.accessToken) sessionStorage.setItem('auth_token', data.accessToken);
      if (data?.refreshToken) sessionStorage.setItem('refresh_token', data.refreshToken);

      // Show success snackbar, then redirect after a short delay
      showSnackbar('Account created successfully! 🎉 Redirecting you…', 'success');
      setTimeout(() => {
        router.push(data?.accessToken ? '/dashboard' : '/login');
      }, 2500);
    } catch (err) {
      showSnackbar(err.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Register - Eduflux</title>
        <meta name="description" content="Create your Eduflux student account and join the learning community." />
      </Head>

      <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-[#0f121a] dark:text-[#f9f9fb]">

        {/* Top Navigation */}
        <header className="flex items-center justify-between border-b border-solid border-[#e9ebf2] dark:border-[#2d3244] px-10 py-3 bg-white dark:bg-[#1a1f2e]">
          <div className="flex items-center gap-4">
            <div className="size-6 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fillRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Eduflux</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-[#556591] dark:text-[#a1accb]">
              Already have an account?
            </span>
            <Link
              href="/login"
              className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-primary/10 text-primary dark:text-[#f9f9fb] text-sm font-bold transition hover:bg-primary/20"
            >
              Log in
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-[480px] flex flex-col gap-6">

            {/* Registration Card */}
            <div className="bg-white dark:bg-[#1a1f2e] p-8 rounded-xl shadow-sm border border-[#e9ebf2] dark:border-[#2d3244]">

              {/* Header */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-3xl">person_add</span>
                </div>
                <h1 className="text-[28px] font-bold leading-tight tracking-tight">Create your account</h1>
                <p className="text-[#556591] dark:text-[#a1accb] text-sm mt-2">
                  Join the student community at Eduflux
                </p>
              </div>

              {/* Form */}
              <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>



                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#556591] dark:text-[#a1accb] text-xl">badge</span>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        placeholder="John"
                        value={form.firstName}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full pl-10 rounded-lg border border-[#d2d7e5] dark:border-[#2d3244] bg-[#f9f9fb] dark:bg-[#121620] h-12 text-sm focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-[#556591]/60 outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#556591] dark:text-[#a1accb] text-xl">person</span>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        placeholder="Doe"
                        value={form.lastName}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full pl-10 rounded-lg border border-[#d2d7e5] dark:border-[#2d3244] bg-[#f9f9fb] dark:bg-[#121620] h-12 text-sm focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-[#556591]/60 outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#556591] dark:text-[#a1accb] text-xl">mail</span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@university.edu"
                      value={form.email}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full pl-10 rounded-lg border border-[#d2d7e5] dark:border-[#2d3244] bg-[#f9f9fb] dark:bg-[#121620] h-12 text-sm focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-[#556591]/60 outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Password Group */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="password" className="text-sm font-medium">Password</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#556591] dark:text-[#a1accb] text-xl">lock</span>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full pl-10 rounded-lg border border-[#d2d7e5] dark:border-[#2d3244] bg-[#f9f9fb] dark:bg-[#121620] h-12 text-sm focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-[#556591]/60 outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#556591] dark:text-[#a1accb] text-xl">lock_reset</span>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full pl-10 rounded-lg border border-[#d2d7e5] dark:border-[#2d3244] bg-[#f9f9fb] dark:bg-[#121620] h-12 text-sm focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-[#556591]/60 outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="mt-2 flex items-center gap-2">
                  <input
                    id="agreedToTerms"
                    name="agreedToTerms"
                    type="checkbox"
                    checked={form.agreedToTerms}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="rounded border-[#d2d7e5] text-primary focus:ring-primary disabled:opacity-60"
                  />
                  <label htmlFor="agreedToTerms" className="text-xs text-[#556591] dark:text-[#a1accb]">
                    I agree to the{' '}
                    <Link href="#" className="text-primary font-medium hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="#" className="text-primary font-medium hover:underline">Privacy Policy</Link>.
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  id="register-submit"
                  type="submit"
                  disabled={isLoading}
                  className="mt-4 flex w-full items-center justify-center rounded-lg h-12 bg-primary text-white text-base font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating Account…
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 my-2">
                  <div className="h-px flex-1 bg-[#e9ebf2] dark:bg-[#2d3244]" />
                  <span className="text-xs text-[#556591] dark:text-[#a1accb] font-medium uppercase tracking-wider">Or</span>
                  <div className="h-px flex-1 bg-[#e9ebf2] dark:bg-[#2d3244]" />
                </div>

                {/* Google SSO */}
                <button
                  id="sso-google"
                  type="button"
                  className="flex w-full items-center justify-center gap-3 rounded-lg h-12 border border-[#d2d7e5] dark:border-[#2d3244] bg-white dark:bg-[#1a1f2e] text-sm font-semibold hover:bg-[#f9f9fb] dark:hover:bg-[#121620] transition"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>
              </form>
            </div>

            {/* Footer Text */}
            <div className="text-center">
              <p className="text-sm text-[#556591] dark:text-[#a1accb]">
                Need help?{' '}
                <Link href="#" className="text-primary font-medium hover:underline">Contact support</Link>
              </p>
            </div>

            {/* Decorative Banner */}
            <div className="hidden md:flex w-full h-32 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-dashed border-primary/20 items-center justify-center">
              <div className="flex gap-4 opacity-40">
                <span className="material-symbols-outlined text-4xl text-primary">school</span>
                <span className="material-symbols-outlined text-4xl text-primary">book</span>
                <span className="material-symbols-outlined text-4xl text-primary">psychology</span>
              </div>
            </div>
          </div>
        </main>

        {/* Page Footer */}
        <footer className="px-10 py-6 text-center border-t border-[#e9ebf2] dark:border-[#2d3244]">
          <p className="text-xs text-[#556591] dark:text-[#a1accb]">
            © 2024 Eduflux Learning Systems. All rights reserved.
          </p>
        </footer>
      </div>

      {/* Snackbar */}
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        duration={snackbar.type === 'success' ? 2500 : 3500}
        onClose={() => setSnackbar({ message: '', type: 'info' })}
      />
    </>
  );
}
