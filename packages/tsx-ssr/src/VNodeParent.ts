import { VNode } from "./VNode";
import type { ComponentThis } from "./types";

export abstract class VNodeParent extends VNode {
    protected children: VNode[];
    protected status: 'init' | 'resolvingSelf' | 'resolvingChildren' | 'resolved' = 'init';

    public constructor(children: VNode[] = []) {
        super();
        this.children = children;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    protected async resolveSelf(thisArg: ComponentThis) {}

    public override async resolve(thisArg: ComponentThis) {
        if (this.status !== 'init') throw new Error("Called resolve twice on node");

        this.status = 'resolvingSelf';
        await this.resolveSelf(thisArg);

        this.status = 'resolvingChildren';
        await Promise.all(this.children.map(child => child.resolve(thisArg)));

        this.status = 'resolved';
    }

    public override toDom(document: Document): HTMLElement | DocumentFragment | Text {
        if (this.status !== "resolved") throw new Error("You need to resolve first!");

        const el = document.createDocumentFragment();
        for (const child of this.children) {
            el.appendChild(child.toDom(document));
        }

        return el;
    }
}
