'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { findDrink } from '@/lib/drinks';

const LOADING_LINES = [
  'reading your day…',
  'consulting the brewmaster…',
  'rejecting three bad ideas…',
  'plating your moment…',
];

export default function MenuPage() {
  const router = useRouter();
  const [confession, setConfession] = useState('');
  const [drinks, setDrinks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadIdx, setLoadIdx] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('yomies_confession');
    if (!stored) {
      router.replace('/');
      return;
    }
    setConfession(stored);

    // Check if drinks already cached for this confession
    const cached = localStorage.getItem('yomies_drinks');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.confession === stored) {
          setDrinks(parsed.drinks);
          setLoading(false);
          return;
        }
      } catch {}
    }

    // Generate fresh
    fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confession: stored }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.drinks) {
          setDrinks(data.drinks);
          localStorage.setItem(
            'yomies_drinks',
            JSON.stringify({ confession: stored, drinks: data.drinks })
          );
        } else {
          setError('something went wrong');
        }
      })
      .catch(() => setError('something went wrong'))
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => setLoadIdx((i) => (i + 1) % LOADING_LINES.length), 900);
    return () => clearInterval(id);
  }, [loading]);

  function selectDrink(idx) {
    const selected = drinks[idx];
    localStorage.setItem('yomies_selected', JSON.stringify(selected));
    const orders = parseInt(localStorage.getItem('yomies_orders') || '0', 10);
    localStorage.setItem('yomies_orders', String(orders + 1));
    router.push('/card');
  }

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="text-[11px] font-mono uppercase tracking-widest text-soft mb-6">
            you said
          </p>
          <p className="font-serif italic text-3xl leading-tight mb-12">
            "{confession}"
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="w-2 h-2 rounded-full bg-yomies animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-yomies animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-yomies animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="mt-6 text-[11px] font-mono uppercase tracking-widest text-soft">
            {LOADING_LINES[loadIdx]}
          </p>
        </div>
      </main>
    );
  }

  if (error || !drinks) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="font-serif italic text-2xl mb-6">something went sideways.</p>
        <button
          onClick={() => router.push('/')}
          className="bg-ink text-cream px-6 py-3 rounded-full font-mono uppercase text-xs tracking-widest"
        >
          try again
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-12">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-soft border-b border-line">
        <button onClick={() => router.push('/')} className="hover:text-ink transition">← back</button>
        <span>your menu · expires 2h 47m</span>
      </div>

      <div className="max-w-md mx-auto px-6 pt-8">
        <p className="rise rise-1 text-[11px] font-mono uppercase tracking-widest text-soft mb-3">
          you said
        </p>
        <p className="rise rise-1 font-serif italic text-2xl leading-tight mb-2 text-ink">
          "{confession}"
        </p>
        <p className="rise rise-2 text-[11px] font-mono uppercase tracking-widest text-soft mb-10">
          we made you these — only today
        </p>

        <div className="space-y-5">
          {drinks.map((drink, idx) => {
            const real = findDrink(drink.drinkId);
            return (
              <button
                key={idx}
                onClick={() => selectDrink(idx)}
                className={`rise rise-${idx + 2} lift block w-full text-left bg-white rounded-2xl p-6 border border-line hover:border-yomies transition group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-soft">
                    no. 0{idx + 1}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-heat">
                    one-of-one
                  </span>
                </div>
                <h2 className="font-serif text-[34px] leading-[1.02] tracking-tightest mb-3 text-ink group-hover:text-yomies transition-colors">
                  {drink.name}
                </h2>
                <p className="text-soft leading-relaxed mb-5 text-[15px]">
                  {drink.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-line">
                  <div className="text-[11px] font-mono uppercase tracking-widest text-soft">
                    served as · <span className="text-ink">{real.name}</span>
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-yomies group-hover:translate-x-1 transition-transform">
                    order →
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-10 text-center text-[11px] font-mono uppercase tracking-widest text-soft">
          these names belong to you, today, only.
        </p>
      </div>
    </main>
  );
}
