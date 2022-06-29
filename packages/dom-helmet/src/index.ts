import { transferAttributes } from "./transferAttributes";
import { transferChildren } from "./transferChildren";
import { transferHead } from "./transferHead";

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
    // fixme: more tests
    // HTML Attributes
    html.querySelectorAll("html").forEach((element) => transferAttributes(html, element));
    // fixme: verify that html elements do not contain any children?

    body.querySelectorAll("body").forEach((falseBody) => {
        transferAttributes(body, falseBody);
        transferChildren(falseBody, body);
        // Remove false body
        falseBody.remove();
    });

    body.querySelectorAll("head").forEach((falseHead) => transferHead(head, falseHead));
}
