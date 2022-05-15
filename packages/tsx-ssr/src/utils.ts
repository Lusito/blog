import { appendChildren, flattenChildren } from './internal';
import type { ComponentChildren, ComponentThis } from './types';

export async function toDom(
  document: Document,
  children: ComponentChildren,
  thisArg: ComponentThis
) {
  return appendChildren(
    document,
    document.createDocumentFragment(),
    flattenChildren(children),
    thisArg
  );
}

export async function renderToString(
  document: Document,
  children: ComponentChildren,
  thisArg: ComponentThis
) {
  const domChildren = await toDom(document, children, thisArg);
  const wrapper = document.createElement('div');
  wrapper.appendChild(domChildren);

  return wrapper.innerHTML;
}
