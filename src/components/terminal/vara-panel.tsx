'use client';

import type { CSSProperties, ReactNode } from 'react';
import SpotlightCard from '@/components/react-bits/SpotlightCard';
import { useTheme } from '@/components/providers/theme-provider';

const spotlightPanelStyle = {
  borderRadius: 16,
  padding: 0,
  boxShadow: 'none',
  '--spotlight-card-surface': 'var(--workspace-card)',
  '--spotlight-card-border': 'var(--border)',
  '--spotlight-card-shadow': 'none',
} as CSSProperties;

export function VaraPanel({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  return (
    <SpotlightCard
      theme={theme}
      className="mt-8"
      style={spotlightPanelStyle}
      intensity={0.08}
      spotlightColor="#00dd95"
      spotlightSize={300}
      softness={0.8}
      borderGlow={0.3}
      proximity={60}
      grain={0}
    >
      {children}
    </SpotlightCard>
  );
}
