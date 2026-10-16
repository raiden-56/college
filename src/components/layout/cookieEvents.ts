/** Lets any component (e.g. the footer link) reopen the cookie preferences dialog. */
export const COOKIE_PREFS_EVENT = 'bapuji:open-cookie-preferences';

export const openCookiePreferences = () => window.dispatchEvent(new Event(COOKIE_PREFS_EVENT));

export interface CookieConsentState {
  decided: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt?: string;
}

export const COOKIE_STORAGE_KEY = 'bapuji-cookie-consent-v1';
