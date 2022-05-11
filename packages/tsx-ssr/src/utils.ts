import { ComponentChildren, ComponentThis, TsxDocument } from "./types";
import { VNode } from "./VNode";
import { VPromiseNode } from "./VPromiseNode";
import { VTextNode } from "./VTextNode";

export function flattenChildren(children: ComponentChildren, result: VNode[] = []) {
    if (Array.isArray(children)) {
        for (const child of children)
            flattenChildren(child, result);
    } else if (typeof children === "string") {
        if (children) result.push(new VTextNode(children));
    } else if (typeof children === "number") {
        result.push(new VTextNode(children.toString()));
    } else if (children instanceof VNode) {
        result.push(children);
    } else if (children) {
        result.push(new VPromiseNode(children));
    }

    return result;
}

export async function toDom(document: TsxDocument, children: ComponentChildren, self: ComponentThis): Promise<HTMLElement | DocumentFragment | Text> {
    const flattened = flattenChildren(children);

    await Promise.all(flattened.map(child => child.resolve(self)));
    const el = document.createDocumentFragment();
    for (const child of flattened) {
        el.appendChild(child.toDom(document));
    }

    return el;
}

export async function renderToString(document: TsxDocument, children: ComponentChildren, self: ComponentThis) {
    const domChildren = await toDom(document, children, self);
    const wrapper = document.createElement("div");
    wrapper.appendChild(domChildren);
    return wrapper.innerHTML;
}
