import type { ComponentChildren } from ".";
import { StyleAttributes } from "./HTMLAttributes";
import { flattenChildren } from "./utils";
import { VNodeParent } from "./VNodeParent";

export type ElementAttributes = { [s: string]: string | number | boolean | StyleAttributes };

function setAttributes(element: HTMLElement, attrs: ElementAttributes) {
    // Special handler for style with a value of type StyleAttributes
    if (attrs.style && typeof (attrs.style) !== "string") {
        const style = attrs.style as StyleAttributes;
        const target = element.style as StyleAttributes;
        for (const key in style) {
            if (target.hasOwnProperty(key))
                target[key] = style[key];
        }
        delete attrs.style;
    }

    if (attrs.dangerouslySetInnerHTML) {
        element.innerHTML = attrs.dangerouslySetInnerHTML as string;
        delete attrs.dangerouslySetInnerHTML;
    }

    for (const name in attrs) {
        const value = attrs[name];
        if (value === true)
            element.setAttribute(name, name);
        else if (value || value === 0)
            element.setAttribute(name, value.toString());
    }
}

export class VElementNode extends VNodeParent {
    protected tag: string;
    protected attrs: ElementAttributes;

    public constructor(tag: string, attrs: ElementAttributes, children: ComponentChildren) {
        super(flattenChildren(children));
        this.tag = tag;
        this.attrs = attrs;
    }

    public override toDom() {
        if (this.status !== "resolved") throw new Error("You need to resolve first!");

        const el = document.createElement(this.tag);
        setAttributes(el, this.attrs);
        if (el.innerHTML) {
            if (this.children.length) {
                console.error("Received both dangerouslySetInnerHTML and children. Children will be ignored!");
            }
        } else {
            for (const child of this.children) {
                el.appendChild(child.toDom());
            }
        }

        return el;
    }
}
