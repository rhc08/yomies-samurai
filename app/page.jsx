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

const FEED_LOOP = [
  { area: 'marina', drink: 'the pre-wedding spiral' },
  { area: 'difc', drink: 'q4 survival protocol' },
  { area: 'jbr', drink: 'a reason to live until friday' },
  { area: 'business bay', drink: "the eldest daughter's espresso" },
  { area: 'downtown', drink: 'monday is a personal attack' },
  { area: 'al barsha', drink: 'inbox anxiety latte' },
];

export default function Home() {
  const router = useRouter();
  const [confession, setConfession] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [feedIdx, setFeedIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PROMPTS.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setFeedIdx((i) => (i + 1) % FEED_LOOP.length);
    }, 3500);
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
    localStorage.removeItem('yomies_drinks');
    router.push('/menu');
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Top utility bar — feels like the delivery app chrome */}
      <div className="px-5 pt-5 pb-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-soft">
        <span>delivered by · talabat</span>
        <span>dubai · {orderCount > 0 ? `${orderCount} confessions` : 'open'}</span>
      </div>

      {/* Yomies brand header — wordmark + status */}
      <div className="px-5 pt-3 pb-4 flex items-end justify-between border-b border-line">
        <div className="rise rise-1">
          <div className="text-[10px] font-mono uppercase tracking-widest text-soft mb-0.5">presented by</div>
          <div className="font-serif italic text-yomies text-4xl leading-none tracking-tight">yomies<span className="text-heat">.</span></div>
        </div>
        <div className="rise rise-1 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-soft">
          <span className="w-1.5 h-1.5 rounded-full bg-heat animate-pulse"></span>
          <span>refreshes 2h 47m</span>
        </div>
      </div>

      {/* Hero */}
      <div className="flex-1 px-5 pt-8 pb-6">
        <h1 className="rise rise-2 font-serif leading-[0.95] tracking-tightest mb-5 text-[44px]">
          the menu that <em className="text-yomies">doesn't<br />exist</em>
          <span className="inline-block ml-1 text-heat font-serif italic text-2xl translate-y-[-8px]">*</span>
        </h1>

        <p className="rise rise-3 text-soft text-[14px] leading-relaxed mb-8 max-w-[28ch]">
          Other coffee apps make you scroll forty drinks you don't want.
          Tell us one true thing about your day. We'll do the rest.
        </p>

        {/* Decorative divider */}
        <div className="rise rise-3 flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-ink/20"></div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-soft">today only</div>
          <div className="h-px flex-1 bg-ink/20"></div>
        </div>

        {/* Input */}
        <div className="rise rise-4 mb-5">
          <label className="block text-[10px] font-mono uppercase tracking-widest text-soft mb-2">
            how's your day going?
          </label>
          <textarea
            value={confession}
            onChange={(e) => setConfession(e.target.value)}
            placeholder={PROMPTS[placeholderIdx]}
            maxLength={140}
            rows={3}
            className="w-full bg-transparent border-0 border-b border-ink/30 focus:border-yomies focus:outline-none font-serif text-2xl leading-tight tracking-tight resize-none py-2 placeholder:text-ink/25 placeholder:italic transition-colors"
          />
          <div className="flex justify-between items-center mt-2 text-[10px] font-mono uppercase tracking-widest text-soft">
            <span>one honest line</span>
            <span>{confession.length}/140</span>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!confession.trim() || submitting}
          className="rise rise-4 w-full bg-ink text-cream py-4 rounded-full font-mono uppercase tracking-[0.2em] text-[11px] lift hover:bg-yomies disabled:bg-ink/30 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'reading your day…' : 'serve me something'}
        </button>

        <p className="mt-3 text-center text-[10px] font-mono uppercase tracking-widest text-soft">
          we don't store your confession.
        </p>
      </div>

      {/* Bottom: "Today in Dubai" live ticker */}
      <div className="bg-ink text-cream py-4 px-5">
        <div className="text-[9px] font-mono uppercase tracking-widest text-cream/50 mb-1">
          today in dubai · live
        </div>
        <div className="font-serif italic text-base leading-snug min-h-[2.5rem]">
          someone in {FEED_LOOP[feedIdx].area} just got{' '}
          <span className="text-heat">"{FEED_LOOP[feedIdx].drink}"</span>
        </div>
      </div>
    </main>
  );
}
