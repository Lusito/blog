import { Component, createElement } from "tsx-dom-ssr";

type DynamicPageProps = {
    component: Component;
};

export function DynamicPage({ component }: DynamicPageProps) {
    return createElement(component, {});
}
