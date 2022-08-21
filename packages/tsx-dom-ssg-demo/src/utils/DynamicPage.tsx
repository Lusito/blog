import { Component, createElement } from "tsx-dom-ssr";

type DynamicPageProps = {
    component: Component;
};

export const DynamicPage = ({ component }: DynamicPageProps) => createElement(component, {});
