import {
    removeDuplicatesBySelector,
    removeDuplicatesBySelectorAndAttribute,
    removeDuplicatesBySelectorAndTextContent,
} from "./removeDuplicates";

export function transferHead(head: HTMLHeadElement, falseHead: HTMLHeadElement) {
    // If title, base or meta[charset] are present, they will replace old instances completely.
    removeDuplicatesBySelector(head, falseHead, "title");
    removeDuplicatesBySelector(head, falseHead, "base");
    removeDuplicatesBySelector(head, falseHead, "meta[charset]");

    removeDuplicatesBySelectorAndAttribute(head, falseHead, "meta", "name");
    removeDuplicatesBySelectorAndAttribute(head, falseHead, "meta", "http-equiv");
    removeDuplicatesBySelectorAndAttribute(head, falseHead, "link", "href");
    removeDuplicatesBySelectorAndAttribute(head, falseHead, "script", "src");
    removeDuplicatesBySelectorAndAttribute(head, falseHead, "*", "id");
    removeDuplicatesBySelectorAndTextContent(head, falseHead, "style");

    // Move all children of head elements in the body to the main head
    Array.from(falseHead.childNodes).forEach((node) => head.appendChild(node));

    // Then remove the false head
    falseHead.remove();
}
