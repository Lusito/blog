import {
    Swup,
    SwupA11yPlugin,
    SwupBodyClassPlugin,
    SwupCssPlugin,
    SwupHeadPlugin,
    SwupPreloadPlugin,
    SwupProgressPlugin,
    SwupScrollPlugin,
} from "scatman";

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
