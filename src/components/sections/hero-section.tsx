'use client';

import { ArrowRight, KeyRound, ScrollText, ShieldCheck } from 'lucide-react';
import BlurText from '@/components/react-bits/BlurText';
import ShinyText from '@/components/react-bits/ShinyText';
import { AgentWalletMock } from '@/components/demo/agent-wallet-mock';
import { Container } from '@/components/layout/container';
import { WaitlistStarButton } from '@/components/ui/waitlist';
import { useTheme } from '@/components/providers/theme-provider';
import { useI18n } from '@/i18n/locale-provider';
import { cn } from '@/lib/utils';

export function HeroSection() {
  const { t, locale } = useI18n();
  const { theme } = useTheme();
  const isZh = locale === 'zh';
  const isLight = theme === 'light';
  const trustPoints = [
    { icon: ShieldCheck, label: t.hero.trust.approvals },
    { icon: KeyRound, label: t.hero.trust.credentials },
    { icon: ScrollText, label: t.hero.trust.audit },
  ];

  return (
    <section id="top" className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[980px] overflow-hidden">
          <div
            className={cn(
              'absolute inset-0',
              isLight
                ? 'bg-[radial-gradient(48%_40%_at_76%_14%,rgba(0,171,115,0.1),transparent_65%)]'
                : 'bg-[radial-gradient(48%_40%_at_76%_14%,rgba(0,221,149,0.13),transparent_65%)]',
            )}
          />
          <div
            className={cn(
              'absolute inset-0',
              isLight
                ? 'bg-[radial-gradient(45%_32%_at_10%_0%,rgba(255,255,255,0.8),transparent_60%)]'
                : 'bg-[radial-gradient(45%_32%_at_10%_0%,rgba(255,255,255,0.05),transparent_60%)]',
            )}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_42%,var(--background)_96%)]" />
        </div>
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_0%,black_10%,transparent_65%)] opacity-30" />
      </div>

      <Container className="relative pt-14 pb-14 sm:pt-20 lg:pt-24 lg:pb-20">
        <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 xl:gap-20">
          <div className="max-w-[660px] lg:max-w-none">
            <div
              className="animate-hero-in border-border bg-card/50 inline-flex items-center gap-2.5 rounded-full border py-1.5 pr-2.5 pl-3 backdrop-blur-md"
              style={{ animationDelay: '40ms' }}
            >
              <span className="relative flex size-2" aria-hidden="true">
                <span className="bg-brand/60 absolute inline-flex size-full animate-ping rounded-full [animation-duration:2.6s]" />
                <span className="bg-brand relative inline-flex size-2 rounded-full" />
              </span>
              <ShinyText
                text={t.hero.badge}
                color={isLight ? '#174a37' : '#cfe9dc'}
                shineColor={isLight ? '#00ab73' : '#69ffce'}
                speed={5}
                className="text-[0.68rem] font-semibold tracking-[0.16em] uppercase"
              />
              <span className="bg-border h-3 w-px" aria-hidden="true" />
              <span className="text-muted-foreground text-[0.64rem] font-medium">
                {t.common.agentWallet}
              </span>
            </div>

            <h1
              className={cn(
                'font-display mt-7 font-extrabold',
                isZh
                  ? 'text-[clamp(2.2rem,4.1vw,3.5rem)] leading-[1.16] tracking-[-0.03em]'
                  : 'text-[clamp(2.9rem,5.8vw,5.15rem)] leading-[1.05] tracking-[-0.05em]',
              )}
            >
              {t.hero.title.map((line, index) => (
                <span
                  key={line.text}
                  className={
                    line.gradient
                      ? 'text-gradient animate-hero-in block pb-1'
                      : 'animate-hero-in text-foreground block'
                  }
                  style={{ animationDelay: `${100 + index * 80}ms` }}
                >
                  {line.text}{' '}
                </span>
              ))}
            </h1>
          </div>

          <div
            className="animate-hero-in max-w-[440px] lg:justify-self-end lg:pt-14 2xl:max-w-[480px]"
            style={{ animationDelay: '260ms' }}
          >
            {isZh ? (
              <p
                className="text-muted-foreground animate-hero-in text-base leading-relaxed sm:text-[1.075rem] sm:leading-[1.75]"
                style={{ animationDelay: '260ms' }}
              >
                {t.hero.description}
              </p>
            ) : (
              <BlurText
                text={t.hero.description}
                animateBy="words"
                direction="bottom"
                delay={14}
                blur={8}
                distance={14}
                threshold={0}
                trigger="load"
                className="text-muted-foreground text-base leading-relaxed sm:text-[1.075rem] sm:leading-[1.75]"
              />
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <WaitlistStarButton>{t.hero.primaryCta}</WaitlistStarButton>
              <a
                href="#how-it-works"
                className="group text-foreground/80 hover:text-foreground border-border bg-card/50 hover:bg-card inline-flex h-[3.25rem] items-center justify-center gap-2 rounded-full border px-6 text-sm font-semibold transition-all duration-300"
              >
                {t.hero.secondaryCta}
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>

            <ul className="text-muted-foreground mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.72rem]">
              {trustPoints.map(({ icon: Icon, label }, index) => (
                <li key={label} className="flex items-center gap-1.5">
                  {index > 0 ? (
                    <span
                      className="bg-border mr-3.5 hidden size-1 rounded-full sm:block"
                      aria-hidden="true"
                    />
                  ) : null}
                  <Icon className="text-accent-text/70 size-3.5" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="animate-hero-in relative mt-14 sm:mt-16 lg:mt-20"
          style={{ animationDelay: '420ms' }}
        >
          <AgentWalletMock className="max-w-[860px] min-[2200px]:max-w-[1200px] 2xl:max-w-[1040px]" />
        </div>
      </Container>
    </section>
  );
}
