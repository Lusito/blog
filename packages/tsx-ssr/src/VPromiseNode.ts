import { VNodeParent } from "./VNodeParent";
import type { ComponentChildren } from "./types";
import { flattenChildren } from "./utils";

export class VPromiseNode extends VNodeParent {
    protected promise: ComponentChildren;

    public constructor(promise: ComponentChildren) {
        super();
        this.promise = promise;
    }

    protected override async resolveSelf() {
        const children = await Promise.resolve(this.promise);
        this.children = flattenChildren(children);
    }
}
