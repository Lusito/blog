import { setupHook } from "scss-modules";

import { copyAsset } from "./utils";

setupHook({
    mapFileUrl(fileUrl) {
        return copyAsset(fileUrl);
    },
});
