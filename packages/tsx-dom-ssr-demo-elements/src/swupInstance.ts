import { Swup } from "./swup";
import { SwupA11yPlugin } from "./swup/plugins/a11y/SwupA11yPlugin";
import { SwupBodyClassPlugin } from "./swup/plugins/body/SwupBodyClassPlugin";
import { SwupCssPlugin } from "./swup/plugins/css/SwupCssPlugin";
import { SwupHeadPlugin } from "./swup/plugins/head/SwupHeadPlugin";
import { SwupPreloadPlugin } from "./swup/plugins/preload/SwupPreloadPlugin";
import { SwupProgressPlugin } from "./swup/plugins/progress/SwupProgressPlugin";
import { SwupScrollPlugin } from "./swup/plugins/scroll/SwupScrollPlugin";

let swup: Swup | null = null;
document.addEventListener("DOMContentLoaded", () => {
    swup = new Swup();
    swup.use(
        new SwupCssPlugin(swup),
        new SwupHeadPlugin(swup),
        new SwupBodyClassPlugin(swup),
        new SwupScrollPlugin(swup),
        new SwupProgressPlugin(swup),
        new SwupPreloadPlugin(swup),
        new SwupA11yPlugin(swup)
    );
});

export function goToPage(url: string) {
    if (swup) {
        swup.goTo(url);
    }
}
