import { ScatAnimationPlugin } from "../../ScatPlugin";
import type { Scatman, ScatPageLoadEvent } from "../../Scatman";

// fixme: let user define data-scatman-page somewhere instead of using a generated path?
export function classify(text: string) {
    const output = text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/\//g, "-") // Replace / with -
        .replace(/[^\w-]+/g, "") // Remove all non-word chars
        .replace(/--+/g, "-") // Replace multiple - with single -
        .replace(/^-+/, "") // Trim - from start of text
        .replace(/-+$/, "") // Trim - from end of text
        .replace(/^\//, ""); // Trim / from start of text
    return output || "homepage";
}

type Options = {
    animationSelector: string;
};

// default options
const defaultOptions: Options = {
    animationSelector: '[class*="transition-"]',
};

export class ScatCssPlugin implements ScatAnimationPlugin {
    readonly options: Options;

    private scatman: Scatman;

    constructor(scatman: Scatman, options: Partial<Options> = {}) {
        this.scatman = scatman;
        this.options = { ...defaultOptions, ...options };
    }

    mount(): void {
        document.documentElement.classList.add("scatman-enabled");
        this.scatman.events.willReplaceContent.on(this.onWillReplaceContent);
    }

    unmount(): void {
        document.documentElement.classList.remove("scatman-enabled");
        this.scatman.events.willReplaceContent.off(this.onWillReplaceContent);
        // fixme: remove other classes?
    }

    private getAnimationPromises() {
        const animatedElements = document.querySelectorAll(this.options.animationSelector);
        const promises = Array.from(animatedElements).map(
            (element) =>
                new Promise<void>((resolve) => {
                    const listener = (event: Event) => {
                        if (element === event.target) {
                            element.removeEventListener("transitionend", listener);
                            resolve();
                        }
                    };
                    element.addEventListener("transitionend", listener);
                })
        );
        return promises;
    }

    private onWillReplaceContent = ({ popstate }: ScatPageLoadEvent) => {
        document.documentElement.classList.remove("is-leaving");

        // only add for non-popstate transitions
        if (!popstate) {
            document.documentElement.classList.add("is-rendering");
        }
    };

    async animateOut({ popstate, url, customTransition }: ScatPageLoadEvent) {
        // handle classes
        document.documentElement.classList.add("is-changing");
        document.documentElement.classList.add("is-leaving");
        document.documentElement.classList.add("is-animating");
        if (popstate) {
            document.documentElement.classList.add("is-popstate");
        }

        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const transition = customTransition || url;
        document.documentElement.classList.add(`to-${classify(transition)}`);

        await Promise.all(this.getAnimationPromises());
    }

    async animateIn() {
        setTimeout(() => document.documentElement.classList.remove("is-animating"), 10);

        await Promise.all(this.getAnimationPromises());

        document.documentElement.classList.forEach((classItem) => {
            if (/^(to-|is-changing$|is-rendering$|is-popstate$)/.test(classItem)) {
                document.documentElement.classList.remove(classItem);
            }
        });
    }
}
