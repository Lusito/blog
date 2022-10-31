import "../pirates/scss-modules";
import "../pirates/images";
import "../pirates/markdown";
import fs from "fs";
import { basename } from "path";
import { ComponentChildren } from "tsx-dom-ssr";
import { build } from "esbuild";
import { CssModule } from "scss-modules";

import NotFoundPage from "./pages/site/404.page";
import { DynamicPage } from "./utils/DynamicPage";
import { getAllFiles } from "./utils/fileUtils";
import { HomePage } from "./utils/HomePage";
import { ListAllPage } from "./utils/ListAllPage";
import { itemsPerPage, ListPage } from "./utils/ListPage";
import { MarkdownPage } from "./utils/MarkdownPage";
import { getPages, PageInfo, pageHasTags, tagSlugToLabel, tagLabels } from "./utils/pageUtils";
import { renderHTML } from "./utils/renderHTML";
import { renderRSS } from "./utils/renderRSS";
import { renderSitemap, SitemapConfig } from "./utils/renderSitemap";
import { SearchPage } from "./utils/SearchPage";
import { tagDescriptions } from "./utils/tagDescriptions";

const assets = "src/blog/assets";
const destination = "dist";

async function writeSitemap(config: SitemapConfig) {
    const xml = await renderSitemap(config);
    await fs.promises.writeFile(`${destination}/sitemap.xml`, xml);
}

async function writeRSS(pages: PageInfo[]) {
    const xml = await renderRSS(pages);
    await fs.promises.writeFile(`${destination}/rss.xml`, xml);
}

async function writeHTML(path: string, children: ComponentChildren) {
    const html = await renderHTML(path, children);
    await fs.promises.writeFile(`${destination}${path}`, html);
}

async function createHTMLPath(path: string) {
    const fullPath = `${destination}${path}`;
    if (!fs.existsSync(fullPath)) await fs.promises.mkdir(fullPath, { recursive: true });
}

async function writePages(path: string, tags: string[], title: string, description: string, pages: PageInfo[]) {
    const pageCount = Math.ceil(pages.length / itemsPerPage);
    if (pageCount <= 1) return [];

    await createHTMLPath(path);
    return Promise.all(
        Array.from({ length: pageCount - 1 }, (_, index) =>
            writeHTML(
                `${path}/${index + 2}.html`,
                <ListPage
                    path={path}
                    tags={tags}
                    title={title}
                    description={description}
                    pages={pages}
                    pageNumber={index + 2}
                />
            )
        )
    );
}

async function copyAssets() {
    const files = getAllFiles(assets, /(?<!\.gitkeep)$/, []);
    await createHTMLPath("/assets");
    await Promise.all(
        files.map((file) => {
            const target = `${destination}/assets/${basename(file)}`;
            return fs.promises.copyFile(file, target);
        })
    );

    const result = await build({
        bundle: true,
        minify: process.env.NODE_ENV === "production",
        entryPoints: ["src/custom-elements/index.ts"],
        outfile: `${destination}/custom-elements.js`,
    });

    if (result.warnings.length) {
        console.warn(result.warnings);
    }
    if (result.errors.length) {
        console.error(result.errors);
    }
}

async function createFiles() {
    const start = Date.now();
    const pages = await getPages();
    const pagesWithTags = pages.filter(pageHasTags);
    const tags = Object.keys(tagSlugToLabel);

    await createHTMLPath("/tag");
    await Promise.all([
        copyAssets(),
        writeHTML("/404.html", <NotFoundPage />),
        writeHTML("/index.html", <HomePage pages={pagesWithTags} />),
        writeHTML(
            "/latest.html",
            <ListPage
                path="/latest"
                tags={tagLabels}
                title="Latest Posts"
                description="A chronological list of posts on this blog"
                pages={pagesWithTags}
                pageNumber={1}
            />
        ),
        writeHTML("/all.html", <ListAllPage pages={pagesWithTags} />),
        writeHTML("/search.html", <SearchPage pages={pagesWithTags} />),
        writePages("/latest", tagLabels, "Latest Posts", "A chronological list of posts on this blog", pagesWithTags),
        ...tags
            .map((tag) => {
                const tagLabel = tagSlugToLabel[tag] ?? tag;
                const filteredPages = pages.filter((p) => p.tags.includes(tagLabel));

                const description = tagDescriptions[tagLabel] ?? `Posts related to ${tagLabel}`;
                return [
                    writeHTML(
                        `/tag/${tag}.html`,
                        <ListPage
                            path={`/tag/${tag}`}
                            tags={[tagLabel]}
                            title={tagLabel}
                            description={description}
                            pages={filteredPages}
                            pageNumber={1}
                        />
                    ),
                    writePages(`/tag/${tag}`, [tagLabel], tagLabel, description, filteredPages),
                ];
            })
            .flat(),
        ...pages.map((page) => {
            const path = `/${page.slug}.html`;
            if (page.type === "md") return writeHTML(path, <MarkdownPage page={page} />);
            return writeHTML(path, <DynamicPage component={page.body} />);
        }),
        writeSitemap({ pages, pagesWithTags }),
        writeRSS(pagesWithTags),
    ]);

    console.log(`Generating files took ${Date.now() - start}ms`);
}

createFiles();

// Extend ComponentThis
declare module "tsx-dom-ssr" {
    export interface ComponentThis {
        readonly path: string;
        cssModules: CssModule[];
    }
}
