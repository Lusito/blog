export const siteTitle = "Lusitos Tech Blog";
export const siteDescription =
    "This is a blog on all the tech things I'm interested in, mostly focused on web- and game technologies.";
export const siteUrl = process.env.NODE_ENV === "production" ? "https://blog.lusito.info" : "";
export const siteUrlForSlug = (slug: string) => (slug ? `${siteUrl}/${slug}.html` : siteUrl);
