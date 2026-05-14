'use client';

import { useState, useEffect } from 'react';

export default function DebugPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confession: 'I forgot my mom\'s birthday last week and she just brought it up' }),
    })
      .then((r) => r.json())
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch((e) => {
        setResult({ error: 'fetch_failed', message: String(e) });
        setLoading(false);
      });
  }, []);

  function getDiagnosis() {
    if (!result) return null;
    if (result.source === 'gemini') {
      return {
        status: 'ok',
        title: '✓ Everything is working',
        message: 'Your Gemini API is connected and generating real content. The app is ready for submission.',
        action: null,
      };
    }
    if (result.error === 'no_key') {
      return {
        status: 'fail',
        title: '✗ GEMINI_API_KEY env var is not set in Vercel',
        message: 'The server has no API key, so it can\'t call Gemini.',
        action: 'Go to vercel.com → your project → Settings → Environment Variables → Add New. Name: GEMINI_API_KEY (exact spelling). Value: your key from aistudio.google.com. Make sure all 3 checkboxes (Production, Preview, Development) are checked. Save. Then go to Deployments → click the latest one → click "Redeploy".',
      };
    }
    if (result.error === 'api_error') {
      return {
        status: 'fail',
        title: '✗ The Gemini API returned an error',
        message: result.detail || 'Either your API key is invalid, expired, or the model name is wrong.',
        action: '1) Double-check your key is correct at aistudio.google.com. 2) Verify the model in app/api/generate/route.js is "gemini-2.5-flash" (not the deprecated "gemini-2.0-flash"). 3) Make sure you committed and Vercel rebuilt.',
      };
    }
    if (result.error === 'bad_shape' || result.error === 'no_text') {
      return {
        status: 'warn',
        title: '⚠ Gemini answered but in the wrong shape',
        message: 'The model responded, but didn\'t return clean JSON. Usually a transient issue.',
        action: 'Refresh this page to retry. If it keeps happening, the model might be overloaded.',
      };
    }
    if (result.source === 'fallback') {
      return {
        status: 'fail',
        title: '✗ Falling back, unknown reason',
        message: 'Something failed but the server didn\'t tell us what.',
        action: 'Check the Vercel runtime logs: vercel.com → your project → Deployments → click latest → Functions tab. Look for "Gemini API error:" lines.',
      };
    }
    return {
      status: 'unknown',
      title: '?',
      message: 'Unexpected response shape.',
      action: 'Send Claude this screenshot.',
    };
  }

  const dx = getDiagnosis();

  return (
    <main className="min-h-screen p-6 font-mono text-sm">
      <h1 className="font-serif italic text-4xl text-yomies mb-1">debug</h1>
      <p className="text-soft text-[11px] uppercase tracking-widest mb-8">yomies system check</p>

      {loading && <p className="text-soft">running test…</p>}

      {!loading && dx && (
        <div className={`p-5 rounded-2xl border-2 mb-6 ${
          dx.status === 'ok' ? 'border-yomies bg-yomies/5' :
          dx.status === 'fail' ? 'border-heat bg-heat/5' :
          'border-ink/30 bg-ink/5'
        }`}>
          <h2 className="font-serif text-2xl mb-3 leading-tight">{dx.title}</h2>
          <p className="text-ink/80 mb-4 leading-relaxed">{dx.message}</p>
          {dx.action && (
            <div className="border-t border-ink/20 pt-4 mt-4">
              <p className="text-[10px] uppercase tracking-widest text-soft mb-2">how to fix</p>
              <p className="text-ink leading-relaxed text-[13px] whitespace-pre-wrap">{dx.action}</p>
            </div>
          )}
        </div>
      )}

      {!loading && result && (
        <details className="text-[11px]">
          <summary className="cursor-pointer text-soft uppercase tracking-widest mb-2">raw response (for claude)</summary>
          <pre className="bg-ink text-cream p-4 rounded-lg overflow-x-auto whitespace-pre-wrap break-words text-[10px]">
{JSON.stringify(result, null, 2)}
          </pre>
        </details>
      )}

      <div className="mt-8">
        <a href="/" className="text-yomies underline text-[11px] uppercase tracking-widest">← back to app</a>
      </div>
    </main>
  );
}
