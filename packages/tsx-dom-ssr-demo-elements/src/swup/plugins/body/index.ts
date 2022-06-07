import type { Swup } from "../..";
import { getCurrentUrl } from "../../helpers/getCurrentUrl";
import { SwupPlugin } from "../../plugin";

type Options = {
    validClass: RegExp;
};

const defaultOptions: Options = {
    validClass: /./,
};

export default class BodyClassPlugin implements SwupPlugin {
    readonly name = "BodyClassPlugin";

    swup: Swup;

    options: Options;

    constructor(swup: Swup, options: Partial<Options> = {}) {
        this.swup = swup;
        this.options = { ...defaultOptions, ...options };
    }

    mount() {
        this.swup.events.contentReplaced.on(this.onContentReplaced);
    }

    unmount() {
        this.swup.events.contentReplaced.off(this.onContentReplaced);
    }

    onContentReplaced = () => {
        const page = this.swup.cache.get(getCurrentUrl());
        if (!page) {
            console.warn("Page did not exist in cache: ", getCurrentUrl());
            return;
        }

        const { validClass } = this.options;

        // remove old classes
        document.body.classList.forEach((className) => {
            if (validClass.test(className)) {
                document.body.classList.remove(className);
            }
        });

        // add new classes
        const classList = page.document.querySelector("body")?.classList;
        classList?.forEach((className) => {
            if (validClass.test(className)) {
                document.body.classList.add(className);
            }
        });
    };
}
