import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Snackbar from '@/components/Snackbar';

export default function GoogleCallback() {
  const router = useRouter();
  const [snackbar, setSnackbar] = useState({ message: '', type: 'info' });

  useEffect(() => {
    // Wait until router is ready and query parameters are parsed
    if (!router.isReady) return;

    const { token, accessToken, refreshToken, error } = router.query;

    if (error) {
      setSnackbar({ message: `Login failed: ${error}`, type: 'error' });
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    // Depending on backend, the token might be named 'token' or 'accessToken'
    const finalAccessToken = accessToken || token;

    if (finalAccessToken) {
      localStorage.setItem('auth_token', finalAccessToken);
      
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }

      setSnackbar({ message: 'Login successful! Redirecting...', type: 'success' });
      setTimeout(() => router.push('/dashboard'), 1500);
    } else {
      setSnackbar({ message: 'Authentication token missing.', type: 'error' });
      setTimeout(() => router.push('/login'), 2000);
    }
  }, [router.isReady, router.query, router]);

  return (
    <>
      <Head>
        <title>Authenticating - Eduflux</title>
      </Head>
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center justify-center font-display">
        <div className="flex flex-col items-center justify-center gap-6">
          <svg
            className="animate-spin h-12 w-12 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <div className="text-center space-y-2">
            <h2 className="text-[#0f121a] dark:text-white text-2xl font-bold">
              Completing Authentication
            </h2>
            <p className="text-[#556591] dark:text-gray-400">
              Please wait while we log you in...
            </p>
          </div>
        </div>
        
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar({ message: '', type: 'info' })}
        />
      </div>
    </>
  );
}
