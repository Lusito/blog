import { flattenChildren } from './internal';
import type { ComponentChildren, ComponentThis } from './types';

export async function toDom(
  document: Document,
  children: ComponentChildren,
  thisArg: ComponentThis
): Promise<HTMLElement | DocumentFragment | Text> {
  const flattened = flattenChildren(children);

  await Promise.all(flattened.map((child) => child.resolve(thisArg)));
  const el = document.createDocumentFragment();
  for (const child of flattened) {
    el.appendChild(child.toDom(document));
  }

  return el;
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
