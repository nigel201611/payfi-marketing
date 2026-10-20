import type { CSSProperties } from 'react';

const COLORS = ['#00dd95', '#69ffce', '#00ab73', '#ffd166', '#f2f7f4'];

export function Confetti() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 28 }, (_, index) => {
        const left = (index * 37.4) % 100;
        const delay = (index % 8) * 0.09;
        const duration = 1.5 + (index % 6) * 0.18;
        const drift = (index % 2 === 0 ? 1 : -1) * (8 + (index % 5) * 9);
        const color = COLORS[index % COLORS.length];
        return (
          <span
            key={index}
            className="absolute top-0 block h-2.5 w-1.5 rounded-[1px] opacity-0"
            style={
              {
                left: `${left}%`,
                backgroundColor: color,
                animation: `confetti-fall ${duration}s ease-in ${delay}s both`,
                '--confetti-drift': `${drift}px`,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
