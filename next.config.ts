import type { NextConfig } from 'next';

const isGithubPages = process.env.GITHUB_PAGES === 'true';
const pagesBasePath = '/payfi-marketing';

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const nextConfig: NextConfig = {
  // GitHub Pages serves static files only; the regular Node deployment stays standalone.
  output: isGithubPages ? 'export' : 'standalone',
  basePath: isGithubPages ? pagesBasePath : undefined,
  trailingSlash: isGithubPages ? true : undefined,
  poweredByHeader: false,
  devIndicators: false,
  images: {
    unoptimized: true,
  },
  ...(isGithubPages
    ? {}
    : {
        async headers() {
          return [{ source: '/(.*)', headers: securityHeaders }];
        },
      }),
};

export default nextConfig;
