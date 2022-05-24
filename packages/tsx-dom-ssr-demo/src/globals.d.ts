import("tsx-dom-ssr-demo-elements");

declare module "*.module.css" {
    const content: {
        _getCss(): string;
        [key: string]: string;
    };
    export = content;
}
