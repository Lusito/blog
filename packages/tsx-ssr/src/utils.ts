import { toDom } from './internal';
import type { ComponentChildren, ComponentThis } from './types';

export { toDom } from './internal';

export async function renderToString(
  document: Document,
  children: ComponentChildren,
  thisArg: ComponentThis
) {
  const fragment = await toDom(document, children, thisArg);
  const wrapper = document.createElement('div');
  wrapper.appendChild(fragment);

  return wrapper.innerHTML;
}
