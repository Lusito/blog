import express from "express";

import { respondHTML } from "./utils/renderHTML";
import { IndexPage } from "./pages/IndexPage";
import { DynamicPage } from "./utils/DynamicPage";
import { getPages } from "./utils/getPages";
import { MarkdownPage } from "./utils/MarkdownPage";
import { ListPage } from "./utils/ListPage";

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

async function init() {
    const pages = await getPages();

    // fixme: could have a sidebar with all available tags
    app.get("/", (req, res) => respondHTML(res, <ListPage pages={pages} start={0} />));

    // "all.html" pages should just show titles in order to reduce the size
    // example: /latest/2.html, /latest/all.html
    // app.get("/latest/all.html", (req, res) => respondHTML(res, <ListPage />));
    // app.get("/latest/:page.html", (req, res) => respondHTML(res, <ListPage page={req.params.page} />));

    app.get("/tag/:tag.html", (req, res) =>
        respondHTML(res, <ListPage tag={req.params.tag} pages={pages} start={0} />)
    );
    // fixme: pagination, for example /tag/react/2.html, /tag/react/all.html
    // app.get("/tag/:tag/all.html", (req, res) => respondHTML(res, <ListPage tag={req.params.tag} />));
    // app.get("/tag/:tag/:page.html", (req, res) => respondHTML(res, <ListPage tag={req.params.tag} page={req.params.page} />));

    // search is done clientside, filter by search-text, tags (and/or) and date-range
    // app.get("/search.html", (req, res) => respondHTML(res, <SearchPage />));

    // example: /using-hot-module-replacement-manually.html
    app.get("/:slug.html", (req, res) => {
        const { slug } = req.params;
        const page = pages.find((p) => p.slug === slug);
        if (!page) return res.sendStatus(404);
        if (page.type === "md") return respondHTML(res, <MarkdownPage page={page} />);
        return respondHTML(res, <DynamicPage component={page.component} />);
    });

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
}

// fixme: required pages: legal notice, privacy policy (all linked from the footer rather than from the menu).. should they have no tags at all?
// fixme: about page? portfolio page? Project introductions, toilet papers, etc.
// fixme: cookie banner? (for login of giscus maybe)

init();

// Extend ComponentThis
declare module "tsx-dom-ssr" {
    export interface ComponentThis {
        cssModules: CssModule[];
    }
}
