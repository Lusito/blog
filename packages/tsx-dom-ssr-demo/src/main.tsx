import express from "express";
import fs from "fs";

import { respondHTML } from "./utils/renderHTML";
import { DemoPage } from "./pages/DemoPage";
import { ramRouter } from "./routers/ramRouter";

const app = express();
const port = 3000;

app.get("/", (req, res) => respondHTML(res, <DemoPage />));

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