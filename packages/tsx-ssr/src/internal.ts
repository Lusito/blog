import type {
  BaseProps,
  Component,
  ComponentChildren,
  ComponentThis,
  VNode,
} from './types';

function createTextNode(text: string): VNode {
  return async (document) => document.createTextNode(text);
}

function createPromiseNode(promise: ComponentChildren): VNode {
  return async (document, thisArg) => {
    const children = await Promise.resolve(promise);

    return appendChildren(
      document,
      document.createDocumentFragment(),
      flattenChildren(children),
      thisArg
    );
  };
}

export function flattenChildren(
  children: ComponentChildren,
  result: VNode[] = []
) {
  if (Array.isArray(children)) {
    for (const child of children) flattenChildren(child, result);
  } else if (typeof children === 'string') {
    if (children) result.push(createTextNode(children));
  } else if (typeof children === 'number') {
    result.push(createTextNode(children.toString()));
  } else if (children && typeof children === 'function') {
    result.push(children);
  } else if (children) {
    result.push(createPromiseNode(children));
  }

  return result;
}

export async function appendChildren(
  document: Document,
  target: HTMLElement | DocumentFragment,
  nodes: VNode[],
  thisArg: ComponentThis
) {
  const domChildren = await Promise.all(
    nodes.map((child) => child(document, thisArg))
  );
  for (const child of domChildren) {
    target.appendChild(child);
  }

  return target;
}

export type InternalComponent<T = BaseProps> = ((
  props: T
) => ComponentChildren) & {
  __tsxInternal: boolean;
};

export function internalComponent<T>(comp: Component<T>): InternalComponent<T> {
  return Object.assign(comp, { __tsxInternal: true });
}
