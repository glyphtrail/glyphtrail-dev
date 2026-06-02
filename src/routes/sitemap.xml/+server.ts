import type { RequestHandler } from './$types';
import { buildDateIso } from '$lib/server/build-metadata';

const SITE = 'https://glyphtrail.dev';

// Routes to advertise. Single-page site for now; add paths here as routes grow.
const paths = ['/'];

export const prerender = true;

export const GET: RequestHandler = () => {
  const urls = paths
    .map(
      (path) => `  <url>
    <loc>${SITE}${path}</loc>
    <lastmod>${buildDateIso}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${path === '/' ? '1.0' : '0.7'}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' }
  });
};
