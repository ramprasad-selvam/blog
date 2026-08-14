import './globals.css';
import { Inter } from 'next/font/google';
import ThemeSync from './theme-sync';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { const theme = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'; document.documentElement.dataset.theme = theme; document.documentElement.style.colorScheme = theme; })()`,
          }}
        />
      </head>
      <body className={`${inter.className} bg-zinc-950 text-zinc-100`}>
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}