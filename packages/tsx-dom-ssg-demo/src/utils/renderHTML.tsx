/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { addAbortSignal, ComponentChildren, toDom } from "tsx-dom-ssr";
import { domHelmet } from "dom-helmet";
import { Window } from "happy-dom";

import { siteUrl } from "./config";
import highlightCss from "../style/highlight.module.scss";

const window = new Window();
const document = window.document as unknown as Document;
const protocolPattern = /^https?:\/\//;

export async function renderHTML(path: string, children: ComponentChildren) {
    const cssModules: CssModule[] = [];
    const abortController = new AbortController();

    let dom: DocumentFragment;
    try {
        dom = await toDom(document, children, addAbortSignal({ path, cssModules }, abortController));
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

    if (wrapper.querySelector("code.hljs")) {
        cssModules.push(highlightCss);
    }

    const style = document.createElement("style");
    // eslint-disable-next-line no-underscore-dangle
    style.innerHTML = cssModules.map((m) => m._getCss()).join("\n");
    head.appendChild(style);

    wrapper.querySelectorAll("a").forEach((link) => {
        const href = link.getAttribute("href");
        const rel = link.getAttribute("rel");

        if (href && !rel && protocolPattern.test(href) && (!siteUrl || !href.startsWith(siteUrl))) {
            link.setAttribute("rel", "noopener nofollow");
        }
    });

    if (!wrapper.querySelector("meta[name=description]")) {
        throw new Error(`Path "${path}" does not contain meta description`);
    }

    return `<!DOCTYPE html>${wrapper.innerHTML}`;
}

export function createElement(tag: string, attributes: Record<string, string> = {}) {
    const el = document.createElement(tag);
    for (const key of Object.keys(attributes)) {
        el.setAttribute(key, attributes[key]);
    }

    return el;
}
