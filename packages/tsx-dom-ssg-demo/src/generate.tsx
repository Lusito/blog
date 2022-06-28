import fs from "fs";
import { ComponentChildren } from "tsx-dom-ssr";

import NotFoundPage from "./pages/site/404.page";
import { DynamicPage } from "./utils/DynamicPage";
import { ListAllPage } from "./utils/ListAllPage";
import { itemsPerPage, ListPage } from "./utils/ListPage";
import { MarkdownPage } from "./utils/MarkdownPage";
import { getPages, PageInfo, pageHasTags, tagSlugToLabel, tagLabels } from "./utils/pageUtils";
import { renderHTML } from "./utils/renderHTML";
import { renderSitemap, SitemapConfig } from "./utils/renderSitemap";

async function writeSitemap(config: SitemapConfig) {
    const xml = await renderSitemap(config);
    await fs.promises.writeFile("dist/packages/tsx-dom-ssg-demo/sitemap.xml", xml);
}

async function writeHTML(path: string, children: ComponentChildren) {
    const html = await renderHTML(path, children);
    await fs.promises.writeFile(`dist/packages/tsx-dom-ssg-demo${path}`, html);
}

async function createHTMLPath(path: string) {
    const fullPath = `dist/packages/tsx-dom-ssg-demo${path}`;
    if (!fs.existsSync(fullPath)) await fs.promises.mkdir(fullPath);
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

async function createFiles() {
    const start = Date.now();
    const pages = await getPages();
    const pagesWithTags = pages.filter(pageHasTags);
    const tags = Object.keys(tagSlugToLabel);

    await createHTMLPath("/tag");
    await Promise.all([
        writeHTML("/404.html", <NotFoundPage />),
        writeHTML(
            "/index.html",
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
        writePages("/latest", tagLabels, "Latest Posts", "A chronological list of posts on this blog", pagesWithTags),
        ...tags
            .map((tag) => {
                const tagLabel = tagSlugToLabel[tag] ?? tag;
                const filteredPages = pages.filter((p) => p.tags.includes(tagLabel));
                const description = `Posts related to ${tagLabel}`;
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
            return writeHTML(path, <DynamicPage component={page.component} />);
        }),
        writeSitemap({ pages, pagesWithTags }),
    ]);

    console.log(`Generating files took ${Date.now() - start}ms`);
}

createFiles();
