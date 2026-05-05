import { Helmet } from 'react-helmet-async';
import { SITE } from '@/lib/site';

/**
 * Reusable per-page SEO. Pass `path` (e.g. "/about"), `title`, `description`,
 * and optional `jsonLd` (object or array). `image` defaults to SITE.ogImage.
 */
export default function Seo({
  path = '/',
  title,
  description,
  image,
  type = 'website',
  jsonLd,
  noindex = false,
}) {
  const url = `${SITE.domain}${path}`;
  const ogImage = image || SITE.ogImage;
  const fullTitle = title
    ? `${title} | ${SITE.shortName} — Columbia, SC`
    : `${SITE.name} | Captive Insurance Consultants — Columbia, SC`;
  const desc = description || SITE.description;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1'} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? { '@context': 'https://schema.org', '@graph': jsonLd } : jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
