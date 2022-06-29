import {
    removeDuplicatesBySelector,
    removeDuplicatesBySelectorAndAttribute,
    removeDuplicatesBySelectorAndTextContent,
} from "./removeDuplicates";
import { transferChildren } from "./transferChildren";

export function transferHead(target: HTMLHeadElement, falseElement: HTMLHeadElement) {
    // If title, base or meta[charset] are present, they will replace old instances completely.
    removeDuplicatesBySelector(target, falseElement, "title");
    removeDuplicatesBySelector(target, falseElement, "base");
    removeDuplicatesBySelector(target, falseElement, "meta[charset]");

    removeDuplicatesBySelectorAndAttribute(target, falseElement, "meta", "name");
    removeDuplicatesBySelectorAndAttribute(target, falseElement, "meta", "http-equiv");
    removeDuplicatesBySelectorAndAttribute(target, falseElement, "link", "href");
    removeDuplicatesBySelectorAndAttribute(target, falseElement, "script", "src");
    removeDuplicatesBySelectorAndAttribute(target, falseElement, "*", "id");
    removeDuplicatesBySelectorAndTextContent(target, falseElement, "style");

    // Move all children of head elements in the body to the main head
    transferChildren(falseElement, target);

    // Then remove the false element
    falseElement.remove();
}
