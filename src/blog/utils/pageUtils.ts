import { join, relative, resolve } from "path";
import { Component } from "tsx-dom-ssr";
import slugify from "slug";
import { MarkdownModule } from "@lusito/require-libs";

import { getAllFiles } from "./fileUtils";

export type FrontMatter = {
    tags: string[];
    title: string;
    image?: string;
    description: string;
    created: string;
    modified?: string;
    originalSource?: string;
    /** optional, usually generated from title */
    slug?: string;
    hideSynopsis?: boolean;
    hideDate?: boolean;
};
export type TsxPage = { frontMatter: FrontMatter; default: Component };

export type PageInfoBase = {
    tags: string[];
    title: string;
    image?: string;
    description: string;
    created: Date;
    modified?: Date;
    originalSource?: string;
    slug: string;
    hideSynopsis?: boolean;
    hideDate?: boolean;
};
export type PageInfoMd = PageInfoBase & { type: "md"; body: string };
export type PageInfoTsx = PageInfoBase & { type: "tsx"; body: Component };
export type PageInfo = PageInfoMd | PageInfoTsx;

export const tagSlugToLabel: Record<string, string> = {};
export const tagLabels: string[] = [];

function parseDate(date: string) {
    if (date.includes("T")) return new Date(date);
    // If not manually specified, append a default time of 12:00
    return new Date(`${date}T12:00:00.000Z`);
}

function createPageInfoBase(fm: FrontMatter, body: string | Component): PageInfo {
    for (const tag of fm.tags) {
        tagSlugToLabel[slugify(tag)] = tag;
    }

    return {
        type: typeof body === "string" ? "md" : "tsx",
        tags: fm.tags,
        title: fm.title,
        image: fm.image,
        description: fm.description,
        created: parseDate(fm.created),
        modified: fm.modified ? parseDate(fm.modified) : undefined,
        slug: fm.slug ?? slugify(fm.title),
        hideDate: fm.hideDate,
        hideSynopsis: fm.hideSynopsis,
        originalSource: fm.originalSource,
        body,
    } as PageInfo;
}

const rootPath = join("src", "blog", "pages");
export async function getPages() {
    const pages = getAllFiles(rootPath, /\.page\.(md|tsx)$/, []);

    const list = await Promise.all(
        pages.map(async (file): Promise<PageInfo> => {
            const relativePath = relative(__dirname, resolve(process.cwd(), file));
            if (file.endsWith(".md")) {
                const data: MarkdownModule = await import(relativePath);

                return createPageInfoBase(data.frontMatter as FrontMatter, data.html);
            }

            const page: TsxPage = await import(relativePath.replace(/\.page\.tsx$/, ".page"));
            if (!page?.frontMatter || !page?.default) throw new Error("Invalid page export");

            return createPageInfoBase(page.frontMatter, page.default);
        })
    );

    tagLabels.push(...Object.values(tagSlugToLabel));
    tagLabels.sort();

    return list.sort((a, b) => (a.created < b.created ? 1 : -1));
}

export function pageHasTags(page: PageInfo) {
    return page.tags.length > 0;
}

export function getLatestLastModified(pages: PageInfo[]) {
    let latestLastmod: Date | undefined;
    for (const page of pages) {
        const lastmod = page.modified ?? page.created;
        if (lastmod && (!latestLastmod || lastmod > latestLastmod)) {
            latestLastmod = lastmod;
        }
    }

    return latestLastmod;
}

export function getLatestCreated(pages: PageInfo[]) {
    let latestCreated: Date | undefined;
    for (const { created } of pages) {
        if (created && (!latestCreated || created > latestCreated)) {
            latestCreated = created;
        }
    }

    return latestCreated;
}
