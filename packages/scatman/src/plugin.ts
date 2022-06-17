import type { SwupPageLoadEvent } from ".";

export interface SwupPlugin {
    /**
     * this is mount method rewritten by class extending
     * and is executed when swup is enabled with plugin
     */
    mount(): void;

    /**
     * this is unmount method rewritten by class extending
     * and is executed when swup with plugin is disabled
     */
    unmount(): void;
}

export interface SwupAnimationPlugin extends SwupPlugin {
    animateOut(data: SwupPageLoadEvent): Promise<void>;
    animateIn(data: SwupPageLoadEvent): Promise<void>;
}
