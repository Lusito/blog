import fs from "fs";
import path from "path";
import frontMatter from "front-matter";
import { Component } from "tsx-dom-ssr";
import slugify from "slug";

function getAllFiles(dirPath: string, pattern: RegExp, arrayOfFiles: string[]) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            arrayOfFiles = getAllFiles(filePath, pattern, arrayOfFiles);
        } else if (pattern.test(filePath)) {
            arrayOfFiles.push(filePath);
        }
    }

    return arrayOfFiles;
}

export type FrontMatter = {
    tags: string[];
    title: string;
    image?: string;
    description: string;
    created: string;
    modified?: string;
    /** optional, usually generated from title */
    slug?: string;
};
export type TsxPage = { frontMatter: FrontMatter; default: Component };

export type PageInfoBase = {
    tags: string[];
    title: string;
    image?: string;
    description: string;
    created: Date;
    modified?: Date;
    slug: string;
};
export type PageInfoMd = PageInfoBase & { type: "md"; body: string };
export type PageInfoTsx = PageInfoBase & { type: "tsx"; component: Component };
export type PageInfo = PageInfoMd | PageInfoTsx;

export const tagSlugToLabel: Record<string, string> = {};
export const tagLabels: string[] = [];

function parseDate(date: string) {
    if (date.includes('T')) return new Date(date);
    // If not manually specified, append a default time of 12:00
    return new Date(`${date}T12:00:00.000Z`);
}

export async function getPages() {
    const rootPath = path.join("packages", "tsx-dom-ssg-demo", "src", "pages");
    const pages = getAllFiles(rootPath, /\.page\.(md|tsx)$/, []);

    const list: PageInfo[] = await Promise.all(
        pages.map(async (file) => {
            if (file.endsWith(".md")) {
                const data = await fs.promises.readFile(file, "utf-8");
                const fm = frontMatter(data);
                const page = fm.attributes as FrontMatter;

                for (const tag of page.tags) {
                    tagSlugToLabel[slugify(tag)] = tag;
                }

                return {
                    type: "md",
                    tags: page.tags,
                    title: page.title,
                    image: page.image,
                    description: page.description,
                    created: parseDate(page.created),
                    modified: page.modified ? parseDate(page.modified) : undefined,
                    slug: page.slug ?? slugify(page.title),
                    body: fm.body,
                };
            }

            const relativePath = path.relative(rootPath, file).replace(/\.page\.tsx$/, "");
            const page: TsxPage = await import(`../pages/${relativePath}.page`);
            if (!page?.frontMatter || !page?.default) throw new Error("Invalid page export");

            const fm = page.frontMatter;

            for (const tag of fm.tags) {
                tagSlugToLabel[slugify(tag)] = tag;
            }

            return {
                type: "tsx",
                tags: fm.tags,
                title: fm.title,
                image: fm.image,
                description: fm.description,
                created: parseDate(fm.created),
                modified: fm.modified ? parseDate(fm.modified) : undefined,
                slug: fm.slug ?? slugify(fm.title),
                component: page.default,
            };
        })
    );

    tagLabels.push(...Object.values(tagSlugToLabel));
    tagLabels.sort();

    return list.sort((a, b) => (a.created < b.created ? 1 : -1));
}

export function pageHasTags(page: PageInfo) {
    return page.tags.length > 0;
}
