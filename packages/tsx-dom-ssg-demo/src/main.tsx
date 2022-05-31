import express from "express";

import { respondHTML } from "./utils/renderHTML";
import { IndexPage } from "./pages/IndexPage";
import { DynamicPage } from "./utils/DynamicPage";
import { getPages } from "./utils/getPages";
import { MarkdownPage } from "./utils/MarkdownPage";

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

app.get("/", (req, res) => respondHTML(res, <IndexPage />));

async function init() {
    const pages = await getPages();

    // example: /react/index.html, /react/2.html, /react/all.html
    // app.get("/:tag/", (req, res) => respondHTML(res, <ListPage tag={req.params.tag} page={1} />));
    // app.get("/:tag/index.html", (req, res) => respondHTML(res, <ListPage tag={req.params.tag} page={1} />));
    // app.get("/:tag/:page.html", (req, res) => respondHTML(res, <ListPage tag={req.params.tag} page={req.params.page} />));

    // example: /trink-nicht-so-viel.html
    app.get("/:slug.html", (req, res) => {
        const { slug } = req.params;
        const page = pages.find((p) => p.slug === slug);
        if (!page) return res.sendStatus(404);
        if (page.type === "md") return respondHTML(res, <MarkdownPage page={page} />);
        return respondHTML(res, <DynamicPage path={page.path} />);
    });

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
}

init();

// Extend ComponentThis
declare module "tsx-dom-ssr" {
    export interface ComponentThis {
        cssModules: CssModule[];
    }
}
