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
  p: { color: NAVY, fontSize: '15px', lineHeight: '1.6', margin: '0 0 16px 0' },
  msgBox: { backgroundColor: BG, borderLeft: `4px solid ${TEAL}`, padding: '16px', margin: '16px 0', color: NAVY, fontSize: '14px', lineHeight: '1.55', whiteSpace: 'pre-wrap', fontStyle: 'italic' },
  link: { color: TEAL },
  hr: { borderColor: '#eee', margin: '24px 0 16px 0' },
  sig: { color: NAVY, fontSize: '15px', fontWeight: 600, margin: '24px 0 4px 0' },
  byline: { color: MUTED, fontSize: '13px', margin: 0 },
  footer: { color: MUTED, fontSize: '12px', textAlign: 'center', margin: '24px 0 0 0', lineHeight: '1.6' },
};

export default function ContactAutoReply({ name = 'there', message = '' }) {
  const firstName = (name || '').split(/\s+/)[0] || 'there';
  return h(Html, null,
    h(Head, null),
    h(Preview, null, 'Thanks for reaching out to Palmetto Consulting'),
    h(Body, { style: styles.main },
      h(Container, { style: styles.container },
        h(Section, { style: styles.card },
          h(Heading, { as: 'h1', style: styles.h1 }, `Thanks for reaching out, ${firstName}.`),
          h(Text, { style: styles.p },
            'We\u2019ve received your message and a member of our team will be in touch shortly \u2014 typically within one business day.'),
          h(Text, { style: styles.p }, 'For your records, here\u2019s what you sent us:'),
          h(Section, { style: styles.msgBox }, message),
          h(Text, { style: styles.p },
            'If your matter is time-sensitive, feel free to reach us directly at ',
            h(Link, { href: 'mailto:info@palmettoconsulting.us', style: styles.link }, 'info@palmettoconsulting.us'),
            ' or call (803) 254-0061.'),
          h(Hr, { style: styles.hr }),
          h(Text, { style: styles.sig }, 'The Palmetto Consulting team'),
          h(Text, { style: styles.byline }, 'Captive Insurance Consultants \u00b7 Columbia, SC'),
        ),
        h(Text, { style: styles.footer },
          'Palmetto Consulting of Columbia \u00b7 ',
          h(Link, { href: 'https://palmettoconsulting.us', style: { color: MUTED } }, 'palmettoconsulting.us'),
          h('br'),
          'This is an automated confirmation. A real person will follow up shortly.'),
      ),
    ),
  );
}
