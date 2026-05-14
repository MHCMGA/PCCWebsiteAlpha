import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Section, Eyebrow } from "@/components/ui/section";
import { Spinner } from "@/components/ui/spinner";
import { SITE } from "@/lib/site";
import {
  bucketMessageLength,
  trackContactSubmit,
  trackEmailClick,
  trackPhoneClick,
} from "@/lib/track";
import { graph, webPage, breadcrumb, offerCatalog, service } from "@/lib/schema";

const DOMAIN = SITE.domain;
const initialForm = { name: "", email: "", message: "", website: "" };

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your full name."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address."),
  message: z
    .string()
    .trim()
    .min(1, "Please enter a short message.")
    .min(10, "Please include a little more detail so we can route your note."),
  // Honeypot — visually hidden; server treats any non-empty value as a bot.
  website: z.string().max(0).optional().default(""),
});

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
    onClick: () => trackPhoneClick("contact_card"),
  },
  {
    icon: Mail,
    label: "Email",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
    onClick: () => trackEmailClick("contact_card"),
  },
];

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
  const [status, setStatus] = useState(null);
  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: initialForm,
  });
  const submitting = form.formState.isSubmitting;

  const onValid = async (data) => {
    setStatus(null);
    const { toast } = await import("sonner");
    const detail = {
      msg_len: bucketMessageLength((data.message ?? "").length),
      from_path: typeof window !== "undefined" ? window.location.pathname : undefined,
    };
    let outcome = "error";
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        outcome =
          res.status === 429
            ? "rate_limited"
            : res.status === 403
              ? "spam"
              : res.status === 400 || res.status === 422
                ? "invalid"
                : "error";
        throw new Error(body.error || "Failed to send message. Please try again.");
      }
      outcome = "success";
      toast.success("Message sent. We will be in touch soon.");
      setStatus({
        variant: "success",
        title: "Message sent",
        message: "Thank you. We will be in touch soon.",
      });
      form.reset(initialForm);
    } catch (err) {
      const message = err.message || "Something went wrong. Please try again.";
      toast.error(message);
      setStatus({ variant: "error", title: "Message not sent", message });
    } finally {
      trackContactSubmit(outcome, detail);
    }
  };

  const onInvalid = () => {
    setStatus({
      variant: "warning",
      title: "Please check the form",
      message: "A few details need attention before we can send your message.",
    });
    const currentMsg = form.getValues("message") ?? "";
    trackContactSubmit("invalid", {
      msg_len: bucketMessageLength(currentMsg.length),
      from_path: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
  };

  return (
    <>
      <title>Contact Us | Palmetto Consulting of Columbia | Columbia, SC</title>
      <meta
        name="description"
        content="Contact Palmetto Consulting of Columbia, LLC. Reach our independent insurance consulting team in Columbia, SC at 803-904-8461. All business is generated by referral, we'd love to hear from you."
      />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <link rel="canonical" href={`${DOMAIN}/contact`} />
      <meta property="og:url" content={`${DOMAIN}/contact`} />
      <meta property="og:title" content="Contact Us | Palmetto Consulting of Columbia" />
      <meta
        property="og:description"
        content="Reach Palmetto Consulting of Columbia at our Columbia, SC office. Independent insurance consultants available by phone at 803-904-8461."
      />
      <meta name="twitter:title" content="Contact Us | Palmetto Consulting of Columbia" />
      <meta
        name="twitter:description"
        content="Contact Palmetto Consulting of Columbia, independent insurance consultants in Columbia, SC. Call 803-904-8461 or send us a message."
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD injection
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />

      <HeroBanner image="/hero-contact.webp" eyebrow="Reach Out" heading="Contact Us" />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <AnimatedSection>
            <Eyebrow>Get in Touch</Eyebrow>
            <h2 className="mb-6 text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--color-navy)]">
              We&apos;d love to hear from you
            </h2>
            <p className="mb-5 text-base leading-7 text-[var(--color-muted)]" data-speakable>
              All of our business is generated by referral. If you&apos;ve been referred to us or
              are interested in learning how Palmetto can help your organization, please reach out,
              we&apos;re happy to have a conversation at no obligation.
            </p>
            <p className="mb-8 text-base leading-7 text-[var(--color-muted)]">
              Our team of independent insurance consultants is based in Columbia, South Carolina and
              serves clients across the United States. Whether you&apos;re exploring captive
              insurance for the first time or need experienced CFO-level guidance for an established
              carrier, we&apos;re here to help.{" "}
              <Link
                to="/about"
                viewTransition
                className="font-semibold text-[var(--color-navy)] underline decoration-[var(--color-teal)] underline-offset-4 hover:text-[var(--color-teal)]"
              >
                Learn more about our team
              </Link>
              .
            </p>

            <div className="grid gap-4">
              {contactMethods.map(({ icon: Icon, label, value, href, onClick }) => (
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
                        onClick={onClick}
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
                    <AccordionTrigger>What kind of organizations are a fit?</AccordionTrigger>
                    <AccordionContent>
                      Organizations exploring captive insurance, reinsurance vehicles, carrier
                      growth, or CFO-level insurance finance support are good candidates for a
                      conversation.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="first-call">
                    <AccordionTrigger>Is the first conversation obligated?</AccordionTrigger>
                    <AccordionContent>
                      No. Initial conversations are no-obligation and help determine whether
                      Palmetto can add value.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={150}>
            <Card>
              <CardContent className="p-8">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onValid, onInvalid)}
                    noValidate
                    className="space-y-5"
                  >
                    {status ? (
                      <Alert variant={status.variant} title={status.title}>
                        <p>{status.message}</p>
                      </Alert>
                    ) : null}
                    {/* Honeypot — hidden from real users; bots that fill it get a 200 + silent drop. */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        left: "-10000px",
                        width: "1px",
                        height: "1px",
                        overflow: "hidden",
                      }}
                    >
                      <label htmlFor="website">
                        Leave this field empty
                        <input
                          id="website"
                          type="text"
                          name="website"
                          tabIndex={-1}
                          autoComplete="off"
                          {...form.register("website")}
                        />
                      </label>
                    </div>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="John Smith"
                              autoComplete="name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="font-medium text-red-700" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john@example.com"
                              autoComplete="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="font-medium text-red-700" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={6}
                              placeholder="Tell us how we can help..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="font-medium text-red-700" />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={submitting} className="w-full">
                      {submitting ? <Spinner label="Sending" /> : "Send Message"}
                    </Button>
                    <p className="mt-3 text-center text-xs text-[var(--color-muted)]">
                      By submitting, you agree to our{" "}
                      <Link
                        to="/privacy"
                        viewTransition
                        className="underline underline-offset-2 hover:text-[var(--color-teal)]"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </Section>
    </>
  );
}
