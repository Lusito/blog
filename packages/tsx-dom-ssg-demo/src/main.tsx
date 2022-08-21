import express, { Request, Response } from "express";
import compression from "compression";
import { ComponentChildren } from "tsx-dom-ssr";
import fs from "fs";

import { renderHTML } from "./utils/renderHTML";
import NotFoundPage from "./pages/site/404.page";
import { DynamicPage } from "./utils/DynamicPage";
import { getPages, pageHasTags, tagLabels, tagSlugToLabel } from "./utils/pageUtils";
import { MarkdownPage } from "./utils/MarkdownPage";
import { itemsPerPage, ListPage } from "./utils/ListPage";
import { ListAllPage } from "./utils/ListAllPage";
import { tagDescriptions } from "./utils/tagDescriptions";
import { renderSitemap } from "./utils/renderSitemap";
import { SearchPage } from "./utils/SearchPage";
import { HomePage } from "./utils/HomePage";

// The stuff below is purely for the dev-server
const app = express();
app.use(compression());
const port = 3000;

async function respondHTML(res: Response, path: string, children: ComponentChildren) {
    try {
        const html = await renderHTML(path, children);
        res.send(html);
    } catch (e) {
        console.error("Uncaught exception", e);
        res.status(500).send(`Unknown Error ${String(e)}`);
    }
}

if (process.env.NODE_ENV !== "production") {
    // SSE hot reload:
    const startupTime = Date.now();
    app.get("/hot-sse", (req, res) => {
        res.status(200).set({ connection: "keep-alive", "content-type": "text/event-stream" });
        res.write(`data: ${startupTime}\n\n`);
        res.flush();
    });
}

app.use("/assets", express.static("dist/packages/tsx-dom-ssg-demo/assets", { index: false, redirect: false }));

app.get("/custom-elements.js", async (req, res) => {
    let filePath = "./dist/packages/tsx-dom-ssg-demo-elements/main.esm.js";
    if (!fs.existsSync(filePath)) {
        filePath = filePath.replace(/\.esm\.js$/, ".js");
    }
    res.sendFile(filePath, { root: process.cwd() });
});

const respond404 = (req: Request, res: Response) => {
    res.status(404);
    return respondHTML(res, req.path, <NotFoundPage />);
};

const validatePage = (page: string | undefined, numPages: number) => {
    const pageNumber = page ? parseInt(page) : 1;
    if (page === "1" || Number.isNaN(pageNumber) || pageNumber < 1 || (pageNumber - 1) * itemsPerPage >= numPages) {
        return undefined;
    }

    return pageNumber;
};

async function init() {
    const pages = await getPages();
    const pagesWithTags = pages.filter(pageHasTags);

    // Pages without tags are internal (for example "about") and not supposed to be listed
    app.get("/", (req, res) => respondHTML(res, req.path, <HomePage pages={pagesWithTags} />));
    app.get("/all.html", (req, res) => respondHTML(res, req.path, <ListAllPage pages={pagesWithTags} />));
    app.get("/search.html", (req, res) => respondHTML(res, req.path, <SearchPage pages={pagesWithTags} />));

    app.get("/latest/:page?.html", (req, res) => {
        const { page } = req.params;
        const pageNumber = validatePage(page, pagesWithTags.length);

        if (!pageNumber) {
            return respond404(req, res);
        }

        respondHTML(
            res,
            req.path,
            <ListPage
                path="/latest"
                tags={tagLabels}
                title="Latest Posts"
                description="A chronological list of posts on this blog"
                pages={pagesWithTags}
                pageNumber={pageNumber}
            />
        );
    });

    // fixme: implement infinite scrolling?
    app.get("/tag/:tag/:page?.html", (req, res) => {
        const { tag, page } = req.params;
        const tagLabel = tagSlugToLabel[tag] ?? tag;
        const filteredPages = pages.filter((p) => p.tags.includes(tagLabel));

        const pageNumber = validatePage(page, filteredPages.length);

        if (!pageNumber) {
            return respond404(req, res);
        }

        const description = tagDescriptions[tagLabel] ?? `Posts related to ${tagLabel}`;

        respondHTML(
            res,
            req.path,
            <ListPage
                path={`/tag/${tag}`}
                tags={[tagLabel]}
                title={tagLabel}
                description={description}
                pages={filteredPages}
                pageNumber={pageNumber}
            />
        );
    });

    app.get("/:slug.html", (req, res) => {
        const { slug } = req.params;
        const page = pages.find((p) => p.slug === slug);
        if (!page) {
            return respond404(req, res);
        }
        if (page.type === "md") return respondHTML(res, req.path, <MarkdownPage page={page} />);
        return respondHTML(res, req.path, <DynamicPage component={page.body} />);
    });

    app.get("/sitemap.xml", async (req, res) => {
        try {
            const xml = await renderSitemap({ pages, pagesWithTags });
            res.type("application/xml");
            res.send(xml);
        } catch (e) {
            console.error("Uncaught exception", e);
            res.status(500).send(`Unknown Error ${String(e)}`);
        }
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
