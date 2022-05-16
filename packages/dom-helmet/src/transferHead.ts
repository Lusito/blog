import { removeDuplicatesBySelector, removeDuplicatesBySelectorAndAttribute, removeElement } from './removeDuplicates';

export function transferHead(head: HTMLHeadElement, falseHead: HTMLHeadElement) {
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
  Array.from(falseHead.childNodes).forEach((node) => head.appendChild(node));

  // Then remove the false head
  falseHead.remove();
}
