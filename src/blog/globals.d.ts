import("../custom-elements");

declare module "*.png" {
    const content: string;
    export = content;
}

declare module "*.webp" {
    const content: string;
    export = content;
}

declare module "*.md" {
    const content: import("../pirates/markdown").MarkdownModule;
    export = content;
}
