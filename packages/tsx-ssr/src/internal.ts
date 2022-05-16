import { ElementAttributes, setAttributes } from './setAttributes';
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

    return toDom(document, children, thisArg);
  };
}

function hasChildrenSet(children: ComponentChildren) {
  if (Array.isArray(children)) {
    return children.length > 0;
  }

  return children !== undefined;
}

export function createHtmlElementNode(
  tag: string,
  { children, ...attrs }: BaseProps
): VNode {
  return async (document, thisArg) => {
    const el = document.createElement(tag);
    setAttributes(el, attrs as ElementAttributes);

    if (el.innerHTML) {
      if (hasChildrenSet(children)) {
        console.error(
          'Received both dangerouslySetInnerHTML and children. Children will be ignored!'
        );
      }
    } else {
      const fragment = await toDom(document, children, thisArg);
      el.appendChild(fragment);
    }

    return el;
  };
}

export function createComponentNode(
  tag: Component<BaseProps>,
  props: BaseProps
): ComponentChildren {
  return async (document, thisArg) => {
    const children = await tag.call(thisArg, props);

    return toDom(document, children, thisArg);
  };
}

function flattenChildren(children: ComponentChildren, result: VNode[]) {
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

export async function toDom(
  document: Document,
  children: ComponentChildren,
  thisArg: ComponentThis
) {
  const target = document.createDocumentFragment();

  const domChildren = await Promise.all(
    flattenChildren(children, []).map((child) => child(document, thisArg))
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
