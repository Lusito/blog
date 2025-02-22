export const siteTitle = "Lusitos Tech Blog";
export const siteDescription =
    "This is a blog on all the tech things I'm interested in, mostly focused on web- and game technologies.";
export const productionSiteUrl = "https://blog.lusito.info";
export const siteUrl = process.env.NODE_ENV === "production" ? productionSiteUrl : "";
export const siteUrlForSlug = (slug: string) => (slug ? `${siteUrl}/${slug}.html` : siteUrl);
