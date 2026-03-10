/**
 * Retrieves the auth token from either localStorage or sessionStorage.
 * Returns null if called server-side (no window object).
 */
export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return (
    localStorage.getItem('auth_token') ||
    sessionStorage.getItem('auth_token') ||
    null
  );
}

/**
 * Builds standard authorized fetch options, merging any extra options.
 */
export function authHeaders(extraHeaders = {}) {
  const token = getAuthToken();
  return {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...extraHeaders,
    },
  };
}
