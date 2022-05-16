import type { BaseProps, Component, ComponentChildren } from './types';
import {
  createComponentNode,
  createHtmlElementNode,
  InternalComponent,
} from './internal';

export { Fragment } from './Fragment';

export function jsx(
  tag: string | Component,
  props: BaseProps
): ComponentChildren {
  if ((tag as InternalComponent).__tsxInternal === true) {
    return (tag as InternalComponent)(props);
  }

  if (typeof tag === 'string') {
    return createHtmlElementNode(tag, props);
  }

  return createComponentNode(tag, props);
}

export { jsx as jsxs, jsx as jsxDEV };
