import type { StyleAttributes } from "tsx-dom-types";

export type ElementAttributes = {
    [s: string]: string | number | boolean | StyleAttributes;
};

export function setAttributes(element: HTMLElement, attrs: ElementAttributes) {
    // Special handler for style with a value of type StyleAttributes
    if (attrs.style && typeof attrs.style !== "string") {
        const style = attrs.style as StyleAttributes;
        const target = element.style as StyleAttributes;
        for (const key in style) {
            if (key in target) {
                target[key] = style[key];
            }
        }
        delete attrs.style;
    }

    if (attrs.dangerouslySetInnerHTML) {
        element.innerHTML = attrs.dangerouslySetInnerHTML as string;
        delete attrs.dangerouslySetInnerHTML;
    }

    for (const name of Object.keys(attrs)) {
        const value = attrs[name];
        if (value === true) {
            element.setAttribute(name, name);
        } else if (value || value === 0) {
            element.setAttribute(name, value.toString());
        }
    }
}
