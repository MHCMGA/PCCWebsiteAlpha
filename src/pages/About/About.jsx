import { Helmet } from 'react-helmet-async';
import { Briefcase, ClipboardText } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import AnimatedSection from '@/components/AnimatedSection/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Section, Eyebrow, SectionHeading } from '@/components/ui/section';
import { SITE } from '@/lib/site';

const DOMAIN = SITE.domain;
const OG_IMAGE = SITE.ogImage;

const team = [
  {
    name: 'John A. Weitzel',
    role: 'Founder & Principal',
    bio: 'John founded Palmetto Consulting of Columbia in 1998 following a nearly 50-year career in the insurance industry, primarily serving as Chief Financial Officer. His deep expertise in both the captive and traditional insurance marketplace forms the cornerstone of the firm.',
  },
  {
    name: 'Matthew A. Holycross, CPA',
    role: 'Member',
    bio: "Matthew joined Palmetto in 2015, bringing a background in traditional Property & Casualty carrier management as well as extensive experience in the Alternative Risk and Captive market. His perspectives have expanded the firm's capabilities and value to clients.",
  },
  {
    name: 'Michael D. Hunter, CPA',
    role: 'Member',
    bio: "Michael joined Palmetto in 2020. He brings significant experience as an external audit manager for a national accounting firm and as the CFO of multiple AM-Best Rated Property and Casualty insurers, further strengthening the team's financial leadership.",
    photo: '/team/michael-hunter-v2.jpg',
  },
];

const personSchema = team.map((m) => ({
  '@type': 'Person',
  '@id': `${DOMAIN}/about#${m.name.toLowerCase().replace(/[^a-z]+/g, '-')}`,
  name: m.name,
  jobTitle: m.role,
  worksFor: { '@id': `${DOMAIN}/#organization` },
  description: m.bio,
  ...(m.photo ? { image: `${DOMAIN}${m.photo}` } : {}),
  ...(m.name.includes('CPA') ? {
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Professional Certification',
      name: 'Certified Public Accountant (CPA)',
    },
    knowsAbout: [
      'Captive Insurance',
      'Property and Casualty Insurance',
      'Insurance CFO Services',
      'External Audit',
      'AM Best Rated Insurers',
      'Insurance Financial Reporting',
    ],
  } : {}),
}));

const aboutServiceSchema = [
  {
    '@type': 'Service',
    name: 'Controllership Services',
    serviceType: 'Insurance Controllership',
    provider: { '@id': `${DOMAIN}/#organization` },
    areaServed: { '@type': 'Country', name: 'United States' },
    description: 'General ledger maintenance, cash receipt and disbursement operations, financial statement presentation, and regulatory reporting for captive insurance companies.',
  },
  {
    '@type': 'Service',
    name: 'Full CFO Services',
    serviceType: 'Insurance CFO Services',
    provider: { '@id': `${DOMAIN}/#organization` },
    areaServed: { '@type': 'Country', name: 'United States' },
    description: 'Treasury, investment monitoring, tax planning, budget analysis, reinsurance negotiations, rating agency relationships, and internal audit for captive and traditional insurance companies.',
  },
];

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${DOMAIN}/` },
    { '@type': 'ListItem', position: 2, name: 'About Us', item: `${DOMAIN}/about` },
  ],
};

const aboutWebPageSchema = {
  '@type': 'AboutPage',
  '@id': `${DOMAIN}/about#webpage`,
  url: `${DOMAIN}/about`,
  name: 'About Palmetto Consulting of Columbia',
  isPartOf: { '@id': `${DOMAIN}/#website` },
  about: { '@id': `${DOMAIN}/#organization` },
  inLanguage: 'en-US',
  speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', 'h2', '[data-speakable]'] },
};

function Banner({ eyebrow, heading }) {
  return (
    <section
      className="relative isolate flex min-h-[42vh] items-center text-white"
      style={{
          backgroundImage:
            "linear-gradient(rgba(0,48,87,0.55), rgba(0,48,87,0.78)), url('/hero-about.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container-x relative z-10 text-center">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-cyan)]">{eyebrow}</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{heading}</h1>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | Palmetto Consulting of Columbia | Columbia, SC</title>
        <meta name="description" content="Learn about Palmetto Consulting of Columbia, LLC, an independent insurance consulting firm founded in Columbia, SC in 1998. Meet our expert team of insurance CFO and captive market specialists." />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={`${DOMAIN}/about`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${DOMAIN}/about`} />
        <meta property="og:title" content="About Us | Palmetto Consulting of Columbia" />
        <meta property="og:description" content="Founded in Columbia, SC in 1998, Palmetto Consulting brings decades of captive insurance expertise and independent CFO services to clients across the United States." />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Palmetto Consulting of Columbia" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | Palmetto Consulting of Columbia" />
        <meta name="twitter:description" content="Meet the team behind Palmetto Consulting of Columbia, independent insurance consultants serving clients since 1998 from Columbia, SC." />
        <meta name="twitter:image" content={OG_IMAGE} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [aboutWebPageSchema, ...personSchema, ...aboutServiceSchema, breadcrumbSchema],
          })}
        </script>
      </Helmet>

      <Banner eyebrow="Our Story" heading="About Us" />

      {/* History */}
      <Section>
        <div className="grid gap-12 md:grid-cols-2 md:items-start">
          <AnimatedSection>
            <Eyebrow>Founded 1998</Eyebrow>
            <SectionHeading className="mb-0">Who We Are</SectionHeading>
          </AnimatedSection>
          <AnimatedSection delay={120} className="space-y-5 text-base leading-7 text-[var(--color-ink)]">
            <p data-speakable>
              Palmetto Consulting of Columbia, LLC was founded in 1998 by John A. Weitzel, an insurance
              executive whose career spanned nearly 50 years working for, or consulting with, insurance
              companies, primarily as a Chief Financial Officer. Our offices are located in Columbia,
              South Carolina, at the heart of the Palmetto State.
            </p>
            <p>
              Since 2003, Palmetto&apos;s services have been focused almost exclusively on the captive
              insurance industry. Clients have included prospective and established captive insurance
              companies and captive managers across the United States.
            </p>
          </AnimatedSection>
        </div>
      </Section>

      {/* What We Do */}
      <Section className="bg-white border-y border-[var(--color-border-soft)]">
        <AnimatedSection className="text-center">
          <Eyebrow>Our Expertise</Eyebrow>
          <SectionHeading>What We Do</SectionHeading>
        </AnimatedSection>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {[
            { Icon: ClipboardText, title: 'Controllership Services', body: 'Palmetto fills a void in the marketplace based on the premise that many captive managers provide adequate service fulfilling the Controllership function, including general ledger maintenance, cash receipt and disbursement operations, financial statement presentation, and regulatory reporting.' },
            { Icon: Briefcase, title: 'Full CFO Services', body: 'Relatively few captive managers provide the full menu of Chief Financial Officer functions. Palmetto specializes in Treasury, Investment monitoring, Tax planning, Budget analysis, Reinsurance negotiations, Rating agency relationships, and Internal audit, delivering a proactive approach that advances clients from compliance to best practices.' },
          ].map(({ Icon, title, body }, i) => (
            <AnimatedSection key={title} delay={(i + 1) * 100}>
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-sm bg-[var(--color-bg)] text-[var(--color-teal)]">
                    <Icon size={28} weight="duotone" aria-hidden="true" />
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-[var(--color-navy)]">{title}</h3>
                  <p className="text-sm leading-7 text-[var(--color-muted)]">{body}</p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </Section>

      {/* Approach */}
      <Section className="bg-[var(--color-navy)] text-white">
        <AnimatedSection className="mx-auto max-w-3xl text-center">
          <Eyebrow light>How We Work</Eyebrow>
          <h2 className="mb-8 text-3xl md:text-4xl font-extrabold tracking-tight">From Compliance to Best Practices</h2>
          <p className="mb-5 text-base md:text-lg leading-8 text-white/85">
            Palmetto assists clients in assembling teams of top-notch insurance management, underwriting,
            claims, investment management, actuary, audit, and legal experts during the formation stage of
            a new captive. We are uniquely equipped to serve as a client&apos;s captive manager or guide a
            selected captive manager, assuring the team selects appropriate domiciles, develops business
            plans, projects financial results, and walks a captive application to regulators from
            submission to approval.
          </p>
          <p className="mb-8 text-base md:text-lg leading-8 text-white/85">
            Once a client is fully operational, we act as team captain to ensure all team members are
            achieving their individual benchmarks and properly contributing toward the collective success
            of the client. Long-term relationships with regulators, based on mutual respect, facilitate
            this process.
          </p>
          <p className="border-l-4 border-[var(--color-cyan)] pl-6 text-left text-lg italic text-white/95">
            &quot;There is a reason we do not advertise, all our business is generated by referral.&quot;
          </p>
        </AnimatedSection>
      </Section>

      {/* Team */}
      <Section>
        <AnimatedSection className="text-center">
          <Eyebrow>The People Behind Palmetto</Eyebrow>
          <SectionHeading>Our Team</SectionHeading>
        </AnimatedSection>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {team.map((m, i) => (
            <AnimatedSection key={m.name} delay={i * 120}>
              <Card className="h-full">
                <CardContent className="flex h-full flex-col items-center p-8 text-center">
                  {m.photo ? (
                    <img
                      src={m.photo}
                      alt={`${m.name}, ${m.role} at Palmetto Consulting of Columbia`}
                      width={144}
                      height={144}
                      loading="lazy"
                      style={{ objectPosition: '50% 22%' }}
                      className="mb-5 size-36 rounded-full border-[3px] border-[var(--color-teal)] object-cover shadow-md"
                    />
                  ) : (
                    <div className="mb-5 flex size-36 items-center justify-center rounded-full border-[3px] border-[var(--color-teal)] bg-[var(--color-bg)] text-3xl font-extrabold text-[var(--color-navy)]">
                      {m.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-[var(--color-navy)]">{m.name}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-teal)]">{m.role}</p>
                  <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">{m.bio}</p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="bg-[var(--color-teal)] py-16 text-center text-white">
        <div className="container-x">
          <AnimatedSection>
            <h2 className="mb-6 text-2xl md:text-3xl font-extrabold tracking-tight">
              Ready to work with Palmetto?
            </h2>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
