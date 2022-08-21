export const siteTitle = "Lusitos Tech Blog";
export const siteUrl = process.env.NODE_ENV === "production" ? "https://blog.lusito.info" : "";
export const siteUrlForSlug = (slug: string) => slug ? `${siteUrl}/${slug}.html` : siteUrl;
