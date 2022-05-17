declare namespace JSX {
    interface IntrinsicElements {
        "word-count": IntrinsicElements["div"];
    }
}

declare module "*.module.css" {
    const content: {
        _getCss(): string;
        [key: string]: string;
    };
    export = content;
}
