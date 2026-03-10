import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function GoogleCallback() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Wait until router is ready
    if (!router.isReady) return;

    const { token, accessToken, refreshToken, error } = router.query;

    if (error) {
      setErrorMsg(`Login failed: ${error}`);
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    const finalAccessToken = accessToken || token;

    if (finalAccessToken) {
      localStorage.setItem('auth_token', finalAccessToken);
      
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }

      router.push('/dashboard');
    } else {
      setErrorMsg('Authentication token missing.');
      setTimeout(() => router.push('/login'), 2000);
    }
  }, [router.isReady, router.query, router]);

  return (
    <>
      <Head>
        <title>Authenticating - Eduflux Admin</title>
      </Head>
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center justify-center font-display">
        {errorMsg ? (
          <div className="bg-white dark:bg-background-dark/50 shadow-xl rounded-xl p-8 border border-red-200 dark:border-red-800 text-center">
             <div className="text-red-500 mb-4">
                 <span className="material-symbols-outlined text-4xl">error</span>
             </div>
             <h2 className="text-red-600 dark:text-red-400 text-xl font-bold mb-2">Authentication Error</h2>
             <p className="text-gray-600 dark:text-gray-400">{errorMsg}</p>
             <p className="text-gray-500 dark:text-gray-500 text-sm mt-4">Redirecting back to login...</p>
          </div>
        ) : (
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
        )}
      </div>
    </>
  );
}
