import { Cache } from "./helpers/Cache";
import { getPageDataFromHtml, PageData } from "./helpers/pageData";
import { SwupPlugin } from "./plugin";
import { unpackLink } from "./helpers/Link";
import { classify } from "./helpers/classify";
import { getCurrentUrl } from "./helpers/getCurrentUrl";
import { getDelegateTarget } from "./helpers/getDelegateTarget";
import { EventManager } from "./helpers/EventManager";
import { markSwupElements, unmarkSwupElements, replaceSwupElements } from "./helpers/dataSwup";

type Options = {
    animateHistoryBrowsing: boolean;
    animationSelector: string;
    linkSelector: string;
    cache: boolean;
    containers: string[];
    requestHeaders: Record<string, string>;
    skipPopStateHandling(event: PopStateEvent): boolean;
    log?: (...args: unknown[]) => void;
};

// default options
const defaultOptions: Options = {
    animateHistoryBrowsing: false,
    animationSelector: '[class*="transition-"]',
    linkSelector: `a[href^="${window.location.origin}"]:not([data-no-swup]), a[href^="/"]:not([data-no-swup]), a[href^="#"]:not([data-no-swup])`,
    cache: true,
    containers: ["#swup"],
    requestHeaders: {
        "X-Requested-With": "swup",
        Accept: "text/html, application/xhtml+xml",
    },
    skipPopStateHandling(event) {
        return !(event.state && event.state.source === "swup");
    },
};

export type Transition = {
    from: string;
    to: string;
    custom?: unknown;
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

    cache: Cache;

    // variable for save options
    options: Options;

    // variable for id of element to scroll to after render
    scrollToElement: string | null = null;

    // variable for promise used for preload, so no new loading of the same page starts while page is loading
    preloading: Record<string, PreloadData> = {};

    // variable for plugins array
    plugins: SwupPlugin[] = [];

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

        if (setOptions.log) {
            this.log = setOptions.log;
        }

        // make modules accessible in instance
        this.cache = new Cache(this);

        // enable swup
        this.enable();
    }

    log(..._args: unknown[]) {
        // do nothing
    }

    use(plugin: SwupPlugin) {
        this.plugins.push(plugin);
        plugin.mount();

        return this.plugins;
    }

    unuse(plugin: string | SwupPlugin) {
        let pluginReference: SwupPlugin | undefined;

        if (typeof plugin === "string") {
            pluginReference = this.plugins.find((p) => plugin === p.name);
        } else {
            pluginReference = plugin;
        }

        if (!pluginReference) {
            console.warn("No such plugin.");
            return;
        }

        pluginReference.unmount();

        const index = this.plugins.indexOf(pluginReference);
        this.plugins.splice(index, 1);

        return this.plugins;
    }

    findPlugin(pluginName: string) {
        return this.plugins.find((p) => pluginName === p.name);
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

    updateTransition(this: Swup, from: string, to: string, custom?: unknown) {
        // transition routes
        this.transition = { from, to, custom };
    }

    renderPage(page: PageData, popstate?: PopStateEvent) {
        document.documentElement.classList.remove("is-leaving");

        // replace state in case the url was redirected
        const { path } = unpackLink(page.url);
        if (window.location.pathname !== path) {
            window.history.replaceState(
                {
                    url: path,
                    random: Math.random(),
                    source: "swup",
                },
                document.title,
                path
            );

            // save new record for redirected url
            this.cache.add(page.cloneWithUrl(path));
        }

        // only add for non-popstate transitions
        if (!popstate || this.options.animateHistoryBrowsing) {
            document.documentElement.classList.add("is-rendering");
        }

        this.events.willReplaceContent.emit(popstate);

        // replace blocks
        replaceSwupElements(document, page);

        // set title
        document.title = page.title;

        this.events.contentReplaced.emit(popstate);
        this.events.pageView.emit(popstate);

        // empty cache if it's disabled (because pages could be preloaded and stuff)
        if (!this.options.cache) {
            this.cache.empty();
        }

        // start animation IN
        setTimeout(() => {
            if (!popstate || this.options.animateHistoryBrowsing) {
                this.events.animationInStart.emit();
                document.documentElement.classList.remove("is-animating");
            }
        }, 10);

        // handle end of animation
        if (!popstate || this.options.animateHistoryBrowsing) {
            const animationPromises = this.getAnimationPromises("in");
            Promise.all(animationPromises).then(() => {
                this.events.animationInDone.emit();
                this.events.transitionEnd.emit(popstate);
                // remove "to-{page}" classes
                document.documentElement.className.split(" ").forEach((classItem) => {
                    if (
                        new RegExp("^to-").test(classItem) ||
                        classItem === "is-changing" ||
                        classItem === "is-rendering" ||
                        classItem === "is-popstate"
                    ) {
                        document.documentElement.classList.remove(classItem);
                    }
                });
            });
        } else {
            this.events.transitionEnd.emit(popstate);
        }

        // reset scroll-to element
        this.scrollToElement = null;
    }

    // fixme: every call to this could be added to preloadData!
    private async doPreloadPage(url: string) {
        const response = await fetch(url, { headers: this.options.requestHeaders });

        if (response.status === 500) {
            this.events.serverError.emit();
            throw new Error("Server Error");
        }

        // get page data
        const page = await this.getPageData(url, response);

        // render page
        this.cache.add(page);
        this.events.pagePreloaded.emit();
    }

    preloadPage(url: string) {
        if (this.cache.exists(url) || this.preloading[url]) {
            return Promise.resolve();
        }

        const promise = this.doPreloadPage(url);
        const entry = {
            promise: promise.then(() => {
                delete this.preloading[url];
            }),
            url,
        };
        this.preloading[url] = entry;
        return entry.promise;
    }

    async fetchPage(url: string) {
        await this.preloadPage(url);
        this.events.pageLoaded.emit();
    }

    async startAnimation(url: string, popstate?: PopStateEvent) {
        this.events.animationOutStart.emit();

        // handle classes
        document.documentElement.classList.add("is-changing");
        document.documentElement.classList.add("is-leaving");
        document.documentElement.classList.add("is-animating");
        if (popstate) {
            document.documentElement.classList.add("is-popstate");
        }
        document.documentElement.classList.add(`to-${classify(url)}`);

        // fixme: unclear if this should be done here or after completion
        // create history record if this is not a popstate call
        if (!popstate) {
            // create pop element with or without anchor
            window.history.pushState(
                {
                    url: url + (this.scrollToElement ?? "") || window.location.href.split(window.location.hostname)[1],
                    random: Math.random(),
                    source: "swup",
                },
                document.title,
                url || window.location.href.split(window.location.hostname)[1]
            );
        }

        // animation promise stuff
        await Promise.all(this.getAnimationPromises("out"));
        this.events.animationOutDone.emit();
    }

    async loadPage(data: { url: string; customTransition?: string | null }, popstate?: PopStateEvent) {
        this.events.transitionStart.emit(popstate);

        // set transition object
        if (data.customTransition) {
            this.updateTransition(window.location.pathname, data.url, data.customTransition);
            document.documentElement.classList.add(`to-${classify(data.customTransition)}`);
        } else {
            this.updateTransition(window.location.pathname, data.url);
        }

        const promises: Array<Promise<void>> = [];
        // start/skip loading of page
        if (this.cache.exists(data.url)) {
            this.events.pageRetrievedFromCache.emit();
        } else if (this.preloading[data.url]) {
            promises.push(this.preloading[data.url].promise);
        } else {
            promises.push(this.fetchPage(data.url));
        }

        // start/skip animation
        if (!popstate || this.options.animateHistoryBrowsing) {
            promises.push(this.startAnimation(data.url, popstate));
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
        }
    }

    enable() {
        // add event listeners
        document.addEventListener("click", this.linkClickHandler);
        window.addEventListener("popstate", this.popStateHandler);

        // initial save to cache
        const url = getCurrentUrl();
        const page = getPageDataFromHtml(url, document.documentElement.outerHTML, this.options.containers);
        if (!page) throw new Error("Failed getting page from document");
        if (this.options.cache) {
            this.cache.add(page);
        }

        // mark swup blocks in html
        markSwupElements(document, this.options.containers);

        // modify initial history record
        window.history.replaceState(
            { ...window.history.state, url: window.location.href, random: Math.random(), source: "swup" },
            document.title,
            window.location.href
        );

        // trigger enabled event
        this.events.enabled.emit();

        // add swup-enabled class to html tag
        document.documentElement.classList.add("swup-enabled");

        // trigger page view event
        this.events.pageView.emit();
    }

    destroy() {
        // remove delegated listeners
        document.removeEventListener("click", this.linkClickHandler);

        // remove popstate listener
        window.removeEventListener("popstate", this.popStateHandler);

        // empty cache
        this.cache.empty();

        // unmount plugins
        this.plugins.forEach((plugin) => this.unuse(plugin));

        // remove swup data atributes from blocks
        unmarkSwupElements(document);

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
                // eslint-disable-next-line no-restricted-globals
                window.history.replaceState(
                    {
                        url: url + hash,
                        random: Math.random(),
                        source: "swup",
                    },
                    document.title,
                    url + hash
                );
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
