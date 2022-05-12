import type { ComponentThis, ComponentChildren } from './types';
import { internalComponent, flattenChildren } from './utils';
import { VNodeParent } from './VNodeParent';

class VErrorBoundaryNode extends VNodeParent {
  protected render: ErrorBoundaryProps['render'];
  protected fallback: ErrorBoundaryProps['fallback'];
  protected accept: ErrorBoundaryProps['accept'];
  protected error: unknown;

  public constructor({ render, fallback, accept }: ErrorBoundaryProps) {
    super();
    this.render = render;
    this.fallback = fallback;
    this.accept = accept;
  }

  protected override async resolveSelf() {
    const { error } = this;

    const children = await (error ? this.fallback({ error }) : this.render());
    this.children = flattenChildren(children);
  }

  public override async resolve(thisArg: ComponentThis) {
    try {
      await super.resolve(thisArg);
    } catch (error) {
      if (this.accept && !this.accept(error)) {
        throw error;
      }

      this.status = 'init';
      this.children.length = 0;
      this.error = error;
      await super.resolve(thisArg);
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
