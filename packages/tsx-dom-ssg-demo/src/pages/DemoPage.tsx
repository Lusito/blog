import { createElement } from "tsx-dom-ssr";

// eslint-disable-next-line @typescript-eslint/no-inferrable-types
const s: string = "folder/test";

export async function DemoPage() {
    const bla = await import(`./${s}.page`);
    return createElement(bla.default, {});
}
