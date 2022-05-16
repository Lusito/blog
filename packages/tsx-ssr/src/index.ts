import type { ComponentChildren, HTMLComponentProps } from './types';
import type { HTMLAttributes } from 'tsx-types';

export * from './createContext';
export * from './createElement';
export * from './domUtils';
export * from './jsx-runtime';
export * from './ErrorBoundary';
export * from './Fragment';
export * from './types';

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
