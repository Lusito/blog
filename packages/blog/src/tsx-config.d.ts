import "tsx-dom-ssr";

declare module "tsx-dom-ssr" {
    export interface TsxConfig {
        // Set one of these to false to disable support for them
        svg: false;
        // html: false;
    }
}
