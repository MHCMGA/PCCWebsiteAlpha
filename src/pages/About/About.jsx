import {
  Briefcase,
  CalendarDays,
  ClipboardList as ClipboardText,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection/AnimatedSection";
import FeatureCard from "@/components/FeatureCard/FeatureCard";
import HeroBanner from "@/components/HeroBanner/HeroBanner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section, Eyebrow, SectionHeading } from "@/components/ui/section";
import { SITE } from "@/lib/site";
import { graph, webPage, breadcrumb, person, service } from "@/lib/schema";

const DOMAIN = SITE.domain;

const team = [
  {
    name: "John A. Weitzel",
    role: "Founder & Principal",
    bio: "John founded Palmetto Consulting of Columbia in 1998 following a nearly 50-year career in the insurance industry, primarily serving as Chief Financial Officer. His deep expertise in both the captive and traditional insurance marketplace forms the cornerstone of the firm.",
  },
  {
    name: "Matthew A. Holycross, CPA",
    role: "Principal",
    bio: "Matthew joined Palmetto in 2015, bringing a background in traditional Property & Casualty carrier management as well as extensive experience in the Alternative Risk and Captive market. His perspectives have expanded the firm's capabilities and value to clients.",
  },
  {
    name: "Michael D. Hunter, CPA",
    role: "Principal",
    bio: "Michael joined Palmetto in 2020. He brings significant experience as an external audit manager for a national accounting firm and as the CFO of multiple AM-Best Rated Property and Casualty insurers, further strengthening the team's financial leadership.",
    initials: "MH",
    photo: "/team/michael-hunter-v4.webp",
  },
];

const milestones = [
  { icon: CalendarDays, label: "Founded", value: "1998" },
  { icon: ShieldCheck, label: "Captive focus", value: "Since 2003" },
  { icon: Users, label: "Consultants", value: "3 principals" },
];

const expertise = [
  {
    icon: ClipboardText,
    title: "Controllership Services",
    badge: "Control",
    body: "Palmetto fills a void in the marketplace based on the premise that many captive managers provide adequate service fulfilling the Controllership function, including general ledger maintenance, cash receipt and disbursement operations, financial statement presentation, and regulatory reporting.",
  },
  {
    icon: Briefcase,
    title: "Full CFO Services",
    badge: "CFO",
    body: "Relatively few captive managers provide the full menu of Chief Financial Officer functions. Palmetto specializes in Treasury, Investment monitoring, Tax planning, Budget analysis, Reinsurance negotiations, Rating agency relationships, and Internal audit, delivering a proactive approach that advances clients from compliance to best practices.",
  },
];

const aboutJsonLd = graph([
  webPage({
    id: "webpage",
    url: "/about",
    name: "About Palmetto Consulting of Columbia",
    type: "AboutPage",
  }),
  ...team.map((m) => person({ ...m, isCpa: m.name.includes("CPA") })),
  service({
    name: "Controllership Services",
    serviceType: "Insurance Controllership",
    category: "Insurance Consulting",
    description:
      "General ledger maintenance, cash receipt and disbursement operations, financial statement presentation, and regulatory reporting for captive insurance companies.",
  }),
  service({
    name: "Full CFO Services",
    serviceType: "Insurance CFO Services",
    category: "Insurance Consulting",
    description:
      "Treasury, investment monitoring, tax planning, budget analysis, reinsurance negotiations, rating agency relationships, and internal audit for captive and traditional insurance companies.",
  }),
  breadcrumb([
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
  ]),
]);

export default function About() {
  return (
    <>
      <title>About Us | Palmetto Consulting of Columbia | Columbia, SC</title>
      <meta
        name="description"
        content="Learn about Palmetto Consulting of Columbia, LLC, an independent insurance consulting firm founded in Columbia, SC in 1998. Meet our expert team of insurance CFO and captive market specialists."
      />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <link rel="canonical" href={`${DOMAIN}/about`} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}/about`} />
      <meta property="og:title" content="About Us | Palmetto Consulting of Columbia" />
      <meta
        property="og:description"
        content="Founded in Columbia, SC in 1998, Palmetto Consulting brings decades of captive insurance expertise and independent CFO services to clients across the United States."
      />
      <meta name="twitter:title" content="About Us | Palmetto Consulting of Columbia" />
      <meta
        name="twitter:description"
        content="Meet the team behind Palmetto Consulting of Columbia, independent insurance consultants serving clients since 1998 from Columbia, SC."
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD injection
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />

      <HeroBanner image="/hero-about.webp" eyebrow="Our Story" heading="About Us" />

      {/* History */}
      <Section>
        <div className="grid gap-12 md:grid-cols-2 md:items-start">
          <AnimatedSection>
            <Eyebrow>Founded 1998</Eyebrow>
            <SectionHeading className="mb-0">Who We Are</SectionHeading>
            <div className="mt-8 grid gap-3 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
              {milestones.map(({ icon: Icon, label, value }) => (
                <Card key={label} className="hover:translate-y-0">
                  <CardContent className="p-5">
                    <Icon className="mb-3 size-5 text-[var(--color-teal)]" aria-hidden="true" />
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-muted)]">
                      {label}
                    </p>
                    <p className="mt-1 font-extrabold text-[var(--color-navy)]">{value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AnimatedSection>
          <AnimatedSection
            delay={120}
            className="space-y-5 text-base leading-7 text-[var(--color-ink)]"
          >
            <p data-speakable>
              Palmetto Consulting of Columbia, LLC was founded in 1998 by John A. Weitzel, an
              insurance executive whose career spanned nearly 50 years working for, or consulting
              with, insurance companies, primarily as a Chief Financial Officer. Our offices are
              located in Columbia, South Carolina, at the heart of the Palmetto State.
            </p>
            <p>
              Since 2003, Palmetto&apos;s services have been focused almost exclusively on the
              captive insurance industry. Clients have included prospective and established captive
              insurance companies and captive managers across the United States.
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
          {expertise.map((item, i) => (
            <AnimatedSection key={item.title} delay={(i + 1) * 100}>
              <FeatureCard {...item} />
            </AnimatedSection>
          ))}
        </div>
      </Section>

      {/* Approach */}
      <Section className="bg-[var(--color-navy)] text-white">
        <AnimatedSection className="mx-auto max-w-4xl">
          <Eyebrow light>How We Work</Eyebrow>
          <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-start">
            <div>
              <h2 className="mb-5 text-3xl font-extrabold tracking-tight md:text-4xl">
                From Compliance to Best Practices
              </h2>
              <p className="text-base leading-8 text-white/85 md:text-lg">
                Palmetto helps clients assemble the right team, navigate formation, and keep every
                specialist aligned after launch.
              </p>
              <Accordion
                type="single"
                collapsible
                defaultValue="formation"
                className="mt-6 rounded-sm border border-white/10 bg-white/5 px-5"
              >
                <AccordionItem value="formation" className="border-white/10">
                  <AccordionTrigger className="text-white hover:text-[var(--color-cyan)]">
                    Formation stage guidance
                  </AccordionTrigger>
                  <AccordionContent className="text-white/75">
                    We help assemble insurance management, underwriting, claims, investment
                    management, actuary, audit, and legal experts; select appropriate domiciles;
                    develop business plans; project financial results; and walk captive applications
                    from submission to approval.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="operations" className="border-white/10">
                  <AccordionTrigger className="text-white hover:text-[var(--color-cyan)]">
                    Operational team captain
                  </AccordionTrigger>
                  <AccordionContent className="text-white/75">
                    Once a client is operational, we help ensure team members meet their benchmarks
                    and contribute toward the collective success of the client. Long-term regulator
                    relationships, based on mutual respect, facilitate this process.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <Card className="border-white/15 bg-white/10 text-white shadow-none">
              <CardContent className="p-8">
                <Badge variant="light" className="mb-5">
                  Referral only
                </Badge>
                <p className="text-xl font-extrabold leading-8 tracking-tight">
                  &quot;There is a reason we do not advertise, all our business is generated by
                  referral.&quot;
                </p>
              </CardContent>
            </Card>
          </div>
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
                      className="mb-5 size-36 rounded-full border-[3px] border-[var(--color-teal)] object-cover object-center shadow-md"
                    />
                  ) : (
                    <div className="mb-5 flex size-36 items-center justify-center rounded-full border-[3px] border-[var(--color-teal)] bg-[var(--color-bg)] text-3xl font-extrabold text-[var(--color-navy)]">
                      {m.initials ||
                        m.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-[var(--color-navy)]">{m.name}</h3>
                  <Badge variant={m.name.includes("CPA") ? "default" : "navy"} className="mt-3">
                    {m.role}
                  </Badge>
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
              <Link to="/contact" viewTransition>
                Get in Touch
              </Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
