import type { Swup, SwupPageLoadEvent } from "../../Swup";
import type { SwupPlugin } from "../../plugin";
import { getDelegateTarget } from "../../utils/getDelegateTarget";
import { unpackLink } from "../../utils/urlUtils";

type Options = {
    doScrollingRightAway: boolean;
    behavior?: ScrollBehavior;
};

const defaultOptions: Options = {
    doScrollingRightAway: false,
    behavior: undefined,
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

    private scrollTo(top = 0) {
        window.scrollTo({ left: 0, top, behavior: this.options.behavior });
    }

    private scrollToHash(hash: string) {
        this.scrollTo(this.getScrollTop(hash));
    }

    private getScrollTop(hash: string) {
        const name = hash.slice(1);
        let element: Element | undefined | null = document.getElementById(name);
        if (!element) {
            element = Array.from(document.querySelectorAll("a[name]")).find((a) => a.getAttribute("name") === name);
        }

        if (element) {
            return element.getBoundingClientRect().top + window.pageYOffset;
        }

        console.warn(`Element ${hash} not found`);
        return 0;
    }

    private onSamePage = () => this.scrollTo();

    private onSamePageWithHash = (event: MouseEvent) => {
        if (!event) return;
        const delegateTarget = getDelegateTarget(event, this.swup.options.linkSelector);
        if (!delegateTarget) return;

        this.scrollToHash(unpackLink(delegateTarget).hash);
    };

    private onTransitionStart = (event: SwupPageLoadEvent) => {
        if (this.options.doScrollingRightAway && !event.hash) {
            this.doScrolling(event);
        }
    };

    private onContentReplaced = (event: SwupPageLoadEvent) => {
        if (!this.options.doScrollingRightAway || event.hash) {
            this.doScrolling(event);
        }
    };

    private doScrolling({ popstate, hash }: SwupPageLoadEvent) {
        if (!popstate) {
            if (hash) this.scrollToHash(hash);
            else this.scrollTo();
        }
    }
}
