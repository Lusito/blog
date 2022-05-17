import { transferAttributes } from "./transferAttributes";
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
    transferAttributes(html, html.querySelectorAll("html"));
    transferAttributes(body, html.querySelectorAll("body"));

    body.querySelectorAll("head").forEach((falseHead) => transferHead(head, falseHead));
}
