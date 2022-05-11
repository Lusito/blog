import { VNode } from "./VNode";
import type { ComponentThis, ComponentChildren } from "./types";

export abstract class VNodeParent extends VNode {
    protected children: VNode[];
    protected status: 'init' | 'resolvingSelf' | 'resolvingChildren' | 'resolved' = 'init';

    public constructor(children: VNode[] = []) {
        super();
        this.children = children;
    }

    protected async resolveSelf(self: ComponentThis) {
    }

    public override async resolve(self: ComponentThis) {
        if (this.status !== 'init') throw new Error("Called resolve twice on node");

        this.status = 'resolvingSelf';
        await this.resolveSelf(self);

        this.status = 'resolvingChildren';
        await Promise.all(this.children.map(child => child.resolve(self)));

        this.status = 'resolved';
    }

    public override toDom(): HTMLElement | DocumentFragment | Text {
        if (this.status !== "resolved") throw new Error("You need to resolve first!");

        const el = document.createDocumentFragment();
        for (const child of this.children) {
            el.appendChild(child.toDom());
        }

        return el;
    }
}
