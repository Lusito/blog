import type { EventAttributes, StyleAttributes, SVGAttributes } from "tsx-dom-types";

export type ComponentChild = ComponentChild[] | JSX.Element | string | number | boolean | undefined | null;
export type ComponentChildren = ComponentChild | ComponentChild[];
export interface BaseProps {
    children?: ComponentChildren;
}
export type Component = (props: BaseProps) => JSX.Element;
export type ComponentAttributes = {
    [s: string]: string | number | boolean | undefined | null | StyleAttributes | EventListenerOrEventListenerObject;
};

export interface HTMLComponentProps extends BaseProps {
    dangerouslySetInnerHTML?: string;
}

export type IntrinsicElementsHTMLAndSVG = {
    [TKey in keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap]?: SVGAttributes &
        HTMLComponentProps &
        EventAttributes;
};
