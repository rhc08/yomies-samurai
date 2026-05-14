import './globals.css';

export const metadata = {
  title: 'Yomies — The Menu That Doesn\'t Exist',
  description: 'Tell us how your day is going. We\'ll handle the rest.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="grain min-h-screen">
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
