// Schema.org JSON-LD builders. Single source of truth for the Organization
// graph (referenced by @id from every page) plus reusable builders for
// WebPage / BreadcrumbList / Service / Person nodes.
//
// Usage:
//   import { graph, organization, webPage, breadcrumb } from '@/lib/schema';
//   const ld = graph([
//     organization(),
//     webPage({ id: 'webpage', url: '/', name: 'Home', type: 'WebPage' }),
//     breadcrumb([{ name: 'Home', path: '/' }]),
//   ]);
//   <script type="application/ld+json">{JSON.stringify(ld)}</script>
import { SITE } from './site';

const D = SITE.domain;
const ORG_ID = `${D}/#organization`;
const WEBSITE_ID = `${D}/#website`;

export { ORG_ID, WEBSITE_ID };

export function graph(nodes) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

export function website() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: D,
    name: SITE.name,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-US',
  };
}

export function organization() {
  return {
    '@type': ['InsuranceAgency', 'ProfessionalService', 'Organization'],
    '@id': ORG_ID,
    name: SITE.legalName,
    legalName: SITE.legalName,
    alternateName: 'PCC',
    url: D,
    logo: `${D}/icons/icon-512.png`,
    image: SITE.ogImage,
    description: SITE.description,
    foundingDate: String(SITE.founded),
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
      streetAddress: SITE.address.streetAddress,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.latitude, longitude: SITE.geo.longitude },
    telephone: SITE.phoneE164,
    email: SITE.email,
    priceRange: '$$$',
    contactPoint: [{
      '@type': 'ContactPoint',
      telephone: SITE.phoneE164,
      contactType: 'customer service',
      areaServed: 'US',
      availableLanguage: ['en'],
      email: SITE.email,
    }],
  };
}

export function webPage({ id, url, name, type = 'WebPage', speakable = true }) {
  const node = {
    '@type': type,
    '@id': `${D}${url}#${id}`,
    url: `${D}${url}`,
    name,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    inLanguage: 'en-US',
  };
  if (speakable) {
    node.speakable = {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', '[data-speakable]'],
    };
  }
  return node;
}

export function breadcrumb(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${D}${it.path}`,
    })),
  };
}

export function service({ name, description, serviceType = 'Insurance Consulting', category = 'Captive Insurance', additionalType }) {
  const node = {
    '@type': 'Service',
    name,
    description,
    serviceType,
    category,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'United States' },
  };
  if (additionalType) node.additionalType = additionalType;
  return node;
}

export function offerCatalog(name, services) {
  return {
    '@type': 'OfferCatalog',
    name,
    itemListElement: services.map((s, i) => ({
      '@type': 'Offer',
      position: i + 1,
      itemOffered: s,
    })),
  };
}

export function person({ name, role, bio, photo, isCpa = false }) {
  const slug = name.toLowerCase().replace(/[^a-z]+/g, '-');
  const node = {
    '@type': 'Person',
    '@id': `${D}/about#${slug}`,
    name,
    jobTitle: role,
    worksFor: { '@id': ORG_ID },
    description: bio,
  };
  if (photo) node.image = `${D}${photo}`;
  if (isCpa) {
    node.hasCredential = {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Professional Certification',
      name: 'Certified Public Accountant (CPA)',
    };
    node.knowsAbout = [
      'Captive Insurance',
      'Property and Casualty Insurance',
      'Insurance CFO Services',
      'External Audit',
      'AM Best Rated Insurers',
      'Insurance Financial Reporting',
    ];
  }
  return node;
}
