import { Swup } from "./swup";
import BodyClassPlugin from "./swup/plugins/body";
import HeadPlugin from "./swup/plugins/head";
import PreloadPlugin from "./swup/plugins/preload";
import ProgressPlugin from "./swup/plugins/progress";
import ScrollPlugin from "./swup/plugins/scroll";

let swup: Swup | null = null;
document.addEventListener("DOMContentLoaded", () => {
    swup = new Swup();
    swup.use(new HeadPlugin(swup));
    swup.use(new BodyClassPlugin(swup));
    swup.use(new ScrollPlugin(swup));
    swup.use(new ProgressPlugin(swup));
    swup.use(new PreloadPlugin(swup));
});

export function goToPage(url: string) {
    if (swup) {
        swup.loadPage({ url });
    }
}
