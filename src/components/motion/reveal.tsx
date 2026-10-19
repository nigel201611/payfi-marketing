'use client';

import type { ReactNode } from 'react';
import AnimatedContent from '@/components/react-bits/AnimatedContent';
import { cn } from '@/lib/utils';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  duration?: number;
  direction?: 'vertical' | 'horizontal';
  blur?: number;
  once?: boolean;
};

export function Reveal({
  children,
  className,
  delay = 0,
  distance = 26,
  duration = 0.8,
  direction = 'vertical',
  blur = 6,
  once = true,
}: RevealProps) {
  return (
    <AnimatedContent
      className={cn(className)}
      distance={distance}
      duration={duration}
      delay={delay}
      direction={direction}
      blur={blur}
      scale={0.985}
      threshold={0.12}
      once={once}
    >
      {children}
    </AnimatedContent>
  );
}
