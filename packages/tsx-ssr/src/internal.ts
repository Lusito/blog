import type { BaseProps, Component, ComponentChildren } from './types';
import { VNode } from './VNode';
import { VPromiseNode } from './VPromiseNode';
import { VTextNode } from './VTextNode';

export function flattenChildren(
  children: ComponentChildren,
  result: VNode[] = []
) {
  if (Array.isArray(children)) {
    for (const child of children) flattenChildren(child, result);
  } else if (typeof children === 'string') {
    if (children) result.push(new VTextNode(children));
  } else if (typeof children === 'number') {
    result.push(new VTextNode(children.toString()));
  } else if (children instanceof VNode) {
    result.push(children);
  } else if (children) {
    result.push(new VPromiseNode(children));
  }

  return result;
}

export type InternalComponent<T = BaseProps> = ((
  props: T
) => ComponentChildren) & {
  __tsxInternal: boolean;
};

export function internalComponent<T>(comp: Component<T>): InternalComponent<T> {
  return Object.assign(comp, { __tsxInternal: true });
}
