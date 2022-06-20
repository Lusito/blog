// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import("tsx-dom-ssg-demo-elements");

type CssModule = {
    _getCss(): string;
    [key: string]: string;
};

declare module "*.module.scss" {
    const content: CssModule;
    export = content;
}

declare module "*.module.css" {
    const content: CssModule;
    export = content;
}

declare module "*.png" {
    const content: string;
    export = content;
}

declare module "*.webp" {
    const content: string;
    export = content;
}
