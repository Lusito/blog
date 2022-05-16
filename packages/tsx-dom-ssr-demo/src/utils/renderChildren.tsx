import { ComponentChildren, toDom } from 'tsx-dom-ssr';
import { Window } from 'happy-dom';

const window = new Window();
const document = window.document as unknown as Document;

export async function renderChildren(children: ComponentChildren) {
  const dom = await toDom(document, children, {});

  // Since the dom might be a fragment or just a text node, we need a wrapper to render it
  const wrapper = document.createElement('div');
  wrapper.appendChild(dom);
  const head = wrapper.querySelector('head');

  // Move all style tags manually to the head
  wrapper.querySelectorAll('html > body style').forEach((el) => {
    head.appendChild(el);
  });

  // Basic helmet alternative:
  wrapper.querySelectorAll('html > body head').forEach((el) => {
    // fixme: remove duplicate title, scripts, links, styles, etc.
    // Move all children of head elements in the body to the main head
    el.childNodes.forEach((node) => head.appendChild(node));
    // Then remove the false head
    el.remove();
  });

  return `<!DOCTYPE html>${wrapper.innerHTML}`;
}
