import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Geist, Geist_Mono, Manrope } from 'next/font/google';
import { AppProviders } from '@/components/providers/app-providers';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { SkipLink } from '@/components/layout/skip-link';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ex.io';
const pagesBasePath = process.env.GITHUB_PAGES === 'true' ? '/payfi-marketing' : '';

const title = 'EX.IO Agent Wallet — Give your agent a wallet you control';
const description =
  'Let AI agents book, buy, and settle on your behalf — with spend approvals, scoped permissions, and a complete audit trail. One wallet for fiat and digital assets.';
const baseUrl = siteUrl.replace(/\/$/, '');
const ogImage = `${baseUrl}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    'EX.IO',
    'agent wallet',
    'agentic commerce',
    'AI agents',
    'PayFi',
    'stablecoins',
    'digital assets',
  ],
  authors: [{ name: 'EX.IO' }],
  openGraph: {
    type: 'website',
    siteName: 'EX.IO',
    title,
    description,
    url: baseUrl,
    images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [ogImage],
  },
  icons: {
    icon: [{ url: `${pagesBasePath}/icon.png`, sizes: '200x200', type: 'image/png' }],
    apple: `${pagesBasePath}/icon.png`,
  },
};

export const viewport: Viewport = {
  themeColor: '#080a09',
  colorScheme: 'dark light',
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('exio-theme');if(t!=='light'&&t!=='dark'){t='dark';}document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;var l=localStorage.getItem('exio-locale');if(l==='zh'){document.documentElement.lang='zh-CN';}}catch(e){document.documentElement.dataset.theme='dark';}})();`;

// Browser wallet extensions (e.g. MetaMask) run their own scripts in the page. When they fail to
// restore a session they throw uncaught errors that Next.js shows in the dev overlay even though
// this site never talks to a wallet. Filter only extension/MetaMask noise, in development only.
const devExtensionGuardScript =
  process.env.NODE_ENV === 'production'
    ? ''
    : `(function(){
        var isExtensionNoise = function(value){
          try {
            var text = String((value && (value.stack || value.message)) || value || '');
            if (text.indexOf('Failed to connect to MetaMask') !== -1) return true;
            return text.indexOf('chrome-extension://') !== -1 && /metamask|ethereum/i.test(text);
          } catch (e) { return false; }
        };
        window.addEventListener('unhandledrejection', function(event){
          if (isExtensionNoise(event.reason)) {
            event.preventDefault();
            event.stopImmediatePropagation();
          }
        }, true);
        window.addEventListener('error', function(event){
          var text = String(event.filename || '') + ' ' + String(event.message || '');
          if (isExtensionNoise(text)) {
            event.preventDefault();
            event.stopImmediatePropagation();
          }
        }, true);
      })();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${manrope.variable}`}
    >
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        {devExtensionGuardScript ? (
          <Script id="dev-extension-guard" strategy="beforeInteractive">
            {devExtensionGuardScript}
          </Script>
        ) : null}
        <AppProviders>
          <SkipLink />
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
