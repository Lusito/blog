import express from "express";

import { respondHTML } from "./utils/renderHTML";
import { DemoPage } from "./pages/DemoPage";

// The stuff below is purely for the dev-server
const app = express();
const port = 3000;

app.use("/assets", express.static("dist/packages/tsx-dom-ssg-demo/assets", { index: false, redirect: false }));

app.get("/", (req, res) => respondHTML(res, <DemoPage />));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

// Extend ComponentThis
declare module "tsx-dom-ssr" {
    export interface ComponentThis {
        cssModules: CssModule[];
    }
}
