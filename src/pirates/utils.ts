import { copyFileSync, mkdirSync, readFileSync } from "fs";
import { createHash } from "crypto";
import { basename, extname, join } from "path";
import { addHook } from "pirates";

const assetCache: Record<string, string | undefined> = {};
const assetDir = join(process.cwd(), "dist", "assets");
mkdirSync(assetDir, { recursive: true });

export function copyAsset(filename: string) {
    let destination = assetCache[filename];
    if (!destination) {
        const fileBuffer = readFileSync(filename);
        const hashSum = createHash("sha256");
        hashSum.update(fileBuffer);
        const hash = hashSum.digest("hex").substring(0, 8);
        const ext = extname(filename);

        const newFilename = `${basename(filename, ext)}-${hash}${ext}`;

        destination = `/assets/${newFilename}`;
        assetCache[filename] = destination;

        copyFileSync(filename, join(assetDir, newFilename));
    }
    return destination;
}

const devMode = process.env.NODE_ENV === "development";

export function setupCachedHook(
    hook: (code: string, filename: string) => string,
    opts?: Parameters<typeof addHook>[1]
) {
    const compiledCache: Record<string, string | undefined> = {};

    addHook((code, filename) => {
        const cache = compiledCache[filename];
        if (cache) return cache;

        const newCode = hook(code, filename);

        // Clear require cache (FIXME: test if this actually works)
        if (devMode) delete require.cache[filename];
        else compiledCache[filename] = newCode;

        return newCode;
    }, opts);
}
