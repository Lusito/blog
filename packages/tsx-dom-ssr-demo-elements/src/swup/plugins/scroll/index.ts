import type { Swup } from "../..";
import type { SwupPlugin } from "../../plugin";
import { Handler } from "../../helpers/EventManager";
import { getDelegateTarget } from "../../helpers/getDelegateTarget";
import { Link } from "../../helpers/Link";

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

export default class ScrollPlugin implements SwupPlugin {
    readonly name = "ScrollPlugin";

    swup: Swup;

    options: Options;

    constructor(swup: Swup, options: Partial<Options> = {}) {
        this.swup = swup;
        this.options = {
            ...defaultOptions,
            ...options,
        };
    }

    mount() {
        // disable browser scroll control on popstates when
        // animateHistoryBrowsing option is enabled in swup
        if (this.swup.options.animateHistoryBrowsing) {
            window.history.scrollRestoration = "manual";
        }

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

    scrollTo(offset: number) {
        window.scrollTo({
            left: 0,
            top: offset,
            behavior: this.options.behavior,
        });
    }

    getOffset(element: Element) {
        switch (typeof this.options.offset) {
            case "number":
                return this.options.offset;
            case "function":
                return this.options.offset(element);
            default:
                return parseInt(this.options.offset, 10);
        }
    }

    onSamePage = () => {
        this.scrollTo(0);
    };

    onSamePageWithHash: Handler<MouseEvent> = (event) => {
        if (!event) return;
        const delegateTarget = getDelegateTarget(event, this.swup.options.linkSelector);
        if (!delegateTarget) return;

        const element = document.querySelector(new Link(delegateTarget).getHash());
        if (element) {
            const top = element.getBoundingClientRect().top + window.pageYOffset - this.getOffset(element);
            this.scrollTo(top);
        }
    };

    onTransitionStart = (popstate?: PopStateEvent) => {
        if (this.options.doScrollingRightAway && !this.swup.scrollToElement) {
            this.doScrolling(popstate);
        }
    };

    onContentReplaced = (popstate?: PopStateEvent) => {
        if (!this.options.doScrollingRightAway || this.swup.scrollToElement) {
            this.doScrolling(popstate);
        }
    };

    doScrolling(popstate?: PopStateEvent) {
        const { swup } = this;

        if (!popstate || swup.options.animateHistoryBrowsing) {
            if (swup.scrollToElement) {
                const element = document.getElementById(swup.scrollToElement.slice(1));
                if (element) {
                    const top = element.getBoundingClientRect().top + window.pageYOffset - this.getOffset(element);
                    this.scrollTo(top);
                } else {
                    console.warn(`Element ${swup.scrollToElement} not found`);
                }
                swup.scrollToElement = null;
            } else {
                this.scrollTo(0);
            }
        }
    }
}
