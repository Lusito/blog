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
