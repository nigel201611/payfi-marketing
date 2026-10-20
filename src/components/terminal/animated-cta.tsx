'use client';

import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import Magnet from '@/components/react-bits/Magnet';
import StarBorder from '@/components/react-bits/StarBorder';
import { cn } from '@/lib/utils';

export function AnimatedCta({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <Magnet padding={18} magnetStrength={0.1} maxOffset={8} wrapperClassName="inline-flex">
      <StarBorder
        as="button"
        type="button"
        onClick={onClick}
        color="#69FFCE"
        trailColor="#0A4A34"
        backgroundColor="#00DD95"
        textColor="#04110C"
        borderColor="rgba(105,255,206,0.55)"
        radius={999}
        thickness={1.8}
        duration={5}
        glow={0.55}
        sparkle
        className={cn(
          'group font-semibold shadow-[0_0_0_1px_rgba(0,221,149,0.12),0_18px_60px_-14px_rgba(0,221,149,0.72)] transition-shadow duration-500 hover:shadow-[0_0_0_1px_rgba(105,255,206,0.25),0_22px_80px_-12px_rgba(0,221,149,0.9)]',
          className,
        )}
        style={{ padding: '0.95rem 1.7rem', fontSize: '0.95rem', fontWeight: 600 }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
        >
          <span className="absolute inset-y-[-40%] left-0 w-1/3 animate-[cta-shine_4.2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </span>
        <span className="relative z-10 inline-flex items-center gap-2">
          {children}
          <ArrowRight className="size-4" aria-hidden="true" />
        </span>
      </StarBorder>
    </Magnet>
  );
}
