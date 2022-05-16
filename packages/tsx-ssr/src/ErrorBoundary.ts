import type { ComponentChildren } from './types';
import { internalComponent, flattenChildren, appendChildren } from './internal';

export type ErrorBoundaryProps = {
  render: () => ComponentChildren;
  fallback: (props: { error: unknown }) => ComponentChildren;
  /** @returns false if this boundary should skip the error and let the next boundary handle it */
  accept?: (error: unknown) => boolean;
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
