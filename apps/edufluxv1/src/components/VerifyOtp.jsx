import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Snackbar from './Snackbar';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

function maskEmail(email = '') {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  const visible = local.slice(0, 1);
  return `${visible}${'*'.repeat(Math.max(local.length - 1, 3))}@${domain}`;
}

export default function VerifyOtp() {
  const router = useRouter();
  const { email = '' } = router.query;

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [snackbar, setSnackbar] = useState({ message: '', type: 'info' });
  const inputRefs = useRef([]);

  const showSnackbar = (message, type = 'info') => setSnackbar({ message, type });

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // Focus first input on mount
  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  const handleChange = (index, value) => {
    // Accept only a single digit
    if (!/^\d$/.test(value) && value !== '') return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        const next = [...otp];
        next[index] = '';
        setOtp(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...otp];
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      showSnackbar('Please enter all 6 digits of the OTP.', 'error');
      return;
    }
    if (!email) {
      showSnackbar('Email not found. Please restart the process.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('https://eduflux-dev.onrender.com/auth/verify-otp', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          token: String(otp.join('')),
          authTokenType: 'RESET_PASSWORD_VERIFICATION_TOKEN',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || `Verification failed (${res.status})`);
      }

      showSnackbar('OTP verified successfully! Redirecting…', 'success');
      const otpCode = String(otp.join(''));
      const resetToken = data?.resetToken || data?.token || otpCode;
      setTimeout(() => {
        router.push(
          `/reset-password?token=${encodeURIComponent(resetToken)}&email=${encodeURIComponent(email)}`
        );
      }, 2000);
    } catch (err) {
      showSnackbar(err.message || 'Invalid OTP. Please try again.', 'error');
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = useCallback(async () => {
    if (!canResend) return;
    try {
      const res = await fetch('https://eduflux-dev.onrender.com/auth/forgot-password', {
        method: 'POST',
        headers: { 'accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      showSnackbar('A new OTP has been sent to your email.', 'success');
      setOtp(Array(OTP_LENGTH).fill(''));
      setCountdown(RESEND_SECONDS);
      setCanResend(false);
      inputRefs.current[0]?.focus();
    } catch {
      showSnackbar('Failed to resend OTP. Please try again.', 'error');
    }
  }, [canResend, email]);

  return (
    <>
      <Head>
        <title>OTP Verification - Eduflux</title>
        <meta
          name="description"
          content="Verify your identity with a 6-digit OTP sent to your email address."
        />
      </Head>

      <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-[#0f121a] dark:text-white transition-colors duration-200 overflow-x-hidden">

        {/* Top Navigation */}
        <header className="flex items-center justify-between border-b border-solid border-[#e9ebf2] dark:border-[#2d3240] px-10 py-3 bg-white dark:bg-[#1a1f2e]">
          <div className="flex items-center gap-4 text-primary dark:text-[#5c7be6]">
            <div className="size-6">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fillRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-[#0f121a] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
              Eduflux
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all"
            >
              Support
            </Link>
          </div>
        </header>

        {/* Main */}
        <main className="flex flex-1 items-center justify-center py-12 px-4">
          <div className="flex flex-col max-w-[480px] w-full bg-white dark:bg-[#1a1f2e] p-8 rounded-xl shadow-sm border border-[#e9ebf2] dark:border-[#2d3240]">

            {/* Icon + Title */}
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary dark:text-[#5c7be6] mb-4">
                <span className="material-symbols-outlined text-4xl">verified_user</span>
              </div>
              <h1 className="text-[#0f121a] dark:text-white tracking-tight text-2xl font-bold leading-tight text-center">
                Verify Your Identity
              </h1>
              <p className="text-[#4f5b7a] dark:text-[#a1a8b9] text-sm font-normal leading-normal text-center mt-2 px-6">
                We&apos;ve sent a 6-digit code to your email
                <br />
                <span className="font-semibold text-[#0f121a] dark:text-white">
                  {email ? maskEmail(email) : 'your email'}
                </span>
              </p>
            </div>

            {/* OTP Inputs */}
            <form onSubmit={handleSubmit} noValidate>
              <div className="flex justify-center py-6">
                <fieldset className="flex gap-3 md:gap-4" aria-label="One-time password">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (inputRefs.current[i] = el)}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      pattern="\d*"
                      maxLength={1}
                      value={digit}
                      autoFocus={i === 0}
                      disabled={isLoading}
                      onChange={(e) => handleChange(i, e.target.value.slice(-1))}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      onPaste={i === 0 ? handlePaste : undefined}
                      onFocus={(e) => e.target.select()}
                      aria-label={`Digit ${i + 1}`}
                      className={`
                        flex h-14 w-12 text-center text-xl font-bold
                        focus:outline-none focus:ring-2 focus:ring-primary/50
                        border
                        bg-white dark:bg-[#121620]
                        rounded-lg text-[#0f121a] dark:text-white
                        transition-all
                        disabled:opacity-60 disabled:cursor-not-allowed
                        ${digit ? 'border-primary dark:border-primary' : 'border-[#d2d7e5] dark:border-[#3b4255]'}
                      `}
                    />
                  ))}
                </fieldset>
              </div>

              {/* Submit */}
              <div className="flex flex-col gap-3 px-4 pt-2">
                <button
                  id="otp-submit"
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#162a64] transition-colors disabled:opacity-70 disabled:cursor-not-allowed gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Verifying…
                    </>
                  ) : (
                    <span className="truncate">Verify &amp; Proceed</span>
                  )}
                </button>
              </div>
            </form>

            {/* Footer Options */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <p className="text-[#4f5b7a] dark:text-[#a1a8b9] text-sm font-normal">
                Didn&apos;t receive the code?{' '}
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-primary dark:text-[#5c7be6] font-semibold hover:underline"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <span className="text-[#0f121a] dark:text-white font-medium">
                    Resend in {formatTime(countdown)}
                  </span>
                )}
              </p>
              <Link
                href="/login"
                className="flex items-center gap-2 text-primary dark:text-[#5c7be6] text-sm font-semibold hover:underline"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Back to Login
              </Link>
            </div>
          </div>
        </main>

        {/* Decorative grid */}
        <div className="px-10 flex justify-center pb-10 opacity-40 pointer-events-none select-none">
          <div className="w-full max-w-[960px]">
            <div
              className="w-full rounded-lg min-h-[80px]"
              style={{
                backgroundImage:
                  'linear-gradient(to right,rgba(29,59,139,0.07) 1px,transparent 1px),linear-gradient(to bottom,rgba(29,59,139,0.07) 1px,transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-6 text-[#4f5b7a] dark:text-[#a1a8b9] text-xs">
          © 2024 Eduflux Learning Systems. Secure verification.
        </footer>
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
