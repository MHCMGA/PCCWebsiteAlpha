import { Helmet } from "react-helmet-async";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection/AnimatedSection";
import HeroBanner from "@/components/HeroBanner/HeroBanner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Section, Eyebrow } from "@/components/ui/section";
import { Spinner } from "@/components/ui/spinner";
import { SITE } from "@/lib/site";
import {
  graph,
  webPage,
  breadcrumb,
  offerCatalog,
  service,
} from "@/lib/schema";

const DOMAIN = SITE.domain;
const initialForm = { name: "", email: "", message: "" };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const contactMethods = [
  {
    icon: MapPin,
    label: "Office",
    value: "1325 Park St. Suite 200, Columbia, SC 29201",
    href: "https://maps.google.com/?q=1325+Park+St+Suite+200+Columbia+SC+29201",
  },
  {
    icon: Phone,
    label: "Phone",
    value: SITE.phone,
    href: `tel:${SITE.phoneE164}`,
  },
  {
    icon: Mail,
    label: "Email",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
  },
];

function getFormErrors(form) {
  const nextErrors = {};
  const cleanName = form.name.trim();
  const cleanEmail = form.email.trim();
  const cleanMessage = form.message.trim();

  if (!cleanName) nextErrors.name = "Please enter your full name.";
  if (!cleanEmail) {
    nextErrors.email = "Please enter your email address.";
  } else if (!emailPattern.test(cleanEmail)) {
    nextErrors.email = "Please enter a valid email address.";
  }
  if (!cleanMessage) {
    nextErrors.message = "Please enter a short message.";
  } else if (cleanMessage.length < 10) {
    nextErrors.message =
      "Please include a little more detail so we can route your note.";
  }

  return nextErrors;
}

const contactJsonLd = graph([
  webPage({
    id: "webpage",
    url: "/contact",
    name: "Contact Palmetto Consulting of Columbia",
    type: "ContactPage",
  }),
  offerCatalog("Insurance Consulting Services", [
    service({ name: "Captive Insurance Company Design" }),
    service({ name: "Captive Growth Management" }),
    service({
      name: "Insurance CFO Services",
      serviceType: "Insurance CFO Services",
      category: "Insurance Consulting",
    }),
    service({
      name: "Insurance Controllership",
      serviceType: "Insurance Controllership",
      category: "Insurance Consulting",
    }),
  ]),
  breadcrumb([
    { name: "Home", path: "/" },
    { name: "Contact Us", path: "/contact" },
  ]),
]);

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = getFormErrors(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus({
        variant: "warning",
        title: "Please check the form",
        message:
          "A few details need attention before we can send your message.",
      });
      return;
    }

    setSubmitting(true);
    setStatus(null);
    const { toast } = await import("sonner");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(
          data.error || "Failed to send message. Please try again.",
        );
      toast.success("Message sent. We will be in touch soon.");
      setStatus({
        variant: "success",
        title: "Message sent",
        message: "Thank you. We will be in touch soon.",
      });
      setForm(initialForm);
      setErrors({});
    } catch (err) {
      const message = err.message || "Something went wrong. Please try again.";
      toast.error(message);
      setStatus({ variant: "error", title: "Message not sent", message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          Contact Us | Palmetto Consulting of Columbia | Columbia, SC
        </title>
        <meta
          name="description"
          content="Contact Palmetto Consulting of Columbia, LLC. Reach our independent insurance consulting team in Columbia, SC at 803-904-8461. All business is generated by referral, we'd love to hear from you."
        />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={`${DOMAIN}/contact`} />
        <meta property="og:url" content={`${DOMAIN}/contact`} />
        <meta
          property="og:title"
          content="Contact Us | Palmetto Consulting of Columbia"
        />
        <meta
          property="og:description"
          content="Reach Palmetto Consulting of Columbia at our Columbia, SC office. Independent insurance consultants available by phone at 803-904-8461."
        />
        <meta
          name="twitter:title"
          content="Contact Us | Palmetto Consulting of Columbia"
        />
        <meta
          name="twitter:description"
          content="Contact Palmetto Consulting of Columbia, independent insurance consultants in Columbia, SC. Call 803-904-8461 or send us a message."
        />
        <script type="application/ld+json">
          {JSON.stringify(contactJsonLd)}
        </script>
      </Helmet>

      <HeroBanner
        image="/hero-contact.webp"
        eyebrow="Reach Out"
        heading="Contact Us"
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <AnimatedSection>
            <Eyebrow>Get in Touch</Eyebrow>
            <h2 className="mb-6 text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--color-navy)]">
              We&apos;d love to hear from you
            </h2>
            <p
              className="mb-5 text-base leading-7 text-[var(--color-muted)]"
              data-speakable
            >
              All of our business is generated by referral. If you&apos;ve been
              referred to us or are interested in learning how Palmetto can help
              your organization, please reach out, we&apos;re happy to have a
              conversation at no obligation.
            </p>
            <p className="mb-8 text-base leading-7 text-[var(--color-muted)]">
              Our team of independent insurance consultants is based in
              Columbia, South Carolina and serves clients across the United
              States. Whether you&apos;re exploring captive insurance for the
              first time or need experienced CFO-level guidance for an
              established carrier, we&apos;re here to help.
            </p>

            <div className="grid gap-4">
              {contactMethods.map(({ icon: Icon, label, value, href }) => (
                <Card key={label} className="hover:translate-y-0">
                  <CardContent className="flex gap-4 p-5">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-[var(--color-bg)] text-[var(--color-teal)]">
                      <Icon size={24} aria-hidden="true" />
                    </span>
                    <div className="text-sm leading-7">
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-muted)]">
                        {label}
                      </p>
                      <a
                        href={href}
                        className="font-bold text-[var(--color-navy)] hover:text-[var(--color-teal)]"
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noreferrer" : undefined}
                      >
                        {value}
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-6 hover:translate-y-0">
              <CardContent className="p-6">
                <Badge variant="navy" className="mb-3">
                  Quick answers
                </Badge>
                <Accordion type="single" collapsible>
                  <AccordionItem value="fit">
                    <AccordionTrigger>
                      What kind of organizations are a fit?
                    </AccordionTrigger>
                    <AccordionContent>
                      Organizations exploring captive insurance, reinsurance
                      vehicles, carrier growth, or CFO-level insurance finance
                      support are good candidates for a conversation.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="first-call">
                    <AccordionTrigger>
                      Is the first conversation obligated?
                    </AccordionTrigger>
                    <AccordionContent>
                      No. Initial conversations are no-obligation and help
                      determine whether Palmetto can add value.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={150}>
            <Card>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {status ? (
                    <Alert variant={status.variant} title={status.title}>
                      <p>{status.message}</p>
                    </Alert>
                  ) : null}
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
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    {errors.name ? (
                      <p
                        id="name-error"
                        className="text-sm font-medium text-red-700"
                      >
                        {errors.name}
                      </p>
                    ) : null}
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
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                    />
                    {errors.email ? (
                      <p
                        id="email-error"
                        className="text-sm font-medium text-red-700"
                      >
                        {errors.email}
                      </p>
                    ) : null}
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
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={
                        errors.message ? "message-error" : undefined
                      }
                    />
                    {errors.message ? (
                      <p
                        id="message-error"
                        className="text-sm font-medium text-red-700"
                      >
                        {errors.message}
                      </p>
                    ) : null}
                  </div>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? <Spinner label="Sending" /> : "Send Message"}
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
