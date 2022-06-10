import { classify } from "../../helpers/classify";
import { SwupAnimationPlugin } from "../../plugin";
import type { Swup } from "../..";

type Options = {
    animationSelector: string;
};

// default options
const defaultOptions: Options = {
    animationSelector: '[class*="transition-"]',
};

export class SwupCssPlugin implements SwupAnimationPlugin {
    readonly options: Options;

    private swup: Swup;

    constructor(swup: Swup, options: Partial<Options> = {}) {
        this.swup = swup;
        this.options = { ...defaultOptions, ...options };
    }

    mount(): void {
        document.documentElement.classList.add("swup-enabled");
        this.swup.events.willReplaceContent.on(this.onWillReplaceContent);
    }

    unmount(): void {
        document.documentElement.classList.remove("swup-enabled");
        this.swup.events.willReplaceContent.off(this.onWillReplaceContent);
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

    private onWillReplaceContent = (popstate?: PopStateEvent) => {
        document.documentElement.classList.remove("is-leaving");

        // only add for non-popstate transitions
        if (!popstate || this.swup.options.animateHistoryBrowsing) {
            document.documentElement.classList.add("is-rendering");
        }
    };

    async animateOut(data: { url: string; customTransition?: string | null }, popstate?: PopStateEvent) {
        // handle classes
        document.documentElement.classList.add("is-changing");
        document.documentElement.classList.add("is-leaving");
        document.documentElement.classList.add("is-animating");
        if (popstate) {
            document.documentElement.classList.add("is-popstate");
        }

        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const transition = data.customTransition || data.url;
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
