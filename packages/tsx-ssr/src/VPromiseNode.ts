import { VNodeParent } from "./VNodeParent";
import type { ComponentThis, BaseProps, ComponentChildren, Component } from "./types";
import { flattenChildren } from "./utils";

export class VPromiseNode extends VNodeParent {
    protected promise: ComponentChildren;

    public constructor(promise: ComponentChildren) {
        super();
        this.promise = promise;
    }

    protected override async resolveSelf(self: ComponentThis) {
        const children = await Promise.resolve(this.promise);
        this.children = flattenChildren(children);
    }
}
