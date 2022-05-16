export type HelmetOptions = {
  html: HTMLElement;
  head: HTMLElement;
  body: HTMLElement;
};

/**
 * This is a helper similar to "react-helmet".
 * It moves the children of all html > body > head elements into html > head.
 * After that it removes the false head elements.
 *
 * - Duplicates will be removed if not within the same head element:
 *   - Tags: title, base, meta, link, script (with src attribute) and any tag with an id attribute
 * - Transfers attributes from false html and body tags to their real counterparts
 *   - Classes and styles will be appended, other attributes will be replaced.
 *
 * @param elements An object containing the elements required.
 */
export function domHelmet({ html, head, body }: HelmetOptions) {
  transferAttributes(html, html.querySelectorAll('html'));
  transferAttributes(body, html.querySelectorAll('body'));

  body.querySelectorAll('head').forEach((falseHead) => {
    // If title or base are present, they will replace old instances completely.
    removeDuplicatesBySelector(head, falseHead, 'title');
    removeDuplicatesBySelector(head, falseHead, 'base');

    removeDuplicatesBySelectorAndAttribute(head, falseHead, 'link', 'href');
    removeDuplicatesBySelectorAndAttribute(head, falseHead, 'script', 'src');
    removeDuplicatesBySelectorAndAttribute(head, falseHead, '*', 'id');
    removeDuplicatesBySelectorAndAttribute(head, falseHead, 'meta', 'name');
    removeDuplicatesBySelectorAndAttribute(
      head,
      falseHead,
      'meta',
      'http-equiv'
    );

    // Remove pre-existing charset meta tags if there is a new one
    if (falseHead.querySelector('meta[charset]')) {
      head.querySelectorAll('meta[charset]').forEach(removeElement);
    }

    // Move all children of head elements in the body to the main head
    falseHead.childNodes.forEach((node) => head.appendChild(node));

    // Then remove the false head
    falseHead.remove();
  });
}

const removeElement = (element: Element) => element.remove();

function removeDuplicatesBySelector(
  head: Element,
  falseHead: Element,
  selector: string
) {
  if (falseHead.querySelector(selector)) {
    head.querySelectorAll(selector).forEach(removeElement);
  }
}

function removeDuplicatesBySelectorAndAttribute(
  head: Element,
  falseHead: Element,
  selector: string,
  attribute: string
) {
  const originalElements = head.querySelectorAll(selector);
  falseHead.querySelectorAll(selector).forEach((newElement) => {
    const newValue = newElement.getAttribute(attribute);
    if (newValue) {
      originalElements.forEach((oldLink) => {
        if (oldLink.getAttribute(attribute) === newValue) oldLink.remove();
      });
    }
  });
}

function transferAttributes(
  original: Element,
  allElements: NodeListOf<Element>
) {
  allElements.forEach((element) => {
    if (original === element) return;

    const attributes = element.getAttributeNames();
    for (const attribute of attributes) {
      const newValue = element.getAttribute(attribute) ?? '';
      const oldValue = original.getAttribute(attribute);

      if (attribute === 'class' && oldValue) {
        // Classes will be appended instead of replaced
        original.setAttribute('class', `${oldValue} ${newValue}`);
      } else if (attribute === 'style' && oldValue) {
        // Style will be appended instead of replaced
        const separator = oldValue.endsWith(';') ? '' : ';';
        original.setAttribute('style', `${oldValue}${separator}${newValue}`);
      } else {
        original.setAttribute(attribute, newValue);
      }
    }
  });
}
