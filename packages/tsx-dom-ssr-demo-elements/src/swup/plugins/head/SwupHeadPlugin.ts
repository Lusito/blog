import type { Swup } from "../..";
import { getCurrentUrl } from "../../helpers/getCurrentUrl";
import { SwupPlugin } from "../../plugin";

type Options = {
    persistTags: boolean | string | ((element: Element) => boolean);
};
const defaultOptions: Options = {
    persistTags: false,
};

export class SwupHeadPlugin implements SwupPlugin {
    private swup: Swup;

    private options: Options;

    constructor(swup: Swup, options: Partial<Options> = {}) {
        this.swup = swup;
        this.options = { ...defaultOptions, ...options };
    }

    mount() {
        this.swup.events.contentReplaced.on(this.onContentReplaced);
    }

    unmount() {
        this.swup.events.contentReplaced.off(this.onContentReplaced);
    }

    private onContentReplaced = () => {
        const page = this.swup.cache.get(getCurrentUrl());
        if (!page) {
            console.warn("Page did not exist in cache: ", getCurrentUrl());
            return;
        }

        const nextDocument = page.document;
        this.getHeadAndReplace(nextDocument);
        this.updateHtmlLangAttribute(nextDocument);
    };

    private getHeadAndReplace(nextDocument: Document) {
        const oldTags = Array.from(document.head.children);
        const newTags = Array.from(nextDocument.head.children);

        const { head } = document;
        const addTags = newTags.filter((newTag) => !oldTags.some((oldTag) => oldTag.outerHTML === newTag.outerHTML));
        const removeTags = oldTags.filter(
            (oldTag) =>
                !this.isPersistentTag(oldTag) && !newTags.some((newTag) => oldTag.outerHTML === newTag.outerHTML)
        );

        removeTags.forEach((tag) => tag.remove());
        // fixme: insert at correct position
        addTags.forEach((tag) => head.appendChild(tag.cloneNode(true)));
    }

    private updateHtmlLangAttribute(nextDocument: Document) {
        const html = document.documentElement;
        const newLang = nextDocument.documentElement.lang;

        if (html.lang !== newLang) {
            html.lang = newLang;
        }
    }

    private isPersistentTag(item: Element) {
        if (item.hasAttribute("data-swup-persist")) {
            return true;
        }

        const { persistTags } = this.options;
        if (typeof persistTags === "function") {
            return persistTags(item);
        }
        if (typeof persistTags === "string") {
            return item.matches(persistTags);
        }
        return persistTags;
    }
}
