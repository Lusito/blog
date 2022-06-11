import { getPageDataFromHtml, PageData } from "./helpers/pageData";
import { SwupAnimationPlugin, SwupPlugin } from "./plugin";
import { unpackLink } from "./helpers/Link";
import { getCurrentUrl } from "./helpers/getCurrentUrl";
import { createEventManager, eventManagerMapOff } from "./helpers/EventManager";
import { SwupClickPlugin } from "./plugins/click/SwupClickPlugin";

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

export type SwupPageLoadEvent = {
    fromUrl: string;
    url: string;
    hash: string;
    customTransition?: string | null;
    popstate?: PopStateEvent;
};

export class Swup {
    readonly cache: Cache;

    readonly options: Options;

    private readonly preloading = new Map<string, PreloadData>();

    private plugins: SwupPlugin[] = [];

    private animationPlugin?: SwupAnimationPlugin;

    // fixme: one event handler with different string event names?
    readonly events = {
        animationInDone: createEventManager("animationInDone"),
        animationInStart: createEventManager("animationInStart"),
        animationOutDone: createEventManager("animationOutDone"),
        animationOutStart: createEventManager("animationOutStart"),
        animationSkipped: createEventManager("animationSkipped"),
        clickLink: createEventManager<MouseEvent>("clickLink"),
        contentReplaced: createEventManager<SwupPageLoadEvent>("contentReplaced"),
        disabled: createEventManager("disabled"),
        enabled: createEventManager("enabled"),
        openPageInNewTab: createEventManager<MouseEvent>("openPageInNewTab"),
        pagePreloaded: createEventManager("pagePreloaded"),
        pageLoaded: createEventManager("pageLoaded"),
        pageRetrievedFromCache: createEventManager("pageRetrievedFromCache"),
        pageView: createEventManager<SwupPageLoadEvent | undefined>("pageView"),
        samePage: createEventManager<MouseEvent>("samePage"),
        samePageWithHash: createEventManager<MouseEvent>("samePageWithHash"),
        serverError: createEventManager("serverError"),
        transitionStart: createEventManager<SwupPageLoadEvent>("transitionStart"),
        transitionEnd: createEventManager<SwupPageLoadEvent>("transitionEnd"),
        willReplaceContent: createEventManager<SwupPageLoadEvent>("willReplaceContent"),
    };

    constructor(options: Partial<Options> = {}) {
        this.options = { ...defaultOptions, ...options };

        this.cache = this.options.cache ? new Map() : noopCache;

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
        this.events.pageView.emit(undefined);
    }

    use(...plugins: SwupPlugin[]) {
        this.plugins.concat(plugins);
        for (const plugin of plugins) {
            if ("animateOut" in plugin && "animateIn" in plugin) {
                this.animationPlugin = plugin as SwupAnimationPlugin;
            }
            plugin.mount();
        }
    }

    async getPageData(url: string, response: Response) {
        // this method can be replaced in case other content than html is expected to be received from server
        const html = await response.text();
        return getPageDataFromHtml(url, html, this.options.containers);
    }

    async renderPage(page: PageData, event: SwupPageLoadEvent) {
        const { popstate } = event;
        // replace state in case the url was redirected
        const { path } = unpackLink(page.url);
        if (window.location.pathname !== path) {
            if (!popstate) {
                this.pushHistory(path);
            }

            // save new record for redirected url
            this.cache.set(path, page.cloneWithUrl(path));
        } else if (!popstate) {
            this.pushHistory(page.url + event.hash);
        }

        this.events.willReplaceContent.emit(event);

        // replace blocks
        this.replaceContainers(page);

        // set title
        document.title = page.title;

        this.events.contentReplaced.emit(event);
        this.events.pageView.emit(event);

        if (this.animationPlugin && (!popstate || this.options.animateHistoryBrowsing)) {
            this.events.animationInStart.emit();
            await this.animationPlugin.animateIn(event);
            this.events.animationInDone.emit();
        }
        this.events.transitionEnd.emit(event);
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

    goTo(href: string, customTransition?: string) {
        const { hash, url } = unpackLink(href);
        this.loadPage({ fromUrl: getCurrentUrl(), url, hash, customTransition });
    }

    async loadPage(event: SwupPageLoadEvent) {
        this.events.transitionStart.emit(event);

        let animateOutPromise = Promise.resolve();
        if (this.animationPlugin) {
            if (event.popstate && !this.options.animateHistoryBrowsing) {
                this.events.animationSkipped.emit();
            } else {
                this.events.animationOutStart.emit();
                animateOutPromise = this.animationPlugin.animateOut(event);
                this.events.animationOutDone.emit();
            }
        }

        let page = this.cache.get(event.url);
        // start/skip loading of page
        if (page) {
            this.events.pageRetrievedFromCache.emit();
        } else {
            const preloading = this.preloading.get(event.url);
            if (preloading) {
                page = await preloading.promise;
            } else {
                page = await this.fetchPage(event.url);
            }
        }

        try {
            await animateOutPromise;

            // render page
            await this.renderPage(page, event);
        } catch (error) {
            console.error("Error loading page: ", error);

            // An error happened, try to make it load manually
            window.location.href = event.url;
        }
    }

    destroy() {
        // clear cache
        this.cache.clear();

        // unmount plugins
        this.plugins.forEach((plugin) => plugin.unmount());
        this.plugins.length = 0;

        // remove event handlers
        eventManagerMapOff(this.events);

        // trigger disable event
        this.events.disabled.emit();
    }
}
