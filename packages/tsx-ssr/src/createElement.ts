import { ElementAttributes, VElementNode } from './VElementNode';
import { VComponentNode } from './VComponentNode';
import type {
  BaseProps,
  Component,
  ComponentChildren,
  ComponentThis,
} from './types';
import type { InternalComponent } from './utils';

export function createElement(
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

export const h = createElement;
