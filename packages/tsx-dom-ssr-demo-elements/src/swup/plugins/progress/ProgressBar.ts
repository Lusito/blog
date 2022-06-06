type Options = {
    className: string;
    animationDuration: number;
    background: string;
};
const defaultOptions = {
    className: "progress-bar",
    animationDuration: 300, // ms
    background: "red",
};

export default class ProgressBar {
    options: Options;

    minValue = 0.1;

    stylesheetElement: HTMLStyleElement;

    progressElement: HTMLDivElement;

    hiding = false;

    trickleInterval?: number;

    value = 0;

    visible = false;

    constructor(options: Partial<Options> = {}) {
        this.options = {
            ...defaultOptions,
            ...options,
        };

        this.stylesheetElement = this.createStylesheetElement();
        this.progressElement = this.createProgressElement();
    }

    get defaultCSS() {
        const { className, animationDuration, background } = this.options;
        return `
			.${className} {
				position: fixed;
				display: block;
				top: 0;
				left: 0;
				height: 3px;
				background: ${background};
				z-index: 9999;
				transition:
				width ${animationDuration}ms ease-out,
				opacity ${animationDuration / 2}ms ${animationDuration / 2}ms ease-in;
				transform: translate3d(0, 0, 0);
			}
    `;
    }

    show() {
        if (!this.visible) {
            this.visible = true;
            this.installStylesheetElement();
            this.installProgressElement();
            this.startTrickling();
        }
    }

    hide() {
        if (this.visible && !this.hiding) {
            this.hiding = true;
            this.fadeProgressElement(() => {
                this.uninstallProgressElement();
                this.stopTrickling();
                this.visible = false;
                this.hiding = false;
            });
        }
    }

    setValue(value: number) {
        this.value = Math.max(this.minValue, value);
        this.refresh();
    }

    // Private

    installStylesheetElement() {
        document.head.insertBefore(this.stylesheetElement, document.head.firstChild);
    }

    installProgressElement() {
        this.progressElement.style.width = "0";
        this.progressElement.style.opacity = "1";
        document.documentElement.insertBefore(this.progressElement, document.body);
        this.refresh();
    }

    fadeProgressElement(callback: () => void) {
        this.progressElement.style.opacity = "0";
        setTimeout(callback, this.options.animationDuration * 1.5);
    }

    uninstallProgressElement() {
        if (this.progressElement.parentNode) {
            document.documentElement.removeChild(this.progressElement);
        }
    }

    startTrickling() {
        if (!this.trickleInterval) {
            this.trickleInterval = window.setInterval(this.trickle, this.options.animationDuration);
        }
    }

    stopTrickling() {
        window.clearInterval(this.trickleInterval);
        delete this.trickleInterval;
    }

    trickle = () => {
        const advance = (Math.random() * 3) / 100;
        this.setValue(this.value + advance);
    };

    refresh() {
        requestAnimationFrame(() => {
            this.progressElement.style.width = `${10 + this.value * 90}%`;
        });
    }

    createStylesheetElement() {
        const element = document.createElement("style");
        element.setAttribute("data-progressbar-styles", "");
        element.setAttribute("data-swup-persist", "true");
        element.textContent = this.defaultCSS;
        return element;
    }

    createProgressElement() {
        const element = document.createElement("div");
        element.className = this.options.className;
        return element;
    }
}
