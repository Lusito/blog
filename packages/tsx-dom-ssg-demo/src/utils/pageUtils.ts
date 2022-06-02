import fs from "fs";
import path from "path";
import frontMatter from "front-matter";
import { Component } from "tsx-dom-ssr";

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

// fixme: use library
export const slugify = (s: string) => s.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

export type FrontMatter = {
    tags: string[];
    title: string;
    image?: string;
    description: string;
    date: string;
    /** optional, usually generated from title */
    slug?: string;
};
export type TsxPage = { frontMatter: FrontMatter; default: Component };

export type PageInfoBase = {
    tags: string[];
    title: string;
    image?: string;
    description: string;
    date: Date;
    slug: string;
};
export type PageInfoMd = PageInfoBase & { type: "md"; body: string };
export type PageInfoTsx = PageInfoBase & { type: "tsx"; component: Component };
export type PageInfo = PageInfoMd | PageInfoTsx;

export const tagLabels: Record<string, string> = {};

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
                    tagLabels[slugify(tag)] = tag;
                }

                return {
                    type: "md",
                    tags: page.tags,
                    title: page.title,
                    image: page.image,
                    description: page.description,
                    date: new Date(page.date),
                    slug: page.slug ?? slugify(page.title),
                    body: fm.body,
                };
            }

            const relativePath = path.relative(rootPath, file).replace(/\.page\.tsx$/, "");
            const page: TsxPage = await import(`../pages/${relativePath}.page`);
            if (!page?.frontMatter || !page?.default) throw new Error("Invalid page export");

            const fm = page.frontMatter;

            for (const tag of fm.tags) {
                tagLabels[slugify(tag)] = tag;
            }

            return {
                type: "tsx",
                tags: fm.tags,
                title: fm.title,
                image: fm.image,
                description: fm.description,
                date: new Date(fm.date),
                slug: fm.slug ?? slugify(fm.title),
                component: page.default,
            };
        })
    );

    return list.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function pageHasTags(page: PageInfo) {
    return page.tags.length > 0;
}
