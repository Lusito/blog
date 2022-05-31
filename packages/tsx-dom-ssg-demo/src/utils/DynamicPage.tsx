import { createElement } from "tsx-dom-ssr";

type DynamicPageProps = {
    path: string;
};

export async function DynamicPage({ path }: DynamicPageProps) {
    const page = await import(`../pages/${path}.page`);
    return createElement(page.default, {});
}
