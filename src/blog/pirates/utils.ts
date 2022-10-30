import { readFileSync } from "fs";
import { createHash } from "crypto";
import { basename, extname } from "path";

export function hashFile(filename: string) {
    const fileBuffer = readFileSync(filename);
    const hashSum = createHash("sha256");
    hashSum.update(fileBuffer);
    const hash = hashSum.digest("hex").substring(0, 8);
    const ext = extname(filename);

    return `${basename(filename, ext)}-${hash}${ext}`;
}
