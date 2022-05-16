/**
 * This is a very basic "react-helmet" implementation.
 * It moves the children of all html > body > head elements into html > head.
 * After that it removes the false head elements.
 * 
 * @todo Remove duplicate title, scripts, links, styles, etc.
 * @todo Supports all valid head tags: title, base, meta, link, script, noscript, and style tags.
 * @todo Supports attributes for body, html and title tags.
 * @todo ? Nested components override duplicate head changes.
 * @todo ? Duplicate head changes are preserved when specified in the same component (support for tags like "apple-touch-icon").
 * @todo Create tsx-dom-helmet library?
 * 
 * @param wrapper A HTML element containing exactly one <html> element.
 */
export function helmet(wrapper: HTMLElement) {
  const head = wrapper.querySelector('html > head');

  // Basic helmet alternative:
  wrapper.querySelectorAll('html > body head').forEach((el) => {
    // Move all children of head elements in the body to the main head
    el.childNodes.forEach((node) => head.appendChild(node));
    // Then remove the false head
    el.remove();
  });
}
