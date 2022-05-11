import type {
  ComponentThis,
  ComponentChildren,
  InternalComponent,
} from './types';
import { flattenChildren } from './utils';
import { VNodeParent } from './VNodeParent';

class VErrorBoundaryNode extends VNodeParent {
  protected render: ErrorBoundaryProps['render'];
  protected fallback: ErrorBoundaryProps['fallback'];
  protected error: unknown;

  public constructor({ render, fallback }: ErrorBoundaryProps) {
    super();
    this.render = render;
    this.fallback = fallback;
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

export const ErrorBoundary: InternalComponent<ErrorBoundaryProps> = (props) =>
  new VErrorBoundaryNode(props);
ErrorBoundary.__tsxInternal = true;
