import type { Swup } from "../..";
import type { SwupPlugin } from "../../plugin";
import { Handler } from "../../helpers/EventManager";
import { getDelegateTarget } from "../../helpers/getDelegateTarget";
import { unpackLink } from "../../helpers/Link";

type Options = {
    doScrollingRightAway: boolean;
    behavior?: ScrollBehavior;
    offset: number | string | ((element: Element) => number);
};

const defaultOptions: Options = {
    doScrollingRightAway: false,
    behavior: undefined,
    offset: 0,
};

export class SwupScrollPlugin implements SwupPlugin {
    private swup: Swup;

    private options: Options;

    constructor(swup: Swup, options: Partial<Options> = {}) {
        this.swup = swup;
        this.options = { ...defaultOptions, ...options };
    }

    mount() {
        // scroll to the top of the page
        this.swup.events.samePage.on(this.onSamePage);

        // scroll to referenced element on the same page
        this.swup.events.samePageWithHash.on(this.onSamePageWithHash);

        // scroll to the referenced element
        this.swup.events.transitionStart.on(this.onTransitionStart);

        // scroll to the referenced element when it's in the page (after render)
        this.swup.events.contentReplaced.on(this.onContentReplaced);
    }

    unmount() {
        this.swup.events.samePage.off(this.onSamePage);
        this.swup.events.samePageWithHash.off(this.onSamePageWithHash);
        this.swup.events.transitionStart.off(this.onTransitionStart);
        this.swup.events.contentReplaced.off(this.onContentReplaced);

        window.history.scrollRestoration = "auto";
    }

    private scrollTo(offsetOrHash: number | string) {
        window.scrollTo({
            left: 0,
            top: typeof offsetOrHash === "number" ? offsetOrHash : this.getScrollTop(offsetOrHash),
            behavior: this.options.behavior,
        });
    }

    private getScrollTop(hash: string) {
        const name = hash.slice(1);
        let element: Element | undefined | null = document.getElementById(name);
        if (!element) {
            element = Array.from(document.querySelectorAll("a[name]")).find((a) => a.getAttribute("name") === name);
        }

        if (element) {
            return element.getBoundingClientRect().top + window.pageYOffset - this.getOffset(element);
        }

        console.warn(`Element ${hash} not found`);
        return 0;
    }

    private getOffset(element: Element) {
        switch (typeof this.options.offset) {
            case "number":
                return this.options.offset;
            case "function":
                return this.options.offset(element);
            default:
                return parseInt(this.options.offset, 10);
        }
    }

    private onSamePage = () => {
        this.scrollTo(0);
    };

    private onSamePageWithHash: Handler<MouseEvent> = (event) => {
        if (!event) return;
        const delegateTarget = getDelegateTarget(event, this.swup.options.linkSelector);
        if (!delegateTarget) return;

        this.scrollTo(unpackLink(delegateTarget).hash);
    };

    private onTransitionStart = (popstate?: PopStateEvent) => {
        if (this.options.doScrollingRightAway && !this.swup.scrollToElement) {
            this.doScrolling(popstate);
        }
    };

    private onContentReplaced = (popstate?: PopStateEvent) => {
        if (!this.options.doScrollingRightAway || this.swup.scrollToElement) {
            this.doScrolling(popstate);
        }
    };

    private doScrolling(popstate?: PopStateEvent) {
        if (!popstate) {
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            this.scrollTo(this.swup.scrollToElement || 0);
            this.swup.scrollToElement = null;
        }
    }
}
