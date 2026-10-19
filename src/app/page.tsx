import ClickSpark from '@/components/react-bits/ClickSpark';
import { ComingSoonSection } from '@/components/sections/coming-soon-section';
import { ControlSection } from '@/components/sections/control-section';
import { DeveloperSection } from '@/components/sections/developer-section';
import { HeroSection } from '@/components/sections/hero-section';
import { HowItWorksSection } from '@/components/sections/how-it-works-section';
import { site } from '@/constants/site';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'EX.IO Agent Wallet',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  description:
    'Give AI agents a wallet you control. Spend approvals, scoped permissions, one-time credentials, and a full audit trail across fiat and digital assets.',
  offers: {
    '@type': 'Offer',
    availability: 'https://schema.org/PreOrder',
    price: '0',
    priceCurrency: 'USD',
  },
  publisher: {
    '@type': 'Organization',
    name: site.name,
    url: site.external.exio,
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ClickSpark
        sparkColor={['#00dd95', '#69ffce', '#00ab73']}
        sparkSize={8}
        sparkRadius={26}
        sparkCount={9}
        sparkWidth={1.4}
        duration={560}
        easing="ease-out"
        shape="line"
        glow={4}
        layer="front"
      >
        <HeroSection />
        <HowItWorksSection />
        <ControlSection />
        <DeveloperSection />
        <ComingSoonSection />
      </ClickSpark>
    </>
  );
}
