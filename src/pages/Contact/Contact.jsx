import { Helmet } from 'react-helmet-async';
import { MapPin, Phone } from '@phosphor-icons/react';
import { useState } from 'react';
import { toast } from 'sonner';
import AnimatedSection from '@/components/AnimatedSection/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Section, Eyebrow } from '@/components/ui/section';
import { SITE } from '@/lib/site';

const DOMAIN = SITE.domain;
const OG_IMAGE = SITE.ogImage;

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${DOMAIN}/` },
    { '@type': 'ListItem', position: 2, name: 'Contact Us', item: `${DOMAIN}/contact` },
  ],
};

const contactJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      '@id': `${DOMAIN}/contact#webpage`,
      url: `${DOMAIN}/contact`,
      name: 'Contact Palmetto Consulting of Columbia',
      isPartOf: { '@id': `${DOMAIN}/#website` },
      about: { '@id': `${DOMAIN}/#organization` },
      inLanguage: 'en-US',
      speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', 'h2', '[data-speakable]'] },
    },
    {
      '@type': ['InsuranceAgency', 'ProfessionalService', 'Organization'],
      '@id': `${DOMAIN}/#organization`,
      name: 'Palmetto Consulting of Columbia, LLC',
      legalName: 'Palmetto Consulting of Columbia, LLC',
      alternateName: 'PCC',
      url: DOMAIN,
      logo: `${DOMAIN}/icons/icon-512.png`,
      image: `${DOMAIN}/og.png`,
      description: 'Independent insurance consultants in Columbia, SC specializing in captive insurance company design, growth management, and CFO services since 1998.',
      foundingDate: '1998',
      founder: { '@type': 'Person', name: 'John A. Weitzel' },
      slogan: 'All business by referral.',
      knowsAbout: [
        'Captive Insurance',
        'Captive Insurance Company Formation',
        'Insurance CFO Services',
        'Reinsurance',
        'Property and Casualty Insurance',
        'Insurance Regulatory Reporting',
        'Insurance Treasury Management',
        'AM Best Rating Agency Relationships',
      ],
      areaServed: { '@type': 'Country', name: 'United States' },
      address: {
        '@type': 'PostalAddress',
        streetAddress: '1325 Park St. Suite 200',
        addressLocality: 'Columbia',
        addressRegion: 'SC',
        postalCode: '29201',
        addressCountry: 'US',
      },
      geo: { '@type': 'GeoCoordinates', latitude: 34.0007, longitude: -81.0348 },
      telephone: '+1-803-904-8461',
      email: 'info@palmettoconsulting.us',
      priceRange: '$$$',
      contactPoint: [{
        '@type': 'ContactPoint',
        telephone: '+1-803-904-8461',
        contactType: 'customer service',
        areaServed: 'US',
        availableLanguage: ['en'],
        email: 'info@palmettoconsulting.us',
      }],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Insurance Consulting Services',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Captive Insurance Company Design', serviceType: 'Captive Insurance Consulting', category: 'Captive Insurance' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Captive Growth Management', serviceType: 'Captive Insurance Consulting', category: 'Captive Insurance' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Insurance CFO Services', serviceType: 'Insurance CFO Services', category: 'Insurance Consulting' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Insurance Controllership', serviceType: 'Insurance Controllership', category: 'Insurance Consulting' } },
        ],
      },
    },
    breadcrumbSchema,
  ],
};

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to send message. Please try again.');
      toast.success('Message sent. We will be in touch soon.');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Palmetto Consulting of Columbia | Columbia, SC</title>
        <meta name="description" content="Contact Palmetto Consulting of Columbia, LLC. Reach our independent insurance consulting team in Columbia, SC at 803-904-8461. All business is generated by referral, we'd love to hear from you." />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={`${DOMAIN}/contact`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${DOMAIN}/contact`} />
        <meta property="og:title" content="Contact Us | Palmetto Consulting of Columbia" />
        <meta property="og:description" content="Reach Palmetto Consulting of Columbia at our Columbia, SC office. Independent insurance consultants available by phone at 803-904-8461." />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:site_name" content="Palmetto Consulting of Columbia" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us | Palmetto Consulting of Columbia" />
        <meta name="twitter:description" content="Contact Palmetto Consulting of Columbia, independent insurance consultants in Columbia, SC. Call 803-904-8461 or send us a message." />
        <meta name="twitter:image" content={OG_IMAGE} />
        <script type="application/ld+json">{JSON.stringify(contactJsonLd)}</script>
      </Helmet>

      <section
        className="relative isolate flex min-h-[42vh] items-center text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,48,87,0.55), rgba(0,48,87,0.78)), url('/hero-contact.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container-x relative z-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-cyan)]">Reach Out</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Contact Us</h1>
        </div>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <AnimatedSection>
            <Eyebrow>Get in Touch</Eyebrow>
            <h2 className="mb-6 text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--color-navy)]">
              We&apos;d love to hear from you
            </h2>
            <p className="mb-5 text-base leading-7 text-[var(--color-muted)]" data-speakable>
              All of our business is generated by referral. If you&apos;ve been referred to us or are
              interested in learning how Palmetto can help your organization, please reach out, we&apos;re
              happy to have a conversation at no obligation.
            </p>
            <p className="mb-8 text-base leading-7 text-[var(--color-muted)]">
              Our team of independent insurance consultants is based in Columbia, South Carolina and
              serves clients across the United States. Whether you&apos;re exploring captive insurance for
              the first time or need experienced CFO-level guidance for an established carrier, we&apos;re
              here to help.
            </p>

            <ul className="space-y-5">
              <li className="flex gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-[var(--color-bg)] text-[var(--color-teal)]">
                  <MapPin size={24} weight="duotone" aria-hidden="true" />
                </span>
                <div className="text-sm leading-7 text-[var(--color-ink)]">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-muted)]">Office Address</p>
                  <p>1325 Park St. Suite 200</p>
                  <p>Columbia, SC 29201</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-[var(--color-bg)] text-[var(--color-teal)]">
                  <Phone size={24} weight="duotone" aria-hidden="true" />
                </span>
                <div className="text-sm leading-7">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-muted)]">Phone</p>
                  <a
                    href="tel:+18039048461"
                    className="text-lg font-bold text-[var(--color-navy)] hover:text-[var(--color-teal)]"
                  >
                    803-904-8461
                  </a>
                </div>
              </li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={150}>
            <Card>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Smith"
                      required
                      autoComplete="name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help..."
                      required
                    />
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? 'Sending…' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </Section>
    </>
  );
}
