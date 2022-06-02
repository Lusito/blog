import type slugify from "slugify";

export const siteTitle = "Lusitos Tech Blog";
export const siteUrl = process.env.NODE_ENV === "production" ? "https://blog.lusito.info" : "";
export const slugifyOptions: Parameters<typeof slugify>[1] = {
    lower: true,
};
