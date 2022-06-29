import { transferAttributes } from "./transferAttributes";
import { transferChildren } from "./transferChildren";

// fixme: tests
export function transferBody(target: HTMLBodyElement, falseElement: HTMLBodyElement) {
    // Transfer attributes
    transferAttributes(target, falseElement);

    // Move all children of head elements in the body to the main head
    transferChildren(falseElement, target);

    // Then remove the false element
    falseElement.remove();
}
