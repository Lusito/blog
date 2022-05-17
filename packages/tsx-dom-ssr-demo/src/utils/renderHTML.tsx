import { ComponentChildren, toDom } from "tsx-dom-ssr";
import { domHelmet } from "dom-helmet";
import { Window } from "happy-dom";
import { Response } from "express";

const window = new Window();
const document = window.document as unknown as Document;

export async function renderHTML(children: ComponentChildren) {
    const dom = await toDom(document, children, {});

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

    domHelmet({
        html: wrapper.querySelector("html"),
        head: wrapper.querySelector("html > head"),
        body: wrapper.querySelector("html > body"),
    });

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
