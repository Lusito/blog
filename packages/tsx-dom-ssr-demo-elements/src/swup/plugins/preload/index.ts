import type { Swup } from "../..";
import { LinkSource, unpackLink } from "../../helpers/Link";
import { SwupPlugin } from "../../plugin";
import { getDelegateTarget } from "../../helpers/getDelegateTarget";
import { EventManager } from "../../helpers/EventManager";

export default class PreloadPlugin implements SwupPlugin {
    readonly name = "PreloadPlugin";

    private swup: Swup;

    private readonly events = {
        hoverLink: new EventManager("hoverLink"),
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
        EventManager.off(this.events);

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
