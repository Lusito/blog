import { VNodeParent } from './VNodeParent';
import type { ComponentThis, BaseProps, Component } from './types';
import { flattenChildren } from './internal';

export class VComponentNode extends VNodeParent {
  protected tag: Component;
  protected props: BaseProps;

  public constructor(tag: Component, props: BaseProps) {
    super();
    this.tag = tag;
    this.props = props;
  }

  protected override async resolveSelf(thisArg: ComponentThis) {
    const children = await this.tag.call(thisArg, this.props);
    this.children = flattenChildren(children);
  }
}
