import {
    Scatman,
    ScatA11yPlugin,
    ScatBodyClassPlugin,
    ScatCssPlugin,
    ScatHeadPlugin,
    ScatPreloadPlugin,
    ScatProgressPlugin,
    ScatScrollPlugin,
} from "scatman";

let scatman: Scatman | null = null;
document.addEventListener("DOMContentLoaded", () => {
    scatman = new Scatman();
    scatman.use(
        new ScatCssPlugin(scatman),
        new ScatHeadPlugin(scatman),
        new ScatBodyClassPlugin(scatman),
        new ScatScrollPlugin(scatman),
        new ScatProgressPlugin(scatman),
        new ScatPreloadPlugin(scatman),
        new ScatA11yPlugin(scatman)
    );
});

export function goToPage(url: string) {
    if (scatman) {
        scatman.goTo(url);
    }
}
