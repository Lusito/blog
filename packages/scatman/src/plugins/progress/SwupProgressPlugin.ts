import type { Swup } from "../../Swup";
import type { SwupPlugin } from "../../plugin";
import { ProgressBar } from "./ProgressBar";

type Options = {
    container: string;
    className: string;
    background: string;
    transition: number;
    delay: number;
    hideImmediately: boolean;
};

const defaultOptions = {
    container: "body",
    className: "swup-progress-bar",
    background: "red",
    transition: 300,
    delay: 300,
    hideImmediately: true,
};

export class SwupProgressPlugin implements SwupPlugin {
    private swup: Swup;

    private options: Options;

    private showProgressBarTimeout?: number;

    private hideProgressBarTimeout?: number;

    private progressBar: ProgressBar;

    constructor(swup: Swup, options: Partial<Options> = {}) {
        this.swup = swup;
        this.options = { ...defaultOptions, ...options };

        let container = document.querySelector(this.options.container);
        if (!container) {
            console.warn(
                `Could not find container for progress bar using "${this.options.container}". Using body instead`
            );
            container = document.body;
        }

        this.progressBar = new ProgressBar({
            className: this.options.className,
            transition: this.options.transition,
            background: this.options.background,
            container,
        });
    }

    mount() {
        this.swup.events.transitionStart.on(this.start);
        this.swup.events.contentReplaced.on(this.stop);
    }

    unmount() {
        this.swup.events.transitionStart.off(this.start);
        this.swup.events.contentReplaced.off(this.stop);
    }

    private start = () => {
        this.progressBar.setValue(0);
        this.showProgressBarAfterDelay();
    };

    private stop = () => {
        this.progressBar.setValue(1);
        if (this.options.hideImmediately) {
            this.hideProgressBar();
        } else {
            this.finishAnimationAndHideProgressBar();
        }

        window.clearTimeout(this.showProgressBarTimeout);
        delete this.showProgressBarTimeout;
    };

    private showProgressBar = () => {
        window.clearTimeout(this.hideProgressBarTimeout);
        delete this.hideProgressBarTimeout;
        this.progressBar.show();
    };

    private showProgressBarAfterDelay() {
        this.showProgressBarTimeout = window.setTimeout(this.showProgressBar, this.options.delay);
    }

    private hideProgressBar = () => {
        this.progressBar.hide();
    };

    private finishAnimationAndHideProgressBar() {
        this.hideProgressBarTimeout = window.setTimeout(this.hideProgressBar, this.options.transition);
    }
}
