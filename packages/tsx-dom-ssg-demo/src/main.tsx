import express from "express";

import { respondHTML } from "./utils/renderHTML";
import { DemoPage } from "./pages/DemoPage";

// The stuff below is purely for the dev-server
const app = express();
const port = 3000;

app.use("/assets", express.static("dist/packages/tsx-dom-ssg-demo/assets", { index: false, redirect: false }));

app.get("/", (req, res) => respondHTML(res, <DemoPage />));
// example: /react/index.html, /react/2.html, /react/all.html
// app.get("/:tag/", (req, res) => respondHTML(res, <ListPage tag={req.params.tag} page={1} />));
// app.get("/:tag/index.html", (req, res) => respondHTML(res, <ListPage tag={req.params.tag} page={1} />));
// app.get("/:tag/:page.html", (req, res) => respondHTML(res, <ListPage tag={req.params.tag} page={req.params.page} />));
// example: /trink-nicht-so-viel.html
// app.get("/:id", (req, res) => respondHTML(res, <PostPage id={req.params.id} />));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

// Extend ComponentThis
declare module "tsx-dom-ssr" {
    export interface ComponentThis {
        cssModules: CssModule[];
    }
}
