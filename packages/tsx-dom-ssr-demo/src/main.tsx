import express from "express";
import fs from "fs";

import { respondHTML } from "./utils/renderHTML";
import { DemoPage } from "./pages/DemoPage";
import { ramRouter } from "./routers/ramRouter";
import { SequentialPage } from "./pages/SequentialPage";

const app = express();
const port = 3000;

app.get("/", (req, res) => respondHTML(res, <DemoPage />));

app.get("/sequential", (req, res) => respondHTML(res, <SequentialPage />));

app.get("/custom-elements.js", async (req, res) => {
    fs.readFile("./dist/packages/tsx-dom-ssr-demo-elements/main.esm.js", { encoding: "utf-8" }, (err, content) => {
        if (err) {
            res.status(404).send("");
        } else {
            res.contentType("text/javascript").send(content);
        }
    });
});

app.use(ramRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

// Extend ComponentThis
declare module "tsx-dom-ssr" {
    export interface ComponentThis {
        cssModules: CssModule[];
    }
}