import type { Swup, Transition } from "../..";
import { SwupAnimationPlugin } from "../../plugin";

type InOutParam = {
    paramsFrom: RegExpExecArray | null;
    paramsTo: RegExpExecArray | null;
    transition: Transition;
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

export  class SwupJsPlugin implements SwupAnimationPlugin {
    private swup: Swup;

    private currentAnimation: Animation | null = null;

    private options: Options;

    constructor(swup: Swup, options: Partial<Options> = {}) {
        this.swup = swup;
        this.options = { ...defaultOptions, ...options };
        if (options.animations) {
            this.options.animations = [...defaultOptions.animations, ...options.animations];
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mount() {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    unmount() {}

    animateOut() {
        return this.createAnimationPromise("out");
    }

    animateIn() {
        return this.createAnimationPromise("in");
    }

    private createAnimationPromise(type: "in" | "out") {
        const animation = this.getRatedAnimation(type);
        const { transition } = this.swup;

        return new Promise<void>((resolve) => {
            animation[type](resolve, {
                paramsFrom: animation.from.exec(transition.from),
                paramsTo: animation.to.exec(transition.to),
                transition,
                from: animation.from,
                to: animation.to,
            });
        });
    }

    private getRatedAnimation(type: "in" | "out") {
        // already saved from out animation
        if (type === "in") {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return this.currentAnimation!;
        }

        let topAnimation = this.options.animations[0];
        let topRating = 0;

        this.options.animations.forEach((animation) => {
            const rating = this.rateAnimation(animation);

            if (rating >= topRating) {
                topAnimation = animation;
                topRating = rating;
            }
        });

        this.currentAnimation = topAnimation;
        return this.currentAnimation;
    }

    private rateAnimation(animation: Animation) {
        const { transition } = this.swup;

        // run regex
        const fromMatched = animation.from.test(transition.from);
        const toMatched = animation.to.test(transition.to);

        let rating = 0;
        // check if regex passes
        rating += fromMatched ? 1 : 0;
        rating += toMatched ? 1 : 0;

        // beat all other if custom parameter fits
        rating += fromMatched && transition.custom && animation.to.test(transition.custom) ? 2 : 0;

        return rating;
    }
}
