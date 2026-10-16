import { siteConfig } from '@/config/site';

/**
 * Form submission service.
 *
 * BACKEND INTEGRATION POINT: when VITE_API_BASE_URL is set, every form POSTs JSON to
 * `${VITE_API_BASE_URL}/${endpoint}`. The server must validate input again, apply rate-limiting /
 * CAPTCHA, store the record, and route it (email/CRM). Until then, submissions are handled by a local
 * mock that never claims an official submission.
 */

export type FormEndpoint =
  | 'admission-enquiries'
  | 'campus-visits'
  | 'contact-messages'
  | 'feedback'
  | 'grievances'
  | 'alumni-registrations'
  | 'newsletter'
  | 'placement-enquiries';

export interface SubmitResult {
  /** 'server' = accepted by a real backend; 'mock' = demo mode, nothing was sent anywhere */
  mode: 'server' | 'mock';
  reference: string;
}

export class SubmissionError extends Error {
  constructor(
    message: string,
    public readonly kind: 'spam' | 'network' | 'server',
  ) {
    super(message);
    this.name = 'SubmissionError';
  }
}

/** Minimum milliseconds between form render and submit — bots usually submit instantly. */
const MIN_FILL_TIME_MS = 2500;

export interface SpamGuard {
  /** Value of the hidden honeypot input; real users leave it empty */
  honeypot?: string;
  /** Date.now() captured when the form mounted */
  startedAt: number;
}

const makeReference = (endpoint: FormEndpoint) => {
  const prefix = endpoint.split('-').map((w) => w[0]).join('').toUpperCase();
  return `${prefix}-${Date.now().toString(36).toUpperCase().slice(-6)}`;
};

export async function submitForm<T extends object>(endpoint: FormEndpoint, payload: T, guard: SpamGuard): Promise<SubmitResult> {
  if (guard.honeypot) throw new SubmissionError('Submission blocked.', 'spam');
  if (Date.now() - guard.startedAt < MIN_FILL_TIME_MS) {
    throw new SubmissionError('That was quick! Please review your details and submit again.', 'spam');
  }

  if (!siteConfig.apiBaseUrl) {
    // Mock mode: simulate latency so loading states are visible.
    await new Promise((r) => setTimeout(r, 900));
    if (import.meta.env.DEV) console.info(`[mock submit] ${endpoint}`, payload);
    return { mode: 'mock', reference: makeReference(endpoint) };
  }

  let response: Response;
  try {
    response = await fetch(`${siteConfig.apiBaseUrl.replace(/\/$/, '')}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new SubmissionError('We couldn’t reach the server. Please check your connection and try again.', 'network');
  }
  if (!response.ok) {
    throw new SubmissionError('The server could not accept your submission right now. Please try again later or contact us by phone.', 'server');
  }
  const data = (await response.json().catch(() => ({}))) as { reference?: string };
  return { mode: 'server', reference: data.reference ?? makeReference(endpoint) };
}
