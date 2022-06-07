import type { Swup } from "../..";
import { getCurrentUrl } from "../../helpers/getCurrentUrl";
import { SwupPlugin } from "../../plugin";

type Options = {
    persistTags: boolean | string | ((element: Element) => boolean);
    persistAssets: boolean;
};
const defaultOptions: Options = {
    persistTags: false,
    persistAssets: false,
};

export default class HeadPlugin implements SwupPlugin {
    readonly name = "HeadPlugin";

    swup: Swup;

    options: Options;

    constructor(swup: Swup, options: Partial<Options> = {}) {
        this.swup = swup;
        this.options = { ...defaultOptions, ...options };

        // options.persistAssets is a shortcut to:
        // options.persistTags with a default asset selector for scripts & styles
        if (this.options.persistAssets && !this.options.persistTags) {
            this.options.persistTags = "link[rel=stylesheet], script[src], style";
        }
    }

    mount() {
        this.swup.events.contentReplaced.on(this.onContentReplaced);
    }

    unmount() {
        this.swup.events.contentReplaced.off(this.onContentReplaced);
    }

    onContentReplaced = () => {
        const page = this.swup.cache.get(getCurrentUrl());
        if (!page) {
            console.warn("Page did not exist in cache: ", getCurrentUrl());
            return;
        }

        const nextDocument = page.document;
        this.getHeadAndReplace(nextDocument);
        this.updateHtmlLangAttribute(nextDocument);
    };

    getHeadAndReplace(nextDocument: Document) {
        const oldTags = this.getHeadChildren(document);
        const newTags = this.getHeadChildren(nextDocument);

        const { head } = document;
        const themeActive = !!document.querySelector("[data-swup-theme]");
        const addTags = this.getTagsToAdd(oldTags, newTags, themeActive);
        const removeTags = this.getTagsToRemove(oldTags, newTags);

        removeTags.reverse().forEach((item) => {
            head.removeChild(item.tag);
        });

        addTags.forEach((item) => {
            head.insertBefore(item.tag.cloneNode(true), head.children[item.index]);
        });

        this.swup.log(`Removed ${removeTags.length} / added ${addTags.length} tags in head`);
    }

    updateHtmlLangAttribute(nextDocument: Document) {
        const html = document.documentElement;
        const newLang = nextDocument.documentElement.lang;

        if (html.lang !== newLang) {
            this.swup.log(`Updated lang attribute: ${html.lang} > ${newLang}`);
            html.lang = newLang;
        }
    }

    getHeadChildren(doc: Document) {
        return Array.from(doc.head.children);
    }

    compareTags(oldTag: Element, newTag: Element) {
        return oldTag.outerHTML === newTag.outerHTML;
    }

    getTagsToRemove(oldTags: Element[], newTags: Element[]) {
        const removeTags = [];

        for (const oldTag of oldTags) {
            let foundAt = -1;

            for (let j = 0; j < newTags.length; j++) {
                if (this.compareTags(oldTag, newTags[j])) {
                    foundAt = j;
                    break;
                }
            }

            if (foundAt < 0 && oldTag.getAttribute("data-swup-theme") === null && !this.isPersistentTag(oldTag)) {
                removeTags.push({ tag: oldTag });
            }
        }

        return removeTags;
    }

    getTagsToAdd = (oldTags: Element[], newTags: Element[], themeActive: boolean) => {
        const addTags = [];

        for (let i = 0; i < newTags.length; i++) {
            let foundAt = null;
            const tag = newTags[i];

            for (let j = 0; j < oldTags.length; j++) {
                if (this.compareTags(oldTags[j], tag)) {
                    foundAt = j;
                    break;
                }
            }

            if (foundAt == null) {
                addTags.push({ index: themeActive ? i + 1 : i, tag });
            }
        }

        return addTags;
    };

    isPersistentTag(item: Element) {
        if (item.getAttribute("data-swup-persist") === "true") {
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
