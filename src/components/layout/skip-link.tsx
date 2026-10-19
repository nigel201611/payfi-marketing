'use client';

import { useI18n } from '@/i18n/locale-provider';

export function SkipLink() {
  const { t } = useI18n();

  return (
    <a
      href="#main-content"
      className="bg-brand text-ink sr-only z-[100] rounded-full px-5 py-3 font-semibold focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100]"
    >
      {t.common.skipToContent}
    </a>
  );
}
