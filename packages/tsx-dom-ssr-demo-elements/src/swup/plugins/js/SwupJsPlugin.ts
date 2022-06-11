import type { Swup, SwupPageLoadEvent } from "../..";
import { SwupAnimationPlugin } from "../../plugin";

type InOutParam = {
    paramsFrom: RegExpExecArray | null;
    paramsTo: RegExpExecArray | null;
    event: SwupPageLoadEvent;
    from: string | RegExp;
    to: string | RegExp;
};

type Animation = {
    from: RegExp;
    to: RegExp;
    out: (next: () => void, param: InOutParam) => void;
    in: (next: () => void, param: InOutParam) => void;
};

type Options = {
    animateHistoryBrowsing: boolean;
    animations: Animation[];
};

const catchAll = /^(.*)[/#?]?$/i; // pathToRegExp("(.*)")

// default options
const defaultOptions: Options = {
    animateHistoryBrowsing: false,
    animations: [
        {
            from: catchAll,
            to: catchAll,
            out: (next) => next(),
            in: (next) => next(),
        },
    ],
};

export class SwupJsPlugin implements SwupAnimationPlugin {
    private currentAnimation: Animation | null = null;

    private options: Options;

    constructor(_swup: Swup, options: Partial<Options> = {}) {
        this.options = { ...defaultOptions, ...options };
        if (options.animations) {
            this.options.animations = [...defaultOptions.animations, ...options.animations];
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mount() {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    unmount() {}

    animateOut(event: SwupPageLoadEvent) {
        return this.createAnimationPromise(event, "out");
    }

    animateIn(event: SwupPageLoadEvent) {
        return this.createAnimationPromise(event, "in");
    }

    private createAnimationPromise(event: SwupPageLoadEvent, type: "in" | "out") {
        // type === "in" => already saved from out animation
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const animation = type === "in" ? this.currentAnimation! : this.getRatedAnimation(event);

        return new Promise<void>((resolve) => {
            animation[type](resolve, {
                paramsFrom: animation.from.exec(event.fromUrl),
                paramsTo: animation.to.exec(event.toUrl),
                event,
                from: animation.from,
                to: animation.to,
            });
        });
    }

    private getRatedAnimation(event: SwupPageLoadEvent) {
        let topAnimation = this.options.animations[0];
        let topRating = 0;

        this.options.animations.forEach((animation) => {
            const rating = this.rateAnimation(event, animation);

            if (rating >= topRating) {
                topAnimation = animation;
                topRating = rating;
            }
        });

        this.currentAnimation = topAnimation;
        return this.currentAnimation;
    }

    private rateAnimation(event: SwupPageLoadEvent, animation: Animation) {
        const fromMatched = animation.from.test(event.fromUrl);
        const toMatched = animation.to.test(event.toUrl);

        const rating = (fromMatched ? 1 : 0) + (toMatched ? 1 : 0);

        // beat all other if custom parameter fits
        if (fromMatched && event.customTransition && animation.to.test(event.customTransition)) {
            return rating + 2;
        }

        return rating;
    }
}
