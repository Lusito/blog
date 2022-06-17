import type { Swup } from "../../Swup";
import { getDelegateTarget } from "../../utils/getDelegateTarget";
import { unpackLink, getCurrentUrl } from "../../utils/urlUtils";
import { SwupPlugin } from "../../plugin";

export class SwupClickPlugin implements SwupPlugin {
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
        const fromUrl = getCurrentUrl();
        if (url !== fromUrl) {
            // get custom transition from data
            const customTransition = delegateTarget.getAttribute("data-swup-transition");

            // load page
            // eslint-disable-next-line dot-notation
            this.swup["loadPage"]({ fromUrl, url, hash, customTransition });
            return;
        }

        if (hash) {
            // eslint-disable-next-line dot-notation
            this.swup["pushHistory"](url + hash);
            this.swup.events.samePageWithHash.emit(event);
        } else {
            this.swup.events.samePage.emit(event);
        }
    };

    private popStateHandler = (event: PopStateEvent) => {
        if (this.swup.options.skipPopStateHandling(event)) {
            return;
        }

        const { hash, url } = unpackLink(event.state ? event.state.url : getCurrentUrl());

        // eslint-disable-next-line dot-notation
        this.swup["loadPage"]({ fromUrl: "", url, hash, popstate: event });
    };
}
