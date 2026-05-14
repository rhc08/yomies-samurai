'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { findDrink } from '@/lib/drinks';

function makeSerial() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export default function CardPage() {
  const router = useRouter();
  const [drink, setDrink] = useState(null);
  const [confession, setConfession] = useState('');
  const [serial, setSerial] = useState('');
  const [time, setTime] = useState('');
  const [orderCount, setOrderCount] = useState(0);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    const sel = localStorage.getItem('yomies_selected');
    const conf = localStorage.getItem('yomies_confession');
    if (!sel || !conf) {
      router.replace('/');
      return;
    }
    setDrink(JSON.parse(sel));
    setConfession(conf);

    // Stable serial per session
    let cached = localStorage.getItem('yomies_current_serial');
    if (!cached) {
      cached = makeSerial();
      localStorage.setItem('yomies_current_serial', cached);
    }
    setSerial(cached);

    const now = new Date(Date.now() + 4 * 60 * 60 * 1000);
    const hh = String(now.getUTCHours()).padStart(2, '0');
    const mm = String(now.getUTCMinutes()).padStart(2, '0');
    const dayName = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][now.getUTCDay()];
    setTime(`${dayName} ${hh}:${mm}`);

    setOrderCount(parseInt(localStorage.getItem('yomies_orders') || '0', 10));
  }, [router]);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Yomies served me',
          text: `I told Yomies "${confession}" and they served me "${drink.name}". ${drink.diagnosis}`,
        });
        setShared(true);
      } catch {}
    } else {
      await navigator.clipboard.writeText(
        `I told Yomies "${confession}" and they served me "${drink.name}". ${drink.diagnosis}`
      );
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  }

  function startOver() {
    localStorage.removeItem('yomies_confession');
    localStorage.removeItem('yomies_drinks');
    localStorage.removeItem('yomies_selected');
    localStorage.removeItem('yomies_current_serial');
    router.push('/');
  }

  if (!drink) return null;

  const real = findDrink(drink.drinkId);

  return (
    <main className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-soft border-b border-line">
        <button onClick={() => router.push('/menu')} className="hover:text-ink transition">← back to menu</button>
        <span>your diagnosis</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        {/* THE CARD — designed to be screenshotted */}
        <div className="rise rise-1 w-full max-w-sm">
          <div className="bg-cream border-2 border-ink rounded-[2px] overflow-hidden shadow-[8px_8px_0_0_rgba(15,15,15,1)]">
            {/* Card header strip */}
            <div className="bg-ink text-cream px-5 py-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
              <span>yomies · diagnosis no. {serial}</span>
              <span>{time}</span>
            </div>

            {/* Body */}
            <div className="px-7 py-8">
              {/* The confession echoed */}
              <p className="text-[10px] font-mono uppercase tracking-widest text-soft mb-2">
                the confession
              </p>
              <p className="font-serif italic text-lg leading-snug text-ink mb-7">
                "{confession}"
              </p>

              {/* Divider with seal */}
              <div className="flex items-center gap-3 mb-7">
                <div className="flex-1 h-px bg-ink/30"></div>
                <div className="w-10 h-10 rounded-full border-2 border-ink flex items-center justify-center font-serif italic text-yomies text-lg">
                  Y
                </div>
                <div className="flex-1 h-px bg-ink/30"></div>
              </div>

              {/* Drink name — the hero */}
              <p className="text-[10px] font-mono uppercase tracking-widest text-soft mb-2">
                we served you
              </p>
              <h1 className="font-serif text-[44px] leading-[0.98] tracking-tightest text-ink mb-6">
                {drink.name}
              </h1>

              {/* Diagnosis */}
              <p className="font-serif italic text-[19px] leading-snug text-yomies mb-7">
                {drink.diagnosis}
              </p>

              {/* The actual drink */}
              <div className="border-t border-ink/20 pt-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-soft mb-1">
                    in your cup
                  </p>
                  <p className="font-serif text-xl text-ink leading-tight">{real.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-soft mb-1">
                    no.
                  </p>
                  <p className="font-mono text-sm text-ink">{serial}</p>
                </div>
              </div>
            </div>

            {/* Footer strip */}
            <div className="border-t-2 border-ink px-5 py-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
              <span className="text-soft">no person is the same.</span>
              <span className="text-soft">no drink is the same.</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="rise rise-3 mt-10 w-full max-w-sm space-y-3">
          <button
            onClick={handleShare}
            className="w-full bg-yomies text-cream py-4 rounded-full font-mono uppercase tracking-[0.2em] text-xs lift hover:bg-ink transition-colors"
          >
            {shared ? 'copied ✓' : 'share this diagnosis'}
          </button>
          <button
            onClick={() => router.push('/menu')}
            className="w-full border border-ink/30 text-ink py-4 rounded-full font-mono uppercase tracking-[0.2em] text-xs lift hover:bg-ink hover:text-cream transition-colors"
          >
            order this
          </button>
          <button
            onClick={startOver}
            className="w-full text-soft py-2 font-mono uppercase tracking-[0.2em] text-[11px] hover:text-ink transition-colors"
          >
            start a new day →
          </button>
        </div>

        {orderCount >= 5 && (
          <div className="rise rise-4 mt-8 text-center max-w-sm">
            <p className="text-[10px] font-mono uppercase tracking-widest text-soft mb-2">
              your yomies twin
            </p>
            <p className="font-serif italic text-base text-ink leading-snug">
              {orderCount} confessions in. a pattern is forming. we're watching.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
