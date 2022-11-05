import { createImageHandler } from "@lusito/require-libs";
import { addHook } from "pirates";

import { copyAsset } from "./utils";

const imageHandler = createImageHandler({ copyAsset });
addHook((_, filename) => imageHandler(filename), { exts: [".png", ".webp"] });
