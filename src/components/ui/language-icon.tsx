import type { Locale } from '@/i18n/messages';

export function LanguageIcon({ locale }: { locale: Locale }) {
  if (locale === 'zh') {
    return (
      <svg viewBox="0 0 24 16" aria-hidden="true" className="h-3.5 w-[21px] shrink-0 rounded-[2px]">
        <rect width="24" height="16" fill="#DE2910" />
        <path d="M5 2.1 5.8 4.5l2.5.1-2 1.5.7 2.4-2-1.4-2 1.4.7-2.4-2-1.5 2.5-.1Z" fill="#FFDE00" />
        <circle cx="10.4" cy="2.4" r="0.55" fill="#FFDE00" />
        <circle cx="11.6" cy="4.1" r="0.55" fill="#FFDE00" />
        <circle cx="11.6" cy="6.1" r="0.55" fill="#FFDE00" />
        <circle cx="10.4" cy="7.8" r="0.55" fill="#FFDE00" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 16" aria-hidden="true" className="h-3.5 w-[21px] shrink-0 rounded-[2px]">
      <rect width="24" height="16" fill="#012169" />
      <path d="M0 0 24 16M24 0 0 16" stroke="#ffffff" strokeWidth="3.4" />
      <path d="M0 0 24 16M24 0 0 16" stroke="#C8102E" strokeWidth="1.6" />
      <path d="M12 0v16M0 8h24" stroke="#ffffff" strokeWidth="5.2" />
      <path d="M12 0v16M0 8h24" stroke="#C8102E" strokeWidth="2.8" />
    </svg>
  );
}
