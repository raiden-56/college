import { afterEach, describe, expect, it, vi } from 'vitest';
import { submitForm, SubmissionError } from '../api';

afterEach(() => {
  vi.useRealTimers();
});

describe('submitForm (mock mode, no VITE_API_BASE_URL)', () => {
  it('rejects honeypot submissions as spam', async () => {
    await expect(submitForm('contact-messages', {}, { honeypot: 'http://spam', startedAt: 0 })).rejects.toMatchObject({ kind: 'spam' });
  });

  it('rejects forms submitted faster than a human could fill them', async () => {
    const err = await submitForm('contact-messages', {}, { startedAt: Date.now() }).catch((e) => e);
    expect(err).toBeInstanceOf(SubmissionError);
    expect(err.kind).toBe('spam');
  });

  it('never reports a server submission without a backend', async () => {
    vi.useFakeTimers();
    const pending = submitForm('admission-enquiries', { a: 1 }, { startedAt: Date.now() - 10_000 });
    await vi.runAllTimersAsync();
    const result = await pending;
    expect(result.mode).toBe('mock');
    expect(result.reference).toMatch(/^AE-[A-Z0-9]{6}$/);
  });
});
