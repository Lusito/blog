import { FC, createElement } from "tsx-dom-ssr";

type DynamicPageProps = {
    component: FC;
};

export const DynamicPage = ({ component }: DynamicPageProps) => createElement(component, {});
