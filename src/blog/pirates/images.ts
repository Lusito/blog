import { addHook } from "pirates";
import fs from "fs";
import { join } from "path";

import { hashFile } from "./utils";

const compiledCache: Record<string, string | undefined> = {};
const devMode = process.env.NODE_ENV === "development";
const assetDir = join(process.cwd(), "dist", "assets");
fs.mkdirSync(assetDir, { recursive: true });

addHook(
    (code, filename) => {
        const cache = compiledCache[filename];
        if (cache) return cache;

        const newFilename = hashFile(filename);
        const assetFilename = `assets/${newFilename}`;
        fs.copyFileSync(filename, join(assetDir, newFilename));

        const newCode = `module.exports = ${JSON.stringify(assetFilename)}`;

        // Clear require cache (FIXME: test if this actually works)
        if (devMode) delete require.cache[filename];
        else compiledCache[filename] = newCode;

        return newCode;
    },
    { exts: [".png", ".webp"] }
);
