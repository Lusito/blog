// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import("tsx-dom-ssr-demo-elements");

declare module "*.module.scss" {
    const content: {
        _getCss(): string;
        [key: string]: string;
    };
    export = content;
}

declare module "*.module.css" {
    const content: {
        _getCss(): string;
        [key: string]: string;
    };
    export = content;
}
