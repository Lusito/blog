import { setAttributes } from "./setAttributes";
import { toDom } from "./domUtils";
import type { BaseProps, Component, ComponentAttributes, ComponentChildren, VNode } from "./types";

function hasChildrenSet(children: ComponentChildren) {
    if (Array.isArray(children)) {
        return children.length > 0;
    }

    return children !== undefined;
}

export function createDomElement(document: Document, tag: string, attrs: ComponentAttributes | null) {
    const options = attrs?.is ? { is: attrs.is as string } : undefined;

    if (attrs?.xmlns) return document.createElementNS(attrs.xmlns as string, tag, options) as SVGElement;

    return document.createElement(tag, options);
}

export function createHtmlElementNode(tag: string, { children, ...attrs }: BaseProps): VNode {
    return async (document, thisArg) => {
        const el = createDomElement(document, tag, attrs as ComponentAttributes);
        setAttributes(el, attrs as ComponentAttributes);

        if (el.innerHTML) {
            if (hasChildrenSet(children)) {
                console.error("Received both dangerouslySetInnerHTML and children. Children will be ignored!");
            }
        } else {
            const fragment = await toDom(document, children, thisArg);
            el.appendChild(fragment);
        }

        return el;
    };
}

export function createComponentNode(tag: Component<BaseProps>, props: BaseProps): ComponentChildren {
    return async (document, thisArg) => {
        const children = await tag.call(thisArg, props);

        return toDom(document, children, thisArg);
    };
}

export type InternalComponent<T = BaseProps> = ((props: T) => ComponentChildren) & {
    __tsxInternal: boolean;
};

export function internalComponent<T>(comp: Component<T>): InternalComponent<T> {
    return Object.assign(comp, { __tsxInternal: true });
}
