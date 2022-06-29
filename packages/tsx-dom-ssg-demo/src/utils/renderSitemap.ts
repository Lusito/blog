import { siteUrl } from "./config";
import { PageInfo } from "./pageUtils";

export type SitemapEntry = {
    loc: string;
    lastmod?: Date;
};

export type SitemapConfig = {
    pages: PageInfo[];
    pagesWithTags: PageInfo[];
};

export function renderSitemap({ pages, pagesWithTags }: SitemapConfig) {
    // eslint-disable-next-line no-undef-init
    let newestLastmod: Date | undefined = undefined;
    for (const page of pagesWithTags) {
        if (page.date && (!newestLastmod || page.date > newestLastmod)) {
            newestLastmod = page.date;
        }
    }

    const entries: SitemapEntry[] = [];
    entries.push({ loc: "/", lastmod: newestLastmod });
    entries.push({ loc: "/all.html", lastmod: newestLastmod });
    for (const page of pages) {
        entries.push({
            loc: `/${page.slug}.html`,
            lastmod: page.date,
        });
    }

    const urls = entries.map(({ loc, lastmod }) => {
        const lastmodPart = lastmod ? `<lastmod>${lastmod?.toISOString()}</lastmod>` : "";
        return `<url><loc>${siteUrl}${loc}</loc>${lastmodPart}</url>`;
    });

    return `<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    ${urls.join("\n    ")}
</urlset>`;
}
