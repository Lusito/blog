import type { ComponentThis, ComponentChildren } from './types';
import { internalComponent, flattenChildren, appendChildren } from './internal';
import { VNode } from './VNode';

class VErrorBoundaryNode extends VNode {
  private render: ErrorBoundaryProps['render'];
  private fallback: ErrorBoundaryProps['fallback'];
  private accept: ErrorBoundaryProps['accept'];

  public constructor({ render, fallback, accept }: ErrorBoundaryProps) {
    super();
    this.render = render;
    this.fallback = fallback;
    this.accept = accept;
  }

  public override async toDom(
    document: Document,
    thisArg: ComponentThis
  ): Promise<HTMLElement | DocumentFragment | Text> {
    try {
      const children = await this.render();

      return appendChildren(
        document,
        document.createDocumentFragment(),
        flattenChildren(children),
        thisArg
      );
    } catch (error) {
      if (this.accept && !this.accept(error)) {
        throw error;
      }

      const children = await this.fallback({ error });
      return appendChildren(
        document,
        document.createDocumentFragment(),
        flattenChildren(children),
        thisArg
      );
    }
  }
}

export type ErrorBoundaryProps = {
  render: () => ComponentChildren;
  fallback: (props: { error: unknown }) => ComponentChildren;
  accept?: (error: unknown) => boolean; // if this boundary accepts the error or lets the next boundary handle it
};

export const ErrorBoundary = internalComponent(
  (props: ErrorBoundaryProps) => new VErrorBoundaryNode(props)
);
