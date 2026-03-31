'use client';

import { useState } from 'react';

// Hidden admin page — excluded from sitemap and robots.txt.
// Two-tier Notion sync:
//   Quick Refresh → revalidateTag('notion') — updates ISR-cached pages instantly
//   Full Rebuild  → Vercel Deploy Hook      — updates everything incl. pages.json (~3-5 min)
//
// Protected by a password field (sends REFRESH_SECRET as Bearer token).
// The secret never enters the JS bundle — you type it in the browser.

function StatusMessage({ status }) {
  if (!status) return null;
  const styles = {
    loading: { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--fg-muted)' },
    success: { background: '#f0fdf4', border: '1px solid #86efac', color: '#166534' },
    error:   { background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b' },
  };
  return (
    <div className="px-4 py-3 rounded-xl text-sm mt-4" style={styles[status.type]}>
      {status.message}
    </div>
  );
}

function RefreshCard({ title, description, buttonLabel, onAction, disabled, status }) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-4"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div>
        <p className="font-semibold text-base mb-1" style={{ color: 'var(--fg)' }}>{title}</p>
        <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>{description}</p>
      </div>
      <button
        onClick={onAction}
        disabled={disabled}
        className="self-start px-5 py-3 rounded-full text-sm font-semibold transition-colors duration-200"
        style={{
          background: disabled ? 'var(--surface)' : 'var(--brand)',
          color: disabled ? 'var(--fg-muted)' : '#ffffff',
          border: `2px solid ${disabled ? 'var(--border)' : 'var(--brand)'}`,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        {disabled ? 'Working…' : buttonLabel}
      </button>
      <StatusMessage status={status} />
    </div>
  );
}

export default function AdminRefreshPage() {
  const [secret, setSecret]           = useState('');
  const [isrStatus, setIsrStatus]     = useState(null);
  const [buildStatus, setBuildStatus] = useState(null);
  const [isrBusy, setIsrBusy]         = useState(false);
  const [buildBusy, setBuildBusy]     = useState(false);

  async function callApi(endpoint, setBusy, setStatus) {
    setBusy(true);
    setStatus({ type: 'loading', message: 'Working…' });
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (secret) headers['Authorization'] = `Bearer ${secret}`;

      const res  = await fetch(endpoint, { method: 'POST', headers });
      const data = await res.json();
      setStatus(data.ok
        ? { type: 'success', message: data.message }
        : { type: 'error',   message: data.error ?? 'Something went wrong.' }
      );
    } catch {
      setStatus({ type: 'error', message: 'Network error.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{ background: 'var(--background)', color: 'var(--fg)' }}
    >
      <div className="w-full max-w-lg">

        <div className="mb-8">
          <p className="text-xs font-mono mb-2" style={{ color: 'var(--fg-muted)' }}>/admin/refresh</p>
          <h1 className="text-2xl font-semibold mb-2">Notion Sync</h1>
          <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>
            Pull fresh content from Notion. Use Quick Refresh for text edits.
            Use Full Rebuild when you add projects or update case study images.
          </p>
        </div>

        {/* Password field */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--fg)' }}>
            Secret
          </label>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="REFRESH_SECRET value"
            className="w-full px-4 py-3 rounded-xl text-sm"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--fg)',
              outline: 'none',
            }}
          />
          <p className="text-xs mt-1.5" style={{ color: 'var(--fg-muted)' }}>
            Leave blank if REFRESH_SECRET is not set on Vercel.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <RefreshCard
            title="Quick Refresh"
            description="Clears the ISR cache for home, work, about, awards, and contact pages. Takes effect on the next page load. Does not update project body content or images."
            buttonLabel="Quick Refresh"
            onAction={() => callApi('/api/revalidate', setIsrBusy, setIsrStatus)}
            disabled={isrBusy}
            status={isrStatus}
          />

          <RefreshCard
            title="Full Rebuild"
            description="Triggers a complete Vercel build — re-syncs all Notion content including project body text, images, and new projects. Takes 3–5 minutes."
            buttonLabel="Full Rebuild"
            onAction={() => callApi('/api/deploy', setBuildBusy, setBuildStatus)}
            disabled={buildBusy}
            status={buildStatus}
          />
        </div>

        <p className="text-xs mt-8 text-center" style={{ color: 'var(--fg-muted)' }}>
          Excluded from sitemap and search engines.
        </p>
      </div>
    </div>
  );
}
