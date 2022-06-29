import { transferAttributes } from "./transferAttributes";

// fixme: tests
export function transferHtml(target: HTMLHtmlElement, falseElement: HTMLHtmlElement) {
    // fixme: verify that html elements do not contain any children?

    // Transfer attributes
    transferAttributes(target, falseElement);

    // Then remove the false element
    falseElement.remove();
}
