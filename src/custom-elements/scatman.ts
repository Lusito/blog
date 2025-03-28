import {
    Scatman,
    ScatA11yPlugin,
    ScatBodyClassPlugin,
    ScatHeadPlugin,
    ScatPreloadPlugin,
    ScatProgressPlugin,
    ScatScrollPlugin,
    ScatPreserveScrollPlugin,
} from "scatman";

export const scatman = new Scatman();

document.addEventListener("DOMContentLoaded", () => {
    scatman.init();
    scatman.use(
        new ScatHeadPlugin(scatman),
        new ScatBodyClassPlugin(scatman),
        new ScatScrollPlugin(scatman),
        new ScatPreserveScrollPlugin(scatman),
        new ScatProgressPlugin(scatman),
        new ScatPreloadPlugin(scatman),
        new ScatA11yPlugin(scatman),
    );
});
