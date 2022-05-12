import type {
  BaseProps,
  Component,
  ComponentChildren,
  ComponentThis,
} from './types';
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

export async function toDom(
  document: Document,
  children: ComponentChildren,
  thisArg: ComponentThis
): Promise<HTMLElement | DocumentFragment | Text> {
  const flattened = flattenChildren(children);

  await Promise.all(flattened.map((child) => child.resolve(thisArg)));
  const el = document.createDocumentFragment();
  for (const child of flattened) {
    el.appendChild(child.toDom(document));
  }

  return el;
}

export async function renderToString(
  document: Document,
  children: ComponentChildren,
  thisArg: ComponentThis
) {
  const domChildren = await toDom(document, children, thisArg);
  const wrapper = document.createElement('div');
  wrapper.appendChild(domChildren);

  return wrapper.innerHTML;
}

export type InternalComponent<T = BaseProps> = Component<T> & {
  __tsxInternal: boolean;
};

export function internalComponent<T>(comp: Component<T>): InternalComponent<T> {
  return Object.assign(comp, { __tsxInternal: true });
}
