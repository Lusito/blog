import type { Swup } from "../..";
import { getCurrentUrl } from "../../helpers/getCurrentUrl";
import { getDelegateTarget } from "../../helpers/getDelegateTarget";
import { unpackLink } from "../../helpers/Link";
import { SwupPlugin } from "../../plugin";

export default class SwupClickPlugin implements SwupPlugin {
    private swup: Swup;

    constructor(swup: Swup) {
        this.swup = swup;
    }

    mount() {
        document.addEventListener("click", this.linkClickHandler);
        window.addEventListener("popstate", this.popStateHandler);
    }

    unmount() {
        document.removeEventListener("click", this.linkClickHandler);
        window.removeEventListener("popstate", this.popStateHandler);
    }

    private linkClickHandler = (event: MouseEvent) => {
        if (event.button !== 0) return;

        const delegateTarget = getDelegateTarget(event, this.swup.options.linkSelector);
        if (!delegateTarget) return;

        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            // open in new tab (do nothing)
            this.swup.events.openPageInNewTab.emit(event);
            return;
        }

        this.swup.events.clickLink.emit(event);
        event.preventDefault();

        const { url, hash } = unpackLink(delegateTarget);
        if (url !== getCurrentUrl()) {
            if (hash) {
                this.swup.scrollToElement = hash;
            }

            // get custom transition from data
            const customTransition = delegateTarget.getAttribute("data-swup-transition");

            // load page
            this.swup.loadPage({ url, customTransition });
            return;
        }

        if (hash) {
            this.swup.events.samePageWithHash.emit(event);
        } else {
            this.swup.events.samePage.emit(event);
        }
    };

    private popStateHandler = (event: PopStateEvent) => {
        if (this.swup.options.skipPopStateHandling(event)) {
            console.log("this happens");
            return;
        }

        const { hash, url } = unpackLink(event.state ? event.state.url : window.location.pathname);
        if (hash) {
            this.swup.scrollToElement = hash;
        }
        this.swup.events.popState.emit(event);
        this.swup.loadPage({ url }, event);
    };
}
