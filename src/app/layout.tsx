import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Geist, Geist_Mono, Manrope } from 'next/font/google';
import { AppProviders } from '@/components/providers/app-providers';
import { site } from '@/constants/site';
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

const pagesBasePath = process.env.GITHUB_PAGES === 'true' ? '/payfi-marketing' : '';
const siteUrl = site.url.replace(/\/$/, '');
const title = 'Agentic Payment';
const description =
  'Roadshow sandbox for agentic RWA purchases: client intent, CRB fiat funding, agent-driven orders, human approval, and on-chain settlement. Mock data only.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    'Naka',
    'RWA',
    'agentic payments',
    'AI agents',
    'Cross River Bank',
    'tokenized assets',
    'stablecoins',
    'EX.IO',
  ],
  authors: [{ name: 'Naka RWA Agent' }],
  openGraph: {
    type: 'website',
    siteName: site.name,
    title,
    description,
    url: siteUrl,
    images: [{ url: `${siteUrl}/og.png`, width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [`${siteUrl}/og.png`],
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

const initScript = `(function(){try{var t=localStorage.getItem('naka-theme');if(t!=='light'&&t!=='dark'){t='dark';}document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;var l=localStorage.getItem('naka-locale');if(l==='zh'){document.documentElement.lang='zh-CN';}}catch(e){document.documentElement.dataset.theme='dark';}})();`;

// Browser wallet extensions (e.g. MetaMask) can throw their own uncaught errors; this sandbox never
// talks to a wallet, so keep their noise out of the dev overlay. Development only.
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
          {initScript}
        </Script>
        {devExtensionGuardScript ? (
          <Script id="dev-extension-guard" strategy="beforeInteractive">
            {devExtensionGuardScript}
          </Script>
        ) : null}
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
