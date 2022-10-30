import { setupHook } from "scss-modules";

import { hashFile } from "./utils";

setupHook({
    mapFileUrl(fileUrl) {
        return `assets/${hashFile(fileUrl)}`;
    },
});
