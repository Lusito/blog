import { Swup } from "./swup";
import BodyClassPlugin from "./swup/plugins/body";
import HeadPlugin from "./swup/plugins/head";
import PreloadPlugin from "./swup/plugins/preload";
import ProgressPlugin from "./swup/plugins/progress";
import ScrollPlugin from "./swup/plugins/scroll";

let swup: Swup | null = null;
document.addEventListener("DOMContentLoaded", () => {
    swup = new Swup();
    swup.use(
        new HeadPlugin(swup),
        new BodyClassPlugin(swup),
        new ScrollPlugin(swup),
        new ProgressPlugin(swup),
        new PreloadPlugin(swup)
    );
});

export function goToPage(url: string) {
    if (swup) {
        swup.loadPage({ url });
    }
}
