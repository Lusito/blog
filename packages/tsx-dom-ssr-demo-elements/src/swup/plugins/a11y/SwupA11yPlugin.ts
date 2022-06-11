// import "focus-options-polyfill"; // tell authors to install if needed

import { SwupPlugin } from "../../plugin";
import type { Swup } from "../..";

type Options = {
    headingSelector: string;
    mode: "focusHeading" | "announceHeading";
    announcementTemplate: string;
    urlTemplate: string;
};

const defaultOptions: Options = {
    headingSelector: "main h1, h2, [role=heading]",
    mode: "focusHeading",
    announcementTemplate: "Navigated to: {title}",
    urlTemplate: "New page at {url}",
};

export class SwupA11yPlugin implements SwupPlugin {
    private swup: Swup;

    private options: Options;

    private liveNode?: HTMLElement;

    constructor(swup: Swup, options: Partial<Options> = {}) {
        this.swup = swup;
        this.options = { ...defaultOptions, ...options };
    }

    mount() {
        this.swup.events.transitionEnd.on(this.announceVisit);
    }

    unmount() {
        this.swup.events.transitionEnd.off(this.announceVisit);
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
        });
    };

    private announcePageName() {
        const { headingSelector, mode, urlTemplate, announcementTemplate } = this.options;

        // Look for first heading matching selector
        const heading = document.querySelector(headingSelector);
        if (mode === "focusHeading") {
            if (heading instanceof HTMLElement) {
                heading.setAttribute("tabindex", "-1");
                heading.focus();
                return;
            }
        }

        // Default: title or announce new /path/of/page.html
        let pageName = document.title || urlTemplate.replace("{url}", window.location.pathname);

        if (heading) {
            const ariaLabel = heading.getAttribute("aria-label");
            if (ariaLabel) pageName = ariaLabel;
            else if (heading.textContent) pageName = heading.textContent;
        }

        this.loseFocus();
        const announcement = announcementTemplate.replace("{title}", pageName.trim());
        this.announce(announcement);
    }

    private loseFocus() {
        if (document.activeElement instanceof HTMLElement || document.activeElement instanceof SVGElement) {
            document.activeElement.blur();
        }
    }
}
