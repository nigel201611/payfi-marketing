'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Lock } from 'lucide-react';
import StarBorder from '@/components/react-bits/StarBorder';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { brandButtonClass, type BrandButtonVariant } from '@/components/ui/brand-button';
import { useI18n } from '@/i18n/locale-provider';
import { cn } from '@/lib/utils';

type FormStatus = 'idle' | 'submitting' | 'success';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function WaitlistDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useI18n();
  const copy = t.waitlist;
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function reset() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setEmail('');
    setCompany('');
    setError('');
    setStatus('idle');
  }

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (!next) {
      const timer = setTimeout(reset, 220);
      timerRef.current = timer;
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();

    if (!EMAIL_PATTERN.test(trimmed)) {
      setError(copy.invalidEmail);
      return;
    }

    setError('');
    setStatus('submitting');
    timerRef.current = setTimeout(() => {
      setStatus('success');
    }, 750);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-surface overflow-hidden border-white/10 p-0 text-white sm:max-w-[480px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(0,221,149,0.22),transparent_70%)]"
        />
        <div className="relative p-6 sm:p-8">
          <div className="border-brand/25 bg-brand/10 text-brand mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.68rem] font-semibold tracking-[0.16em] uppercase">
            <span className="bg-brand size-1.5 rounded-full" />
            {copy.badge}
          </div>

          {status === 'success' ? (
            <div role="status" aria-live="polite" className="py-4">
              <div className="bg-brand/15 text-brand mb-5 grid size-12 place-items-center rounded-full">
                <CheckCircle2 className="size-6" aria-hidden="true" />
              </div>
              <DialogHeader className="text-left">
                <DialogTitle className="font-display text-2xl font-bold text-white">
                  {copy.successTitle}
                </DialogTitle>
                <DialogDescription className="pt-2 text-sm leading-relaxed text-white/55">
                  {copy.successDescription}
                </DialogDescription>
              </DialogHeader>
              <p className="mt-4 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/75">
                {email.trim()}
              </p>
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className={brandButtonClass({ size: 'md', className: 'mt-6 w-full' })}
              >
                {copy.done}
              </button>
            </div>
          ) : (
            <>
              <DialogHeader className="text-left">
                <DialogTitle className="font-display text-[1.65rem] leading-tight font-bold text-white">
                  {copy.title}
                </DialogTitle>
                <DialogDescription className="pt-2 text-sm leading-relaxed text-white/55">
                  {copy.description}
                </DialogDescription>
              </DialogHeader>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
                <div className="space-y-2">
                  <Label htmlFor="waitlist-email" className="text-white/80">
                    {copy.emailLabel}
                  </Label>
                  <Input
                    id="waitlist-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={copy.emailPlaceholder}
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (error) setError('');
                    }}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? 'waitlist-email-error' : undefined}
                    className="focus-visible:border-brand/60 focus-visible:ring-brand/20 h-12 border-white/12 bg-white/[0.04] text-white placeholder:text-white/40"
                  />
                  {error ? (
                    <p id="waitlist-email-error" role="alert" className="text-xs text-red-400">
                      {error}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="waitlist-company" className="text-white/80">
                    {copy.companyLabel}{' '}
                    <span className="font-normal text-white/40">{copy.companyOptional}</span>
                  </Label>
                  <Input
                    id="waitlist-company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    placeholder={copy.companyPlaceholder}
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                    className="focus-visible:border-brand/60 focus-visible:ring-brand/20 h-12 border-white/12 bg-white/[0.04] text-white placeholder:text-white/40"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className={brandButtonClass({ size: 'lg', className: 'mt-2 w-full' })}
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      {copy.joining}
                    </>
                  ) : (
                    <>
                      {copy.submit}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-4 flex items-start gap-2 text-[0.7rem] leading-relaxed text-white/45">
                <Lock className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                {copy.disclaimer}
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

type WaitlistButtonProps = {
  children?: ReactNode;
  variant?: BrandButtonVariant;
  className?: string;
  id?: string;
};

export function WaitlistButton({
  children,
  variant = 'primary',
  className,
  id,
}: WaitlistButtonProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        id={id}
        type="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className={brandButtonClass({ variant, className })}
      >
        {children ?? t.nav.joinTheWaitlist}
      </button>
      <WaitlistDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

export function WaitlistStarButton({ children }: { children?: ReactNode }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <>
      <StarBorder
        as="button"
        type="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        color="#69FFCE"
        trailColor="#0A4A34"
        backgroundColor="#00DD95"
        textColor="#04110C"
        borderColor="rgba(105,255,206,0.55)"
        radius={999}
        thickness={1.5}
        duration={6}
        glow={0.3}
        className={cn('!font-semibold')}
        style={{ padding: '0.9rem 1.65rem', fontSize: '0.95rem', fontWeight: 600 }}
      >
        {children ?? t.nav.joinTheWaitlist}
        <ArrowRight className="size-4" aria-hidden="true" />
      </StarBorder>
      <WaitlistDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
