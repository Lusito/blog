import { ElementAttributes, VElementNode } from './VElementNode';
import { VComponentNode } from './VComponentNode';
import type {
  BaseProps,
  Component,
  ComponentChildren,
  ComponentThis,
  HTMLComponentProps,
  InternalComponent,
} from './types';
import type { HTMLAttributes } from './HTMLAttributes';

export * from './createContext';
export * from './ErrorBoundary';
export * from './Fragment';
export * from './HTMLAttributes';
export * from './types';
export { toDom, renderToString } from './utils';

export function h(
  tag: string | Component,
  attrs: Record<string, unknown> | null,
  ...children: ComponentChildren[]
): ComponentChildren {
  if (typeof tag === 'string') {
    return new VElementNode(tag, (attrs ?? {}) as ElementAttributes, children);
  }
  if ((tag as InternalComponent).__tsxInternal === true) {
    return tag.call({} as ComponentThis, {
      ...attrs,
      children,
    }) as unknown as ComponentChildren;
  }
  return new VComponentNode(tag, (attrs ?? {}) as BaseProps, children);
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    type Element = ComponentChildren;

    interface ElementAttributesProperty {
      props: unknown; // specify the property name to use
    }

    interface ElementChildrenAttribute {
      children: ComponentChildren;
    }

    type IntrinsicElementsHTML = {
      [K in keyof HTMLElementTagNameMap]?: HTMLAttributes & HTMLComponentProps;
    };

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface IntrinsicElements extends IntrinsicElementsHTML {}
  }
}
