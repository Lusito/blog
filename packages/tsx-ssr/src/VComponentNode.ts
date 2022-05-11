import { VNodeParent } from "./VNodeParent";
import type { ComponentThis, BaseProps, ComponentChildren, Component } from "./types";
import { flattenChildren } from "./utils";

export class VComponentNode extends VNodeParent {
    protected tag: Component;
    protected props: BaseProps;

    public constructor(tag: Component, props: BaseProps, children: ComponentChildren) {
        super();
        this.tag = tag;
        this.props = { ...props, children };
    }

    protected override async resolveSelf(thisArg: ComponentThis) {
        const children = await this.tag.call(thisArg, this.props);
        this.children = flattenChildren(children);
    }
}
