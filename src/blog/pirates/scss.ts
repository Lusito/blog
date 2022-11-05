import { createScssHandler } from "@lusito/require-libs";
import { addHook } from "pirates";

import { copyAsset } from "./utils";

const devMode = process.env.NODE_ENV !== "production";

// SCSS Modules
const scssHandler = createScssHandler({
    style: devMode ? "expanded" : "compressed",
    mapFileUrl: copyAsset,
});

addHook(scssHandler, { exts: [".css", ".scss"] });
