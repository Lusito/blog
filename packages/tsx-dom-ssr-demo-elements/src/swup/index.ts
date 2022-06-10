import { getPageDataFromHtml, PageData } from "./helpers/pageData";
import { SwupAnimationPlugin, SwupPlugin } from "./plugin";
import { unpackLink } from "./helpers/Link";
import { getCurrentUrl } from "./helpers/getCurrentUrl";
import { EventManager } from "./helpers/EventManager";
import { SwupCssPlugin } from "./plugins/css/SwupCssPlugin";
import SwupClickPlugin from "./plugins/click/SwupClickPlugin";

type Options = {
    animateHistoryBrowsing: boolean;
    linkSelector: string;
    cache: boolean;
    containers: string;
    requestHeaders: Record<string, string>;
    skipPopStateHandling(event: PopStateEvent): boolean;
};

// default options
const defaultOptions: Options = {
    animateHistoryBrowsing: false,
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
    promise: Promise<PageData>;
    url: string;
};

type Cache = {
    get(url: string): PageData | undefined;
    set(url: string, page: PageData): void;
    clear(): void;
};
const noop = () => undefined;
const noopCache = {
    get: noop,
    set: noop,
    clear: noop,
};

export class Swup {
    transition: Transition = {
        from: "",
        to: "",
    };

    readonly cache: Cache;

    readonly options: Options;

    // variable for id of element to scroll to after render
    // fixme: is there a better way?
    scrollToElement: string | null = null;

    private readonly preloading = new Map<string, PreloadData>();

    private plugins: SwupPlugin[] = [];

    private animationPlugin: SwupAnimationPlugin;

    // fixme: one event handler with different string event names?
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

    constructor(options: Partial<Options> = {}) {
        this.options = { ...defaultOptions, ...options };

        this.cache = this.options.cache ? new Map() : noopCache;

        // fixme: make configurable:
        this.animationPlugin = new SwupCssPlugin(this);
        this.use(this.animationPlugin);
        this.use(new SwupClickPlugin(this));

        // initial save to cache
        const url = getCurrentUrl();
        const page = getPageDataFromHtml(url, document.documentElement.outerHTML, this.options.containers);
        if (!page) throw new Error("Failed getting page from document");
        this.cache.set(page.url, page);

        // modify initial history record
        this.replaceHistory(window.location.href);

        // trigger enabled event
        this.events.enabled.emit();

        // trigger page view event
        this.events.pageView.emit();
    }

    use(...plugins: SwupPlugin[]) {
        this.plugins.concat(plugins);
        plugins.forEach((plugin) => plugin.mount());
    }

    async getPageData(url: string, response: Response) {
        // this method can be replaced in case other content than html is expected to be received from server
        const html = await response.text();
        return getPageDataFromHtml(url, html, this.options.containers);
    }

    async renderPage(page: PageData, popstate?: PopStateEvent) {
        // replace state in case the url was redirected
        const { path } = unpackLink(page.url);
        if (window.location.pathname !== path) {
            if (!popstate) {
                this.pushHistory(path);
            }

            // save new record for redirected url
            this.cache.set(path, page.cloneWithUrl(path));
        } else if (!popstate) {
            this.pushHistory(page.url + (this.scrollToElement ?? ""));
        }

        this.events.willReplaceContent.emit(popstate);

        // replace blocks
        this.replaceContainers(page);

        // set title
        document.title = page.title;

        this.events.contentReplaced.emit(popstate);
        this.events.pageView.emit(popstate);

        if (!popstate || this.options.animateHistoryBrowsing) {
            this.events.animationInStart.emit();
            await this.animationPlugin.animateIn(popstate);
            this.events.animationInDone.emit();
        }
        this.events.transitionEnd.emit(popstate);

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

        this.cache.set(url, page);
        this.events.pagePreloaded.emit();

        return page;
    }

    preloadPage(url: string) {
        const cachedPage = this.cache.get(url);
        if (cachedPage) return cachedPage;
        const preloading = this.preloading.get(url);
        if (preloading) return preloading.promise;

        const promise = this.doPreloadPage(url);
        const entry = {
            promise: promise.then((page) => {
                this.preloading.delete(url);
                return page;
            }),
            url,
        };
        this.preloading.set(url, entry);
        return entry.promise;
    }

    async fetchPage(url: string) {
        const page = await this.preloadPage(url);
        this.events.pageLoaded.emit();
        return page;
    }

    private pushHistory(url: string) {
        window.history.pushState({ url, source: "swup" }, "", url);
    }

    private replaceHistory(url: string) {
        window.history.replaceState({ url, source: "swup" }, "", url);
    }

    async loadPage(data: { url: string; customTransition?: string | null }, popstate?: PopStateEvent) {
        // fixme: ensure data.url starts with "/""?
        this.events.transitionStart.emit(popstate);

        // set transition object
        this.transition = { from: window.location.pathname, to: data.url, custom: data.customTransition };

        let animateOutPromise: Promise<void>;
        if (popstate && !this.options.animateHistoryBrowsing) {
            this.events.animationSkipped.emit();
            animateOutPromise = Promise.resolve();
        } else {
            this.events.animationOutStart.emit();
            animateOutPromise = this.animationPlugin.animateOut(data, popstate);
            this.events.animationOutDone.emit();
        }
        let page = this.cache.get(data.url);
        // start/skip loading of page
        if (page) {
            this.events.pageRetrievedFromCache.emit();
        } else {
            const preloading = this.preloading.get(data.url);
            if (preloading) {
                page = await preloading.promise;
            } else {
                page = await this.fetchPage(data.url);
            }
        }

        try {
            await animateOutPromise;

            // render page
            await this.renderPage(page, popstate);
        } catch (error) {
            console.error("Error loading page: ", error);

            // An error happened, try to make it load manually
            window.location.href = data.url;
        }
    }

    destroy() {
        // clear cache
        this.cache.clear();

        // unmount plugins
        this.plugins.forEach((plugin) => plugin.unmount());
        this.plugins.length = 0;

        // remove event handlers
        EventManager.off(this.events);

        // trigger disable event
        this.events.disabled.emit();
    }
}
