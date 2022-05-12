import type { BaseProps, Component, ComponentChildren } from './types';
import type { InternalComponent } from './internal';
import { VComponentNode } from './VComponentNode';
import { VElementNode } from './VElementNode';

export { Fragment } from './Fragment';

export function jsx(
  tag: string | Component,
  props: BaseProps
): ComponentChildren {
  if (typeof tag === 'string') {
    return new VElementNode(tag, props);
  }

  if ((tag as InternalComponent).__tsxInternal === true) {
    return (tag as InternalComponent)(props);
  }

  return new VComponentNode(tag, props);
}

export { jsx as jsxs, jsx as jsxDEV };
