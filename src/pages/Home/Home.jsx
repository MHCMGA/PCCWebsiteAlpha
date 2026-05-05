import { Helmet } from 'react-helmet-async';
import { Building2 as Buildings, TrendingUp as ChartLineUp, Handshake, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedSection from '@/components/AnimatedSection/AnimatedSection';
import StatsBar from '@/components/StatsBar/StatsBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Section, Eyebrow, SectionHeading } from '@/components/ui/section';
import { SITE } from '@/lib/site';

const DOMAIN = SITE.domain;
const OG_IMAGE = SITE.ogImage;

const services = [
  {
    icon: Buildings,
    title: 'Insurance Company Design & Structure',
    body: 'Whether you need a captive to insure your commercially un-insurable risks, are an agency seeking a reinsurance vehicle, or want to build a new commercial carrier from the ground up, we can help.',
  },
  {
    icon: Handshake,
    title: 'Industry Relationships',
    body: "Does your carrier need additional products or distribution alternatives to your current agency force? Our deep ties to the insurance community and relationships with MGAs, other carriers, and service providers allow us to bring our clients solutions to the problems that we can't solve ourselves.",
  },
  {
    icon: ChartLineUp,
    title: 'Growth Management',
    body: 'Even for profitable insurance companies, growth can present a host of challenges and complexities. We can assist with reinsurance structure, rating agency relationships, and the regulatory challenges that rapid growth can bring.',
  },
  {
    icon: Target,
    title: 'Deliberately Not "One-Size Fits All"',
    body: 'Unlike large firms, we are not beholden to outside ownership, Wall Street, or sales targets. We are relationship-builders as much as we are insurance-company-builders. Sometimes the right solution is to do nothing at all, and we are always okay with that.',
  },
];


const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${DOMAIN}/#website`,
      url: DOMAIN,
      name: 'Palmetto Consulting of Columbia',
      publisher: { '@id': `${DOMAIN}/#organization` },
      inLanguage: 'en-US',
    },
    {
      '@type': 'WebPage',
      '@id': `${DOMAIN}/#webpage`,
      url: `${DOMAIN}/`,
      name: 'Palmetto Consulting of Columbia | Captive Insurance Consultants',
      isPartOf: { '@id': `${DOMAIN}/#website` },
      about: { '@id': `${DOMAIN}/#organization` },
      inLanguage: 'en-US',
      speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', 'h2', '[data-speakable]'] },
    },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${DOMAIN}/` }] },
    {
      '@type': 'OfferCatalog',
      name: 'Insurance Consulting Services',
      itemListElement: services.map((s, i) => ({
        '@type': 'Offer',
        position: i + 1,
        itemOffered: {
          '@type': 'Service',
          name: s.title,
          description: s.body,
          provider: { '@id': `${DOMAIN}/#organization` },
          areaServed: { '@type': 'Country', name: 'United States' },
          serviceType: 'Insurance Consulting',
          category: 'Captive Insurance',
          additionalType: 'https://en.wikipedia.org/wiki/Captive_insurance',
        },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Captive Insurance Consultants in Columbia, SC | Palmetto Consulting</title>
        <meta name="description" content="Palmetto Consulting of Columbia, LLC are independent insurance consultants in Columbia, SC specializing in captive insurance design, growth management, and CFO services since 1998." />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={`${DOMAIN}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${DOMAIN}/`} />
        <meta property="og:title" content="Palmetto Consulting of Columbia | Captive Insurance Consultants" />
        <meta property="og:description" content="Independent insurance consultants in Columbia, SC focused on captive insurance and the traditional insurance marketplace. Serving clients since 1998." />
        <meta name="twitter:title" content="Palmetto Consulting of Columbia | Captive Insurance Consultants" />
        <meta name="twitter:description" content="Independent insurance consultants in Columbia, SC focused on captive insurance and the traditional insurance marketplace since 1998." />
        <script type="application/ld+json">{JSON.stringify(homeJsonLd)}</script>
      </Helmet>

      {/* Hero */}
      <section
        className="relative isolate flex min-h-[78vh] items-center overflow-hidden text-white"
        style={{ minHeight: '78vh' }}
      >
        <img
          src="/hero-buildings-1400.webp"
          srcSet="/hero-buildings-600.webp 600w, /hero-buildings-900.webp 900w, /hero-buildings-1400.webp 1400w"
          sizes="100vw"
          alt=""
          aria-hidden="true"
          width="1400"
          height="934"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{ backgroundImage: 'linear-gradient(rgba(0, 48, 87, 0.55), rgba(0, 48, 87, 0.78))' }}
        />
        <div className="container-x relative z-10 max-w-3xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-cyan)] animate-fade-up">
            Independent Insurance Consultants in Columbia, SC
          </p>
          <h1 className="mb-6 text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight animate-fade-up">
            Palmetto Consulting<br />of Columbia
          </h1>
          <p className="mb-10 text-lg md:text-xl text-white/85 animate-fade-up" data-speakable>
            Focused on the intersection of captive insurance<br className="hidden md:inline" /> and the traditional insurance marketplace.
          </p>
          <Button asChild size="lg" className="animate-fade-up">
            <Link to="/contact">Let&apos;s Work Together</Link>
          </Button>
        </div>
      </section>

      <StatsBar />

      {/* Mission */}
      <Section>
        <AnimatedSection className="mx-auto max-w-3xl text-center">
          <p className="text-lg md:text-xl leading-8 text-[var(--color-navy)]" data-speakable>
            Based in Columbia, South Carolina, Palmetto remains uniquely focused on the intersection
            of captive insurance and the traditional insurance marketplace, primarily on those
            opportunities where our backgrounds can add the most value to our clients and partners.
          </p>
        </AnimatedSection>
      </Section>

      {/* Services */}
      <Section className="bg-white border-y border-[var(--color-border-soft)]">
        <AnimatedSection className="text-center">
          <Eyebrow>What We Do</Eyebrow>
          <SectionHeading>Our Services</SectionHeading>
        </AnimatedSection>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <AnimatedSection key={s.title} delay={i * 90}>
                <Card className="h-full">
                  <CardContent className="flex h-full flex-col p-8">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-sm bg-[var(--color-bg)] text-[var(--color-teal)]">
                      <Icon size={28} aria-hidden="true" />
                    </div>
                    <h3 className="mb-3 text-lg font-bold text-[var(--color-navy)]">{s.title}</h3>
                    <p className="text-sm leading-7 text-[var(--color-muted)]">{s.body}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            );
          })}
        </div>
      </Section>

      {/* CTA */}
      <section className="bg-[var(--color-navy)] py-20 text-center text-white">
        <div className="container-x">
          <AnimatedSection>
            <h2 className="mb-8 text-2xl md:text-4xl font-extrabold leading-tight tracking-tight">
              Your goals are individual.<br />
              We believe captive insurance should be too.
            </h2>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Take the Next Step</Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
