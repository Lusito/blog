import { copyAsset, setupCachedHook } from "./utils";

setupCachedHook(
    (code, filename) => {
        const assetFilename = copyAsset(filename);
        return `module.exports = ${JSON.stringify(assetFilename)}`;
    },
    { exts: [".png", ".webp"] }
);
