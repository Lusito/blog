import type { Swup, Transition } from "../..";
import { SwupPlugin } from "../../plugin";

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

const catchAll = /^(.*)[/#?]?$/i; // pathToRegExp("(.*)")
const defaultAnimation: Animation = {
    from: catchAll,
    to: catchAll,
    out: (next) => next(),
    in: (next) => next(),
};

export default class JsPlugin implements SwupPlugin {
    readonly name = "JsPlugin";

    swup: Swup;

    currentAnimation: number | null = null;

    animations: Animation[];

    private swupGetAnimationPromises?: (_type: "in" | "out") => Array<Promise<void>>;

    constructor(swup: Swup, animations: Animation[] = []) {
        this.swup = swup;
        this.animations = [defaultAnimation, ...animations];
    }

    mount() {
        this.swupGetAnimationPromises = this.getAnimationPromises;
        this.swup.getAnimationPromises = this.getAnimationPromises;
    }

    unmount() {
        if (this.swupGetAnimationPromises) {
            this.getAnimationPromises = this.swupGetAnimationPromises;
            delete this.swupGetAnimationPromises;
        }
    }

    getAnimationPromises = (type: "in" | "out") => {
        const animationIndex = this.getAnimationIndex(type);
        return [this.createAnimationPromise(animationIndex, type)];
    };

    createAnimationPromise(index: number, type: "in" | "out") {
        const { transition } = this.swup;
        const animation = this.animations[index];

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

    getAnimationIndex(type: "in" | "out") {
        // already saved from out animation
        if (type === "in") {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return this.currentAnimation!;
        }

        let animationIndex = 0;
        let topRating = 0;

        this.animations.forEach((animation, index) => {
            const rating = this.rateAnimation(animation);

            if (rating >= topRating) {
                animationIndex = index;
                topRating = rating;
            }
        });

        this.currentAnimation = animationIndex;
        return this.currentAnimation;
    }

    rateAnimation(animation: Animation) {
        const { transition } = this.swup;

        // run regex
        const fromMatched = animation.from.test(transition.from);
        const toMatched = animation.to.test(transition.to);

        let rating = 0;
        // check if regex passes
        rating += fromMatched ? 1 : 0;
        rating += toMatched ? 1 : 0;

        // beat all other if custom parameter fits
        rating += fromMatched && animation.to === transition.custom ? 2 : 0;

        return rating;
    }
}
