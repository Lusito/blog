import type { Swup } from "..";
import type { PageData } from "./pageData";

export class Cache {
    pages: Record<string, PageData | undefined> = {};

    last?: PageData;

    swup: Swup;

    constructor(swup: Swup) {
        this.swup = swup;
    }

    add(page: PageData) {
        const last = this.pages[page.url];
        if (!last) {
            this.pages[page.url] = page;
        }
        this.last = last;
        this.swup.log(`Cache (${Object.keys(this.pages).length})`, this.pages);
    }

    get(url: string) {
        return this.pages[url];
    }

    exists(url: string) {
        return url in this.pages;
    }

    empty() {
        this.pages = {};
        delete this.last;
        this.swup.log("Cache cleared");
    }

    remove(url: string) {
        delete this.pages[url];
    }
}
