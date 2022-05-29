/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { addAbortSignal, ComponentChildren, toDom } from "tsx-dom-ssr";
import { domHelmet } from "dom-helmet";
import { Window } from "happy-dom";
import { Response } from "express";

const window = new Window();
const document = window.document as unknown as Document;

export async function renderHTML(children: ComponentChildren) {
    const cssModules: CssModule[] = [];
    const abortController = new AbortController();

    let dom: DocumentFragment;
    try {
        dom = await toDom(document, children, addAbortSignal({ cssModules }, abortController));
    } catch (e) {
        if (!abortController.signal.aborted) abortController.abort();
        throw e;
    }

    // Since the dom might be a fragment or just a text node, we need a wrapper to render it
    const wrapper = document.createElement("div");
    wrapper.appendChild(dom);

    if (
        wrapper.childNodes.length !== 1 ||
        wrapper.childNodes[0].nodeType !== 1 ||
        (wrapper.childNodes[0] as Element).tagName !== "HTML"
    ) {
        throw new Error("Expected one html node at the root level");
    }

    const head = wrapper.querySelector("html > head") as HTMLHeadElement;
    domHelmet({
        html: wrapper.querySelector("html")!,
        head,
        body: wrapper.querySelector("html > body")!,
    });

    // fixme: would be nice to only have one style tag,
    // but @hotwired/turbo will then keep adding new style tags to the head on navigation with partially duplicate css.
    for (const cssModule of cssModules) {
        const style = document.createElement("style");
        // eslint-disable-next-line no-underscore-dangle
        style.innerHTML = cssModule._getCss();
        head.appendChild(style);
    }

    return `<!DOCTYPE html>${wrapper.innerHTML}`;
}

export async function respondHTML(res: Response, children: ComponentChildren) {
    try {
        const html = await renderHTML(children);
        res.send(html);
    } catch (e) {
        console.error("Uncaught exception", e);
        res.status(500).send(`Unknown Error ${String(e)}`);
    }
}
