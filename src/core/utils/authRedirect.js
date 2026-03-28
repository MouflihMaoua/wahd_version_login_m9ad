/**
 * Base URL for auth redirects (password recovery, OAuth).
 * Prefer VITE_SITE_URL in production so it matches Supabase "Redirect URLs" exactly.
 */
export function getSiteOrigin() {
  const env = import.meta.env.VITE_SITE_URL;
  if (typeof env === 'string' && env.trim()) {
    return env.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return '';
}

/** Full URL where Supabase sends the user after clicking the reset link */
export function getPasswordResetRedirectUrl() {
  const base = getSiteOrigin();
  return `${base}/reinitialiser-mot-de-passe`;
}
