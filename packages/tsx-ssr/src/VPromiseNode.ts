import { VNode } from './VNode';
import type { ComponentChildren, ComponentThis } from './types';
import { appendChildren, flattenChildren } from './internal';

export class VPromiseNode extends VNode {
  private promise: ComponentChildren;

  public constructor(promise: ComponentChildren) {
    super();
    this.promise = promise;
  }

  public override async toDom(
    document: Document,
    thisArg: ComponentThis
  ): Promise<HTMLElement | DocumentFragment | Text> {
    const children = await Promise.resolve(this.promise);

    return appendChildren(
      document,
      document.createDocumentFragment(),
      flattenChildren(children),
      thisArg
    );
  }
}
