export const removeElement = (element: Element) => element.remove();

export function removeDuplicatesBySelector(
  head: Element,
  falseHead: Element,
  selector: string
) {
  if (falseHead.querySelector(selector)) {
    head.querySelectorAll(selector).forEach(removeElement);
  }
}

export function removeDuplicatesBySelectorAndAttribute(
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
