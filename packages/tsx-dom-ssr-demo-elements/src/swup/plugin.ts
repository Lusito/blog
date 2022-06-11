import type { SwupLoadPageData } from ".";

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
    animateOut(data: SwupLoadPageData): Promise<void>;
    animateIn(data: SwupLoadPageData): Promise<void>;
}
