import { ElementAttributes, VElementNode } from "./VElementNode";
import { VComponentNode } from "./VComponentNode";
import { BaseProps, Component, ComponentChildren, ComponentThis, HTMLComponentProps, InternalComponent } from "./types";
import { HTMLAttributes } from "./HTMLAttributes";

export * from "./createContext";
export * from "./ErrorBoundary";
export * from "./Fragment";
export * from "./HTMLAttributes";
export * from "./types";
export { toDom, renderToString } from "./utils";

export function h(tag: string | Component, attrs: Record<string, unknown> | null, ...children: ComponentChildren[]): ComponentChildren {
    if (typeof tag === "string") {
        return new VElementNode(tag, (attrs ?? {}) as ElementAttributes, children);
    }
    if ((tag as InternalComponent).__tsxInternal === true) {
        return tag.call({} as ComponentThis, { ...attrs, children }) as unknown as ComponentChildren;
    }
    return new VComponentNode(tag, (attrs ?? {}) as BaseProps, children);
}

declare global {
    namespace JSX {
        type Element = ComponentChildren;

        interface ElementAttributesProperty {
            props: any; // specify the property name to use
        }

        interface ElementChildrenAttribute {
            children: ComponentChildren;
        }

        type IntrinsicElementsHTML = { [K in keyof HTMLElementTagNameMap]?: HTMLAttributes & HTMLComponentProps };

        interface IntrinsicElements extends IntrinsicElementsHTML { }
    }
}
