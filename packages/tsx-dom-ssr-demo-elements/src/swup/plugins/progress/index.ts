import type { Swup } from "../..";
import type { SwupPlugin } from "../../plugin";
import ProgressBar from "./ProgressBar";

type Options = {
    className: string;
    transition: number;
    delay: number;
    hideImmediately: boolean;
};

const defaultOptions = {
    className: "swup-progress-bar",
    transition: 300,
    delay: 300,
    hideImmediately: true,
};

export default class ProgressPlugin implements SwupPlugin {
    readonly name = "SwupProgressPlugin";

    swup: Swup;

    options: Options;

    showProgressBarTimeout?: number;

    hideProgressBarTimeout?: number;

    progressBar: ProgressBar;

    constructor(swup: Swup, options: Partial<Options> = {}) {
        this.swup = swup;
        this.options = { ...defaultOptions, ...options };

        this.progressBar = new ProgressBar({
            className: this.options.className,
            animationDuration: this.options.transition,
        });
    }

    mount() {
        this.swup.events.transitionStart.on(this.startShowingProgress);
        this.swup.events.contentReplaced.on(this.stopShowingProgress);
    }

    unmount() {
        this.swup.events.transitionStart.off(this.startShowingProgress);
        this.swup.events.contentReplaced.off(this.stopShowingProgress);
    }

    startShowingProgress = () => {
        this.progressBar.setValue(0);
        this.showProgressBarAfterDelay();
    };

    stopShowingProgress = () => {
        this.progressBar.setValue(1);
        if (this.options.hideImmediately) {
            this.hideProgressBar();
        } else {
            this.finishAnimationAndHideProgressBar();
        }

        window.clearTimeout(this.showProgressBarTimeout);
        delete this.showProgressBarTimeout;
    };

    showProgressBar = () => {
        window.clearTimeout(this.hideProgressBarTimeout);
        delete this.hideProgressBarTimeout;
        this.progressBar.show();
    };

    showProgressBarAfterDelay() {
        this.showProgressBarTimeout = window.setTimeout(this.showProgressBar, this.options.delay);
    }

    hideProgressBar = () => {
        this.progressBar.hide();
    };

    finishAnimationAndHideProgressBar() {
        this.hideProgressBarTimeout = window.setTimeout(this.hideProgressBar, this.options.transition);
    }
}
