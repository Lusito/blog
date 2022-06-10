import { Swup } from "./swup";
import SwupBodyClassPlugin from "./swup/plugins/body/SwupBodyClassPlugin";
import SwupHeadPlugin from "./swup/plugins/head/SwupHeadPlugin";
import SwupPreloadPlugin from "./swup/plugins/preload/SwupPreloadPlugin";
import SwupProgressPlugin from "./swup/plugins/progress/SwupProgressPlugin";
import SwupScrollPlugin from "./swup/plugins/scroll/SwupScrollPlugin";

let swup: Swup | null = null;
document.addEventListener("DOMContentLoaded", () => {
    swup = new Swup();
    swup.use(
        new SwupHeadPlugin(swup),
        new SwupBodyClassPlugin(swup),
        new SwupScrollPlugin(swup),
        new SwupProgressPlugin(swup),
        new SwupPreloadPlugin(swup)
    );
});

export function goToPage(url: string) {
    if (swup) {
        swup.loadPage({ url });
    }
}
