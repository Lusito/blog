// import "focus-options-polyfill"; // tell authors to install if needed

import { SwupPlugin } from "../../plugin";
import type { Swup } from "../..";

type Options = { contentSelector: string; headingSelector: string; announcementTemplate: string; urlTemplate: string };

const defaultOptions: Options = {
    contentSelector: "main",
    headingSelector: "h1, h2, [role=heading]",
    announcementTemplate: "Navigated to: {title}",
    urlTemplate: "New page at {url}",
};

export default class SwupA11yPlugin implements SwupPlugin {
    private swup: Swup;

    private options: Options;

    private liveNode?: HTMLElement;

    constructor(swup: Swup, options: Partial<Options> = {}) {
        this.swup = swup;
        this.options = { ...defaultOptions, ...options };
    }

    mount() {
        this.swup.events.contentReplaced.on(this.announceVisit);
    }

    unmount() {
        this.swup.events.contentReplaced.off(this.announceVisit);
        this.removeLiveNode();
    }

    private removeLiveNode() {
        if (this.liveNode) {
            this.liveNode.remove();
            delete this.liveNode;
        }
    }

    private announce(message: string) {
        this.removeLiveNode();

        const node = document.createElement("span");
        node.setAttribute("aria-live", "polite");
        node.setAttribute("role", "status");
        node.setAttribute(
            "style",
            "position: fixed; width: 1px; height: 1px; top: -10px; left: -10px; z-index: -1; overflow: hidden;"
        );

        document.body.appendChild(node);

        window.setTimeout(() => {
            node.textContent = message;
        }, 100);

        this.liveNode = node;
    }

    private announceVisit = () => {
        requestAnimationFrame(() => {
            this.announcePageName();
            this.focusPageContent();
        });
    };

    private announcePageName() {
        const { contentSelector, headingSelector, urlTemplate, announcementTemplate } = this.options;

        // Default: announce new /path/of/page.html
        let pageName = urlTemplate.replace("{url}", window.location.pathname);

        // Check for title tag
        if (document.title) {
            pageName = document.title;
        }

        // Look for first heading in content container
        const content = document.querySelector(contentSelector);
        if (content) {
            const headings = content.querySelectorAll(headingSelector);
            if (headings.length) {
                const heading = headings[0];
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                pageName = heading.getAttribute("aria-label") || heading.textContent || "";
            }
        }

        const announcement = announcementTemplate.replace("{title}", pageName.trim());
        this.announce(announcement);
    }

    private focusPageContent() {
        const content = document.querySelector(this.options.contentSelector);
        if (content) {
            content.setAttribute("tabindex", "-1");
            if (content instanceof HTMLElement || content instanceof SVGElement) {
                content.focus({ preventScroll: true });
            }
        }
    }
}
