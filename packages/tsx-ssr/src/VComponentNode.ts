import { VNode } from './VNode';
import type { ComponentThis, BaseProps, Component } from './types';
import { appendChildren, flattenChildren } from './internal';

export class VComponentNode extends VNode {
  private tag: Component;
  private props: BaseProps;

  public constructor(tag: Component, props: BaseProps) {
    super();
    this.tag = tag;
    this.props = props;
  }

  public override async toDom(
    document: Document,
    thisArg: ComponentThis
  ): Promise<HTMLElement | DocumentFragment | Text> {
    const children = await this.tag.call(thisArg, this.props);

    return appendChildren(
      document,
      document.createDocumentFragment(),
      flattenChildren(children),
      thisArg
    );
  }
}
