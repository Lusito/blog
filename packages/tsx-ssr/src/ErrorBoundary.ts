import type { ComponentChildren } from './types';
import { internalComponent, flattenChildren, appendChildren } from './internal';

export type ErrorBoundaryProps = {
  render: () => ComponentChildren;
  fallback: (props: { error: unknown }) => ComponentChildren;
  accept?: (error: unknown) => boolean; // if this boundary accepts the error or lets the next boundary handle it
};

export const ErrorBoundary = internalComponent((props: ErrorBoundaryProps) => {
  return async (document, thisArg) => {
    try {
      const children = await props.render();

      return appendChildren(
        document,
        document.createDocumentFragment(),
        flattenChildren(children),
        thisArg
      );
    } catch (error) {
      if (props.accept && !props.accept(error)) {
        throw error;
      }

      const children = await props.fallback({ error });
      return appendChildren(
        document,
        document.createDocumentFragment(),
        flattenChildren(children),
        thisArg
      );
    }
  };
});
