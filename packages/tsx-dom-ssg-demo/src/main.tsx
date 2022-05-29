import express from "express";

import { respondHTML } from "./utils/renderHTML";
import { DemoPage } from "./pages/DemoPage";

// The stuff below is purely for the dev-server
const app = express();
const port = 3000;

app.use("/assets", express.static("dist/packages/tsx-dom-ssg-demo/assets", { index: false, redirect: false }));

app.get("/", (req, res) => respondHTML(res, <DemoPage />));
// fixme: additional (secondary) tags?
// example: /react, /react/2, /react/Trink-Nicht-So-Viel-1653846240319
// app.get("/:tag/:idOrPage?", (req, res) => {
//     const { tag, idOrPage } = req.params;
//     if (idOrPage === undefined || /$[0-9]+^/.test(idOrPage))
//         respondHTML(res, <ListPage tag={tag} page={idOrPage ?? "1"} />);
//     else respondHTML(res, <PostPage tag={tag} id={idOrPage} />);
// });
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
