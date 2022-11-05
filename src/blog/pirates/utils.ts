import { createCopyAsset } from "@lusito/require-libs";
import { join } from "path";

const assetDir = join(process.cwd(), "dist", "assets");
export const copyAsset = createCopyAsset(assetDir, "/assets/");
