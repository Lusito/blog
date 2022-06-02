import express, { Request, Response } from "express";

import { respondHTML } from "./utils/renderHTML";
import NotFoundPage from "./pages/site/404.page";
import { DynamicPage } from "./utils/DynamicPage";
import { getPages, pagesWithTags, tagLabels } from "./utils/getPages";
import { MarkdownPage } from "./utils/MarkdownPage";
import { itemsPerPage, ListPage } from "./utils/ListPage";
import { ListAllPage } from "./utils/ListAllPage";

// The stuff below is purely for the dev-server
const app = express();
const port = 3000;

if (process.env.NODE_ENV !== "production") {
    // SSE hot reload:
    const startupTime = Date.now();
    app.get("/hot-sse", (req, res) => {
        res.status(200).set({ connection: "keep-alive", "content-type": "text/event-stream" });
        res.write(`data: ${startupTime}\n\n`);
    });
}

app.use("/assets", express.static("dist/packages/tsx-dom-ssg-demo/assets", { index: false, redirect: false }));

const respond404 = (req: Request, res: Response) => {
    res.status(404);
    return respondHTML(res, req.path, <NotFoundPage />);
};

async function init() {
    const pages = await getPages();

    // Pages without tags are internal (for example "about") and not supposed to be listed
    app.get("/", (req, res) =>
        respondHTML(
            res,
            req.path,
            <ListPage path="/latest" title="Latest Posts" pages={pages.filter(pagesWithTags)} pageNumber={1} />
        )
    );
    app.get("/all.html", (req, res) => respondHTML(res, req.path, <ListAllPage pages={pages.filter(pagesWithTags)} />));

    app.get("/latest/:page.html", (req, res) => {
        const { page } = req.params;
        const pageNumber = page ? parseInt(page) : 1;
        const filteredPages = pages.filter(pagesWithTags);

        if (pageNumber < 2 || (pageNumber - 1) * itemsPerPage >= filteredPages.length) {
            return respond404(req, res);
        }

        respondHTML(
            res,
            req.path,
            <ListPage path="/latest" title="Latest Posts" pages={filteredPages} pageNumber={pageNumber} />
        );
    });

    // fixme: implement infinite scrolling?
    app.get("/tag/:tag/:page?.html", (req, res) => {
        const { tag, page } = req.params;
        const pageNumber = page ? parseInt(page) : 1;
        const tagLabel = tag && (tagLabels[tag] ?? tag);
        const filteredPages = pages.filter((p) => p.tags.includes(tagLabel));

        if (page === "1" || pageNumber < 1 || (pageNumber - 1) * itemsPerPage >= filteredPages.length) {
            return respond404(req, res);
        }

        respondHTML(
            res,
            req.path,
            <ListPage path={`/tag/${tag}`} title={tagLabel} pages={filteredPages} pageNumber={pageNumber} />
        );
    });

    // fixme: search is done clientside, filter by search-text, tags (and/or) and date-range
    // app.get("/search.html", (req, res) => respondHTML(res, <SearchPage />));

    app.get("/:slug.html", (req, res) => {
        const { slug } = req.params;
        const page = pages.find((p) => p.slug === slug);
        if (!page) {
            return respond404(req, res);
        }
        if (page.type === "md") return respondHTML(res, req.path, <MarkdownPage page={page} />);
        return respondHTML(res, req.path, <DynamicPage component={page.component} />);
    });
    app.get("*", respond404);

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
}

// fixme: required pages: legal notice?, privacy policy? (all linked from the footer rather than from the menu)
// fixme: portfolio page? Project introductions, toilet papers, etc.
// fixme: cookie banner? (for login of giscus maybe)

init();

// Extend ComponentThis
declare module "tsx-dom-ssr" {
    export interface ComponentThis {
        readonly path: string;
        cssModules: CssModule[];
    }
}
