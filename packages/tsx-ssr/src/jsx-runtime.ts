import type { BaseProps, Component, ComponentChildren } from './types';
import { appendChildren, flattenChildren, InternalComponent } from './internal';
import { ElementAttributes, setAttributes } from './setAttributes';

export { Fragment } from './Fragment';

export function jsx(
  tag: string | Component,
  props: BaseProps
): ComponentChildren {
  if ((tag as InternalComponent).__tsxInternal === true) {
    return (tag as InternalComponent)(props);
  }

  if (typeof tag === 'string') {
    return async (document, thisArg) => {
      const { children, ...attrs } = props;

      const el = document.createElement(tag);
      setAttributes(el, attrs as ElementAttributes);

      const flatChildren = flattenChildren(children);
      if (el.innerHTML) {
        if (flatChildren.length) {
          console.error(
            'Received both dangerouslySetInnerHTML and children. Children will be ignored!'
          );
        }

        return el;
      }

      return appendChildren(document, el, flatChildren, thisArg);
    };
  }

  return async (document, thisArg) => {
    const children = await tag.call(thisArg, props);

    return appendChildren(
      document,
      document.createDocumentFragment(),
      flattenChildren(children),
      thisArg
    );
  };
}

export { jsx as jsxs, jsx as jsxDEV };
