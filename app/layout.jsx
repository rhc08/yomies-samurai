import './globals.css';

export const metadata = {
  title: 'Yomies — The Menu That Doesn\'t Exist',
  description: 'Tell us how your day is going. We\'ll handle the rest.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {/* Desktop backdrop — only visible on md+ */}
        <div className="hidden md:flex fixed inset-0 items-center justify-center bg-ink overflow-hidden">
          <div className="absolute inset-0 desktop-bg"></div>
          <div className="absolute top-8 left-10 text-cream/60 font-mono text-[11px] uppercase tracking-widest">
            samurai 17 · yomies × talabat
          </div>
          <div className="absolute bottom-8 left-10 text-cream/40 font-mono text-[11px] uppercase tracking-widest max-w-xs leading-relaxed">
            the menu that doesn't exist — a one-of-one drink built from a one-line confession.
          </div>
          <div className="absolute bottom-8 right-10 text-cream/40 font-mono text-[11px] uppercase tracking-widest">
            view on mobile for the real thing →
          </div>
        </div>

        {/* The app itself — phone-framed on desktop, full-screen on mobile */}
        <div className="relative md:min-h-screen md:flex md:items-center md:justify-center md:py-12">
          <div className="phone-frame grain relative z-10 min-h-screen md:min-h-0 md:h-[820px] md:w-[400px] md:rounded-[44px] md:overflow-hidden md:border-[10px] md:border-ink md:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
            <div className="relative z-10 h-full overflow-y-auto no-scrollbar">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
