import { getPageDataFromHtml, PageData } from "./helpers/pageData";
import { SwupPlugin } from "./plugin";
import { unpackLink } from "./helpers/Link";
import { classify } from "./helpers/classify";
import { getCurrentUrl } from "./helpers/getCurrentUrl";
import { getDelegateTarget } from "./helpers/getDelegateTarget";
import { EventManager } from "./helpers/EventManager";

type Options = {
    animateHistoryBrowsing: boolean;
    animationSelector: string;
    linkSelector: string;
    cache: boolean;
    containers: string;
    requestHeaders: Record<string, string>;
    skipPopStateHandling(event: PopStateEvent): boolean;
};

// default options
const defaultOptions: Options = {
    animateHistoryBrowsing: false,
    animationSelector: '[class*="transition-"]',
    linkSelector: `a[href^="${window.location.origin}"]:not([data-no-swup]), a[href^="/"]:not([data-no-swup]), a[href^="#"]:not([data-no-swup])`,
    cache: true,
    containers: ".swup-container",
    requestHeaders: {
        "X-Requested-With": "swup",
        Accept: "text/html, application/xhtml+xml",
    },
    skipPopStateHandling(event) {
        return event.state?.source !== "swup";
    },
};

export type Transition = {
    from: string;
    to: string;
    custom?: string | null;
};

type PreloadData = {
    promise: Promise<void>;
    url: string;
};

export class Swup {
    // variable for current transition object
    transition: Transition = {
        from: "",
        to: "",
    };

    readonly cache = new Map<string, PageData>();

    // variable for save options
    readonly options: Options;

    // variable for id of element to scroll to after render
    scrollToElement: string | null = null;

    // variable for promise used for preload, so no new loading of the same page starts while page is loading
    private readonly preloading = new Map<string, PreloadData>();

    // variable for plugins array
    private plugins: SwupPlugin[] = [];

    // handler arrays
    readonly events = {
        animationInDone: new EventManager("animationInDone"),
        animationInStart: new EventManager("animationInStart"),
        animationOutDone: new EventManager("animationOutDone"),
        animationOutStart: new EventManager("animationOutStart"),
        animationSkipped: new EventManager("animationSkipped"),
        clickLink: new EventManager<MouseEvent>("clickLink"),
        contentReplaced: new EventManager<PopStateEvent>("contentReplaced"),
        disabled: new EventManager("disabled"),
        enabled: new EventManager("enabled"),
        openPageInNewTab: new EventManager<MouseEvent>("openPageInNewTab"),
        pagePreloaded: new EventManager("pagePreloaded"),
        pageLoaded: new EventManager("pageLoaded"),
        pageRetrievedFromCache: new EventManager("pageRetrievedFromCache"),
        pageView: new EventManager<PopStateEvent>("pageView"),
        popState: new EventManager<PopStateEvent>("popState"),
        samePage: new EventManager<MouseEvent>("samePage"),
        samePageWithHash: new EventManager<MouseEvent>("samePageWithHash"),
        serverError: new EventManager("serverError"),
        transitionStart: new EventManager<PopStateEvent>("transitionStart"),
        transitionEnd: new EventManager<PopStateEvent>("transitionEnd"),
        willReplaceContent: new EventManager<PopStateEvent>("willReplaceContent"),
    };

    private isErrorPop = false;

    constructor(setOptions: Partial<Options> = {}) {
        // merge options
        this.options = {
            ...defaultOptions,
            ...setOptions,
        };

        // add event listeners
        document.addEventListener("click", this.linkClickHandler);
        window.addEventListener("popstate", this.popStateHandler);

        // initial save to cache
        const url = getCurrentUrl();
        const page = getPageDataFromHtml(url, document.documentElement.outerHTML, this.options.containers);
        if (!page) throw new Error("Failed getting page from document");
        if (this.options.cache) {
            this.cache.set(page.url, page);
        }

        // modify initial history record
        this.replaceHistory(window.location.href);

        // trigger enabled event
        this.events.enabled.emit();

        // add swup-enabled class to html tag
        document.documentElement.classList.add("swup-enabled");

        // trigger page view event
        this.events.pageView.emit();
    }

    use(...plugins: SwupPlugin[]) {
        this.plugins.concat(plugins);
        plugins.forEach((plugin) => plugin.mount());
    }

    getAnimationPromises(_type: "in" | "out") {
        const animatedElements = document.querySelectorAll(this.options.animationSelector);
        const promises = Array.from(animatedElements).map(
            (element) =>
                new Promise<void>((resolve) => {
                    element.addEventListener("transitionend", (event) => {
                        if (element === event.target) {
                            resolve();
                        }
                    });
                })
        );
        return promises;
    }

    async getPageData(url: string, response: Response) {
        // this method can be replaced in case other content than html is expected to be received from server
        const html = await response.text();
        return getPageDataFromHtml(url, html, this.options.containers);
    }

    renderPage(page: PageData, popstate?: PopStateEvent) {
        document.documentElement.classList.remove("is-leaving");

        // replace state in case the url was redirected
        const { path } = unpackLink(page.url);
        if (window.location.pathname !== path) {
            this.pushHistory(path);

            // save new record for redirected url
            this.cache.set(path, page.cloneWithUrl(path));
        } else {
            this.pushHistory(page.url + (this.scrollToElement ?? ""));
        }

        // only add for non-popstate transitions
        if (!popstate || this.options.animateHistoryBrowsing) {
            document.documentElement.classList.add("is-rendering");
        }

        this.events.willReplaceContent.emit(popstate);

        // replace blocks
        this.replaceContainers(page);

        // set title
        document.title = page.title;

        this.events.contentReplaced.emit(popstate);
        this.events.pageView.emit(popstate);

        // start animation IN
        setTimeout(() => {
            if (!popstate || this.options.animateHistoryBrowsing) {
                this.events.animationInStart.emit();
                document.documentElement.classList.remove("is-animating");
            }
        }, 10);

        // handle end of animation
        if (!popstate || this.options.animateHistoryBrowsing) {
            this.stopAnimation(popstate);
        } else {
            this.events.transitionEnd.emit(popstate);
        }

        // reset scroll-to element
        this.scrollToElement = null;
    }

    private replaceContainers(page: PageData) {
        const targets = document.body.querySelectorAll(this.options.containers);
        if (targets.length !== page.blocks.length) {
            throw new Error("Received page is invalid.");
        }
        for (let i = 0; i < targets.length; i++) {
            targets[i].outerHTML = page.blocks[i];
        }
    }

    private async doPreloadPage(url: string) {
        const response = await fetch(url, { headers: this.options.requestHeaders });

        if (response.status === 500) {
            this.events.serverError.emit();
            throw new Error("Server Error");
        }

        // get page data
        const page = await this.getPageData(url, response);

        // render page
        this.cache.set(url, page);
        this.events.pagePreloaded.emit();
    }

    preloadPage(url: string) {
        if (this.cache.has(url) || this.preloading.has(url)) {
            return Promise.resolve();
        }

        const promise = this.doPreloadPage(url);
        const entry = {
            promise: promise.then(() => {
                this.preloading.delete(url);
            }),
            url,
        };
        this.preloading.set(url, entry);
        return entry.promise;
    }

    async fetchPage(url: string) {
        await this.preloadPage(url);
        this.events.pageLoaded.emit();
    }

    private pushHistory(url: string) {
        window.history.pushState({ url, source: "swup" }, "", url);
    }

    private replaceHistory(url: string) {
        window.history.replaceState({ url, source: "swup" }, "", url);
    }

    async startAnimation(data: { url: string; customTransition?: string | null }, popstate?: PopStateEvent) {
        this.events.animationOutStart.emit();

        // handle classes
        document.documentElement.classList.add("is-changing");
        document.documentElement.classList.add("is-leaving");
        document.documentElement.classList.add("is-animating");
        if (popstate) {
            document.documentElement.classList.add("is-popstate");
        }

        if (data.customTransition) {
            document.documentElement.classList.add(`to-${classify(data.customTransition)}`);
        } else {
            document.documentElement.classList.add(`to-${classify(data.url)}`);
        }

        // animation promise stuff
        await Promise.all(this.getAnimationPromises("out"));
        this.events.animationOutDone.emit();
    }

    async stopAnimation(popstate?: PopStateEvent) {
        const animationPromises = this.getAnimationPromises("in");
        await Promise.all(animationPromises);

        this.events.animationInDone.emit();
        this.events.transitionEnd.emit(popstate); // fixme: should be elsewhere
        // remove some classes
        document.documentElement.classList.forEach((classItem) => {
            if (/^(to-|is-changing$|is-rendering$|is-popstate$)/.test(classItem)) {
                document.documentElement.classList.remove(classItem);
            }
        });
    }

    async loadPage(data: { url: string; customTransition?: string | null }, popstate?: PopStateEvent) {
        // fixme: ensure data.url starts with "/""?
        this.events.transitionStart.emit(popstate);

        // set transition object
        this.transition = { from: window.location.pathname, to: data.url, custom: data.customTransition };

        const promises: Array<Promise<void>> = [];
        // start/skip loading of page
        if (this.cache.has(data.url)) {
            this.events.pageRetrievedFromCache.emit();
        } else {
            const preloading = this.preloading.get(data.url);
            promises.push(preloading ? preloading.promise : this.fetchPage(data.url));
        }

        // start/skip animation
        if (!popstate || this.options.animateHistoryBrowsing) {
            promises.push(this.startAnimation(data, popstate));
        } else {
            this.events.animationSkipped.emit();
        }

        try {
            // when everything is ready, handle the outcome
            await Promise.all(promises);

            const page = this.cache.get(data.url);
            if (!page) {
                throw new Error(`Page did not exist in cache: ${data.url}`);
            }
            // render page
            this.renderPage(page, popstate);
        } catch (error) {
            console.error("Error loading page: ", error);

            // go back to the last page we're still at
            this.isErrorPop = true; // fixme: maybe not needed if we would replace when actually done
            window.history.back();
        } finally {
            // clear cache if it's disabled (because pages could be preloaded and stuff)
            if (!this.options.cache) {
                this.cache.clear();
            }
        }
    }

    destroy() {
        // remove delegated listeners
        document.removeEventListener("click", this.linkClickHandler);

        // remove popstate listener
        window.removeEventListener("popstate", this.popStateHandler);

        // clear cache
        this.cache.clear();

        // unmount plugins
        this.plugins.forEach((plugin) => plugin.unmount());
        this.plugins.length = 0;

        // remove event handlers
        EventManager.off(this.events);

        // trigger disable event
        this.events.disabled.emit();

        // remove swup-enabled class from html tag
        document.documentElement.classList.remove("swup-enabled");
    }

    linkClickHandler = (event: MouseEvent) => {
        // index of pressed button needs to be checked because Firefox triggers click on all mouse buttons
        if (event.button !== 0) return;

        const delegateTarget = getDelegateTarget(event, this.options.linkSelector);
        if (!delegateTarget) return;

        // control key pressed
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            // open in new tab (do nothing)
            this.events.openPageInNewTab.emit(event);
            return;
        }

        this.events.clickLink.emit(event);
        event.preventDefault();

        const { url, hash } = unpackLink(delegateTarget);
        // link to different url
        if (url !== getCurrentUrl()) {
            if (hash) {
                this.scrollToElement = hash;
            }

            // get custom transition from data
            const customTransition = delegateTarget.getAttribute("data-swup-transition");

            // load page
            this.loadPage({ url, customTransition });
            return;
        }

        if (hash) {
            // link to the same URL with hash
            this.events.samePageWithHash.emit(event);
            const element = document.getElementById(hash.slice(1));
            if (element) {
                this.replaceHistory(url + hash);
            } else {
                // referenced element not found
                console.warn(`Element for offset not found (${hash})`);
            }
        } else {
            // link to the same URL without hash
            this.events.samePage.emit(event);
        }
    };

    popStateHandler = (event: PopStateEvent) => {
        if (this.isErrorPop) {
            window.location.reload();
            return;
        }

        if (this.options.skipPopStateHandling(event)) return;

        const { hash, url } = unpackLink(event.state ? event.state.url : window.location.pathname);
        if (hash) {
            this.scrollToElement = hash;
        } else {
            event.preventDefault();
        }
        this.events.popState.emit(event);
        this.loadPage({ url }, event);
    };
}
