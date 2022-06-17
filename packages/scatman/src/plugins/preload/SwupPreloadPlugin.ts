import type { Swup } from "../../Swup";
import { LinkSource, unpackLink } from "../../utils/urlUtils";
import { SwupPlugin } from "../../plugin";
import { getDelegateTarget } from "../../utils/getDelegateTarget";
import { createEventManager, eventManagerMapOff } from "../../utils/EventManager";

export class SwupPreloadPlugin implements SwupPlugin {
    private swup: Swup;

    private readonly events = {
        hoverLink: createEventManager<MouseEvent>("hoverLink"),
    };

    constructor(swup: Swup) {
        this.swup = swup;
    }

    mount() {
        // register mouseover handler
        document.body.addEventListener("mouseover", this.onMouseover);

        // initial preload of page form links with [data-swup-preload]
        this.preloadPages();

        // do the same on every content replace
        this.swup.events.contentReplaced.on(this.onContentReplaced);
    }

    unmount() {
        eventManagerMapOff(this.events);

        document.body.removeEventListener("mouseover", this.onMouseover);

        this.swup.events.contentReplaced.off(this.onContentReplaced);
    }

    private onContentReplaced = () => {
        this.preloadPages();
    };

    private onMouseover = (event: MouseEvent) => {
        const { swup } = this;
        const delegateTarget = getDelegateTarget(event, swup.options.linkSelector);
        if (!delegateTarget) return;

        this.events.hoverLink.emit(event);

        this.preloadPage(delegateTarget);
    };

    private async preloadPage(linkSource: LinkSource) {
        await this.swup.preloadPage(unpackLink(linkSource).url);
    }

    private preloadPages() {
        document.querySelectorAll("[data-swup-preload]").forEach((element) => {
            const href = element.getAttribute("href");
            if (href) this.preloadPage(href);
        });
    }
}