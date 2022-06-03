import fs from "fs";
import { ComponentChildren } from "tsx-dom-ssr";

import NotFoundPage from "./pages/site/404.page";
import { DynamicPage } from "./utils/DynamicPage";
import { ListAllPage } from "./utils/ListAllPage";
import { itemsPerPage, ListPage } from "./utils/ListPage";
import { MarkdownPage } from "./utils/MarkdownPage";
import { getPages, PageInfo, pageHasTags, tagLabels } from "./utils/pageUtils";
import { renderHTML } from "./utils/renderHTML";

async function writeHTML(path: string, children: ComponentChildren) {
    const html = await renderHTML(path, children);
    await fs.promises.writeFile(`dist/packages/tsx-dom-ssg-demo${path}`, html);
}

async function createHTMLPath(path: string) {
    const fullPath = `dist/packages/tsx-dom-ssg-demo${path}`;
    if (!fs.existsSync(fullPath)) await fs.promises.mkdir(fullPath);
}

async function writePages(path: string, title: string, description: string, pages: PageInfo[]) {
    const pageCount = Math.ceil(pages.length / itemsPerPage);
    if (pageCount <= 1) return [];

    await createHTMLPath(path);
    return Promise.all(
        Array.from({ length: pageCount - 1 }, (_, index) =>
            writeHTML(
                `${path}/${index + 2}.html`,
                <ListPage path={path} title={title} description={description} pages={pages} pageNumber={index + 2} />
            )
        )
    );
}

async function createFiles() {
    const start = Date.now();
    const pages = await getPages();
    const pagesWithTags = pages.filter(pageHasTags);
    const tags = Object.keys(tagLabels);

    await createHTMLPath("/tag");
    await Promise.all([
        writeHTML("/404.html", <NotFoundPage />),
        writeHTML(
            "/index.html",
            <ListPage
                path="/latest"
                title="Latest Posts"
                description="A list of all posts on this blog"
                pages={pagesWithTags}
                pageNumber={1}
            />
        ),
        writeHTML("/all.html", <ListAllPage pages={pagesWithTags} />),
        writePages("/latest", "Latest Posts", "A list of all posts on this blog", pagesWithTags),
        ...tags
            .map((tag) => {
                const tagLabel = tagLabels[tag] ?? tag;
                const filteredPages = pages.filter((p) => p.tags.includes(tagLabel));
                const description = `A list of all posts related to ${tagLabel}`;
                return [
                    writeHTML(
                        `/tag/${tag}.html`,
                        <ListPage
                            path={`/tag/${tag}`}
                            title={tagLabel}
                            description={description}
                            pages={filteredPages}
                            pageNumber={1}
                        />
                    ),
                    writePages(`/tag/${tag}`, tagLabel, description, pagesWithTags),
                ];
            })
            .flat(),
        ...pages.map((page) => {
            const path = `/${page.slug}.html`;
            if (page.type === "md") return writeHTML(path, <MarkdownPage page={page} />);
            return writeHTML(path, <DynamicPage component={page.component} />);
        }),
    ]);

    console.log(`Generating files took ${Date.now() - start}ms`);
}

createFiles();
