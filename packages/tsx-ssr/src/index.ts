import type { ComponentChildren, HTMLComponentProps } from './types';
import type { HTMLAttributes } from './HTMLAttributes';

export * from './createContext';
export * from './createElement';
export * from './ErrorBoundary';
export * from './Fragment';
export * from './HTMLAttributes';
export * from './types';
export { toDom, renderToString } from './utils';

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
