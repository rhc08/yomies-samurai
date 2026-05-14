'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PROMPTS = [
  'avoiding my mom\'s calls again',
  'three meetings before noon',
  'pretending the deck is done',
  'sunday refused to end',
  'tired but not allowed to be',
  'inbox: 47, energy: 3',
];

export default function Home() {
  const router = useRouter();
  const [confession, setConfession] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PROMPTS.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const stored = parseInt(localStorage.getItem('yomies_orders') || '0', 10);
    setOrderCount(stored);
  }, []);

  async function handleSubmit() {
    if (!confession.trim() || submitting) return;
    setSubmitting(true);
    localStorage.setItem('yomies_confession', confession.trim());
    localStorage.removeItem('yomies_drinks'); // force fresh generation
    router.push('/menu');
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Top utility bar — feels like the delivery app surface */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-soft">
        <span>delivered by · talabat</span>
        <span>dubai · {orderCount > 0 ? `${orderCount} ordered` : 'now serving'}</span>
      </div>

      {/* Hero */}
      <div className="flex-1 px-6 pt-12 pb-8 max-w-md mx-auto w-full">
        <div className="rise rise-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-ink/15 rounded-full text-[10px] font-mono uppercase tracking-widest mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-heat animate-pulse"></span>
            <span>menu refreshes in 2h 47m</span>
          </div>
        </div>

        <h1 className="rise rise-2 font-serif text-[64px] leading-[0.95] tracking-tightest mb-4">
          the menu that <em className="text-yomies">doesn't exist</em>
        </h1>

        <p className="rise rise-3 text-soft text-base leading-relaxed mb-12 max-w-[22ch]">
          Most coffee apps make you choose from forty things you don't want. Tell us one true thing about your day. We'll handle the rest.
        </p>

        {/* Input */}
        <div className="rise rise-4 mb-6">
          <label className="block text-[11px] font-mono uppercase tracking-widest text-soft mb-3">
            how's your day going?
          </label>
          <textarea
            value={confession}
            onChange={(e) => setConfession(e.target.value)}
            placeholder={PROMPTS[placeholderIdx]}
            maxLength={140}
            rows={3}
            className="w-full bg-transparent border-0 border-b border-ink/30 focus:border-yomies focus:outline-none font-serif text-3xl leading-tight tracking-tight resize-none py-2 placeholder:text-ink/25 placeholder:italic transition-colors"
          />
          <div className="flex justify-between items-center mt-2 text-[11px] font-mono uppercase tracking-widest text-soft">
            <span>one line is enough</span>
            <span>{confession.length}/140</span>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!confession.trim() || submitting}
          className="rise rise-4 w-full bg-ink text-cream py-5 rounded-full font-mono uppercase tracking-[0.2em] text-xs lift hover:bg-yomies disabled:bg-ink/30 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'reading your day…' : 'serve me something'}
        </button>

        <p className="mt-4 text-center text-[11px] font-mono uppercase tracking-widest text-soft">
          we don't store your confession.
        </p>
      </div>

      {/* Bottom: "Today in Dubai" peek */}
      <div className="border-t border-line bg-ink text-cream py-5 px-6 overflow-hidden">
        <div className="text-[10px] font-mono uppercase tracking-widest text-cream/60 mb-2">
          today in dubai
        </div>
        <div className="font-serif italic text-lg">
          someone in marina just got served <span className="text-heat">"the pre-wedding spiral"</span>
        </div>
      </div>
    </main>
  );
}
