import { createElement as h } from 'react';
import {
  Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text,
} from '@react-email/components';

const NAVY = '#003057';
const TEAL = '#006fa8';
const BG = '#f7f7f5';
const MUTED = '#6b7280';

const styles = {
  main: { backgroundColor: BG, fontFamily: 'Segoe UI, Arial, sans-serif', margin: 0, padding: 0 },
  container: { maxWidth: '600px', margin: '0 auto', padding: '24px 16px' },
  card: { backgroundColor: '#ffffff', borderRadius: '4px', padding: '32px', border: '1px solid #eeeeee' },
  h1: { color: NAVY, fontSize: '22px', fontWeight: 700, margin: '0 0 16px 0' },
  label: { color: MUTED, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px 0' },
  value: { color: NAVY, fontSize: '15px', margin: '0 0 16px 0' },
  link: { color: TEAL, textDecoration: 'none' },
  msgBox: { backgroundColor: BG, borderLeft: `4px solid ${TEAL}`, padding: '16px', margin: '0 0 16px 0', color: NAVY, fontSize: '15px', lineHeight: '1.55', whiteSpace: 'pre-wrap' },
  hr: { borderColor: '#eee', margin: '16px 0' },
  metaText: { color: MUTED, fontSize: '13px', margin: '0 0 16px 0' },
  footer: { color: MUTED, fontSize: '12px', textAlign: 'center', margin: '24px 0 0 0' },
};

export default function ContactNotification({ name = '', email = '', message = '', meta = {} }) {
  const origin = [meta.city, meta.region, meta.country].filter(Boolean).join(', ');
  return h(Html, null,
    h(Head, null),
    h(Preview, null, `New contact form: ${name}`),
    h(Body, { style: styles.main },
      h(Container, { style: styles.container },
        h(Section, { style: styles.card },
          h(Heading, { as: 'h1', style: styles.h1 }, 'New Contact Form Submission'),
          h(Text, { style: styles.label }, 'Name'),
          h(Text, { style: styles.value }, name),
          h(Text, { style: styles.label }, 'Email'),
          h(Text, { style: styles.value },
            h(Link, { href: `mailto:${email}`, style: styles.link }, email),
          ),
          h(Text, { style: styles.label }, 'Message'),
          h(Section, { style: styles.msgBox }, message),
          origin && h(Hr, { style: styles.hr }),
          origin && h(Text, { style: styles.label }, 'Origin'),
          origin && h(Text, { style: styles.metaText }, origin),
        ),
        h(Text, { style: styles.footer },
          `Sent from palmettoconsulting.us · Reply directly to this email to respond to ${name}.`),
      ),
    ),
  );
}
